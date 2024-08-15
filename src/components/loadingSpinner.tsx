import { FiLoader } from "react-icons/fi";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-slate-900 to-slate-800">
      <FiLoader className="animate-spin text-4xl text-white" />
    </div>
  );
}
