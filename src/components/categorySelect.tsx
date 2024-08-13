import React from "react";
import CreatableSelect from "react-select/creatable";

export interface CategoryOption {
  label: string;
  value: string;
}

interface CategorySelectProps {
  categories: CategoryOption[];
  selectedCategory: CategoryOption | null;
  onChange: (category: CategoryOption | null) => void;
  onAddCategory: (newCategory: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  categories,
  selectedCategory,
  onChange,
  onAddCategory,
}) => {
  const handleChange = (newValue: CategoryOption | null) => {
    onChange(newValue);
  };

  const handleCreate = (inputValue: string) => {
    const newCategory = { label: inputValue, value: inputValue.toLowerCase() };
    onAddCategory(inputValue);
    handleChange(newCategory);
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

  return (
    <CreatableSelect
      isClearable
      options={categories}
      value={selectedCategory}
      styles={customStyles}
      onChange={handleChange}
      onCreateOption={handleCreate}
      placeholder="Categoria"
    />
  );
};

export default CategorySelect;
