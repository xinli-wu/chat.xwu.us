import React from 'react';

const initialState = {
  user: null,
  login: (_) => undefined,
  setUser: (_) => undefined,
  logout: () => undefined,
};

export const AuthContext = React.createContext(initialState);
