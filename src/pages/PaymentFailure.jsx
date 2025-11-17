import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import logger from '../utils/logger.js';

function PaymentFailure() {
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
        logger.info('Checking failed payment', { paymentId, status });

        // Consultar detalles del pago fallido desde MP
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
            amount: mpPayment.transaction_amount
          });
        }
      } catch (err) {
        console.error('Error fetching payment details:', err);
        logger.error('Failed payment details fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [paymentId, status]);

  const getErrorMessage = (statusDetail) => {
    const errorMessages = {
      'cc_rejected_insufficient_amount': 'Tu tarjeta no tiene fondos suficientes',
      'cc_rejected_bad_filled_security_code': 'Código de seguridad incorrecto',
      'cc_rejected_bad_filled_date': 'Fecha de vencimiento incorrecta',
      'cc_rejected_bad_filled_other': 'Revisa los datos de tu tarjeta',
      'cc_rejected_call_for_authorize': 'Debes autorizar el pago con tu banco',
      'cc_rejected_card_disabled': 'Tu tarjeta está deshabilitada',
      'cc_rejected_duplicated_payment': 'Ya realizaste un pago similar recientemente',
      'cc_rejected_high_risk': 'El pago fue rechazado por seguridad',
      'cc_rejected_max_attempts': 'Alcanzaste el límite de intentos permitidos',
      'cc_rejected_blacklist': 'No pudimos procesar tu pago',
      'rejected_other_reason': 'El pago fue rechazado',
    };

    return errorMessages[statusDetail] || 'Tu pago no pudo ser procesado';
  };

  const getSuggestions = (statusDetail) => {
    if (statusDetail?.includes('insufficient_amount')) {
      return [
        'Verifica que tu tarjeta tenga fondos suficientes',
        'Intenta con otra tarjeta o método de pago',
      ];
    }

    if (statusDetail?.includes('security_code') || statusDetail?.includes('bad_filled')) {
      return [
        'Verifica que los datos de tu tarjeta sean correctos',
        'Revisa el código de seguridad y la fecha de vencimiento',
      ];
    }

    if (statusDetail?.includes('call_for_authorize') || statusDetail?.includes('high_risk')) {
      return [
        'Contacta a tu banco para autorizar la compra',
        'Verifica que tu tarjeta esté habilitada para compras online',
      ];
    }

    if (statusDetail?.includes('max_attempts')) {
      return [
        'Espera unos minutos antes de intentar nuevamente',
        'Contacta a tu banco si el problema persiste',
      ];
    }

    return [
      'Verifica los datos de tu tarjeta',
      'Intenta con otro método de pago',
      'Contacta a tu banco si el problema persiste',
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

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl pt-20"
      >
        <div className="rounded-2xl border border-red-500/30 bg-[#0E0E0E] p-8 md:p-12">
          {/* Icono de error */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-red-500 bg-red-500/10 text-4xl">
              ❌
            </div>
          </div>

          {/* Título */}
          <h1 className="mb-3 text-center text-3xl font-bold text-white md:text-4xl">
            Pago Rechazado
          </h1>

          <p className="mb-8 text-center text-sm text-gray-400 md:text-base">
            {paymentInfo?.statusDetail
              ? getErrorMessage(paymentInfo.statusDetail)
              : 'No pudimos procesar tu pago'}
          </p>

          {/* Detalles del error */}
          {paymentInfo && (
            <div className="mb-8 space-y-4 rounded-xl border border-red-500/20 bg-red-500/5 p-6">
              <div className="flex justify-between border-b border-red-500/10 pb-3">
                <span className="text-sm text-gray-500">Estado</span>
                <span className="text-sm font-medium text-red-400">Rechazado</span>
              </div>

              {paymentInfo.amount && (
                <div className="flex justify-between border-b border-red-500/10 pb-3">
                  <span className="text-sm text-gray-500">Monto intentado</span>
                  <span className="text-sm font-medium text-white">
                    ${parseFloat(paymentInfo.amount).toLocaleString('es-AR')}
                  </span>
                </div>
              )}

              {paymentInfo.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Método de pago</span>
                  <span className="text-sm font-medium text-white uppercase">
                    {paymentInfo.paymentMethod}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Sugerencias */}
          <div className="mb-8 rounded-xl border border-[#2E2E2E] bg-[#0A0A0A] p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
              ¿Qué puedes hacer?
            </h3>
            <ul className="space-y-3">
              {getSuggestions(paymentInfo?.statusDetail).map((suggestion, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 text-[#B5FF00]">•</span>
                  <span className="text-sm text-gray-300">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Información adicional */}
          <div className="mb-8 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
            <p className="text-center text-sm text-gray-300">
              💡 <strong>Tip:</strong> Si continúas teniendo problemas, prueba con una tarjeta diferente o contacta a nuestro soporte.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col gap-3 md:flex-row">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 rounded-full bg-[#B5FF00] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-black transition-all hover:-translate-y-0.5 hover:bg-[#D0FF4D]"
            >
              Intentar Nuevamente
            </button>
            <button
              onClick={() => navigate('/client/dashboard')}
              className="flex-1 rounded-full border border-[#2E2E2E] bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:border-[#B5FF00] hover:text-[#B5FF00]"
            >
              Volver al Dashboard
            </button>
          </div>

          {/* Link de soporte */}
          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.href = 'mailto:soporte@fitter.com'}
              className="text-sm text-gray-500 underline hover:text-[#B5FF00]"
            >
              ¿Necesitas ayuda? Contacta a soporte
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PaymentFailure;
