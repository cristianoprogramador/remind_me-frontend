import { SetStateAction, useState } from "react";
import Modal from "../modal";
import ModalHeader from "../modalHeader";
import UserSelect from "../userSelect";
import CategorySelect from "../categorySelect";
import { Annotation, CategoryOption, UserProps } from "@/types";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

export type EditRemindProps = {
  modalInfo: boolean;
  setModalInfo: (value: SetStateAction<boolean>) => void;
  annotation: Annotation;
  onUpdateAnnotation: (updatedAnnotation: Partial<Annotation>) => void;
};

export const EditRemind = ({
  modalInfo,
  setModalInfo,
  annotation,
  onUpdateAnnotation,
}: EditRemindProps) => {
  const { data: session } = useSession();
  const { t } = useTranslation();

  const localRemindAt = new Date(annotation.remindAt);
  const fixedUserId = (session?.user as UserProps)?.id;

  const [remindAt, setRemindAt] = useState(
    new Date(
      localRemindAt.getTime() - localRemindAt.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16)
  );
  const [content, setContent] = useState(annotation.content);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryOption | null>(
      annotation.category
        ? { value: annotation.category.uuid, label: annotation.category.name }
        : null
    );
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(
    annotation.relatedUsers?.map((user) => user.user.uuid) || []
  );

  const handleSave = () => {
    const updatedRelatedUsers = selectedUserIds
      .filter((userId) => userId !== fixedUserId)
      .map((userId) => ({
        annotationId: annotation.uuid,
        userId,
        user: {
          uuid: userId,
          name: "",
          email: "",
          profileImageUrl: null,
        },
      }));

    onUpdateAnnotation({
      uuid: annotation.uuid,
      remindAt,
      content,
      category: selectedCategory
        ? { uuid: selectedCategory.value, name: selectedCategory.label }
        : undefined,
      relatedUsers: updatedRelatedUsers,
    });
    setModalInfo(false);
  };

  return (
    <Modal isOpen={modalInfo} setIsOpen={setModalInfo}>
      <ModalHeader
        onClose={() => setModalInfo(false)}
        title={t("editRemind.title")}
      />
      <div className="w-full mt-3 flex flex-col space-y-1.5 gap-1 rounded-lg items-center">
        <div className="flex flex-row justify-between gap-3">
          <div className="w-full">{t("editRemind.notificationDate")}:</div>
          <div className="relative">
            <input
              type="datetime-local"
              value={remindAt}
              onChange={(e) => {
                const [datePart, timePart] = e.target.value.split("T");
                let [hours, minutes] = timePart.split(":");
                minutes = "00";
                const roundedValue = `${datePart}T${hours}:${minutes}`;
                setRemindAt(roundedValue);
              }}
              className="w-full text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>
        </div>
        <div className="flex flex-row justify-between gap-3 text-xs">
          <CategorySelect
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
          />
          <UserSelect
            selectedUserIds={selectedUserIds}
            onChange={setSelectedUserIds}
            fixedUserId={annotation.author.uuid}
          />
        </div>
        <div className="flex w-full justify-center items-center">
          <textarea
            className="w-full bg-transparent px-5 py-3 outline-none border rounded-md"
            placeholder={t("editRemind.placeholder")}
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <button
          className="px-3 py-1 bg-gray-200 text-slate-800 transition-all duration-400 ease-in-out transform hover:bg-blue-600 hover:text-white rounded-md mr-4"
          onClick={handleSave}
        >
          {t("editRemind.save")}
        </button>
      </div>
    </Modal>
  );
};
