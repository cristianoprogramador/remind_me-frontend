import CategorySelect, { CategoryOption } from "@/components/categorySelect";
import UserSelect from "@/components/userSelect";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { FiCalendar } from "react-icons/fi";

interface UserProps {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  token: string;
}

export function CreateRemind() {
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
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const remindAtUTC = new Date(remindAt).toISOString();

    console.log(remindAtUTC);

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
            relatedUserId:
              selectedUserIds[0] !== fixedUserId
                ? selectedUserIds[0]
                : undefined,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Falha ao criar a anotação");
      }

      alert("Anotação criada com sucesso!");

      setContent(""); // Limpa o campo de conteúdo
      setRemindAt(""); // Limpa o campo de data/hora
      setSelectedCategory(null); // Desseleciona a categoria
      setSelectedUserIds([fixedUserId]); // Mantém apenas o usuário logado selecionado

      // Aqui você pode adicionar lógica para limpar os campos ou redirecionar o usuário, etc.
    } catch (error) {
      console.error("Erro ao criar anotação:", error);
      alert("Erro ao criar anotação");
    }
  };

  return (
    <div className="border rounded-md w-full flex flex-col mb-7">
      <div>
        <textarea
          className="w-full bg-transparent px-5 py-3 text-white outline-none"
          placeholder="Eu preciso lembrar de..."
          rows={1}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="h-[1px] w-full bg-gray-300 mb-4" />
      <div className="flex flex-row text-white justify-between items-center mb-2">
        <div className="flex flex-row gap-3 ml-4 items-center text-xs">
          <CiImageOn size={25} className="cursor-pointer hover:text-blue-600" />
          <div className="relative flex items-center">
            <input
              type="datetime-local"
              className="bg-transparent text-white pl-10 w-44 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={remindAt}
              onChange={(e) => {
                const roundedValue =
                  e.target.value.split(":").slice(0, 2).join(":") + ":00";
                setRemindAt(roundedValue);
              }}
              step="3600"
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
        </div>
        <button
          className="px-3 py-1 bg-gray-200 text-slate-800 transition-all duration-400 ease-in-out transform hover:bg-blue-600 hover:text-white rounded-md mr-4"
          onClick={handleCreateAnnotation}
        >
          Criar
        </button>
      </div>
    </div>
  );
}
