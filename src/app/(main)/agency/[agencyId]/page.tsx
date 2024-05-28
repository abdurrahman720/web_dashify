import CircleProgress from "@/components/global/circle-progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { AreaChart } from "@tremor/react";
import {
  ClipboardIcon,
  Contact2,
  DollarSign,
  Goal,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  params: {
    agencyId: string;
  };
};

const Page = async ({ params }: Props) => {
  let currency = "USD";
  let sessions;
  let totalClosedSessions;
  let totalPendingSessions;
  let net = 0;
  let potentialIncome = 0;
  let closingRate = 0;
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01T00:00:00Z`).getTime() / 1000;
  const endDate = new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000;

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
  });

  if (!agencyDetails) return;

  const subaccounts = await db.subAccount.findMany({
    where: {
      agencyId: params.agencyId,
    },
  });

  if (agencyDetails.connectAccountId) {
    const response = await stripe.accounts.retrieve({
      stripeAccount: agencyDetails.connectAccountId,
    });

    currency = response.default_currency?.toUpperCase() || "USD";
    const checkoutSessions = await stripe.checkout.sessions.list(
      {
        created: { gte: startDate, lte: endDate },
        limit: 100,
      },
      { stripeAccount: agencyDetails.connectAccountId }
    );

    // console.log(checkoutSessions)

    sessions = checkoutSessions.data;
    // console.log(checkoutSessions.data);

    totalClosedSessions = checkoutSessions.data
      .filter((session) => session.status === "complete")
      .map((session) => ({
        ...session,
        created: new Date(session.created).toLocaleDateString(),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      }));

    //NOTE:Tweak

    // totalClosedSessions = [
    //   { created: "01/01/2024", amount_total: 45000 },
    //   { created: "01/02/2024", amount_total: 52000 },
    //   { created: "01/03/2024", amount_total: 47000 },
    //   { created: "01/04/2024", amount_total: 55000 },
    //   { created: "01/05/2024", amount_total: 49000 },
    //   { created: "01/06/2024", amount_total: 53000 },
    //   { created: "01/07/2024", amount_total: 51000 },
    //   { created: "01/08/2024", amount_total: 48000 },
    //   { created: "01/09/2024", amount_total: 56000 },
    //   { created: "01/10/2024", amount_total: 50000 },
    //   { created: "01/11/2024", amount_total: 49500 },
    //   { created: "01/12/2024", amount_total: 51500 },
    //   { created: "01/13/2024", amount_total: 53000 },
    //   { created: "01/14/2024", amount_total: 47000 },
    //   { created: "01/15/2024", amount_total: 48500 },
    //   { created: "01/16/2024", amount_total: 52000 },
    //   { created: "01/17/2024", amount_total: 50500 },
    //   { created: "01/18/2024", amount_total: 49000 },
    //   { created: "01/19/2024", amount_total: 51000 },
    //   { created: "01/20/2024", amount_total: 54000 },
    //   { created: "01/21/2024", amount_total: 47500 },
    //   { created: "01/22/2024", amount_total: 52500 },
    //   { created: "01/23/2024", amount_total: 51500 },
    //   { created: "01/24/2024", amount_total: 49500 },
    //   { created: "01/25/2024", amount_total: 48500 },
    //   { created: "01/26/2024", amount_total: 53000 },
    //   { created: "01/27/2024", amount_total: 52000 },
    //   { created: "01/28/2024", amount_total: 50000 },
    //   { created: "01/29/2024", amount_total: 55000 },
    //   { created: "01/30/2024", amount_total: 50500 },
    // ];

    totalPendingSessions = checkoutSessions.data
      .filter((session) => session.status === "open")
      .map((session) => ({
        ...session,
        created: new Date(session.created).toLocaleDateString(),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      }));

    totalPendingSessions = checkoutSessions.data
      .filter((session) => session.status === "open")
      .map((session) => ({
        ...session,
        created: new Date(session.created).toLocaleDateString(),
        amount_total: 200,
      }));

    //NOTE:Tweak

    //  totalPendingSessions = [
    //   { created: "02/01/2024", amount_total: 30000 },
    //   { created: "02/02/2024", amount_total: 32000 },
    //   { created: "02/03/2024", amount_total: 31000 },
    //   { created: "02/04/2024", amount_total: 33000 },
    //   { created: "02/05/2024", amount_total: 30500 },
    //   { created: "02/06/2024", amount_total: 31500 },
    //   { created: "02/07/2024", amount_total: 32500 },
    //   { created: "02/08/2024", amount_total: 30000 },
    //   { created: "02/09/2024", amount_total: 31000 },
    //   { created: "02/10/2024", amount_total: 33500 },
    //   { created: "02/11/2024", amount_total: 30500 },
    //   { created: "02/12/2024", amount_total: 32000 },
    //   { created: "02/13/2024", amount_total: 31500 },
    //   { created: "02/14/2024", amount_total: 33000 },
    //   { created: "02/15/2024", amount_total: 31000 },
    //   { created: "02/16/2024", amount_total: 30000 },
    //   { created: "02/17/2024", amount_total: 33500 },
    //   { created: "02/18/2024", amount_total: 32500 },
    //   { created: "02/19/2024", amount_total: 31000 },
    //   { created: "02/20/2024", amount_total: 32000 },
    //   { created: "02/21/2024", amount_total: 30000 },
    //   { created: "02/22/2024", amount_total: 31000 },
    //   { created: "02/23/2024", amount_total: 33000 },
    //   { created: "02/24/2024", amount_total: 31500 },
    //   { created: "02/25/2024", amount_total: 30500 },
    //   { created: "02/26/2024", amount_total: 32500 },
    //   { created: "02/27/2024", amount_total: 30000 },
    //   { created: "02/28/2024", amount_total: 33500 },
    //   { created: "02/29/2024", amount_total: 32000 },
    // ];

    net = +totalClosedSessions
      .reduce((total, session) => total + (session.amount_total / 100 || 0), 0)
      .toFixed(2);

    potentialIncome = +totalPendingSessions
      .reduce((total, session) => total + (session.amount_total / 100 || 0), 0)
      .toFixed(2);

    closingRate = +(
      (totalClosedSessions.length / checkoutSessions.data.length) * 100 || 0
    ).toFixed(2);
    closingRate = +((totalClosedSessions.length / 40) * 100 || 0).toFixed(2);
  }

  return (
    <div className="relative h-full">
      {!agencyDetails.connectAccountId && (
        <div className="absolute -top-10 -left-10 right-0 bottom-0 z-30 flex items-center justify-center backdrop-blur-md bg-background/50">
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Stripe</CardTitle>
              <CardDescription>
                You need to connect your stripe account to see metrics
              </CardDescription>
              <Link
                href={`/agency/${agencyDetails.id}/launchpad`}
                className="p-2 w-fit bg-secondary text-white rounded-md flex items-center gap-2"
              >
                <ClipboardIcon />
                Launch Pad
              </Link>
            </CardHeader>
          </Card>
        </div>
      )}
      <h1 className="text-4xl">Dashboard</h1>
      <Separator className=" my-6" />
      <div className="flex flex-col gap-4 pb-6">
        <div className="flex gap-4 flex-col xl:!flex-row">
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Income</CardDescription>
              <CardTitle className="text-4xl">
                {net ? `${currency} ${net.toFixed(2)}` : `$0.00`}
              </CardTitle>
              <small className="text-xs text-muted-foreground">
                For the year {currentYear}
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Total revenue generated as reflected in your stripe dashboard.
            </CardContent>
            <DollarSign className="absolute right-4 top-4 text-muted-foreground" />
          </Card>
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Potential Income</CardDescription>
              <CardTitle className="text-4xl">
                {potentialIncome
                  ? `${currency} ${potentialIncome.toFixed(2)}`
                  : `$0.00`}
              </CardTitle>
              <small className="text-xs text-muted-foreground">
                For the year {currentYear}
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              This is how much you can close.
            </CardContent>
            <DollarSign className="absolute right-4 top-4 text-muted-foreground" />
          </Card>
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Active Clients</CardDescription>
              <CardTitle className="text-4xl">{subaccounts.length}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Reflects the number of sub accounts you own and manage.
            </CardContent>
            <Contact2 className="absolute right-4 top-4 text-muted-foreground" />
          </Card>
          <Card className="flex-1 relative">
            <CardHeader>
              <CardTitle>Agency Goal</CardTitle>
              <CardDescription>
                <p className="mt-2">
                  Reflects the number of sub accounts you want to own and
                  manage.
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    Current: {subaccounts.length}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    Goal: {agencyDetails.goal}
                  </span>
                </div>
                <Progress
                  value={(subaccounts.length / agencyDetails.goal) * 100}
                />
              </div>
            </CardFooter>
            <Goal className="absolute right-4 top-4 text-muted-foreground" />
          </Card>
        </div>
        <div className="flex gap-4 xl:!flex-row flex-col">
          <Card className="p-4 flex-1">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <AreaChart
              className="text-sm stroke-primary"
              data={[
                ...(totalClosedSessions || []),
                ...(totalPendingSessions || []),
              ]}
              index="created"
              categories={["amount_total"]}
              colors={["primary"]}
              yAxisWidth={70}
              showAnimation={true}
            />
          </Card>
          <Card className="xl:w-[400px] w-full">
            <CardHeader>
              <CardTitle>Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <CircleProgress
                value={closingRate}
                description={
                  <>
                    {sessions && (
                      <div className="flex flex-col">
                        Abandoned
                        <div className="flex gap-2">
                          <ShoppingCart className="text-rose-700" />
                          {sessions.length}
                          {/* NOTE: Tweak */}
                          {/* {40} */}
                        </div>
                      </div>
                    )}
                    {totalClosedSessions && (
                      <div className="felx flex-col">
                        Won Carts
                        <div className="flex gap-2">
                          <ShoppingCart className="text-emerald-700" />
                          {totalClosedSessions.length}
                        </div>
                      </div>
                    )}
                  </>
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
