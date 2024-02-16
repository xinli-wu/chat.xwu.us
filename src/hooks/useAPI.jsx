import axios from 'axios';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

const { VITE_CHAT_API_URL } = import.meta.env;

export const useChatModels = () => useSWRImmutable(`${VITE_CHAT_API_URL}/openai/chat/models`, axios);

export const useImageModels = () => useSWRImmutable(`${VITE_CHAT_API_URL}/openai/image/models`, axios);

export const useChats = () => useSWR(`${VITE_CHAT_API_URL}/my/chat`, axios);

export const useChat = (objectId) => useSWR(objectId ? `${VITE_CHAT_API_URL}/my/chat/${objectId} ` : null, axios);

export const useRefresh = () =>
  useSWR(`${VITE_CHAT_API_URL}/me/refresh`, axios.post, { refreshInterval: 1000 * 60 * 5 });

export const useImages = () => useSWR(`${VITE_CHAT_API_URL}/my/image`, axios);

export const useImage = (objectId) => useSWR(objectId ? `${VITE_CHAT_API_URL}/my/image/${objectId} ` : null, axios);

export const useStripeProducts = () => useSWR(`${VITE_CHAT_API_URL}/stripe/products`, axios);

export const useStripePrices = () => useSWRImmutable(`${VITE_CHAT_API_URL}/stripe/prices`, axios);

export const usePlans = () => useSWRImmutable(`${VITE_CHAT_API_URL}/stripe/plans`, axios);

export const useFeatures = () => useSWRImmutable(`${VITE_CHAT_API_URL}/stripe/features`, axios);
