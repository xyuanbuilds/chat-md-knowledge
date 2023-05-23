import { useEvent } from "@/hooks";
import * as React from "react";
import { useModal, type RenderModalProps } from "./Modal";

interface TriggerModalProps extends RenderModalProps {
  onOk?: () => void;
  children: RenderFn<[OpenModal: VoidFn]>;
  className?: string;
}

const TriggerModal = ({
  children,
  onOk,
  ...renderReset
}: TriggerModalProps) => {
  let [isOpen, setIsOpen] = React.useState(false);

  const closeModal = useEvent((isOk?: boolean) => {
    setIsOpen(false);
    if (isOk) onOk?.();
  });
  const openModal = React.useCallback(() => setIsOpen(true), []);

  const trigger = children(openModal);

  const [modalElm] = useModal({
    trigger,
    isOpen,
    openModal,
    closeModal,
    ...renderReset,
  });

  return <>{modalElm}</>;
};

export default TriggerModal;
