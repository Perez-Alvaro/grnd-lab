import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useClientAuth } from '@/context/UnifiedAuthContext';
import { supabase } from '@/lib/supabase';
import logger from '@/utils/logger';

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useClientAuth();

  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [showConfetti, setShowConfetti] = useState(true);

  const paymentId = searchParams.get('payment_id');
  const preferenceId = searchParams.get('preference_id');

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      if (!paymentId) {
        setError('No se encontró información del pago');
        setLoading(false);
        return;
      }

      try {
        logger.info('Checking payment status', { paymentId });

        // Buscar el pago en nuestra base de datos
        const { data: sale, error: saleError } = await supabase
          .from('sales')
          .select(`
            *,
            sale_items (
              *,
              product:products (
                id,
                name,
                price,
                type
              )
            )
          `)
          .eq('payment_id', paymentId)
          .single();

        if (saleError && saleError.code !== 'PGRST116') {
          throw saleError;
        }

        if (sale) {
          // El webhook ya procesó el pago
          setPaymentInfo({
            status: sale.status,
            saleId: sale.id,
            amount: sale.total_amount,
            email: sale.user_email,
            products: sale.sale_items,
            processed: true
          });
        } else {
          // El webhook aún no procesó el pago, verificar con MP
          const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
          const response = await fetch(
            `${SUPABASE_URL}/functions/v1/get-mp-payment/${paymentId}`,
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

          if (!response.ok) {
            throw new Error('Error al consultar el estado del pago');
          }

          const mpPayment = await response.json();

          setPaymentInfo({
            status: mpPayment.status,
            mpStatus: mpPayment.status_detail,
            amount: mpPayment.transaction_amount,
            email: mpPayment.payer?.email,
            processed: false
          });
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching payment status:', err);
        logger.error('Payment status check failed', err);
        setError('No se pudo verificar el estado del pago. Por favor contacta a soporte.');
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [paymentId]);

  // Countdown para redirección automática
  useEffect(() => {
    if (!loading && paymentInfo?.status === 'approved' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0 && paymentInfo?.status === 'approved') {
      navigate('/client/dashboard');
    }
  }, [countdown, loading, paymentInfo, navigate]);

  // Ocultar confetti después de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-accent/20"></div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand-border border-t-accent"></div>
            </div>
          </div>
          <p className="text-base font-medium text-white">Verificando tu pago</p>
          <p className="mt-2 text-sm text-gray-500">Esto solo tomará un momento...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl pt-12 md:pt-20"
        >
          <div className="rounded-2xl border border-red-500/30 bg-surface p-6 sm:p-8 md:p-12 shadow-[0_0_50px_-20px_rgba(239,68,68,0.5)]">

            <motion.div
              className="mb-6 flex justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-red-500 opacity-20"></div>
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border-4 border-red-500 bg-red-500/10">
                  <span className="text-5xl sm:text-6xl">⚠️</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="mb-3 text-center text-3xl font-bold text-white md:text-4xl">
                Error al Verificar
              </h2>
              <p className="mb-8 text-center text-sm text-gray-400 md:text-base">
                {error}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4 sm:p-6"
            >
              <div className="text-center">
                <p className="text-sm font-semibold text-white mb-2">
                  💡 Sugerencias
                </p>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm text-gray-400">
                  <li>• Verifica tu conexión a internet</li>
                  <li>• Intenta recargar la página</li>
                  <li>• Revisa tu email para confirmar el estado del pago</li>
                  <li>• Si el problema persiste, contáctanos</li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <button
                onClick={() => window.location.reload()}
                className="rounded-full bg-accent px-8 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-all hover:-translate-y-0.5 hover:bg-accent-strong"
              >
                Reintentar
              </button>

              <button
                onClick={() => navigate('/client/dashboard')}
                className="rounded-full border border-brand-border bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:border-accent hover:bg-accent/10"
              >
                Ir a Mi Dashboard
              </button>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-xs text-gray-500"
          >
            ¿Necesitas ayuda? Estamos aquí para asistirte
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Pago aprobado
  if (paymentInfo?.status === 'approved') {
    return (
      <div className="min-h-screen bg-base p-4 sm:p-6">
        {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl pt-12 md:pt-20"
        >
          {/* Card Principal con sombra accent */}
          <div className="rounded-2xl border border-accent/30 bg-surface p-6 sm:p-8 md:p-12 shadow-[0_0_50px_-20px_rgba(14,242,160,0.5)]">

            {/* Icono de éxito animado */}
            <motion.div
              className="mb-6 flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-accent opacity-20"></div>
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border-4 border-accent bg-accent/10">
                  <span className="text-5xl sm:text-6xl">✅</span>
                </div>
              </div>
            </motion.div>

            {/* Título */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="mb-3 text-center text-3xl font-bold text-white md:text-4xl">
                ¡Pago Confirmado!
              </h1>
              <p className="mb-8 text-center text-sm text-gray-400 md:text-base">
                Tu compra fue procesada exitosamente
              </p>
            </motion.div>

            {/* Información del pago */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6 space-y-4 rounded-xl border border-brand-border bg-base p-4 sm:p-6"
            >
              {paymentInfo.saleId && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 border-b border-brand-border pb-3">
                  <span className="text-sm text-gray-500">ID de Compra</span>
                  <span className="text-sm font-mono font-medium text-white break-all">
                    #{paymentInfo.saleId.substring(0, 8).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 border-b border-brand-border pb-3">
                <span className="text-sm text-gray-500">Monto Total</span>
                <span className="text-xl sm:text-2xl font-bold text-accent">
                  ${parseFloat(paymentInfo.amount).toLocaleString('es-AR')}
                </span>
              </div>

              {paymentInfo.email && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                  <span className="text-sm text-gray-500">Email de entrega</span>
                  <span className="text-sm font-medium text-white break-all">{paymentInfo.email}</span>
                </div>
              )}
            </motion.div>

            {/* Productos comprados */}
            {paymentInfo.products && paymentInfo.products.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-6 rounded-xl border border-brand-border bg-base p-4 sm:p-6"
              >
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Productos Adquiridos
                </h3>
                <ul className="space-y-3">
                  {paymentInfo.products.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-brand-border bg-surface p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                          <span className="text-xl">{item.product.type === 'routine' ? '💪' : '📚'}</span>
                        </div>
                        <span className="text-sm font-medium text-white">{item.product.name}</span>
                      </div>
                      <span className="text-sm text-accent ml-auto sm:ml-0">
                        ${parseFloat(item.price).toLocaleString('es-AR')}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Mensaje de email */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-4"
            >
              <div className="text-center">
                <p className="text-sm font-semibold text-white mb-2">
                  📧 Email enviado correctamente
                </p>
                <p className="text-xs text-gray-400">
                  Te enviamos un email a <strong className="text-white">{paymentInfo.email}</strong> con:
                </p>
                <ul className="mt-3 space-y-1 text-xs text-gray-400">
                  <li>• 📥 Enlaces de descarga (válidos por 7 días)</li>
                  <li>• 📄 Comprobante de Mercado Pago</li>
                  <li>• 💾 Instrucciones de acceso al dashboard</li>
                </ul>
              </div>
            </motion.div>

            {/* Countdown y botones */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center space-y-4"
            >
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span className="animate-pulse">⏱️</span>
                <span>Redirigiendo en {countdown} segundo{countdown !== 1 ? 's' : ''}...</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate('/client/dashboard')}
                  className="rounded-full bg-accent px-8 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-all hover:-translate-y-0.5 hover:bg-accent-strong"
                >
                  Ir a Mi Dashboard
                </button>

                <button
                  onClick={() => navigate('/landing')}
                  className="rounded-full border border-brand-border bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:border-accent hover:bg-accent/10"
                >
                  Volver al Inicio
                </button>
              </div>
            </motion.div>
          </div>

          {/* Mensaje adicional */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-center text-xs text-gray-500"
          >
            ¿Tienes alguna duda? Contáctanos y te ayudaremos en lo que necesites
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Pago pendiente (in_process, pending, etc.)
  if (paymentInfo?.status === 'pending' || paymentInfo?.status === 'in_process') {
    return (
      <div className="min-h-screen bg-base p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl pt-12 md:pt-20"
        >
          {/* Card Principal con sombra amarilla */}
          <div className="rounded-2xl border border-yellow-500/30 bg-surface p-6 sm:p-8 md:p-12 shadow-[0_0_50px_-20px_rgba(234,179,8,0.5)]">

            {/* Icono de pendiente animado */}
            <motion.div
              className="mb-6 flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-yellow-500 opacity-20"></div>
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border-4 border-yellow-500 bg-yellow-500/10">
                  <span className="text-5xl sm:text-6xl">⏳</span>
                </div>
              </div>
            </motion.div>

            {/* Título */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="mb-3 text-center text-3xl font-bold text-white md:text-4xl">
                Pago en Proceso
              </h1>
              <p className="mb-8 text-center text-sm text-gray-400 md:text-base">
                Tu pago está siendo verificado por Mercado Pago
              </p>
            </motion.div>

            {/* Información del estado */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 sm:p-6"
            >
              <div className="text-center">
                <p className="text-sm font-semibold text-white mb-2">
                  ⚡ ¿Qué significa esto?
                </p>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm text-gray-400">
                  <li>• Tu pago está siendo procesado por Mercado Pago</li>
                  <li>• Recibirás un email cuando se confirme</li>
                  <li>• Este proceso puede tomar algunos minutos</li>
                  <li>• No es necesario que permanezcas en esta página</li>
                </ul>
              </div>
            </motion.div>

            {/* Información adicional */}
            {paymentInfo?.amount && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-6 space-y-4 rounded-xl border border-brand-border bg-base p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                  <span className="text-sm text-gray-500">Monto</span>
                  <span className="text-xl sm:text-2xl font-bold text-yellow-500">
                    ${parseFloat(paymentInfo.amount).toLocaleString('es-AR')}
                  </span>
                </div>
                {paymentInfo.email && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2 border-t border-brand-border pt-3">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="text-sm font-medium text-white break-all">{paymentInfo.email}</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Botones */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate('/client/dashboard')}
                  className="rounded-full bg-yellow-500 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-all hover:-translate-y-0.5 hover:bg-yellow-400"
                >
                  Ir a Mi Dashboard
                </button>

                <button
                  onClick={() => navigate('/landing')}
                  className="rounded-full border border-brand-border bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:border-yellow-500 hover:bg-yellow-500/10"
                >
                  Volver al Inicio
                </button>
              </div>
            </motion.div>
          </div>

          {/* Mensaje adicional */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center text-xs text-gray-500"
          >
            Si tienes dudas sobre tu pago, puedes contactarnos
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Estado desconocido o rechazado (fallback)
  return (
    <div className="min-h-screen bg-base p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl pt-12 md:pt-20"
      >
        {/* Card Principal con sombra roja */}
        <div className="rounded-2xl border border-red-500/30 bg-surface p-6 sm:p-8 md:p-12 shadow-[0_0_50px_-20px_rgba(239,68,68,0.5)]">

          {/* Icono de error animado */}
          <motion.div
            className="mb-6 flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-red-500 opacity-20"></div>
              <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border-4 border-red-500 bg-red-500/10">
                <span className="text-5xl sm:text-6xl">❌</span>
              </div>
            </div>
          </motion.div>

          {/* Título */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="mb-3 text-center text-3xl font-bold text-white md:text-4xl">
              {paymentInfo?.status === 'rejected' ? 'Pago Rechazado' : 'Hubo un Problema'}
            </h1>
            <p className="mb-8 text-center text-sm text-gray-400 md:text-base">
              {paymentInfo?.status === 'rejected'
                ? 'Tu pago no pudo ser procesado'
                : 'No pudimos verificar el estado de tu pago'}
            </p>
          </motion.div>

          {/* Información del estado */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4 sm:p-6"
          >
            <div className="text-center">
              <p className="text-sm font-semibold text-white mb-2">
                ⚠️ ¿Qué puedes hacer?
              </p>
              <ul className="mt-3 space-y-2 text-xs sm:text-sm text-gray-400">
                <li>• Verifica que tu tarjeta tenga fondos suficientes</li>
                <li>• Intenta con otro método de pago</li>
                <li>• Contacta a tu banco si el problema persiste</li>
                <li>• Puedes intentar realizar la compra nuevamente</li>
              </ul>
            </div>
          </motion.div>

          {/* Información adicional */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6 space-y-4 rounded-xl border border-brand-border bg-base p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <span className="text-sm text-gray-500">Estado del pago</span>
              <span className="text-sm font-medium text-red-400">
                {paymentInfo?.status || 'Desconocido'}
              </span>
            </div>
            {paymentInfo?.mpStatus && (
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 border-t border-brand-border pt-3">
                <span className="text-sm text-gray-500">Detalle</span>
                <span className="text-sm font-medium text-white break-all">{paymentInfo.mpStatus}</span>
              </div>
            )}
            {paymentInfo?.amount && (
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 border-t border-brand-border pt-3">
                <span className="text-sm text-gray-500">Monto</span>
                <span className="text-xl sm:text-2xl font-bold text-red-500">
                  ${parseFloat(paymentInfo.amount).toLocaleString('es-AR')}
                </span>
              </div>
            )}
          </motion.div>

          {/* Botones */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/landing')}
                className="rounded-full bg-accent px-8 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-all hover:-translate-y-0.5 hover:bg-accent-strong"
              >
                Intentar Nuevamente
              </button>

              <button
                onClick={() => navigate('/client/dashboard')}
                className="rounded-full border border-brand-border bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:border-accent hover:bg-accent/10"
              >
                Ir a Mi Dashboard
              </button>
            </div>
          </motion.div>
        </div>

        {/* Mensaje adicional */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center text-xs text-gray-500"
        >
          ¿Necesitas ayuda? Contáctanos y te asistiremos con tu compra
        </motion.p>
      </motion.div>
    </div>
  );
}

export default PaymentSuccess;
