import { Badge } from "@nextui-org/react";
import React, { useRef } from "react";
import { useHoverDirty } from "react-use";

const HoverBadge = ({
  children,
  onClose,
}: React.PropsWithChildren & {
  onClose?: (tag: React.ReactNode) => void;
}) => {
  const ref = useRef(null);
  const isHovering = useHoverDirty(ref);

  return (
    <Badge
      ref={ref}
      disableOutline
      size="xs"
      content={
        // isHovering ? (
        isHovering ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.(children);
            }}
            className="w-3 h-3 cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : undefined
      }
      placement="top-right"
    >
      {children}
    </Badge>
  );
};

export default HoverBadge;
