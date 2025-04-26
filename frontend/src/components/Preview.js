import React from 'react';

const Preview = ({ markdown, converter }) => {
  const html = converter.makeHtml(markdown);

  return (
    <div
      className="preview"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Preview;




