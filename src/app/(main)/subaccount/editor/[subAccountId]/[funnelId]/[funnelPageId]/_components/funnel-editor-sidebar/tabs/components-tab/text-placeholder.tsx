import { EditorBtns } from "@/lib/constants";
import { TypeIcon } from "lucide-react";
import React from "react";

type Props = {};

const TextPlaceholder = (props: Props) => {
  const handleDragState = (e: React.DragEvent, type: EditorBtns) => {
    console.log(type);
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);

    const componentType = e.dataTransfer.getData("componentType") as EditorBtns;

    console.log(componentType);
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        handleDragState(e, "text");
      }}
      className=" h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
    >
      <TypeIcon size={40} className="text-muted-foreground" />
    </div>
  );
};

export default TextPlaceholder;
