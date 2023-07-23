import { useState } from 'react';

const useLocalStorage = () => {
  const [value, setValue] = useState(null);

  const setItem = (key, value) => {
    // localStorage.setItem(key, value);
    setValue(value);
  };

  const getItem = (key) => {
    const value = localStorage.getItem(key);
    setValue(value);
    return value;
  };

  const removeItem = () => {
    // localStorage.removeItem(key);
    setValue(null);
  };

  return {
    value,
    setItem,
    getItem,
    removeItem,
  };
};

export default useLocalStorage;
