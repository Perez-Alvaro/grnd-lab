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
            email: sale.customer_email,
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
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#2E2E2E] border-t-[#B5FF00] mx-auto"></div>
          <p className="text-sm text-gray-400">Verificando tu pago...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#0E0E0E] p-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-500 text-3xl">
            ⚠️
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-white">Error</h2>
          <p className="mb-6 text-sm text-gray-400">{error}</p>
          <button
            onClick={() => navigate('/client/dashboard')}
            className="w-full rounded-full bg-[#B5FF00] px-6 py-3 text-sm font-semibold uppercase text-black transition-all hover:-translate-y-0.5 hover:bg-[#D0FF4D]"
          >
            Ir a Mi Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  // Pago aprobado
  if (paymentInfo?.status === 'approved') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-6">
        {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl pt-20"
        >
          <div className="rounded-2xl border border-[#B5FF00]/30 bg-[#0E0E0E] p-8 md:p-12">
            {/* Icono de éxito */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#B5FF00] bg-[#B5FF00]/10 text-4xl">
                ✅
              </div>
            </div>

            {/* Título */}
            <h1 className="mb-3 text-center text-3xl font-bold text-white md:text-4xl">
              ¡Pago Confirmado!
            </h1>

            <p className="mb-8 text-center text-sm text-gray-400 md:text-base">
              Tu compra fue procesada exitosamente
            </p>

            {/* Información del pago */}
            <div className="mb-8 space-y-4 rounded-xl border border-[#2E2E2E] bg-[#0A0A0A] p-6">
              {paymentInfo.saleId && (
                <div className="flex justify-between border-b border-[#2E2E2E] pb-3">
                  <span className="text-sm text-gray-500">ID de Compra</span>
                  <span className="text-sm font-medium text-white">{paymentInfo.saleId}</span>
                </div>
              )}

              <div className="flex justify-between border-b border-[#2E2E2E] pb-3">
                <span className="text-sm text-gray-500">Monto</span>
                <span className="text-lg font-bold text-[#B5FF00]">
                  ${parseFloat(paymentInfo.amount).toLocaleString('es-AR')}
                </span>
              </div>

              {paymentInfo.email && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm font-medium text-white">{paymentInfo.email}</span>
                </div>
              )}
            </div>

            {/* Productos comprados */}
            {paymentInfo.products && paymentInfo.products.length > 0 && (
              <div className="mb-8 rounded-xl border border-[#2E2E2E] bg-[#0A0A0A] p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Productos Adquiridos
                </h3>
                <ul className="space-y-3">
                  {paymentInfo.products.map((item, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span className="text-sm text-white">{item.product.name}</span>
                      <span className="text-sm text-gray-400">
                        ${parseFloat(item.price).toLocaleString('es-AR')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mensaje de email */}
            <div className="mb-6 rounded-xl border border-[#B5FF00]/20 bg-[#B5FF00]/5 p-4">
              <p className="text-center text-sm text-gray-300">
                📧 Te enviamos un email a <strong className="text-white">{paymentInfo.email}</strong> con tus archivos y el comprobante de pago.
              </p>
            </div>

            {/* Countdown y botón */}
            <div className="text-center">
              <p className="mb-4 text-xs text-gray-500">
                Redirigiendo a tu dashboard en {countdown} segundo{countdown !== 1 ? 's' : ''}...
              </p>
              <button
                onClick={() => navigate('/client/dashboard')}
                className="w-full rounded-full bg-[#B5FF00] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-all hover:-translate-y-0.5 hover:bg-[#D0FF4D] md:w-auto"
              >
                Ir a Mi Dashboard
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Pago pendiente (in_process, pending, etc.)
  if (paymentInfo?.status === 'pending' || paymentInfo?.status === 'in_process') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-yellow-500/20 bg-[#0E0E0E] p-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-yellow-500 bg-yellow-500/10 text-3xl">
            ⏳
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-white">Pago Pendiente</h2>
          <p className="mb-6 text-sm text-gray-400">
            Tu pago está siendo procesado. Te enviaremos un email cuando se confirme.
          </p>
          <button
            onClick={() => navigate('/client/dashboard')}
            className="w-full rounded-full bg-[#B5FF00] px-6 py-3 text-sm font-semibold uppercase text-black transition-all hover:-translate-y-0.5 hover:bg-[#D0FF4D]"
          >
            Ir a Mi Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  // Estado desconocido o rechazado (fallback)
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-[#2E2E2E] bg-[#0E0E0E] p-8 text-center"
      >
        <p className="mb-4 text-sm text-gray-400">
          Estado del pago: {paymentInfo?.status || 'Desconocido'}
        </p>
        <button
          onClick={() => navigate('/client/dashboard')}
          className="w-full rounded-full bg-[#B5FF00] px-6 py-3 text-sm font-semibold uppercase text-black transition-all hover:-translate-y-0.5 hover:bg-[#D0FF4D]"
        >
          Ir a Mi Dashboard
        </button>
      </motion.div>
    </div>
  );
}

export default PaymentSuccess;
