"use client";
import {
  AgencySidebarOption,
  SubAccount,
  SubAccountSidebarOption,
} from "@prisma/client";

import React, { useEffect, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { ChevronsUpDown, Compass, Menu } from "lucide-react";
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
  const [IsMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  );

  return (
    <Sheet modal={false} open={true}>
      <SheetTrigger
        asChild
        className="absolute left-4 top-4 z-[100] md:!hidden flex"
      >
        <Button variant="outline" size={"icon"}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        showX={!defaultOpen} //added this into sheet content interface
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
                          <CommandItem className="!bg-transparent my-2 text-primary border-[1px] border-border "></CommandItem>
                        </CommandGroup>
                      )}
                  </CommandList>
                </Command>
              }
            </PopoverContent>
          </Popover>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuOptions;
