import React from 'react';

const initialState = {
  app: {},
  setApp: (_) => undefined,
  toast: {},
  setToast: (_) => undefined,
};

const AppContext = React.createContext(initialState);
export default AppContext;
