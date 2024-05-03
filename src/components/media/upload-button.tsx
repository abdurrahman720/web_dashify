"use client";
import React from "react";
import { Button } from "../ui/button";

import CustomModal from "../global/custom-modal";
import UploadMediaForm from "../forms/upload-media";
import { useModal } from "@/app/providers/modal-providers";

type Props = {
  subAccountId: string;
};

const MediaUploadButton = ({ subAccountId }: Props) => {
  const { isOpen, setOpen, setClose } = useModal();

  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal
            title="Upload Media"
            subheading="Upload a file to your media bucket"
          >
            <UploadMediaForm subAccountId={subAccountId} setClose={setClose} />
          </CustomModal>
        );
      }}
    >
      Upload
    </Button>
  );
};

export default MediaUploadButton;
