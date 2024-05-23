import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>



/**
 * Initialize the stripe for the host. If connected account id is passed, it initiates for the connected id
 * @type(connectedAccountId?: string) => Promise<Stripe | null>
 */


export const getStripe: (connectedAccountId?: string) => Promise<Stripe | null> = (
  connectedAccountId?: string
) => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
      { stripeAccount: connectedAccountId }
    );
  }

  return stripePromise;
};