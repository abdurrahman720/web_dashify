import { Contact, Lane, Notification, Prisma, Role, Tag, Ticket, User } from "@prisma/client";
import { _getTicketsWithAllRelations, getAuthUserDetails, getMedia, getPipeLineDetails, getTicketsWithTags, getUserPermissions } from "./queries";
import { db } from "./db";
import { z } from "zod";

export type NotificationWithUser =
  | ({
      User: {
        id: string;
        name: string;
        avatarUrl: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        role: Role;
        agencyId: string | null;
      };
    } & Notification)[]
  | undefined;


//NOTE: instead of typing manually the types, we are just retrieving the type of response

export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<
  typeof getUserPermissions
>;

export type AuthUserWithAgencySidebarOptionsSubAccounts =
  Prisma.PromiseReturnType<typeof getAuthUserDetails>;


const __getUsersWithAgencySubAccountPermissionsSidebarOptions = async (
  agencyId: string
) => {
  return await db.user.findFirst({
    where: { Agency: { id: agencyId } },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  });
};

  export type UsersWithAgencySubAccountPermissionsSidebarOptions =
    Prisma.PromiseReturnType<
      typeof __getUsersWithAgencySubAccountPermissionsSidebarOptions
    >;

export type GetMediaFiles = Prisma.PromiseReturnType<typeof getMedia>
    


// we can create type withouth the relational field 
export type CreateMediaType = Prisma.MediaCreateWithoutSubaccountInput

export type TicketAndTags = Ticket & {
  Tags: Tag[] 
  Assigned: User | null;
  Customer: Contact | null;
}
    
export type LaneDetail = Lane & {
  Tickets: TicketAndTags[]
}

export const CreatePipelineFormSchema = z.object({
  name: z.string().min(1),
});

export const CreateFunnelFormSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  subDomainName: z.string().optional(),
  favicon: z.string().optional(),
});

export type PipelineDetailsWithLanesCardsTagsTickets = Prisma.PromiseReturnType<
  typeof getPipeLineDetails
  >;

export const LaneFormSchema = z.object({
    name:z.string().min(1)
})
  

export type TicketWithTags = Prisma.PromiseReturnType<typeof getTicketsWithTags>

export type TicketDetails = Prisma.PromiseReturnType<typeof _getTicketsWithAllRelations>

const currencyNumberRegex = /^\d+(\.\d{1,2})?$/;

export const TicketFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  value: z.string().refine((value) => currencyNumberRegex.test(value), {
    message: "Value must be a valid price.",
  }),
});