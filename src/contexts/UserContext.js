import React from 'react';

const initialState = {
  user: null,
  setUser: (_) => { },
};

export const UserContext = React.createContext(initialState);
