import * as React from "react";
import cls from "clsx";

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 mr-2 inline-block"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
    />
  </svg>
);

const SideBar = ({ className }: { className?: string }) => {
  return (
    <div className={cls("w-1/5 h=full relative", className)}>
      side bar
      {/* <div className="absolute bottom-4 left-[calc(50%-25%);] w-1/2 h-0 pb-[30.9%]"> */}
      <button className="absolute left-1/2 -translate-x-1/2 bottom-6 rounded-md px-4 flex h-9 items-center text-sm font-medium transition-colors duration-200 leading-none bg-gray-800 text-gray-0 border border-black hover:bg-inherit hover:text:white hover:border-white">
        <DownloadIcon />
        Download
      </button>
      {/* </div> */}
    </div>
  );
};

export default SideBar;
