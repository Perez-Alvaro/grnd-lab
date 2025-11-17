/**
 * Email Service
 *
 * Servicio para enviar emails usando Resend:
 * - Email de confirmación de compra (con PDFs adjuntos)
 * - Email de pago pendiente
 * - Email de pago rechazado
 *
 * NOTA: En el webhook (Edge Function) se usará Resend directamente
 * Este servicio es para llamadas desde el frontend si es necesario
 */

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const FROM_EMAIL = import.meta.env.RESEND_FROM_EMAIL || 'noreply@fitter.com';

/**
 * Template HTML para email de confirmación de compra
 */
const getPurchaseConfirmationTemplate = (userData, products, saleId) => {
  const productsList = products.map(p => `
    <li style="margin-bottom: 8px;">
      <strong>${p.name}</strong> - $${parseFloat(p.price).toLocaleString('es-AR')}
    </li>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Compra - Fitter</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #B5FF00 0%, #8BC800 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: #000; margin: 0; font-size: 28px; font-weight: 700;">Fitter</h1>
    <p style="color: #000; margin: 10px 0 0; font-size: 14px;">Rutinas de Entrenamiento</p>
  </div>

  <!-- Content -->
  <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
    <h2 style="color: #B5FF00; margin-top: 0;">¡Compra Confirmada!</h2>

    <p>Hola <strong>${userData.firstName} ${userData.lastName}</strong>,</p>

    <p>Tu pago fue procesado exitosamente. Encontrarás tus archivos adjuntos en este email.</p>

    <!-- Order Details -->
    <div style="background: #f9f9f9; border-left: 4px solid #B5FF00; padding: 15px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333; font-size: 16px;">Detalles de tu compra</h3>
      <p style="margin: 5px 0;"><strong>ID de compra:</strong> ${saleId}</p>
      <p style="margin: 5px 0;"><strong>Email:</strong> ${userData.email}</p>
    </div>

    <!-- Products -->
    <h3 style="color: #333; font-size: 16px;">Productos:</h3>
    <ul style="list-style: none; padding-left: 0;">
      ${productsList}
    </ul>

    <!-- Instructions -->
    <div style="background: #fffbea; border: 1px solid #ffd700; padding: 15px; margin: 20px 0; border-radius: 8px;">
      <p style="margin: 0; font-size: 14px;"><strong>📎 Archivos Adjuntos:</strong></p>
      <p style="margin: 10px 0 0; font-size: 14px;">Tus rutinas y/o libros están adjuntos como PDFs en este email. Descárgalos y guárdalos en un lugar seguro.</p>
    </div>

    <!-- Support -->
    <p style="margin-top: 30px; font-size: 14px; color: #666;">
      Si tienes alguna pregunta, no dudes en contactarnos respondiendo a este email.
    </p>

    <p style="margin-top: 20px; font-size: 14px;">
      ¡Gracias por confiar en <strong>Fitter</strong>!<br>
      Equipo de Fitter
    </p>
  </div>

  <!-- Footer -->
  <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; font-size: 12px; color: #666;">
    <p style="margin: 0;">© ${new Date().getFullYear()} Fitter. Todos los derechos reservados.</p>
    <p style="margin: 10px 0 0;">Este es un email automático, por favor no responder.</p>
  </div>
</body>
</html>
  `;
};

/**
 * Template para email de pago pendiente
 */
const getPendingPaymentTemplate = (userEmail, paymentMethod) => {
  let instructions = '';

  if (paymentMethod.includes('rapipago') || paymentMethod.includes('pago_facil')) {
    instructions = 'Presenta tu boleto de pago en cualquier punto de Rapipago o Pago Fácil.';
  } else if (paymentMethod.includes('bank_transfer')) {
    instructions = 'Realiza la transferencia bancaria con los datos proporcionados.';
  } else {
    instructions = 'Completa el pago según el método seleccionado.';
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pago Pendiente - Fitter</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #fff3cd; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: #856404; margin: 0; font-size: 24px;">⏳ Pago Pendiente</h1>
  </div>

  <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
    <p>Hola,</p>

    <p>Tu compra está siendo procesada. ${instructions}</p>

    <div style="background: #fffbea; border: 1px solid #ffd700; padding: 15px; margin: 20px 0; border-radius: 8px;">
      <p style="margin: 0;"><strong>📌 Importante:</strong></p>
      <p style="margin: 10px 0 0;">Te enviaremos otro email con tus archivos una vez que confirmemos tu pago.</p>
    </div>

    <p>Si tienes dudas, contáctanos.</p>

    <p style="margin-top: 20px;">Equipo de Fitter</p>
  </div>
</body>
</html>
  `;
};

/**
 * Template para email de pago rechazado
 */
const getFailedPaymentTemplate = (userEmail, reason) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pago Rechazado - Fitter</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #f8d7da; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: #721c24; margin: 0; font-size: 24px;">❌ Pago Rechazado</h1>
  </div>

  <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
    <p>Hola,</p>

    <p>Lamentamos informarte que tu pago no pudo ser procesado.</p>

    <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; margin: 20px 0; border-radius: 8px;">
      <p style="margin: 0;"><strong>Motivo:</strong></p>
      <p style="margin: 10px 0 0;">${reason || 'No especificado'}</p>
    </div>

    <p><strong>¿Qué puedes hacer?</strong></p>
    <ul>
      <li>Verificar que tu tarjeta tenga fondos suficientes</li>
      <li>Intentar con otro método de pago</li>
      <li>Contactar a tu banco si el problema persiste</li>
      <li>Escribirnos si necesitas ayuda</li>
    </ul>

    <p>Puedes intentar comprar nuevamente cuando lo desees.</p>

    <p style="margin-top: 20px;">Equipo de Fitter</p>
  </div>
</body>
</html>
  `;
};

/**
 * NOTA: Las funciones de envío real se implementan en la Edge Function
 * porque Resend necesita ejecutarse server-side con la API key secreta.
 *
 * Estas son las interfaces que el webhook usará:
 */

export const emailTemplates = {
  purchaseConfirmation: getPurchaseConfirmationTemplate,
  pendingPayment: getPendingPaymentTemplate,
  failedPayment: getFailedPaymentTemplate
};

export default {
  templates: emailTemplates
};
