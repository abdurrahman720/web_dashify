import { NextResponse } from "next/server";
import {stripe} from '@/lib/stripe'
import { db } from "@/lib/db";

export async function POST(req:Request){
    const { customerId, priceId } = await req.json();

    if (!customerId || !priceId) {
        return new NextResponse('Customer Id or Price Id is missing',{status:400})
    }

    const subscriptionExists = await db.agency.findFirst({
        where: {
            customerId:customerId
        },
        include: {
            Subscription:true
        }
    })

    try {
        if (subscriptionExists?.Subscription?.subscriptionId && subscriptionExists.Subscription.active) {
            if (!subscriptionExists?.Subscription?.subscriptionId) {
                  throw new Error(
                    "Could not find the subscription id to update the subscription"
                  );
            }
            console.log("updating subscription")

            const currentSubscriptionDetails = await stripe.subscriptions.retrieve(subscriptionExists.Subscription.subscriptionId)

            const subscription = await stripe.subscriptions.update(subscriptionExists.Subscription.subscriptionId, {
                items: [
                    {
                        id: currentSubscriptionDetails.items.data[0].id,
                        deleted:true
                    },
                    {
                        price:priceId
                    }
                ],
                expand: ['latest_invoice.payment_intent']
            })

             return NextResponse.json({
                 subscriptionId: subscription.id,
                 //@ts-ignore
                 clientSecret: subscription.latest_invoice.payment_intent.
                 client_secret
             });

        }
        else {
            console.log('creating subscription')

            const subscription = await stripe.subscriptions.create({
                customer: customerId,
                items: [
                    {
                        price:priceId
                    }
                ],
                payment_behavior: 'default_incomplete',
                payment_settings: { save_default_payment_method: 'on_subscription' },
                expand:['latest_invoice.payment_intent']
            })

            return NextResponse.json({
              subscriptionId: subscription.id,
              //@ts-ignore
              clientSecret:subscription.latest_invoice.payment_intent.client_secret,
            });
        }

       
    } catch (error) {
        console.log("Error", error)
        return new NextResponse('Internal Server Error',{status:500})

    }
}