import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/db";
import { getLanesWithTicketAndTags, getPipeLineDetails, updateLanesOrder, updateTicketsOrder } from "@/lib/queries";
import { LaneDetail } from "@/lib/types";
import { redirect } from "next/navigation";
import PipelineInfoBar from "../_components/pipeline-infobar";
import PipelineSettings from "../_components/pipeline-settings";
import PipelineView from "../_components/pipeline-view";

type Props = {
  params: { subAccountId: string; pipelineId: string };
};

const PipleLineId = async ({ params }: Props) => {
  const pipelineDetails = await getPipeLineDetails(params.pipelineId);

  if (!pipelineDetails)
    return redirect(`/subaccount/${params.subAccountId}/pipelines`);

  const pipelines = await db.pipeline.findMany({
    where: { subAccountId: params.subAccountId },
  });

  const lanes = (await getLanesWithTicketAndTags(
    params.pipelineId
  )) as LaneDetail[];

  return (
    <Tabs defaultValue="view" className="w-full">
      <TabsList className="bg-transparent border-b-2 h-16 w-full justify-between mb-4">
        <PipelineInfoBar
          subAccountId={params.subAccountId}
          pipelines={pipelines}
          pipelineId={params.pipelineId}
        />
        <div>
          <TabsTrigger value="view" className="">
            Pipeline View
          </TabsTrigger>
          <TabsTrigger value="settings" className="">
            Settings
          </TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="view">
        <PipelineView lanes={lanes} pipelineDetails={pipelineDetails} pipelineId={params.pipelineId} subaccountId={params.subAccountId} updateLanesOrder={updateLanesOrder} updateTicketsOrder={updateTicketsOrder}  />
      </TabsContent>
      <TabsContent value="settings">
        <PipelineSettings
          subaccountId={params.subAccountId}
          pipelineId={params.pipelineId}
          pipelines={pipelines}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PipleLineId;
