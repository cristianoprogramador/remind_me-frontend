import CategorySelect from "@/components/categorySelect";
import UserSelect from "@/components/userSelect";
import { Annotation, CategoryOption, UserProps } from "@/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { FiCalendar } from "react-icons/fi";
import { toast } from "react-toastify";

interface CreateRemindProps {
  onCreate: (newAnnotation: Annotation) => void;
}

export function CreateRemind({ onCreate }: CreateRemindProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState<string>("");
  const [remindAt, setRemindAt] = useState<string>("");

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const fixedUserId = (session?.user as UserProps)?.id;
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryOption | null>(null);

  const handleUserChange = (ids: string[]) => {
    setSelectedUserIds(ids);
  };

  const handleCategoryChange = (category: CategoryOption | null) => {
    setSelectedCategory(category);
  };

  const handleCreateAnnotation = async () => {
    if (!content || !remindAt) {
      toast.warning("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const remindAtUTC = new Date(remindAt).toISOString();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/annotations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session?.user as UserProps)?.token}`,
          },
          body: JSON.stringify({
            content,
            remindAt: remindAtUTC,
            categoryId: selectedCategory?.value,
            relatedUserIds: selectedUserIds.filter((id) => id !== fixedUserId),
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Falha ao criar a anotação");
      }

      const newAnnotation = await res.json();

      onCreate(newAnnotation);

      setContent("");
      setRemindAt("");
      setSelectedCategory(null);
      setSelectedUserIds([fixedUserId]);

      toast.success("Lembrete criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar anotação:", error);
      toast.error("Erro ao criar anotação");
    }
  };

  return (
    <div className="border border-theme-border-color rounded-md w-full flex flex-col mb-7">
      <div>
        <textarea
          className="w-full bg-transparent px-5 py-3 text-theme-text-color outline-none"
          placeholder="Eu preciso lembrar de..."
          rows={1}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="h-[1px] w-full bg-theme-text-color mb-4" />
      <div className="flex flex-row text-white justify-between items-center mb-2">
        <div className="md:flex grid grid-cols-1 md:flex-row w-full gap-3 mx-4 items-center text-xs">
          <div className="relative flex items-center">
            <input
              type="datetime-local"
              className="bg-transparent text-theme-text-color pl-10 w-44 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={remindAt}
              onChange={(e) => {
                const [datePart, timePart] = e.target.value.split("T");
                let [hours, minutes] = timePart.split(":");
                minutes = "00";
                const roundedValue = `${datePart}T${hours}:${minutes}`;
                setRemindAt(roundedValue);
              }}
            />
            <FiCalendar
              className="absolute left-3 text-white pointer-events-none"
              size={20}
            />
          </div>
          <UserSelect
            selectedUserIds={selectedUserIds}
            onChange={handleUserChange}
            fixedUserId={fixedUserId}
          />
          <CategorySelect
            selectedCategory={selectedCategory}
            onChange={handleCategoryChange}
          />
          <div className="md:hidden flex items-center justify-center text-center">
            <div
              className="md:hidden flex bg-gray-200 text-slate-800 transition-all duration-400 ease-in-out transform hover:bg-blue-600 hover:text-white rounded-md w-20 h-7 items-center justify-center text-center"
              onClick={handleCreateAnnotation}
            >
              Criar
            </div>
          </div>
        </div>
        <button
          className="md:flex hidden px-3 py-1 bg-gray-200 text-slate-800 transition-all duration-400 ease-in-out transform hover:bg-blue-600 hover:text-white rounded-md mr-4"
          onClick={handleCreateAnnotation}
        >
          Criar
        </button>
      </div>
    </div>
  );
}
