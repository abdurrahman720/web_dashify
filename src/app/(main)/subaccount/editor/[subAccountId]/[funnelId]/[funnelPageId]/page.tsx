import EditorProvider from "@/app/providers/editor/editor-provider";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import FunnelEditorNavigation from "./_components/funnel-editor-navigation";
import FunnelEditorSidebar from "./_components/funnel-editor-sidebar";
import FunnelEditor from "./_components/funnel-editor";

type Props = {
  params: {
    subAccountId: string;
    funnelId: string;
    funnelPageId: string;
  };
};

const FunnelPageId = async ({ params }: Props) => {
  const funnelPageDetails = await db.funnelPage.findFirst({
    where: {
      id: params.funnelPageId,
    },
  });

  if (!funnelPageDetails) {
    return redirect(
      `/subaccount/${params.subAccountId}/funnels/${params.funnelId}`
    );
  }

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden">
      <EditorProvider
        subaccountId={params.subAccountId}
        funnelId={params.funnelId}
        pageDetails={funnelPageDetails}
      >
        <FunnelEditorNavigation
          funnelId={params.funnelId}
          funnelPageDetails={funnelPageDetails}
          subaccountId={params.subAccountId}
        />

        <div className="h-full flex justify-center">
          <FunnelEditor funnelPageId={params.funnelPageId} />
        </div>

        <FunnelEditorSidebar subaccountId={params.subAccountId} />
      </EditorProvider>
    </div>
  );
};

export default FunnelPageId;
