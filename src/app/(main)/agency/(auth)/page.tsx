import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async() => {

   

    const agencyId = await verifyAndAcceptInvitation()
    console.log(agencyId)

    const user = await getAuthUserDetails()

    console.log(user)

    


  return <div>Agency website</div>;
};

export default Page;
