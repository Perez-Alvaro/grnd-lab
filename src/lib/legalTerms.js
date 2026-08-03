/**
 * src/lib/legalTerms.js
 * FUENTE ÚNICA del texto de los Términos y Condiciones de Mock.
 *
 * Lo consumen dos lugares y tienen que decir exactamente lo mismo:
 *   • El PDF que el coach entrega (src/pdf/sections/LegalPage.jsx).
 *   • La aceptación en el registro y el visor web (components/Legal/).
 *
 * Criterio de redacción (importante si se edita):
 * El texto DELIMITA EL OBJETO del servicio (qué hace y qué no hace Mock) en
 * lugar de "renunciar a responsabilidad". En Argentina el art. 37 de la ley
 * 24.240 tiene por no escritas las cláusulas que limitan la responsabilidad
 * por daños, así que una exención genérica sería inoponible; describir con
 * precisión el alcance de la prestación sí es válido y es lo que protege.
 *
 * Si cambia el texto, SUBIR TERMS_VERSION: los usuarios que ya aceptaron la
 * versión anterior vuelven a ver el consentimiento.
 */

/** Versión vigente. Se guarda junto a la aceptación de cada usuario. */
export const TERMS_VERSION = '2026-07-26';

/** Título que encabeza el documento en todos lados. */
export const TERMS_TITLE = 'TÉRMINOS Y CONDICIONES DE MOCK';

export const TERMS_INTRO =
  'Condiciones de uso del software y deslinde de responsabilidad. Forman parte ' +
  'integrante de este documento y se aplican a la totalidad de su contenido.';

export const TERMS_ACCEPTANCE =
  'El uso del software y la entrega de este documento implican el conocimiento ' +
  'y la aceptación íntegra de estas condiciones por parte del profesional ' +
  'usuario, quien asume el carácter de único responsable del contenido ' +
  'profesional aquí volcado.';

/**
 * Cláusulas del documento.
 * @param {Object} opts
 * @param {'workout'|'nutrition'|'general'} opts.variant - 'general' (registro)
 *   incluye las dos cláusulas de salud, porque el usuario va a usar ambos módulos.
 * @param {string} opts.author - quién firma el plan (solo aplica en los PDF).
 * @returns {Array<{n: string, titulo: string, cuerpo: string, base: string}>}
 */
