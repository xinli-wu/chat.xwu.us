import React from 'react';

const initialState = {
  user: null,
  setUser: (_user) => undefined,
};

const UserContext = React.createContext(initialState);

export default UserContext;
