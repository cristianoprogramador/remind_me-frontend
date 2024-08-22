import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { useSession } from "next-auth/react";
import { CategoryOption, UserProps } from "@/types";


interface CategorySelectProps {
  selectedCategory: CategoryOption | null;
  onChange: (category: CategoryOption | null) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  selectedCategory,
  onChange,
}) => {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (newValue: CategoryOption | null) => {
    onChange(newValue);
  };

  const handleCreate = async (inputValue: string) => {
    const newCategory = { label: inputValue, value: inputValue.toLowerCase() };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session?.user as UserProps)?.token}`,
        },
        body: JSON.stringify({ name: inputValue }),
      });

      if (!res.ok) {
        throw new Error("Failed to create category");
      }

      const newCategory = {
        label: inputValue,
        value: (await res.json()).uuid,
      };

      setCategories((prevCategories) => [...prevCategories, newCategory]);
      handleChange(newCategory);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "transparent",
      borderColor: "gray",
      color: "white",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "rgba(31, 41, 55, 1)",
    }),
    option: (provided: any, state: { isFocused: any }) => ({
      ...provided,
      backgroundColor: state.isFocused ? "rgba(75, 85, 99, 1)" : "transparent",
      color: "white",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "white",
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "rgba(75, 85, 99, 1)",
      color: "white",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "white",
    }),
  };

  const formatCreateLabel = (inputValue: string) => `Criar "${inputValue}"`;

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session?.user as UserProps)?.token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await res.json();

        // Mapeia os dados para o formato esperado
        const mappedCategories = data.map((category: any) => ({
          label: category.name,
          value: category.uuid,
        }));

        setCategories(mappedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchCategories();
    }
  }, [session]);

  return (
    <CreatableSelect
      isClearable
      isLoading={loading}
      options={categories}
      value={selectedCategory}
      styles={customStyles}
      onChange={handleChange}
      onCreateOption={handleCreate}
      placeholder="Categoria"
      formatCreateLabel={formatCreateLabel}
      noOptionsMessage={() =>
        loading ? "Carregando categorias..." : "Nenhuma categoria encontrada"
      }
    />
  );
};

export default CategorySelect;
