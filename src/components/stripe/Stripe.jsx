import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { ProductDisplay } from './ProductDisplay';
import axios from 'axios';
const { VITE_CHAT_API_URL } = import.meta.env;

export default function Stripe() {

  const { setToast } = useContext(AppContext);

  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      setSessionId(query.get('session_id'));
      // console.log(query.get('id'));
      // setToast({ text: `Thanks for your payment`, severity: 'success' });
    }

    if (query.get('canceled')) {
      setToast({ text: `You have cancelled your payment`, severity: 'info' });
    }
  }, [sessionId, setToast]);

  useEffect(() => {

    if (sessionId) {
      (async () => {
        const { data } = await axios.post(`${VITE_CHAT_API_URL}/stripe/verify-payment`, { sessionId });
        if (data.status === 'success') {
          setToast({ text: data.message, severity: 'success' });
        } else {
          setToast({ text: data.message, severity: 'error' });
        }

      })();
    }
  }, [sessionId, setToast]);

  return <ProductDisplay />;
};