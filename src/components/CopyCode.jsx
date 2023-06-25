import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import { IconButton } from '@mui/material';
import React, { useContext } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { AppContext } from '../contexts/AppContext';

export const CopyCode = ({ language, code }) => {
  const [copied, setCopied] = React.useState(false);
  const { setToast } = useContext(AppContext);

  const onCopyClick = () => {
    setCopied(true);
    setToast({ text: 'Success', severity: 'success' });
  };

  React.useEffect(() => {
    const timer = setTimeout(() => setCopied(false), 3000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <CopyToClipboard text={String(code)} onCopy={() => onCopyClick()}>
      <span style={{ display: 'flex', justifyContent: 'end', marginBottom: -47 }}>
        <IconButton color="primary" aria-label="Copy to clipboard">
          {copied ? <DoneIcon color="success" /> : <ContentCopyIcon />}
        </IconButton>
      </span>
    </CopyToClipboard>
  );
};
