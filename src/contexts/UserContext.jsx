import React from 'react';

const initialState = {
  user: null,
  setUser: () => undefined,
};

const UserContext = React.createContext(initialState);

export default UserContext;
