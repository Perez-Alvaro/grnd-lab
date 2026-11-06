/**
 * src/lib/privacyPolicy.js
 * FUENTE ÚNICA de la Política de Privacidad de Mock conforme a la Ley 25.326
 * (Protección de los Datos Personales de la República Argentina), su Decreto
 * Reglamentario 1558/2001, y las resoluciones de la Agencia de Acceso a la
 * Información Pública (AAIP).
 */

export const PRIVACY_VERSION = '2026-11-06';
export const PRIVACY_TITLE = 'POLÍTICA DE PRIVACIDAD DE MOCK';

export const PRIVACY_INTRO =
  'La presente Política de Privacidad describe el tratamiento de los datos personales ' +
  'recabados a través de la plataforma Mock (en adelante, la "Plataforma"), de conformidad ' +
  'con la Ley de Protección de los Datos Personales N° 25.326, su Decreto Reglamentario N° 1558/2001, ' +
  'y las disposiciones complementarias dictadas por la Agencia de Acceso a la Información Pública (AAIP).';

export const PRIVACY_SECTIONS = [
  {
    id: 'responsable',
    titulo: '1. Responsable del Tratamiento de los Datos',
    cuerpo:
      'El responsable del tratamiento de las bases de datos de la Plataforma es Mock. ' +
      'Para cualquier consulta, solicitud o ejercicio de derechos vinculados a sus datos personales, ' +
      'el usuario puede comunicarse directamente vía correo electrónico a privacidad@mock.app o ' +
      'a través de los canales oficiales de soporte habilitados en la Plataforma.',
    base: 'Ley 25.326, art. 2 y art. 25.',
  },
  {
    id: 'finalidad',
    titulo: '2. Datos Recabados y Finalidad del Tratamiento',
    cuerpo:
      'Mock recopila exclusivamente los datos indispensables para la prestación del servicio SaaS: ' +
      '(a) Datos de registro y autenticación del profesional usuario: nombre, correo electrónico y credenciales ' +
      'gestionadas de forma cifrada a través de Supabase Auth. ' +
      '(b) Datos de facturación y suscripción: procesados mediante la pasarela de pagos Mercado Pago; Mock no ' +
      'almacena números de tarjetas de crédito o débito ni códigos de seguridad en sus bases de datos. ' +
      '(c) Datos de planificación cargados por el profesional: perfiles de atletas, rutinas de entrenamiento ' +
      'y planes nutricionales para su edición, consulta y exportación a formato PDF. ' +
      'Los datos personales no son comercializados, cedidos ni transferidos a terceros con fines publicitarios.',
    base: 'Ley 25.326, art. 4 (calidad de los datos) y art. 6 (información previa).',
  },
  {
    id: 'atletas',
    titulo: '3. Datos de Terceros (Atletas y Destinatarios de los Planes)',
    cuerpo:
      'Los datos de los atletas y alumnos incorporados a la Plataforma son ingresados por el profesional usuario, ' +
      'quien reviste la calidad de único y exclusivo Responsable de dicho tratamiento ante sus clientes, debiendo ' +
      'contar con el consentimiento expreso de estos para su procesamiento. Mock actúa exclusivamente como ' +
      'Encargado de Tratamiento / proveedor de tecnología de soporte bajo estrictos deberes de confidencialidad y ' +
      'seguridad técnica.',
    base: 'Ley 25.326, art. 9 (seguridad) y art. 25 (prestación de servicios de tratamiento).',
  },
  {
    id: 'ia',
    titulo: '4. Interacción con Herramientas de Inteligencia Artificial de Terceros',
    cuerpo:
      'La Plataforma permite al usuario generar prompts estructurados para ser utilizados opcionalmente en ' +
      'asistentes de inteligencia artificial externos (tales como ChatGPT de OpenAI, Claude de Anthropic o ' +
      'Gemini de Google). Las interacciones directas que el usuario mantenga con dichas plataformas se rigen ' +
      'por las políticas de privacidad y términos de servicio de sus respectivos proveedores.',
    base: 'Deber de transparencia e información general.',
  },
  {
    id: 'derechos_arco',
    titulo: '5. Derechos de Acceso, Rectificación, Actualización y Supresión (ARCO)',
    cuerpo:
      'El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma ' +
      'gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme ' +
      'a las normas aplicables. Asimismo, tiene derecho a solicitar en cualquier momento la rectificación, actualización ' +
      'o supresión de sus datos personales. Las solicitudes de acceso serán respondidas dentro de los diez (10) días ' +
      'corridos y las de rectificación o supresión dentro de los cinco (5) días hábiles de recibida la solicitud fehaciente.',
    base: 'Ley 25.326, arts. 14, 15 y 16.',
  },
  {
    id: 'aaip',
    titulo: '6. Autoridad de Control (AAIP)',
    cuerpo:
      'Se hace saber que la AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de Órgano de Control de la ' +
      'Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados ' +
      'en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales ' +
      '(Sede: Av. Pte. Gral. Julio A. Roca 710, piso 3, Ciudad Autónoma de Buenos Aires; web: https://www.argentina.gob.ar/aaip).',
    base: 'Disposición DNPDP 10/2008 y Resolución AAIP 14/2018.',
  },
  {
    id: 'seguridad',
    titulo: '7. Medidas de Seguridad y Conservación',
    cuerpo:
      'Mock adopta las medidas técnicas y organizativas adecuadas para garantizar la seguridad de los datos ' +
      'personales y evitar su alteración, pérdida o tratamiento no autorizado. Las comunicaciones se realizan a ' +
      'través de canales seguros cifrados mediante protocolo HTTPS/TLS y la base de datos implementa políticas de ' +
      'seguridad a nivel de fila (Row Level Security en Supabase Postgres) garantizando que cada profesional solo ' +
      'acceda a su propia información.',
    base: 'Ley 25.326, arts. 9 y 10.',
  },
  {
    id: 'modificaciones',
    titulo: '8. Modificaciones a la Presente Política',
    cuerpo:
      'Mock se reserva el derecho de actualizar la presente Política de Privacidad para adecuarla a novedades ' +
      'legislativas, jurisprudenciales o cambios en los servicios. Toda modificación sustancial será notificada a los ' +
      'usuarios a través de la Plataforma con antelación a su entrada en vigencia.',
    base: 'Principio de buena fe y transparencia.',
  },
];
