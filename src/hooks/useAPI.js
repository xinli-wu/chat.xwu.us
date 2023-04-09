import axios from 'axios';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

const { REACT_APP_CHAT_API_URL } = process.env;

export const useChats = () => {
  return useSWR(`${REACT_APP_CHAT_API_URL}/my/chat`, axios);
};

export const useChat = (objectId) => {
  return useSWRImmutable(objectId ? `${REACT_APP_CHAT_API_URL}/my/chat/${objectId}` : null, axios);
};

export const useRefresh = () => {
  return useSWR(`${REACT_APP_CHAT_API_URL}/me/refresh`, axios.post, {
    refreshInterval: 1000 * 60 * 5,
  });
};


export const useImages = () => {
  return useSWRImmutable(`${REACT_APP_CHAT_API_URL}/my/image`, axios);
};

export const useImage = (objectId) => {
  return useSWR(objectId ? `${REACT_APP_CHAT_API_URL}/my/image/${objectId}` : null, axios);
};

export const useStripeProducts = () => {
  return useSWRImmutable(`${REACT_APP_CHAT_API_URL}/stripe/products`, axios);
};

export const useStripePrices = () => {
  return useSWRImmutable(`${REACT_APP_CHAT_API_URL}/stripe/prices`, axios);
};

export const usePlans = () => {
  return useSWRImmutable(`${REACT_APP_CHAT_API_URL}/stripe/plans`, axios);
};

export const useFeatures = () => {
  return useSWRImmutable(`${REACT_APP_CHAT_API_URL}/stripe/features`, axios);
};