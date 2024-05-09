"use client";
import { useModal } from "@/app/providers/modal-providers";
import ContactUserForm from "@/components/forms/contact-user.-form";

import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";

import React from "react";

type Props = {
  subAccountId: string;
};

const CraeteContactButton = ({ subAccountId }: Props) => {
  const { setOpen } = useModal();

  const handleCreateContact = async () => {
    setOpen(
      <CustomModal
        title="Create Or Update Contact information"
        subheading="Contacts are like customers."
      >
        <ContactUserForm subAccountId={subAccountId} />
      </CustomModal>
    );
  };

  return <Button onClick={handleCreateContact}>Create Contact</Button>;
};

export default CraeteContactButton;
