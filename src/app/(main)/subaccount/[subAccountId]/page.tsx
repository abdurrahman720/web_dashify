import BlurPage from "@/components/global/blur-page";
import CircleProgress from "@/components/global/circle-progress";
import PipelineValue from "@/components/global/pipeline-value";
import SubaccountFunnelChart from "@/components/global/subaccount-funnel-chart";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { AreaChart, BadgeDelta } from "@tremor/react";
import {
  ClipboardIcon,
  Contact2,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  params: { subAccountId: string };
  searchParams: {
    code: string;
  };
};

const SubAccountIdPage = async ({ params, searchParams }: Props) => {
  let currency = "USD";
  let sessions;
  let totalClosedSessions;
  let totalPendingSessions;
  let net = 0;
  let potentialIncome = 0;
  let closingRate = 0;

  const subaccountDetails = await db.subAccount.findUnique({
    where: {
      id: params.subAccountId,
    },
  });

  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01T00:00:00Z`).getTime() / 1000;
  const endDate = new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000;

  if (!subaccountDetails) return;

  if (subaccountDetails.connectAccountId) {
    const response = await stripe.accounts.retrieve({
      stripeAccount: subaccountDetails.connectAccountId,
    });
    currency = response.default_currency?.toUpperCase() || "USD";
    const checkoutSessions = await stripe.checkout.sessions.list(
      { created: { gte: startDate, lte: endDate }, limit: 100 },
      {
        stripeAccount: subaccountDetails.connectAccountId,
      }
    );
    sessions = checkoutSessions.data.map((session) => ({
      ...session,
      created: new Date(session.created).toLocaleDateString(),
      amount_total: session.amount_total ? session.amount_total / 100 : 0,
    }));

    totalClosedSessions = checkoutSessions.data
      .filter((session) => session.status === "complete")
      .map((session) => ({
        ...session,
        created: new Date(session.created).toLocaleDateString(),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      }));

    //NOTE:Tweak

    // totalClosedSessions = [
    //   { created: "01/01/2024", amount_total: 4500 },
    //   { created: "01/02/2024", amount_total: 5200 },
    //   { created: "01/03/2024", amount_total: 4700 },
    //   { created: "01/04/2024", amount_total: 5500 },
    //   { created: "01/05/2024", amount_total: 0 },
    //   { created: "01/06/2024", amount_total: 0 },
    //   { created: "01/07/2024", amount_total: 5100 },
    //   { created: "01/08/2024", amount_total: 4800 },
    //   { created: "01/09/2024", amount_total: 5600 },
    //   { created: "01/10/2024", amount_total: 5000 },
    //   { created: "01/11/2024", amount_total: 4950 },
    //   { created: "01/12/2024", amount_total: 5150 },
    //   { created: "01/13/2024", amount_total: 5300 },
    //   { created: "01/14/2024", amount_total: 0 },
    //   { created: "01/15/2024", amount_total: 0 },
    //   { created: "01/16/2024", amount_total: 5200 },
    //   { created: "01/17/2024", amount_total: 5050 },
    //   { created: "01/18/2024", amount_total: 4900 },
    //   { created: "01/19/2024", amount_total: 5100 },
    //   { created: "01/20/2024", amount_total: 5400 },
    //   { created: "01/21/2024", amount_total: 4750 },
    //   { created: "01/22/2024", amount_total: 5250 },
    //   { created: "01/23/2024", amount_total: 5150 },
    //   { created: "01/24/2024", amount_total: 4950 },
    //   { created: "01/25/2024", amount_total: 4850 },
    //   { created: "01/26/2024", amount_total: 5300 },
    //   { created: "01/27/2024", amount_total: 0 },
    //   { created: "01/28/2024", amount_total: 5000 },
    //   { created: "01/29/2024", amount_total: 5500 },
    //   { created: "01/30/2024", amount_total: 5050 },
    // ];

    totalPendingSessions = checkoutSessions.data
      .filter(
        (session) => session.status === "open" || session.status === "expired"
      )
      .map((session) => ({
        ...session,
        created: new Date(session.created).toLocaleDateString(),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      }));

    //NOTE:Tweak

    // totalPendingSessions = [
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
      .reduce((total, session) => total + (session.amount_total || 0), 0)
      .toFixed(2);

    potentialIncome = +totalPendingSessions
      .reduce((total, session) => total + (session.amount_total || 0) , 0)
      .toFixed(2);

    closingRate = +(
      (totalClosedSessions.length / checkoutSessions.data.length) *
      100
    ).toFixed(2);

    // closingRate = 75;
  }

  //TODO: needs to be removed
  //   closingRate = +(
  //     (totalClosedSessions.length / sessions.length) *
  //     100
  //   ).toFixed(2);
  // }

  const funnels = await db.funnel.findMany({
    where: {
      subAccountId: params.subAccountId,
    },
    include: {
      FunnelPages: true,
    },
  });

  const funnelPerformanceMetrics = funnels.map((funnel) => ({
    ...funnel,
    totalFunnelVisits: funnel.FunnelPages.reduce(
      (total, page) => total + page.visits,
      0
    ),
  }));

  return (
    <BlurPage>
      <div className="relative h-full">
        {!subaccountDetails.connectAccountId && (
          <div className="absolute -top-10 -left-10 right-0 bottom-0 z-30 flex items-center justify-center backdrop-blur-md bg-background/50">
            <Card>
              <CardHeader>
                <CardTitle>Connect Your Stripe</CardTitle>
                <CardDescription>
                  You need to connect your stripe account to see metrics
                </CardDescription>
                <Link
                  href={`/subaccount/${subaccountDetails.id}/launchpad`}
                  className="p-2 w-fit bg-secondary text-white rounded-md flex items-center gap-2"
                >
                  <ClipboardIcon />
                  Launch Pad
                </Link>
              </CardHeader>
            </Card>
          </div>
        )}
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
              <Contact2 className="absolute right-4 top-4 text-muted-foreground" />
            </Card>
            <PipelineValue subaccountId={params.subAccountId} />

            <Card className="xl:w-fit">
              <CardHeader>
                <CardDescription>Conversions</CardDescription>
                <CircleProgress
                  value={closingRate}
                  description={
                    <>
                      {sessions && (
                        <div className="flex flex-col">
                          Total Carts Opened
                          <div className="flex gap-2">
                            <ShoppingCart className="text-rose-700" />
                            {sessions.length}
                          </div>
                        </div>
                      )}
                      {totalClosedSessions && (
                        <div className="flex flex-col">
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
              </CardHeader>
            </Card>
          </div>

          <div className="flex gap-4 flex-col xl:!flex-row">
            <Card className="relative">
              <CardHeader>
                <CardDescription>Funnel Performance</CardDescription>
              </CardHeader>
              <CardContent className=" text-sm text-muted-foreground flex flex-col gap-12 justify-between ">
                <SubaccountFunnelChart data={funnelPerformanceMetrics} />
                <div className="lg:w-[150px]">
                  Total page visits across all funnels. Hover over to get more
                  details on funnel page performance.
                </div>
              </CardContent>
              <Contact2 className="absolute right-4 top-4 text-muted-foreground" />
            </Card>
            <Card className="p-4 flex-1">
              <CardHeader>
                <CardTitle>Checkout Activity</CardTitle>
              </CardHeader>
              <AreaChart
                className="text-sm stroke-primary"
                data={sessions || []}
                index="created"
                categories={["amount_total"]}
                colors={["primary"]}
                yAxisWidth={50}
                showAnimation={true}
              />
            </Card>
          </div>
          <div className="flex gap-4 xl:!flex-row flex-col">
            <Card className="p-4 flex-1 h-[450px] overflow-scroll relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Transition History
                  <BadgeDelta
                    className="rounded-xl bg-transparent"
                    deltaType="moderateIncrease"
                    isIncreasePositive={true}
                    size="xs"
                  >
                    +12.3%
                  </BadgeDelta>
                </CardTitle>
                <Table>
                  <TableHeader className="!sticky !top-0">
                    <TableRow>
                      <TableHead className="w-[300px]">Email</TableHead>
                      <TableHead className="w-[200px]">Status</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="font-medium truncate">
                    {totalClosedSessions
                      ? totalClosedSessions.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell>
                              {session.customer_details?.email || "-"}
                              {/* {"jacob@gmail.com"} */}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-emerald-500 dark:text-black">
                                Paid
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(session.created).toUTCString()}
                            </TableCell>

                            <TableCell className="text-right">
                              <small>{currency}</small>{" "}
                              <span className="text-emerald-500">
                                {session.amount_total}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      : "No Data"}
                  </TableBody>
                </Table>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </BlurPage>
  );
};

export default SubAccountIdPage;
