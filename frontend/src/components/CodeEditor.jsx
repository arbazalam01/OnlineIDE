import React, { useState } from "react";

import Editor from "@monaco-editor/react";

const CodeEditor = ({ language = "javascript", theme, code, onChange }) => {
  // const [value, setValue] = useState("");

  const handleEditorChange = (value) => {
    // setValue(value);
    onChange("code", value);
  };

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="85vh"
        width={`100%`}
        language={language}
        value={code}
        theme={theme}
        // defaultValue={defaultTemplate}
        onChange={handleEditorChange}
      />
    </div>
  );
};
export default CodeEditor;
