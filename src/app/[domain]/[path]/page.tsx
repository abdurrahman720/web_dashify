import FunnelEditor from "@/app/(main)/subaccount/editor/[subAccountId]/[funnelId]/[funnelPageId]/_components/funnel-editor";
import EditorProvider from "@/app/providers/editor/editor-provider";
import { getDomainContent } from "@/lib/queries";
import { notFound } from "next/navigation";

const Page = async ({
  params,
}: {
  params: { domain: string; path: string };
}) => {
  const domainData = await getDomainContent(params.domain.slice(0, -1));
  const pageData = domainData?.FunnelPages.find(
    (page) => page.pathName === params.path
  );

  if (!pageData || !domainData) return notFound();

  return (
    <EditorProvider
      subaccountId={domainData.subAccountId}
      pageDetails={pageData}
      funnelId={domainData.id}
    >
      <FunnelEditor funnelPageId={pageData.id} liveMode={true} />
    </EditorProvider>
  );
};

export default Page;
