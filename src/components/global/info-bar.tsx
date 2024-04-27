"use client"
import { NotificationWithUser } from '@/lib/types'
import { UserButton } from '@clerk/nextjs'

import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Bell } from 'lucide-react'
import { Role } from '@prisma/client'
import { Card } from '../ui/card'

type Props = {
    notifications: NotificationWithUser | [],
    role?: Role,
    className?: string,
    subAccountId?: string
}

const InfoBar = ({ notifications, role, className, subAccountId }: Props) => {
    const [allNotifications, setAllNotifications] = useState(notifications)
    const [showAll, setShowAll] = useState(true)


    const handleClick = () => {
      if (!showAll) {
        setAllNotifications(notifications);
      } else {
        if (notifications?.length !== 0) {
          setAllNotifications(
            notifications?.filter(
              (item) => item.subAccountId === subAccountId
            ) ?? []
          );
        }
      }
      setShowAll((prev) => !prev);
    };

  return (
    <>
      <div
        className={twMerge(
          "fixed z-[20] md:left-[300px] left-0 right-0 top-0  p-4 bg-background/80 backdrop-blur-md flex  gap-4 items-center border-b-[1px] ",
          className
        )}
      >
        <div className="flex items-center gap-2 ml-auto">
          <UserButton afterSignOutUrl="/" />
          <Sheet>
            <SheetTrigger>
              <div className="rounded-md w-8 h-8 bg-primary flex items-center justify-center text-white">
                <Bell size={17} />
              </div>
            </SheetTrigger>
            <SheetContent side='right' className="mt-4 mr-4 pr-4 flex flex-col">
              <SheetHeader className='text-left'>
                              <SheetTitle>Notifications</SheetTitle>
                              <SheetDescription>
                                  {(role === 'AGENCY_ADMIN' || role === 'AGENCY_OWNER') && (
                                      <Card className='flex items-center justify-between p-4'>
                                          Current Subaccount 
                                          
                                      </Card>
                                  )}
                              </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}

export default InfoBar