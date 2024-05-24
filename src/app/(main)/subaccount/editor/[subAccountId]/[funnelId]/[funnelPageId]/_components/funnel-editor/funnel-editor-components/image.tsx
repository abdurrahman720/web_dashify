"use client";
import {
  EditorElement,
  useEditor,
} from "@/app/providers/editor/editor-provider";
import { EditorBtns } from "@/lib/constants";
import clsx from "clsx";
import { Badge, Trash } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {
  element: EditorElement;
};

const ImageComponent = (props: Props) => {
    const styles = props.element.styles;
    
    

  const { state, dispatch } = useEditor();

  const handleDragStart = (e: React.DragEvent, element: EditorElement) => {
    if (element.type === null || element.type === "__body") return;

    const stringElement = JSON.stringify(element);

    e.dataTransfer.setData("component", stringElement);
  };

  const handleOnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: props.element,
      },
    });
  };

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: props.element },
    });
  };

  return (
    <div
      style={styles}
      draggable
      onDragStart={(e) => handleDragStart(e, props.element)}
      onClick={handleOnClick}
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

      {!Array.isArray(props.element.content) && (
        <Image
          src={props.element.content.src || ""}
          // width={props.element.styles.width as number}
          // height={props.element.styles.height as number}
          fill
          alt={props.element.name}
        />
      )}

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

export default ImageComponent;
