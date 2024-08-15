// src\components\Remind\remind.tsx

import React from "react";
import Image from "next/image";
import { AiOutlineEdit } from "react-icons/ai";
import {
  AiOutlineTag,
  AiOutlineInfoCircle,
  AiOutlineUser,
  AiOutlineTeam,
} from "react-icons/ai";

interface Annotation {
  id: string;
  createdAt: string;
  remindAt: string;
  text: string;
  image: string | null;
  category: string;
  status: string;
  creator: string;
  collaborators: string[];
}

interface AnnotationListProps {
  annotations: Annotation[];
}

const RemindList: React.FC<AnnotationListProps> = ({ annotations }) => {
  return (
    <div className="space-y-2 w-full max-w-3xl">
      {annotations.map((annotation) => (
        <div key={annotation.id} className="bg-white p-4 rounded-md shadow-md">
          <div className="mb-4 text-sm text-gray-500 flex flex-row justify-between">
            <span className="text-xs">
              Criado em: <b className="text-black">{annotation.createdAt}</b>
            </span>
            <span className="flex flex-row gap-1">
              Lembrar em: <b className="text-black">{annotation.remindAt}</b>{" "}
              <AiOutlineEdit
                size={20}
                color="black"
                className="cursor-pointer hover:opacity-80"
              />
            </span>
          </div>
          <h2 className="font-semibold text-xl">{annotation.text}</h2>
          {annotation.image && (
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
          )}
          <div className="mt-4 text-xs text-gray-500 flex justify-end gap-4">
            <span title={`Categoria: ${annotation.category}`}>
              <AiOutlineTag size={25} className="text-black cursor-pointer" />
            </span>
            <span title={`Status: ${annotation.status}`}>
              <AiOutlineInfoCircle
                size={25}
                className={`text-black cursor-pointer ${
                  annotation.status === "Pendente"
                    ? "text-red-600"
                    : "text-black"
                } `}
              />
            </span>
            <span title={`Criado por: ${annotation.creator}`}>
              <AiOutlineUser size={25} className="text-black cursor-pointer" />
            </span>
            {annotation.collaborators.length > 1 && (
              <span
                title={`Participantes: ${annotation.collaborators.join(", ")}`}
              >
                <AiOutlineTeam
                  size={25}
                  className="text-black cursor-pointer"
                />
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RemindList;