export function buildTermsClauses({ variant = 'general', author = '' } = {}) {
  const esNutricion = variant === 'nutrition';
  const esGeneral = variant === 'general';

  const objeto = esGeneral
    ? 'Todo plan generado con Mock'
    : `Este ${esNutricion ? 'plan de alimentación' : 'plan de entrenamiento'}`;
  const profesional = author?.trim()
    ? `el profesional que suscribe este documento (${author.trim()})`
    : esGeneral
      ? 'el profesional usuario'
      : 'el profesional que suscribe este documento';

  const clausulas = [
    {
      titulo: 'Naturaleza del software: herramienta de asistencia',
      cuerpo:
        'Mock es un software de asistencia a la planificación. No presta servicios de ' +
        'entrenamiento, nutrición, medicina ni ninguna otra actividad profesional reglada, ' +
        'ni sustituye el criterio de un profesional matriculado o capacitado. Su única ' +
        'función es ordenar, estructurar y dar formato a la información que el usuario ' +
        'carga y valida. Mock no evalúa, diagnostica ni supervisa a ninguna persona.',
      base:
        'Constitución Nacional, art. 14 (derecho a trabajar y ejercer toda industria ' +
        'lícita); art. 19 (principio de reserva).',
    },
    {
      titulo: 'Responsabilidad profesional exclusiva del usuario',
      cuerpo:
        `${objeto} es prescripto, revisado, aprobado y entregado bajo la exclusiva ` +
        `responsabilidad de ${profesional}, quien ejerce su profesión de manera autónoma ` +
        'y con su propio criterio técnico. El usuario declara contar con la formación, ' +
        'habilitación y matrícula que su actividad requiera. Toda indicación contenida en ' +
        'el plan le es jurídicamente atribuible a él y no a Mock ni a sus desarrolladores, ' +
        'que no intervienen en la decisión profesional ni tienen contacto con el ' +
        'destinatario final del plan.',
      base:
        'Código Civil y Comercial de la Nación, arts. 774 (obligaciones de hacer), ' +
        '1749 (responsabilidad directa) y 1768 (profesionales liberales: la responsabilidad ' +
        'es subjetiva y no se traslada a la cosa empleada, salvo vicio propio de ésta).',
    },
    {
      titulo: 'Contenido generado con asistencia de inteligencia artificial',
      cuerpo:
        'Parte del contenido puede haber sido generado con asistencia de sistemas de ' +
        'inteligencia artificial de terceros. Ese contenido se entrega sin validación ' +
        'clínica, científica ni pedagógica de ninguna clase y puede contener errores, ' +
        'omisiones o afirmaciones inexactas. Su revisión íntegra antes de la entrega es una ' +
        'obligación indelegable del profesional usuario, quien al firmar y entregar el plan ' +
        'declara haberlo revisado y hacerlo propio.',
      base: 'Código Civil y Comercial de la Nación, art. 1710 (deber de prevención del daño).',
    },
  ];

  // Salud: en el registro van las dos; en cada PDF solo la que corresponde.
  const clausulaNutricion = {
    titulo: 'Salud, patologías y derivación obligatoria',
    cuerpo:
      'Los planes de alimentación son de alimentación general para personas sanas. No ' +
      'constituyen tratamiento, dieta terapéutica ni indicación médica, y no deben ' +
      'utilizarse para tratar enfermedad alguna. Ante embarazo, lactancia, trastornos de la ' +
      'conducta alimentaria, patologías metabólicas, digestivas, renales, cardiovasculares, ' +
      'endocrinas o cualquier otra condición de salud, el destinatario debe ser derivado a ' +
      'un profesional matriculado. Se advierte expresamente al usuario que prescribir ' +
      'tratamientos para enfermedades sin título habilitante, o excediendo los límites de ' +
      'su autorización, configura el delito de ejercicio ilegal del arte de curar.',
    base:
      'Código Penal de la Nación, art. 208 inc. 1 (ejercicio ilegal del arte de curar); ' +
      'Ley 26.529 de Derechos del Paciente (consentimiento informado).',
  };

  const clausulaEntrenamiento = {
    titulo: 'Aptitud física y riesgo de la actividad',
    cuerpo:
      'La actividad física conlleva riesgos inherentes de lesión. Los planes de ' +
      'entrenamiento presuponen que el destinatario cuenta con apto médico vigente y no ' +
      'presenta contraindicaciones para el esfuerzo. Ante lesiones, patologías ' +
      'cardiovasculares, osteoarticulares o cualquier otra condición de salud, el ' +
      'destinatario debe ser derivado a un profesional matriculado antes de iniciar o ' +
      'continuar el programa.',
    base:
      'Código Civil y Comercial de la Nación, art. 1710 (deber de prevención del daño); ' +
      'Ley 26.529 de Derechos del Paciente.',
  };

  if (esGeneral) clausulas.push(clausulaEntrenamiento, clausulaNutricion);
  else clausulas.push(esNutricion ? clausulaNutricion : clausulaEntrenamiento);

  clausulas.push(
    {
      titulo: 'Datos personales',
      cuerpo:
        'Los datos del destinatario incorporados a los planes son cargados por el ' +
        'profesional usuario, único responsable de haber obtenido el consentimiento para su ' +
        'tratamiento y de resguardar su confidencialidad. Mock no comercializa ni cede datos ' +
        'de los destinatarios de los planes.',
      base: 'Ley 25.326 de Protección de Datos Personales.',
    },
    {
      titulo: 'Alcance de estas condiciones',
      cuerpo:
        'Las cláusulas precedentes delimitan el objeto y el alcance de la prestación ' +
        'contratada, sin importar renuncia a los derechos indisponibles que la legislación ' +
        'de orden público reconozca a las partes. En la medida en que la ley lo admita, ' +
        'Mock y sus desarrolladores no responden por daños derivados del uso que el ' +
        'profesional haga de la herramienta, de las decisiones técnicas que adopte ni de los ' +
        'resultados obtenidos por el destinatario del plan.',
      base: 'Ley 24.240 de Defensa del Consumidor, art. 37.',
    },
  );

  return clausulas.map((c, i) => ({ ...c, n: String(i + 1) }));
}

export default buildTermsClauses;
