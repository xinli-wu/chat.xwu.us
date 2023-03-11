import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { IconButton } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Noti } from './Noti';

export const CopyCode = ({ language, code }) => {
  const [copied, setCopied] = React.useState(false);
  const [noti, setNoti] = React.useState({ text: null, severity: undefined });


  const onCopyClick = () => {
    setCopied(true);
    setNoti({ text: 'Success', severity: 'success' });

    setTimeout(() => { setCopied(false); }, 3000);
  };

  return (
    <>
      <Noti noti={noti} setNoti={setNoti} />
      {/* <span>{language}</span> */}
      <CopyToClipboard text={String(code)} onCopy={() => onCopyClick()}>
        <span style={{ display: 'flex', justifyContent: 'end', marginBottom: -47 }}>
          <IconButton color="primary" aria-label="Copy to clipboard">
            {copied
              ? <DoneIcon color='success' />
              : <ContentCopyIcon />
            }
          </IconButton>
        </span>
      </CopyToClipboard>
    </>
  );
};