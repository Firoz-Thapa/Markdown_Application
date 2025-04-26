import React from 'react';

function Editor({ markdown, onChange }) {
  return (
    <textarea
      id="markdown-editor"
      value={markdown}
      onChange={onChange}
      placeholder="Write your markdown here..."
    />
  );
}

export default Editor;


