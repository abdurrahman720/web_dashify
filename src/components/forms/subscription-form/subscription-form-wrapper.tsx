"use client"
import { useModal } from '@/app/providers/modal-providers';
import { Plan } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

type Props = {
    customerId: string,
    planExists:boolean
}

const SubscriptionFormWrapper = ({ customerId, planExists }: Props) => {
  const { data, setClose } = useModal();
  const router = useRouter();
  const [selectedPriceId, setSelectedPriceId] = useState<Plan | "">(
    data?.plans?.defaultPriceId || ""
  );
  const [subscription, setSubscription] = useState<{
    subscriptionId: string;
    clientSecret: string;
  }>({ subscriptionId: "", clientSecret: "" });


  return <div>SubscriptionFormWrapper</div>;
};

export default SubscriptionFormWrapper