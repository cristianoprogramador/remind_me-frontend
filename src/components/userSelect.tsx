import React from "react";
import Select, { MultiValue, components } from "react-select";

interface User {
  id: string;
  nome: string;
}

interface UserSelectProps {
  users: User[];
  selectedUserIds: string[];
  onChange: (ids: string[]) => void;
  fixedUserId: string;
}

const UserSelect: React.FC<UserSelectProps> = ({
  users,
  selectedUserIds,
  onChange,
  fixedUserId,
}) => {
  const options = users.map((user) => ({
    value: user.id,
    label: user.nome,
  }));

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
      maxWidth: "100px", // Limita o tamanho do item selecionado
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "white",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      maxWidth: "80px", // Limita o tamanho do texto
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      display: "none", // Oculta o botão de remover o item
    }),
  };

  const handleChange = (
    selectedOptions: MultiValue<{ value: string; label: string }>
  ) => {
    const ids = selectedOptions.map((option) => option.value);

    if (!ids.includes(fixedUserId)) {
      ids.push(fixedUserId);
    }

    onChange(ids);
  };

  const MultiValue = ({ index, getValue, ...props }: any) => {
    const maxToShow = 1;
    const overflowValue = getValue().length - maxToShow;

    if (index < maxToShow) {
      return <components.MultiValue {...props} />;
    }

    if (index === maxToShow) {
      const allSelectedLabels = getValue()
        .slice(1)
        .map((option: { label: string }) => option.label)
        .join(", ");

      return (
        <components.MultiValue {...props}>
          <span title={allSelectedLabels}>{`+ ${overflowValue}`}</span>
        </components.MultiValue>
      );
    }
    return null;
  };

  return (
    <Select
      value={options.filter((option) => selectedUserIds.includes(option.value))}
      onChange={handleChange}
      options={options}
      styles={customStyles}
      isClearable={false}
      isMulti={true}
      placeholder="Selecione usuários"
      components={{ MultiValue }}
    />
  );
};

export default UserSelect;
