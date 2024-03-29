import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import useLocalStorage from './useLocalStorage';

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   authToken?: string;
// }

const useUser = () => {
  const { user, setUser } = useContext(AuthContext);
  const { setItem } = useLocalStorage();

  const addUser = (newUser) => {
    setUser(newUser);
    setItem('user', JSON.stringify(newUser));
  };

  const removeUser = () => {
    setUser(null);
    setItem('user', '');
  };

  return {
    user,
    setUser,
    addUser,
    removeUser,
  };
};

export default useUser;
