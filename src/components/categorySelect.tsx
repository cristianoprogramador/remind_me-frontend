import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { useSession } from "next-auth/react";
import { CategoryOption, UserProps } from "@/types";
import { useTheme } from "@/app/theme-context";


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
  const { theme } = useTheme();

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
      borderColor: theme === "dark" ? "gray" : "#ccc",
      color: theme === "dark" ? "white" : "black",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: theme === "dark" ? "rgba(31, 41, 55, 1)" : "white",
    }),
    option: (provided: any, state: { isFocused: any }) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? theme === "dark"
          ? "rgba(75, 85, 99, 1)"
          : "#ddd"
        : "transparent",
      color: theme === "dark" ? "white" : "black",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: theme === "dark" ? "white" : "black",
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: theme === "dark" ? "rgba(75, 85, 99, 1)" : "#e5e5e5",
      color: theme === "dark" ? "white" : "black",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: theme === "dark" ? "white" : "black",
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
