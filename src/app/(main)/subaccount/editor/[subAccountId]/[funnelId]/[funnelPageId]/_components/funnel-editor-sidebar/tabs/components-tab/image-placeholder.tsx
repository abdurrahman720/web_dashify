/* eslint-disable jsx-a11y/alt-text */
import { EditorBtns } from "@/lib/constants";
import { Image } from "lucide-react";
import React from "react";

type Props = {};

const ImagePlaceholder = (props: Props) => {
  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };
  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, "image")}
      className="h-14 w-14 rounded bg-muted flex justify-center items-center"
    >
      <Image  size={40} className="text-muted-foreground" />
    </div>
  );
};

export default ImagePlaceholder;
