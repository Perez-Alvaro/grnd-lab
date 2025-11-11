import React, { useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Container,
  FadeIn,
  Tag,
  TransitionBox
} from './reactbits/index.js';
import { useAppContext } from '../context/AppContext.jsx';
import { mockProcessPayment } from '../utils/mockApi.js';

const paymentMethods = [
  { id: 'mercadopago', label: 'MercadoPago', accent: '#00a6ff' },
  { id: 'card', label: 'Tarjeta de crédito', accent: '#2d2d2d' },
  { id: 'transfer', label: 'Transferencia bancaria', accent: '#6c8f00' }
];

function PaymentSection({ routine }) {
  const { dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: ''
  });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const plan = useMemo(
    () =>
      routine
        ? {
            id: `routine-${routine.id}`,
            name: routine.name,
            price: routine.price
          }
        : null,
    [routine]
  );

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!routine || !plan) return;
    setProcessing(true);

    const { user, sale } = await mockProcessPayment(formData, routine, plan);
    dispatch({ type: 'ADD_USER', payload: user });
    dispatch({ type: 'ADD_SALE', payload: sale });

    setProcessing(false);
    setSuccess(true);
  };

  if (!routine) {
    return null;
  }

  if (success) {
    return (
      <section className="w-full py-24">
        <Container className="max-w-3xl">
          <FadeIn className="rounded-3xl bg-white p-12 shadow-xl">
            <div className="mx-auto flex max-w-xl flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#d7ff00]/30 text-3xl">🎉</div>
              <h2 className="mt-6 text-3xl font-extrabold text-neutral-900">¡Pago exitoso!</h2>
              <p className="mt-4 text-neutral-600">
                Tu rutina <strong>{routine.name}</strong> ya está en camino. En pocos minutos recibirás el acceso directo en tu correo.
              </p>
              <div className="mt-8 grid gap-4 rounded-2xl bg-[#f3f7dc] p-6 text-left text-neutral-700">
                <p>• Enviaremos el PDF completo a {formData.email}</p>
                <p>• Vas a recibir videos de técnica y recordatorios motivacionales</p>
                <p>• Si necesitás ajustes, respondé al correo y personalizamos juntos</p>
              </div>
              <Button className="mt-8" color="lime" onClick={() => window.location.assign('/')}>Volver al inicio</Button>
            </div>
          </FadeIn>
        </Container>
      </section>
    );
  }

  return (
    <section id="pago" className="w-full py-24">
      <Container className="max-w-5xl">
        <FadeIn className="text-center">
          <span className="text-sm uppercase tracking-[0.45em] text-neutral-500">Paso 04</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-neutral-900">Elegí tu método de pago</h2>
          <p className="mt-4 text-lg text-neutral-600">
            Finalizá tu acceso a la rutina y desbloqueá materiales exclusivos. Nada cambia en el backend, solo tu energía.
          </p>
        </FadeIn>

        <TransitionBox variant="fade-up" delay={180} className="mt-14">
          <Card className="bg-white p-8 shadow-xl">
            <CardBody className="space-y-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="text-left">
                  <h3 className="text-2xl font-semibold text-neutral-900">{routine.name}</h3>
                  <p className="mt-2 text-sm text-neutral-500">
                    {routine.duration} • {routine.frequency} días por semana • Nivel {routine.level}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">Inversión</span>
                  <p className="text-3xl font-bold text-neutral-900">${routine.price.toLocaleString('es-AR')}</p>
                </div>
              </div>

              <form className="grid gap-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col text-left text-sm font-medium text-neutral-600">
                    Nombre
                    <input
                      required
                      value={formData.firstName}
                      onChange={(event) => handleChange('firstName', event.target.value)}
                      className="mt-2 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-800 focus:border-[#d7ff00] focus:outline-none"
                      placeholder="Tu nombre"
                    />
                  </label>
                  <label className="flex flex-col text-left text-sm font-medium text-neutral-600">
                    Apellido
                    <input
                      required
                      value={formData.lastName}
                      onChange={(event) => handleChange('lastName', event.target.value)}
                      className="mt-2 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-800 focus:border-[#d7ff00] focus:outline-none"
                      placeholder="Tu apellido"
                    />
                  </label>
                </div>
                <label className="flex flex-col text-left text-sm font-medium text-neutral-600">
                  Email de entrega
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(event) => handleChange('email', event.target.value)}
                    className="mt-2 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-800 focus:border-[#d7ff00] focus:outline-none"
                    placeholder="tuemail@example.com"
                  />
                  <span className="mt-1 text-xs text-neutral-400">Enviaremos la rutina y accesos exclusivos a este correo.</span>
                </label>

                <div className="grid gap-3 md:grid-cols-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-center text-sm font-semibold text-neutral-700"
                      style={{ boxShadow: `inset 0 0 0 1px ${method.accent}20` }}
                    >
                      {method.label}
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 rounded-2xl bg-neutral-900/90 p-6 text-sm text-neutral-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag tone="lime">Seguro y cifrado</Tag>
                    <Tag tone="lime">Soporte humano</Tag>
                    <Tag tone="lime">Actualizaciones gratis</Tag>
                  </div>
                  <p>
                    Esta es una pasarela demo. Al desplegar en producción mantenemos la integración actual con MercadoPago y tarjetas, sin tocar el backend.
                  </p>
                </div>

                <Button
                  type="submit"
                  color="lime"
                  size="lg"
                  rounded="full"
                  className="w-full shadow-lg hover:shadow-xl"
                  disabled={processing}
                >
                  {processing ? 'Procesando...' : `Completar pedido - $${routine.price.toLocaleString('es-AR')}`}
                </Button>
              </form>
            </CardBody>
          </Card>
        </TransitionBox>
      </Container>
    </section>
  );
}

export default PaymentSection;
