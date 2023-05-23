import clsx from "clsx";

const baseCls = [
  "inline-flex",
  "justify-center",
  "rounded-md",
  "px-4",
  "py-2",
  "text-sm",
  "font-medium",
  "transition-all",
];

const cls = {
  default: clsx(baseCls, [
    "text-blue-900",
    "focus:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-blue-500",
    "focus-visible:ring-offset-2",
  ]),
  solid: clsx(baseCls, [
    "border",
    "border-solid",
    "border-gray-300",
    // "border-transparent",
    "hover:text-[#4096ff]",
    "hover:border-[#4096ff]",
  ]),
};

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button = (
  <button type="button" className="">
    Got it
  </button>
);

export const SolidButton = ({ className, ...rest }: ButtonProps) => (
  <button type="button" className={clsx(cls.solid, className)} {...rest}>
    cancel
  </button>
);
