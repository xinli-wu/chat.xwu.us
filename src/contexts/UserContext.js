import React from 'react';

const initialState = {
  user: null,
  setUser: (_) => undefined,
};

export const UserContext = React.createContext(initialState);
