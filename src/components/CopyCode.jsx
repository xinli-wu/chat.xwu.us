import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import { IconButton } from '@mui/material';
import React, { useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

function CopyCode({ language, code }) {
  const [copied, setCopied] = React.useState(false);

  const onCopyClick = () => {
    setCopied(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (copied) setCopied(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [copied]);

  React.useEffect(() => {
    const timer = setTimeout(() => setCopied(false), 3000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <CopyToClipboard text={String(code)} onCopy={onCopyClick}>
      <span style={{ display: 'flex', justifyContent: 'end', marginBottom: -50 }}>
        <IconButton size="small" color="primary" aria-label="Copy to clipboard">
          {copied ? <DoneIcon color="success" /> : <ContentCopyIcon />}
        </IconButton>
      </span>
    </CopyToClipboard>
  );
}

export default CopyCode;
