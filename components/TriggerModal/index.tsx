import * as React from "react";
import { useModal, type RenderModalProps } from "./Modal";

interface TriggerModalProps extends RenderModalProps {
  children: RenderFn<[OpenModal: VoidFn]>;
}

const TriggerModal = ({ children }: TriggerModalProps) => {
  let [isOpen, setIsOpen] = React.useState(false);

  const closeModal = React.useCallback(() => setIsOpen(false), []);
  const openModal = React.useCallback(() => setIsOpen(true), []);

  const trigger = children(openModal);

  const [modalElm] = useModal({
    trigger,
    isOpen,
    openModal,
    closeModal,
  });

  return <>{modalElm}</>;
};

export default TriggerModal;
