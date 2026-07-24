/**
 * src/hooks/useSubscription.js
 * Estado de suscripción del coach actual para gating y UI.
 * Devuelve { loading, subscription, payments, state, refresh }.
 */
import { useCallback, useEffect, useState } from 'react';
import { getMySubscription, listMyPayments, getMyAccessFlags, getSubscriptionState } from '../lib/subscriptions.js';
import { useAuth } from '../store/authStore.jsx';

export default function useSubscription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [accessFlags, setAccessFlags] = useState(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setPayments([]);
      setAccessFlags(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [sub, pays, flags] = await Promise.all([
        getMySubscription(),
        listMyPayments(),
        getMyAccessFlags(),
      ]);
      setSubscription(sub);
      setPayments(pays);
      setAccessFlags(flags);
    } catch (e) {
      console.error('No se pudo cargar la suscripción:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const state = getSubscriptionState(subscription, payments, accessFlags);

  return { loading, subscription, payments, accessFlags, state, refresh };
}
