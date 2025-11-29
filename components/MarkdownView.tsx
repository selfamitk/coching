import React from 'react';

// A simple regex-based markdown parser for demonstration purposes to avoid heavy dependencies in this specific output format.
// In a production app, use 'react-markdown' or 'marked'.

interface MarkdownViewProps {
  content: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  // We will process the content to standard HTML elements for safety and simplicity without external libs.
  // This is a basic parser.
  
  const renderContent = (text: string) => {
    // 1. Sanitize (Basic) - In real app use DOMPurify
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // 2. Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // 3. Bold & Italic
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
    
    // 4. Blockquotes
    html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

    // 5. Code blocks (Basic)
    html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 6. Horizontal Rule
    html = html.replace(/^---$/gim, '<hr class="my-8 border-gray-300"/>');

    // 7. Lists (Very basic implementation, usually needs state machine for proper nesting)
    // We'll wrap lines starting with - in <li> and wrap consecutive <li>s in <ul> manually in a real parser.
    // Here we use a simpler replacement for visual approximation.
    html = html.replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>');
    html = html.replace(/^\d\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>');

    // 8. Line breaks
    html = html.replace(/\n/gim, '<br />');

    // Clean up excessive br caused by block replacements
    html = html.replace(/<\/h1><br \/>/g, '</h1>');
    html = html.replace(/<\/h2><br \/>/g, '</h2>');
    html = html.replace(/<\/h3><br \/>/g, '</h3>');
    html = html.replace(/<\/blockquote><br \/>/g, '</blockquote>');
    html = html.replace(/<\/li><br \/>/g, '</li>');
    html = html.replace(/<\/pre><br \/>/g, '</pre>');
    html = html.replace(/<hr class="my-8 border-gray-300"\/>\s*<br \/>/g, '<hr class="my-8 border-gray-300"/>');

    return { __html: html };
  };

  return (
    <div 
      className="markdown-body text-gray-800 leading-relaxed"
      dangerouslySetInnerHTML={renderContent(content)}
    />
  );
};
