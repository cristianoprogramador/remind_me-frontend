const CloseButton = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 6L6 18"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 6L18 18"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const ModalHeader = ({
  onClose,
  title,
}: {
  onClose(): void;
  title: string;
}) => {
  return (
    <div className="relative flex items-center justify-center p-3">
      <button
        className="absolute top-0 right-0 border border-black rounded-md"
        onClick={onClose}
      >
        <CloseButton />
      </button>
      <span className="font-semibold text-base">{title}</span>
    </div>
  );
};

export default ModalHeader;
