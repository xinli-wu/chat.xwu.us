import axios from 'axios';
import useSWR from 'swr';

const { REACT_APP_CHAT_API_URL } = process.env;

export const useChats = () => {
  return useSWR(`${REACT_APP_CHAT_API_URL}/my/chat`, axios);
};

export const useChat = (objectId) => {
  return useSWR(objectId ? `${REACT_APP_CHAT_API_URL}/my/chat/${objectId}` : null, axios);
};

export const useRefresh = () => {
  const { data, error, isLoading } = useSWR(`${REACT_APP_CHAT_API_URL}/me/refresh`, axios.post, { refreshInterval: 1000 * 60 * 5 });

  return { data: data?.data, error, isLoading };
};
