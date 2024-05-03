import BlurPage from '@/components/global/blur-page';
import InfoBar from '@/components/global/info-bar';
import Sidebar from '@/components/sidebar';
import Unauthorized from '@/components/unauthorized';
import { getAuthUserDetails, getNotificationAndUser, verifyAndAcceptInvitation } from '@/lib/queries';
import { currentUser } from '@clerk/nextjs';
import { Role } from '@prisma/client';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

type Props = {
    children: ReactNode,
    params:{subAccountId:string}
    
}

const SubAccountLayout =async ({children,params}: Props) => {
      const agencyId = await verifyAndAcceptInvitation();
      if (!agencyId) return <Unauthorized />;
      const user = await currentUser();
      if (!user) {
        return redirect("/");
      }

      let notifications: any = [];

      if (!user.privateMetadata.role) {
        return <Unauthorized />;
      } else {
        const allPermissions = await getAuthUserDetails();
        const hasPermission = allPermissions?.Permissions.find(
          (permissions) =>
            permissions.access &&
            permissions.subAccountId === params.subAccountId
        );
        if (!hasPermission) {
          return <Unauthorized />;
        }

        const allNotifications = await getNotificationAndUser(agencyId);

        if (
          user.privateMetadata.role === "AGENCY_ADMIN" ||
          user.privateMetadata.role === "AGENCY_OWNER"
        ) {
          notifications = allNotifications;
        } else {
          const filteredNoti = allNotifications?.filter(
            (item) => item.subAccountId === params.subAccountId
          );
          if (filteredNoti) notifications = filteredNoti;
        }
      }

 return (
   <div className="h-screen overflow-hidden">
     <Sidebar id={params.subAccountId} type="subaccount" />

     <div className="md:pl-[300px]">
       <InfoBar
         notifications={notifications}
         role={user.privateMetadata.role as Role}
         subAccountId={params.subAccountId as string}
       />
       <div className="relative">
         <BlurPage>{children}</BlurPage>
       </div>
     </div>
   </div>
 );
}

export default SubAccountLayout