import { Friend, UserProps } from "@/types";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Select, { MultiValue, components } from "react-select";

interface UserSelectProps {
  selectedUserIds: string[];
  onChange: (ids: string[]) => void;
  fixedUserId: string;
}

const UserSelect: React.FC<UserSelectProps> = ({
  selectedUserIds,
  onChange,
  fixedUserId,
}) => {
  const { data: session } = useSession();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFriends() {
      if (!session) return;

      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/friendship/friends`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${(session?.user as UserProps)?.token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch friends");
        }

        const data = await res.json();

        const mappedFriends = data.map((friendship: any) => {
          return {
            uuid:
              friendship.user1Id === (session?.user as UserProps)?.id
                ? friendship.user2.uuid
                : friendship.user1.uuid,
            name:
              friendship.user1Id === (session?.user as UserProps)?.id
                ? friendship.user2.name
                : friendship.user1.name,
            email:
              friendship.user1Id === (session?.user as UserProps)?.id
                ? friendship.user2.email
                : friendship.user1.email,
            profileImageUrl:
              friendship.user1Id === (session?.user as UserProps)?.id
                ? friendship.user2.profileImageUrl
                : friendship.user1.profileImageUrl,
          };
        });

        // Adiciona o usuário logado à lista de amigos
        const loggedInUser = {
          uuid: (session?.user as UserProps)?.id,
          name: (session?.user as UserProps)?.name || "",
          email: (session?.user as UserProps)?.email || "",
          profileImageUrl: (session?.user as UserProps)?.image || "",
        };

        setFriends([loggedInUser, ...mappedFriends]);

        // Garante que o usuário logado está sempre selecionado
        onChange([loggedInUser.uuid, ...selectedUserIds]);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFriends();
  }, [session]);

  // Mapeia os amigos para o formato esperado pelo react-select
  const options = friends.map((friend) => ({
    value: friend.uuid,
    label: friend.name,
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
      maxWidth: "100px",
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
      maxWidth: "80px",
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

    // Garante que o usuário logado está sempre selecionado
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
      placeholder={loading ? "Carregando amigos..." : "Selecione usuários"}
      components={{ MultiValue }}
      isLoading={loading}
    />
  );
};

export default UserSelect;
