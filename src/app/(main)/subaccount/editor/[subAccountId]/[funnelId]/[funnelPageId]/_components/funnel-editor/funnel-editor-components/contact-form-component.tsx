"use client";
// import ContactForm from "@/components/forms/contact-form";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { EditorBtns } from "@/lib/constants";
import {
  getFunnel,
  saveActivityLogNotification,
  upsertContact,
} from "@/lib/queries";

import { ContactUserFormSchema } from "@/lib/types";
import { EditorElement, useEditor } from "@/app/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import React from "react";
import { z } from "zod";
import ContactForm from "@/components/forms/contact-form";

type Props = {
  element: EditorElement;
};

const ContactFormComponent = (props: Props) => {
  const { dispatch, state, subaccountId, funnelId, pageDetails } = useEditor();
  const router = useRouter();

  const handleDragStart = (e: React.DragEvent, element: EditorElement) => {
    if (element.type === null || element.type === "__body") return;

    const stringElement = JSON.stringify(element);

    e.dataTransfer.setData("component", stringElement);
  };


  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: props.element,
      },
    });
  };

  const styles = props.element.styles;

  const goToNextPage = async () => {
    if (!state.editor.liveMode) return;
    const funnelPages = await getFunnel(funnelId);
    if (!funnelPages || !pageDetails) return;
    if (funnelPages.FunnelPages.length > pageDetails.order + 1) {
      const nextPage = funnelPages.FunnelPages.find(
        (page) => page.order === pageDetails.order + 1
      );
      if (!nextPage) return;
      router.replace(
        `${process.env.NEXT_PUBLIC_SCHEME}${funnelPages.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${nextPage.pathName}`
      );
    }
  };

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: props.element },
    });
  };

  const onFormSubmit = async (
    values: z.infer<typeof ContactUserFormSchema>
  ) => {
    if (!state.editor.liveMode) return;

    try {
      const response = await upsertContact({
        ...values,
        subAccountId: subaccountId,
      });
      //WIP Call trigger endpoint
      await saveActivityLogNotification({
        agencyId: undefined,
        description: `A New contact signed up | ${response?.name}`,
        subaccountId: subaccountId,
      });
      toast({
        title: "Success",
        description: "Successfully Saved your info",
      });
      await goToNextPage();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not save your information",
      });
    }
  };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
    };


  return (
    <div
      style={styles}
      draggable
      onDragStart={(e) => handleDragStart(e, props.element)}
      onDragOver={handleDragOver}
      onClick={handleOnClickBody}
      className={clsx(
        "p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center",
        {
          "!border-blue-500":
            state.editor.selectedElement.id === props.element.id,

          "!border-solid": state.editor.selectedElement.id === props.element.id,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
        }
      )}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">
            {state.editor.selectedElement.name}
          </Badge>
        )}
      <ContactForm
        subTitle="Contact Us"
        title="Want a free quote? We can help you"
        apiCall={onFormSubmit}
      />
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
};

export default ContactFormComponent;
