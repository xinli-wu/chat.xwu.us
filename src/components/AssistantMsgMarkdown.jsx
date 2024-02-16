import { Stack } from '@mui/material';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyCode from './CopyCode';

function AssistantMsgMarkdown({ content, canCopy = false }) {
  const code = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '') || ['language-javascript', 'javascript'];
    return !inline && match ? (
      <Stack sx={{ overflowX: 'scroll' }}>
        {canCopy && <CopyCode language={match[1]} code={String(children)} />}
        <SyntaxHighlighter showLineNumbers style={vscDarkPlus} language={match[1]} PreTag="span" {...props}>
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </Stack>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  return <ReactMarkdown components={{ code }}>{content}</ReactMarkdown>;
}

export default AssistantMsgMarkdown;
