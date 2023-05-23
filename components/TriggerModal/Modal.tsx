import * as React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { isFn } from "@/utils/predicates";

type FooterRenderArgs = [closeModal: VoidFn];

export interface ModalActionProps {
  isOpen: boolean;
  openModal: VoidFn;
  closeModal: (isOk?: boolean) => void;
}

export interface RenderModalProps {
  title?: React.ReactNode;
  content?: React.ReactNode;
  footer?: RenderFn<FooterRenderArgs> | React.ReactNode;
}

interface ModalProps extends RenderModalProps {
  isOpen: boolean;
  closeModal: VoidFn;
}

const Modal = ({
  title = "设置",
  content = null,
  isOpen,
  footer,
  closeModal,
}: ModalProps) => {
  const okButton = (
    <button
      type="button"
      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      onClick={() => closeModal(true)}
    >
      Got it
    </button>
  );

  const cancelButton = (
    <button
      type="button"
      className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium  focus:outline-none"
      onClick={() => closeModal()}
    >
      cancel
    </button>
  );

  const defaultFooter = (
    <>
      {okButton}
      {cancelButton}
    </>
  );

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>

                <div className="mt-2">{content}</div>

                <div className="mt-4">
                  {isFn<FooterRenderArgs, React.ReactNode>(footer)
                    ? footer(closeModal)
                    : defaultFooter}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export interface UseModalProps extends RenderModalProps, ModalActionProps {
  trigger: React.ReactElement;
}

export const useModal = ({
  title,
  content,
  footer,
  trigger,
  isOpen,
  openModal,
  closeModal,
}: UseModalProps) => {
  const elm = (
    <>
      {trigger}
      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        title={title}
        content={content}
        footer={footer}
      />
    </>
  );

  return [
    elm,
    {
      isOpen,
      openModal,
      closeModal,
    },
  ] as const;
};

export default Modal;
