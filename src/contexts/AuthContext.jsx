import React from 'react';

const initialState = {
  user: null,
  login: () => undefined,
  setUser: (_) => undefined,
  logout: () => undefined,
};

const AuthContext = React.createContext(initialState);
export default AuthContext;
