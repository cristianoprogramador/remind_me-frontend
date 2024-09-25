import { SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "./modal";
import ModalHeader from "./modalHeader";
import { useSession } from "next-auth/react";
import { UserProps } from "@/types";
import { toast } from "react-toastify";

interface ModalSendEmailProps {
  modalInfo: boolean;
  setModalInfo: (value: SetStateAction<boolean>) => void;
}

export const ModalSendEmail = ({
  modalInfo,
  setModalInfo,
}: ModalSendEmailProps) => {
  const [email, setEmail] = useState("");
  const { t } = useTranslation();
  const { data: session } = useSession();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/request-reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (res.ok) {
        toast.success(t("modalSendEmail.resetPasswordSuccess"));
        setModalInfo(false);
      } else {
        const data = await res.json();
        toast.error(data.message || t("modalSendEmail.errorResetPassword"));
      }
    } catch (error) {
      console.error("Erro ao enviar email de redefinição de senha:", error);
      toast.error(t("modalSendEmail.errorResetPassword"));
    }
  };

  return (
    <Modal isOpen={modalInfo} setIsOpen={setModalInfo}>
      <ModalHeader
        onClose={() => setModalInfo(false)}
        title={t("modalSendEmail.resetPasswordMessage")}
      />
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("modalSendEmail.typeEmail")}
          required
          className="p-2 border min-w-96 text-black"
        />
        <button
          type="submit"
          className="cursor-pointer mt-5 font-semibold rounded-lg text-base text-center bg-[#0C346E] text-white hover:opacity-80 py-3"
        >
          {t("modalSendEmail.resetPasswordMessage")}
        </button>
      </form>
    </Modal>
  );
};
