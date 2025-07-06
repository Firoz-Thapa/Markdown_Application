export const insertBlockElement = (markdown, position, element, needsBlankLines = true) => {
  const beforeCursor = markdown.substring(0, position);
  const afterCursor = markdown.substring(position);
  
  let formattedElement = element;
  
  if (needsBlankLines) {
    // Check if we need a newline before
    const lastChar = beforeCursor.slice(-1);
    const secondLastChar = beforeCursor.slice(-2, -1);
    
    if (beforeCursor.length > 0 && lastChar !== '\n') {
      formattedElement = '\n' + formattedElement;
    } else if (beforeCursor.length > 1 && lastChar === '\n' && secondLastChar !== '\n') {
      formattedElement = '\n' + formattedElement;
    }
    
    // Check if we need a newline after
    const firstChar = afterCursor.slice(0, 1);
    const secondChar = afterCursor.slice(1, 2);
    
    if (afterCursor.length > 0 && firstChar !== '\n') {
      formattedElement = formattedElement + '\n';
    } else if (afterCursor.length > 1 && firstChar === '\n' && secondChar !== '\n') {
      formattedElement = formattedElement + '\n';
    }
  }
  
  return {
    newMarkdown: beforeCursor + formattedElement + afterCursor,
    newCursorPosition: position + formattedElement.length
  };
};

export const isAtStartOfLine = (text, position) => {
  if (position === 0) return true;
  return text.charAt(position - 1) === '\n';
};

export const getLineStart = (text, position) => {
  const beforeCursor = text.substring(0, position);
  const lastNewline = beforeCursor.lastIndexOf('\n');
  return lastNewline === -1 ? 0 : lastNewline + 1;
};

export const getCurrentLine = (text, position) => {
  const lineStart = getLineStart(text, position);
  const afterPosition = text.substring(position);
  const nextNewline = afterPosition.indexOf('\n');
  const lineEnd = nextNewline === -1 ? text.length : position + nextNewline;
  
  return {
    start: lineStart,
    end: lineEnd,
    content: text.substring(lineStart, lineEnd)
  };
};