import { IoMdCloseCircleOutline } from "react-icons/io";

const ModalHeader = ({
  onClose,
  title,
}: {
  onClose(): void;
  title: string;
}) => {
  return (
    <div className="relative flex items-center justify-center p-3">
      <button className="absolute top-0 right-0 rounded-md" onClick={onClose}>
        <IoMdCloseCircleOutline
          className="text-gray-300 transition-all duration-400 ease-in-out transform hover:text-red-500"
          size={30}
        />
      </button>

      <span className="font-semibold text-base">{title}</span>
    </div>
  );
};

export default ModalHeader;
