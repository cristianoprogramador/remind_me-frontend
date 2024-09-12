import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { useSession } from "next-auth/react";
import { CategoryOption, UserProps } from "@/types";
import { useTheme } from "@/app/theme-context";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
        throw new Error(t("categorySelect.createFailed"));
      }

      const newCategory = {
        label: inputValue,
        value: (await res.json()).uuid,
      };

      setCategories((prevCategories) => [...prevCategories, newCategory]);
      handleChange(newCategory);
    } catch (error) {
      console.error(t("categorySelect.createError"), error);
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

  const formatCreateLabel = (inputValue: string) =>
    t("categorySelect.create", { value: inputValue });

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
          throw new Error(t("categorySelect.fetchFailed"));
        }

        const data = await res.json();

        // Mapeia os dados para o formato esperado
        const mappedCategories = data.map((category: any) => ({
          label: category.name,
          value: category.uuid,
        }));

        setCategories(mappedCategories);
      } catch (error) {
        console.error(t("categorySelect.fetchError"), error);
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
      placeholder={t("categorySelect.placeholder")}
      formatCreateLabel={formatCreateLabel}
      noOptionsMessage={() =>
        loading ? t("categorySelect.loading") : t("categorySelect.noCategories")
      }
    />
  );
};

export default CategorySelect;
