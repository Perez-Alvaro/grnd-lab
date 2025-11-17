import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import logger from '../utils/logger.js';

function PaymentPending() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!paymentId) {
        setLoading(false);
        return;
      }

      try {
        logger.info('Checking pending payment', { paymentId, status });

        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
        const response = await fetch(
          `${SUPABASE_URL}/functions/v1/get-mp-payment/${paymentId}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          const mpPayment = await response.json();
          setPaymentInfo({
            status: mpPayment.status,
            statusDetail: mpPayment.status_detail,
            paymentMethod: mpPayment.payment_method_id,
            amount: mpPayment.transaction_amount,
            email: mpPayment.payer?.email
          });
        }
      } catch (err) {
        console.error('Error fetching payment details:', err);
        logger.error('Pending payment details fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [paymentId, status]);

  const getPendingMessage = (statusDetail, paymentMethod) => {
    if (statusDetail === 'pending_waiting_payment') {
      if (paymentMethod === 'rapipago' || paymentMethod === 'pagofacil') {
        return {
          title: 'Esperando tu pago',
          message: 'Completa el pago en un punto de Rapipago o Pago Fácil con los datos que te enviamos por email.',
          icon: '🏪'
        };
      }
      if (paymentMethod === 'bank_transfer') {
        return {
          title: 'Esperando tu transferencia',
          message: 'Realiza la transferencia bancaria con los datos que te enviamos por email.',
          icon: '🏦'
        };
      }
    }

    if (statusDetail === 'pending_contingency') {
      return {
        title: 'Procesando tu pago',
        message: 'Estamos validando tu pago. Te notificaremos cuando se confirme.',
        icon: '⏱️'
      };
    }

    if (statusDetail === 'pending_review_manual') {
      return {
        title: 'Pago en revisión',
        message: 'Tu pago está siendo revisado manualmente. Te notificaremos pronto.',
        icon: '🔍'
      };
    }

    return {
      title: 'Pago en proceso',
      message: 'Tu pago está siendo procesado. Te notificaremos cuando se complete.',
      icon: '⏳'
    };
  };

  const getInstructions = (paymentMethod) => {
    if (paymentMethod === 'rapipago' || paymentMethod === 'pagofacil') {
      return [
        'Revisa tu email para obtener el código de pago',
        'Acércate a cualquier punto de Rapipago o Pago Fácil',
        'Presenta el código y completa el pago',
        'Recibirás tu rutina una vez confirmado el pago'
      ];
    }

    if (paymentMethod === 'bank_transfer') {
      return [
        'Revisa tu email con los datos de la transferencia',
        'Realiza la transferencia desde tu banco',
        'El proceso de confirmación puede demorar hasta 48 horas hábiles',
        'Recibirás tu rutina una vez acreditado el pago'
      ];
    }

    return [
      'Revisa tu email para más detalles',
      'Completa el pago según el método seleccionado',
      'Te notificaremos cuando se confirme el pago',
      'Recibirás tu rutina por email'
    ];
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#2E2E2E] border-t-[#B5FF00] mx-auto"></div>
          <p className="text-sm text-gray-400">Verificando detalles del pago...</p>
        </div>
      </div>
    );
  }

  const pendingData = getPendingMessage(
    paymentInfo?.statusDetail,
    paymentInfo?.paymentMethod
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl pt-20"
      >
        <div className="rounded-2xl border border-yellow-500/30 bg-[#0E0E0E] p-8 md:p-12">
          {/* Icono animado */}
          <div className="mb-6 flex justify-center">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-yellow-500 bg-yellow-500/10 text-4xl"
            >
              {pendingData.icon}
            </motion.div>
          </div>

          {/* Título */}
          <h1 className="mb-3 text-center text-3xl font-bold text-white md:text-4xl">
            {pendingData.title}
          </h1>

          <p className="mb-8 text-center text-sm text-gray-400 md:text-base">
            {pendingData.message}
          </p>

          {/* Detalles del pago */}
          {paymentInfo && (
            <div className="mb-8 space-y-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6">
              <div className="flex justify-between border-b border-yellow-500/10 pb-3">
                <span className="text-sm text-gray-500">Estado</span>
                <span className="text-sm font-medium text-yellow-400">Pendiente</span>
              </div>

              {paymentInfo.amount && (
                <div className="flex justify-between border-b border-yellow-500/10 pb-3">
                  <span className="text-sm text-gray-500">Monto</span>
                  <span className="text-lg font-bold text-white">
                    ${parseFloat(paymentInfo.amount).toLocaleString('es-AR')}
                  </span>
                </div>
              )}

              {paymentInfo.paymentMethod && (
                <div className="flex justify-between border-b border-yellow-500/10 pb-3">
                  <span className="text-sm text-gray-500">Método de pago</span>
                  <span className="text-sm font-medium text-white uppercase">
                    {paymentInfo.paymentMethod.replace('_', ' ')}
                  </span>
                </div>
              )}

              {paymentInfo.email && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm font-medium text-white">{paymentInfo.email}</span>
                </div>
              )}
            </div>
          )}

          {/* Instrucciones */}
          <div className="mb-8 rounded-xl border border-[#2E2E2E] bg-[#0A0A0A] p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Próximos pasos
            </h3>
            <ol className="space-y-3">
              {getInstructions(paymentInfo?.paymentMethod).map((instruction, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#B5FF00] text-xs font-bold text-black">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-300">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Nota importante */}
          <div className="mb-8 rounded-xl border border-[#B5FF00]/20 bg-[#B5FF00]/5 p-4">
            <p className="text-center text-sm text-gray-300">
              📧 Te enviamos toda la información necesaria a <strong className="text-white">{paymentInfo?.email || 'tu email'}</strong>. Revisa también tu carpeta de spam.
            </p>
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-3 md:flex-row">
            <button
              onClick={() => navigate('/client/dashboard')}
              className="flex-1 rounded-full bg-[#B5FF00] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-all hover:-translate-y-0.5 hover:bg-[#D0FF4D]"
            >
              Ir a Mi Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 rounded-full border border-[#2E2E2E] bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:border-[#B5FF00] hover:text-[#B5FF00]"
            >
              Verificar Estado
            </button>
          </div>

          {/* Link de soporte */}
          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.href = 'mailto:soporte@fitter.com'}
              className="text-sm text-gray-500 underline hover:text-[#B5FF00]"
            >
              ¿Tienes preguntas? Contacta a soporte
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PaymentPending;
