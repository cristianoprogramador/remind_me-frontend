// src\components\Remind\remind.tsx

import React, { useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlineTag, AiOutlineUser, AiOutlineTeam } from "react-icons/ai";
import { Annotation, UserProps } from "@/types";
import { ToolTip } from "../tooltip";
import { EditRemind } from "./editRemind";
import { useSession } from "next-auth/react";

interface AnnotationListProps {
  annotations: Annotation[];
  fetchAnnotations: () => Promise<void>;
}

const RemindList: React.FC<AnnotationListProps> = ({
  annotations,
  fetchAnnotations,
}) => {
  const [editingAnnotation, setEditingAnnotation] = useState<Annotation | null>(
    null
  );
  const { data: session } = useSession();

  const handleModalEditRemind = (annotation: Annotation) => {
    setEditingAnnotation(annotation);
  };

  const handleUpdateAnnotation = async (
    updatedAnnotation: Partial<Annotation>
  ) => {
    const { uuid, content, remindAt, category, relatedUsers } =
      updatedAnnotation;

    const updateData = {
      content,
      remindAt: new Date(remindAt!).toISOString(),
      categoryId: category?.uuid,
      relatedUsers: relatedUsers?.map((user) => ({
        userId: user.user.uuid,
      })),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/annotations/${uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session?.user as UserProps)?.token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!res.ok) {
        throw new Error("Falha ao atualizar a anotação");
      }

      await fetchAnnotations();
    } catch (error) {
      console.error("Erro ao atualizar anotação:", error);
    }
  };

  return (
    <div className="space-y-2 w-full max-w-3xl">
      {annotations.map((annotation) => (
        <div
          key={annotation.uuid}
          className="bg-white p-4 rounded-md shadow-md border border-theme-border-color"
        >
          <div className="mb-4 text-sm text-gray-500 flex flex-col md:gap-0 gap-1 md:flex-row justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs">
                Criado em:{" "}
                <b className="text-black">
                  {new Date(annotation.createdAt).toLocaleString()}
                </b>
              </span>
            </div>
            <span className="flex flex-row gap-1">
              Lembrar em:{" "}
              <b className="text-black">
                {new Date(annotation.remindAt).toLocaleString()}
              </b>{" "}
              <AiOutlineEdit
                size={20}
                color="black"
                className="cursor-pointer hover:opacity-80"
                onClick={() => handleModalEditRemind(annotation)}
              />
            </span>
          </div>
          <h2 className="font-semibold text-xl">{annotation.content}</h2>
          <div className="mt-4 text-xs text-gray-500 flex flex-row justify-between">
            {annotation.updatedAt !== annotation.createdAt && (
              <div className="flex w-full">
                <span className="text-[10px]">
                  Editado em:{" "}
                  <b className="text-black">
                    {new Date(annotation.updatedAt).toLocaleString()}
                  </b>
                </span>
              </div>
            )}

            <div className="flex flex-row justify-end w-full gap-4">
              {annotation.category && (
                <ToolTip content={`Categoria: ${annotation.category.name}`}>
                  <AiOutlineTag
                    size={25}
                    className="text-black cursor-pointer"
                  />
                </ToolTip>
              )}
              <ToolTip content={`Criado por: ${annotation.author.name}`}>
                <AiOutlineUser
                  size={25}
                  className="text-black cursor-pointer"
                />
              </ToolTip>
              {annotation.relatedUsers &&
                annotation.relatedUsers.length > 0 && (
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
        </div>
      ))}

      {editingAnnotation && (
        <EditRemind
          modalInfo={Boolean(editingAnnotation)}
          setModalInfo={() => setEditingAnnotation(null)}
          annotation={editingAnnotation}
          onUpdateAnnotation={handleUpdateAnnotation}
        />
      )}
    </div>
  );
};

export default RemindList;
