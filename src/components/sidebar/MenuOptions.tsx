"use client";
import {
  Agency,
  AgencySidebarOption,
  SubAccount,
  SubAccountSidebarOption,
} from "@prisma/client";

import React, { useEffect, useMemo, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { ChevronsUpDown, Compass, Menu, PlusCircleIcon } from "lucide-react";
import clsx from "clsx";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import Link from "next/link";
import { useModal } from "@/app/providers/modal-providers";
import CustomModal from "../global/custom-modal";
import AgencyDetails from "../forms/agency-details";
import SubAccountDetails from "../forms/subaccount-details";
import { Separator } from "../ui/separator";
import { icons } from "@/lib/constants";

type Props = {
  defaultOpen?: boolean;
  subaccounts: SubAccount[];
  sideBarOpt: AgencySidebarOption[] | SubAccountSidebarOption[];
  sideBarLogo: string;
  details: any;
  user: any;
  id: string;
};

const MenuOptions = ({
  details,
  defaultOpen,
  subaccounts,
  sideBarLogo,
  user,
  id,
  sideBarOpt,
}: Props) => {
  const { setOpen } = useModal();

  const [IsMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  );

  return (
    <Sheet modal={false} {...openState} >
      <SheetTrigger
        asChild
        className="absolute left-4 top-4 z-[100] md:!hidden flex"
      >
        <Button variant="outline" size={"icon"}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        showX={!defaultOpen} //NOTE: added this into sheet content interface
        side={"left"}
        className={clsx(
          "bg-background/80 backdrop-blur-xl fixed top-0 border-r-[1px] p-6",
          {
            "hidden md:inline-block z-0 w-[300px] ": defaultOpen,
            "inline-block md:hidden z-[100] w-full": !defaultOpen,
          }
        )}
      >
        {/*main content div*/}
        <div>
          {/*logo*/}
          <AspectRatio ratio={16 / 5}>
            <Image
              src={sideBarLogo}
              alt="Sidebar Logo"
              fill
              className="rounded-md object-contain"
            />
          </AspectRatio>
          <Popover>
            {/*this will  trigger the pop over*/}
            <PopoverTrigger asChild>
              {/*name and address | ghost button */}
              <Button
                className="w-full my-4 flex items-center justify-between py-8"
                variant="ghost"
              >
                <div className="flex items-center text-left gap-2">
                  <Compass />
                  <div className="flex flex-col">
                    {details?.name}
                    <span className="text-muted-foreground">
                      {details?.address}
                    </span>
                  </div>
                </div>
                <div>
                  <ChevronsUpDown size={16} className="text-muted-foreground" />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 h-80 mt-4 z-[200]">
              {
                <Command className="rounded-lg">
                  <CommandInput placeholder="Search Accounts..."></CommandInput>
                  <CommandList className="pb-16">
                    <CommandEmpty>No results found</CommandEmpty>
                    {(user?.role === "AGENCY_OWNER" ||
                      user?.role === "AGENCY_ADMIN") &&
                      user?.Agency && (
                        <CommandGroup heading="Agency">
                          <CommandItem className="!bg-transparent my-2 text-primary border-[1px] border-border p-2 rounded-md hover:!bg-muted cursor-pointer transition-all ">
                            {defaultOpen ? (
                              <Link href={`/agency/${user?.Agency?.id}`}>
                                <div className="relative w-16">
                                  <Image
                                    src={user?.Agency?.agencyLogo}
                                    alt="agencylogo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                </div>
                                <div className="flex flex-col flex-1">
                                  {user?.Agency?.name}
                                  <span className="text-muted-foreground">
                                    {user?.Agency?.address}
                                  </span>
                                </div>
                              </Link>
                            ) : (
                              <SheetClose asChild>
                                <Link href={`/agency/${user?.Agency?.id}`}>
                                  <div className="relative w-16">
                                    <Image
                                      src={user?.Agency?.agencyLogo}
                                      alt="agencylogo"
                                      fill
                                      className="rounded-md object-contain"
                                    />
                                  </div>
                                  <div className="flex flex-col flex-1">
                                    {user?.Agency?.name}
                                    <span className="text-muted-foreground">
                                      {user?.Agency?.address}
                                    </span>
                                  </div>
                                </Link>
                              </SheetClose>
                            )}
                          </CommandItem>
                        </CommandGroup>
                      )}
                    <CommandGroup heading="Accounts">
                      {!!subaccounts
                        ? subaccounts.map((subaccount) => (
                            <CommandItem key={subaccount.id}>
                              {defaultOpen ? (
                                <Link href={`/subaccount/${subaccount?.id}`}>
                                  <div className="relative w-16">
                                    <Image
                                      src={subaccount?.subAccountLogo}
                                      alt="agencylogo"
                                      fill
                                      className="rounded-md object-contain"
                                    />
                                  </div>
                                  <div className="flex flex-col flex-1">
                                    {subaccount?.name}
                                    <span className="text-muted-foreground">
                                      {subaccount?.address}
                                    </span>
                                  </div>
                                </Link>
                              ) : (
                                <SheetClose asChild>
                                  <Link href={`/agency/${subaccount?.id}`}>
                                    <div className="relative w-16">
                                      <Image
                                        src={subaccount?.subAccountLogo}
                                        alt="agencylogo"
                                        fill
                                        className="rounded-md object-contain"
                                      />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                      {subaccount?.name}
                                      <span className="text-muted-foreground">
                                        {subaccount?.address}
                                      </span>
                                    </div>
                                  </Link>
                                </SheetClose>
                              )}
                            </CommandItem>
                          ))
                        : "No Accounts"}
                    </CommandGroup>
                  </CommandList>
                  {(user?.role === "AGENCY_OWNER" ||
                    user?.role === "AGENCY_ADMIN") && (
                    <Button
                      className="w-full flex gap-2"
                      onClick={() => {
                        setOpen(
                          //custom data as modal
                          <CustomModal
                            title="Create a Sub Account"
                            subheading="You can switch between your agency account and the subaccount from the sidebar"
                          >
                          
                            <SubAccountDetails
                              agencyDetails={user?.Agency as Agency}
                              userId={user?.id as string}
                              userName={user?.name}
                            />
                          </CustomModal>
                        );
                      }}
                    >
                      <PlusCircleIcon size={15} />
                      Create Sub Account
                    </Button>
                  )}
                </Command>
              }
            </PopoverContent>
          </Popover>
          <p className="text-muted-foreground text-xs mb-2">MENU LINKS</p>
          <Separator className={`mb-4`} />
          <nav className="relative ">
            <Command className="overflow-visible rounded-lg bg-transparent">
              <CommandInput placeholder="Search..." />
              <CommandList className="py-4 overflow-visible">
                <CommandEmpty>No Results Found</CommandEmpty>
                <CommandGroup  className="overflow-visible">
                  {sideBarOpt.map((sidebarOptions) => {
                    let val;
                    //Getting the icon from contants and retriving the path as icon component
                    const result = icons.find((icon) => icon.value === sidebarOptions.icon)
                    if (result) {
                     
                      val = <result.path/>
                    }
                    return (
                      <CommandItem
                        key={sidebarOptions.id}
                        className="md:w-[320px] w-full"
                      >
                        <Link href={sidebarOptions.link} className="flex items-center gap-2 hover:bg-transparent rounded-md transition-all md:w-full">
                          {val}
                          <span className="">
                            {sidebarOptions.name}
                          </span>
                        </Link>
                      </CommandItem>
                    );
                })}
                </CommandGroup>
              </CommandList>
            </Command>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuOptions;
