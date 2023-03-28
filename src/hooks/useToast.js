import { useState } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState({});

  const showToast = (params) => {
    setToast(params);
  };

  const success = (params) => showToast({ ...params, severity: 'success' });
  const error = (params) => showToast({ ...params, severity: 'error' });
  const warning = (params) => showToast({ ...params, severity: 'warning' });
  const info = (params) => showToast({ ...params, severity: 'info' });

  return { toast, setToast, success, error, warning, info };
};