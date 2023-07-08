import axios from 'axios';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

const { VITE_CHAT_API_URL } = import.meta.env;

export const useModels = () => {
  return useSWRImmutable(`${VITE_CHAT_API_URL}/openai/chat/getModels`, axios);
};

export const useChats = () => {
  return useSWR(`${VITE_CHAT_API_URL}/my/chat`, axios);
};

export const useChat = (objectId) => {
  return useSWR(objectId ? `${VITE_CHAT_API_URL}/my/chat/${objectId} ` : null, axios);
};

export const useRefresh = () => {
  return useSWR(`${VITE_CHAT_API_URL}/me/refresh`, axios.post, {
    refreshInterval: 1000 * 60 * 5,
  });
};

export const useImages = () => {
  return useSWR(`${VITE_CHAT_API_URL}/my/image`, axios);
};

export const useImage = (objectId) => {
  return useSWR(objectId ? `${VITE_CHAT_API_URL}/my/image/${objectId} ` : null, axios);
};

export const useStripeProducts = () => {
  return useSWR(`${VITE_CHAT_API_URL}/stripe/products`, axios);
};

export const useStripePrices = () => {
  return useSWRImmutable(`${VITE_CHAT_API_URL}/stripe/prices`, axios);
};

export const usePlans = () => {
  return useSWRImmutable(`${VITE_CHAT_API_URL}/stripe/plans`, axios);
};

export const useFeatures = () => {
  return useSWRImmutable(`${VITE_CHAT_API_URL}/stripe/features`, axios);
};
