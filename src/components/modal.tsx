import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, ReactNode, SetStateAction } from "react";

interface IModalProps {
  isOpen: boolean;
  setIsOpen: (value: SetStateAction<boolean>) => void;
  children: ReactNode;
}

const Modal: React.FC<IModalProps> = ({ isOpen, setIsOpen, children }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div>
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center max-h-screen p-4 overflow-auto sm:items-center">
              <Dialog.Panel className="min-w-[550px] max-h-[90%] overflow-y-auto p-4 mx-auto bg-[#1F2937] rounded text-white border-[1px]">
                {children}
              </Dialog.Panel>
            </div>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
};

export default Modal;
