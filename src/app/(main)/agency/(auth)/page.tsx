import AgencyDetails from "@/components/forms/agency-details";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";

const Page = async ({
  searchParams,
}: {
  searchParams: { plan: Plan; state: string; code: string };
}) => {
  const agencyId = await verifyAndAcceptInvitation();
  console.log(agencyId);

  //get user details and redirect based on their roles
  const user = await getAuthUserDetails();
  console.log(user);

  if (agencyId) {
    if (user?.role === "SUBACCOUNT_GUEST" || user?.role === "SUBACCOUNT_USER") {
      return redirect("/subaccount");
    } else if (user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") {
      if (searchParams?.plan) {
        redirect(`/agency/${agencyId}/building?plan=${searchParams?.plan}`);
      }
      //if user is from stripe, state will contain details
      if (searchParams?.state) {
        const statePath = searchParams?.state?.split("__")[0];
        const stateAgencyId = searchParams?.state?.split("___")[1];
        if (!stateAgencyId) return <div>Not authorized</div>;
        //redirect from stripe using the code
        return redirect(
          `/agency/${stateAgencyId}/${statePath}?code=${searchParams?.code}`
        );
      } else return redirect(`/agency/${agencyId}`);
    } else {
      return <div>Not authorized</div>;
    }
  }

  // if the don't have subaccount, they are not agency owner or admin and they are just new here

  const authUser = await currentUser();

  return (
    <div className="flex justify-center items-center mt-4">
      <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
        <h1 className="text-4xl">Create an Agency</h1>
        <AgencyDetails data={{companyEmail: authUser?.emailAddresses[0].emailAddress}} />
      </div>
    </div>
  );
};

export default Page;
