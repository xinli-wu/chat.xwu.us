import React from 'react';

const initialState = {
  app: {},
  setApp: (_) => undefined,
  toast: {},
  setToast: (_) => undefined,
};

export const AppContext = React.createContext(initialState);
