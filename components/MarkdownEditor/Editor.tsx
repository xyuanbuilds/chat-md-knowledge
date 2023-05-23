import {} from "react";
import clsx from "clsx";
// import "@uiw/react-md-editor/markdown-editor.css";
// import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useControlled } from "@/hooks";
import { useWindowSize } from "react-use";

// TODO suspend
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

// const MarkdownPreview = dynamic(
//   () =>
//     import("@uiw/react-md-editor").then((mod) => {
//       return mod.default.Markdown;
//     }),
//   { ssr: false }
// );

const cls = {
  editor: clsx(["", ""]),
};

interface EditorProps {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const Editor = ({ defaultValue, value, onChange }: EditorProps) => {
  const [controlledValue, setValue] = useControlled({
    defaultValue,
    value,
    onChange,
  });

  const { height } = useWindowSize();

  return (
    <div>
      <MDEditor
        height={height * 0.75}
        maxHeight={height - 150}
        value={controlledValue}
        onChange={(e) => {
          setValue(e ?? "");
        }}
        hideToolbar
      />
      {/* <MarkdownPreview
        source={controlledValue}
        style={{ whiteSpace: "pre-wrap" }}
      /> */}
    </div>
  );
};

export default Editor;
