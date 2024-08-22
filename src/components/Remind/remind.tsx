// src\components\Remind\remind.tsx

import React, { useState } from "react";
import Image from "next/image";
import { AiOutlineEdit } from "react-icons/ai";
import {
  AiOutlineTag,
  AiOutlineInfoCircle,
  AiOutlineUser,
  AiOutlineTeam,
} from "react-icons/ai";
import { Annotation } from "@/types";
import { ToolTip } from "../tooltip";

interface AnnotationListProps {
  annotations: Annotation[];
  onUpdateRemindAt: (id: string, newRemindAt: string) => void;
}

const RemindList: React.FC<AnnotationListProps> = ({
  annotations,
  onUpdateRemindAt,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRemindAt, setNewRemindAt] = useState<string>("");

  const handleEditClick = (annotationId: string, currentRemindAt: string) => {
    setEditingId(annotationId);
    setNewRemindAt(currentRemindAt);
  };

  const handleSaveClick = (annotationId: string) => {
    onUpdateRemindAt(annotationId, newRemindAt);
    setEditingId(null);
  };

  return (
    <div className="space-y-2 w-full max-w-3xl">
      {annotations.map((annotation) => (
        <div
          key={annotation.uuid}
          className="bg-white p-4 rounded-md shadow-md"
        >
          <div className="mb-4 text-sm text-gray-500 flex flex-row justify-between">
            <span className="text-xs">
              Criado em:{" "}
              <b className="text-black">
                {new Date(annotation.createdAt).toLocaleString()}
              </b>
            </span>
            <span className="flex flex-row gap-1">
              Lembrar em:{" "}
              {editingId === annotation.uuid ? (
                <input
                  type="datetime-local"
                  value={newRemindAt}
                  onChange={(e) => {
                    const [datePart, timePart] = e.target.value.split("T");
                    let [hours, minutes] = timePart.split(":");
                    minutes = "00";
                    const roundedValue = `${datePart}T${hours}:${minutes}`;
                    setNewRemindAt(roundedValue);
                  }}
                  className="bg-transparent text-white pl-10 w-44 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                //   <input
                // type="datetime-local"
                // className="bg-transparent text-white pl-10 w-44 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                // value={remindAt}
                // onChange={(e) => {
                //   const [datePart, timePart] = e.target.value.split("T");
                //   let [hours, minutes] = timePart.split(":");
                //   minutes = "00";
                //   const roundedValue = `${datePart}T${hours}:${minutes}`;
                //   setRemindAt(roundedValue);
                // }}
                // />
                <b className="text-black">
                  {new Date(annotation.remindAt).toLocaleString()}
                </b>
              )}{" "}
              <AiOutlineEdit
                size={20}
                color="black"
                className="cursor-pointer hover:opacity-80"
                onClick={() =>
                  editingId === annotation.uuid
                    ? handleSaveClick(annotation.uuid)
                    : handleEditClick(
                        annotation.uuid,
                        new Date(annotation.remindAt).toISOString().slice(0, 16)
                      )
                }
              />
            </span>
          </div>
          <h2 className="font-semibold text-xl">{annotation.content}</h2>
          {/* {annotation.image && (
            <div className="flex items-center justify-center my-3">
              <Image
                src={annotation.image}
                alt="Imagem da anotação"
                layout="responsive"
                width={100}
                height={100}
                className="rounded-md object-cover max-w-[500px]"
              />
            </div>
          )} */}
          <div className="mt-4 text-xs text-gray-500 flex justify-end gap-4">
            {annotation.category && (
              <ToolTip content={`Categoria: ${annotation.category.name}`}>
                <AiOutlineTag size={25} className="text-black cursor-pointer" />
              </ToolTip>
            )}
            <ToolTip content={`Criado por: ${annotation.author.name}`}>
              <AiOutlineUser size={25} className="text-black cursor-pointer" />
            </ToolTip>
            {annotation.relatedUsers && annotation.relatedUsers.length > 0 && (
              <ToolTip
                content={`Participantes: ${annotation.relatedUsers
                  .map((relatedUser) => relatedUser.user.name)
                  .join(", ")}`}
              >
                <AiOutlineTeam
                  size={25}
                  className="text-black cursor-pointer"
                />
              </ToolTip>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RemindList;
