import * as React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { isFn } from "@/utils/predicates";
import clsx from "clsx";
import { SolidButton } from "@/components/Buttons";

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
  closeModal: (isOk?: boolean) => void;
  className?: string;
  containerClassName?: string;
}

const Modal = ({
  title = "设置",
  content = null,
  isOpen,
  footer,
  closeModal,
  className: propsPanelCls,
  containerClassName: containerCls,
}: ModalProps) => {
  const containerClsName = clsx(
    "flex",
    "min-h-full",
    "items-center",
    "justify-center",
    "p-4",
    "text-center",
    "dark:text-white",
    containerCls
  );

  const panelCls = clsx(
    "w-full transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 pb-20 text-left align-middle shadow-xl transition-all",
    propsPanelCls
  );

  const okButton = (
    <button
      type="button"
      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      onClick={() => closeModal(true)}
    >
      Ok
    </button>
  );

  const cancelButton = (
    <SolidButton className="mr-4" onClick={() => closeModal()}>
      Cancel
    </SolidButton>
  );

  const defaultFooter = (
    <>
      {cancelButton}
      {okButton}
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
          <div className={containerClsName}>
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={panelCls}>
                <Dialog.Title
                  as="h3"
                  className="text-lg text-gray-900 dark:text-white font-medium leading-6 "
                >
                  {title}
                </Dialog.Title>

                <div className="mt-4">{content}</div>

                <div className="text-gray-900 dark:text-white mt-4 absolute bottom-5 right-6">
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
  className?: string;
}

export const useModal = ({
  title,
  content,
  footer,
  trigger,
  isOpen,
  openModal,
  closeModal,
  className,
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
        className={className}
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
