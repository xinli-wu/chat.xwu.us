import React from 'react';

const initialState = {
  app: null,
  setApp: (_) => undefined,
};

export const AppContext = React.createContext(initialState);
