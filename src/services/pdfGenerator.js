import jsPDF from 'jspdf';

/**
 * Genera un PDF de una rutina de entrenamiento
 * @param {Object} routine - Rutina completa con todos los detalles
 * @param {Object} purchaseInfo - Información de la compra (usuario, fecha, etc)
 * @returns {Blob} - PDF generado como blob
 */
export const generateRoutinePDF = (routine, purchaseInfo = {}) => {
  const doc = new jsPDF({ orientation: 'landscape', format: 'a4' });

  // Configuración
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // Colores
  const primaryColor = [46, 74, 95]; // #2E4A5F
  const darkColor = [28, 28, 28]; // #1C1C1C
  const grayColor = [110, 110, 110]; // #6E6E6E

  // ============================================
  // PORTADA
  // ============================================

  // Logo/Título
  doc.setFontSize(26);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Fitter', margin, yPos);

  doc.setFontSize(14);
  doc.setTextColor(...grayColor);
  doc.text('PROGRAMA DE ENTRENAMIENTO', margin, yPos + 10);

  yPos += 40;

  // Nombre de la rutina
  doc.setFontSize(26);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'bold');
  const routineNameLines = doc.splitTextToSize(routine.name || routine.title, pageWidth - 2 * margin);
  doc.text(routineNameLines, margin, yPos);
  yPos += routineNameLines.length * 10 + 20;

  // Información de la rutina
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);

  const info = [
    `Género: ${routine.gender || routine.genre || 'Unisex'}`,
    `Objetivo: ${routine.objective || 'General'}`,
    `Nivel: ${routine.level || 'Todos'}`,
    `Frecuencia: ${routine.frequency || 3} días por semana`,
    `Duración: ${routine.durationWeeks || 4} semanas`,
  ];

  info.forEach(line => {
    doc.text(line, margin, yPos);
    yPos += 8;
  });

  yPos += 20;

  // Descripción
  if (routine.description) {
    doc.setFontSize(11);
    doc.setTextColor(...darkColor);
    const descLines = doc.splitTextToSize(routine.description, pageWidth - 2 * margin);
    doc.text(descLines, margin, yPos);
    yPos += descLines.length * 6 + 20;
  }

  // Información de compra
  if (purchaseInfo.userName || purchaseInfo.purchaseDate) {
    yPos = pageHeight - 40;
    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.setFont('helvetica', 'italic');

    if (purchaseInfo.userName) {
      doc.text(`Cliente: ${purchaseInfo.userName}`, margin, yPos);
      yPos += 6;
    }

    if (purchaseInfo.purchaseDate) {
      doc.text(`Fecha de compra: ${new Date(purchaseInfo.purchaseDate).toLocaleDateString('es-AR')}`, margin, yPos);
      yPos += 6;
    }

    doc.text('Generado con Claude Code', margin, yPos);
  }

  // ============================================
  // CONTENIDO: SEMANAS Y EJERCICIOS
  // ============================================

  const weeks = routine.weeks || [];

  weeks.forEach((week, weekIndex) => {
    // Nueva página para cada semana
    doc.addPage();
    yPos = margin;

    // Título de la semana
    doc.setFontSize(19);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(`${week.title || `Semana ${week.weekNumber || weekIndex + 1}`}`, margin, yPos);
    yPos += 12;

    // Resumen de la semana
    if (week.summary) {
      doc.setFontSize(10);
      doc.setTextColor(...grayColor);
      doc.setFont('helvetica', 'italic');
      const summaryLines = doc.splitTextToSize(week.summary, pageWidth - 2 * margin);
      doc.text(summaryLines, margin, yPos);
      yPos += summaryLines.length * 5 + 8;
    }

    // Notas de la semana
    if (week.notes) {
      doc.setFontSize(10);
      doc.setTextColor(...darkColor);
      doc.setFont('helvetica', 'normal');
      doc.text(`Nota: ${week.notes}`, margin, yPos);
      yPos += 10;
    }

    // Días de entrenamiento
    const days = week.days || [];

    days.forEach((day, dayIndex) => {
      // Verificar espacio, si no hay suficiente, nueva página
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = margin;
      }

      // Título del día
      doc.setFontSize(14);
      doc.setTextColor(...darkColor);
      doc.setFont('helvetica', 'bold');
      doc.text(day.name || `Día ${day.dayNumber || dayIndex + 1}`, margin, yPos);
      yPos += 8;

      // Tipo de día
      if (day.type === 'DESCANSO') {
      doc.setFontSize(10);
      doc.setTextColor(...grayColor);
      doc.setFont('helvetica', 'italic');
      doc.text('Día de descanso activo', margin + 5, yPos);
      yPos += 15;
        return; // Skip exercises
      }

      // Ejercicios
      const exercises = day.exercises || [];

      exercises.forEach((exercise, exIndex) => {
        // Verificar espacio
        if (yPos > pageHeight - 30) {
          doc.addPage();
          yPos = margin;
        }

        // Número y nombre del ejercicio
        doc.setFontSize(11);
        doc.setTextColor(...darkColor);
        doc.setFont('helvetica', 'bold');
        doc.text(`${exIndex + 1}. ${exercise.name}`, margin + 5, yPos);
        yPos += 6;

        // Detalles del ejercicio
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...grayColor);

        const details = [];
        if (exercise.sets) details.push(`${exercise.sets} series`);
        if (exercise.reps) details.push(`${exercise.reps} reps`);
        if (exercise.rest) details.push(`Descanso: ${exercise.rest}`);
        if (exercise.rir !== undefined && exercise.rir !== null) details.push(`RIR: ${exercise.rir}`);
        if (exercise.tempo) details.push(`Tempo: ${exercise.tempo}`);

        doc.text(details.join(' | '), margin + 10, yPos);
        yPos += 5;

        // Notas del ejercicio
        if (exercise.notes || exercise.note) {
          doc.setFont('helvetica', 'italic');
          const noteText = exercise.notes || exercise.note;
          const noteLines = doc.splitTextToSize(`💡 ${noteText}`, pageWidth - margin - 15);
          doc.text(noteLines, margin + 10, yPos);
          yPos += noteLines.length * 5 + 3;
        }

        yPos += 3; // Espacio entre ejercicios
      });

      // Nota de recuperación del día
      if (day.recoveryNote) {
        doc.setFontSize(10);
        doc.setTextColor(...primaryColor);
        doc.setFont('helvetica', 'italic');
        doc.text(`⚡ ${day.recoveryNote}`, margin + 5, yPos);
        yPos += 8;
      }

      yPos += 10; // Espacio entre días
    });
  });

  // ============================================
  // ÚLTIMA PÁGINA: INFORMACIÓN ADICIONAL
  // ============================================

  doc.addPage();
  yPos = margin;

  doc.setFontSize(18);
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Consejos Importantes', margin, yPos);
  yPos += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkColor);

  const tips = [
    '📊 Registra tus cargas y progresiones semanalmente',
    '💧 Mantén una hidratación adecuada durante el entrenamiento',
    '🍽️ Asegura un consumo proteico adecuado para la recuperación',
    '😴 Prioriza 7-9 horas de sueño de calidad',
    '🧘 Incluye trabajo de movilidad y estiramiento regular',
    '⚠️ Si sientes dolor, detén el ejercicio y consulta un profesional',
    '📈 El progreso requiere consistencia y paciencia',
  ];

  tips.forEach(tip => {
    const tipLines = doc.splitTextToSize(tip, pageWidth - 2 * margin);
    doc.text(tipLines, margin, yPos);
    yPos += tipLines.length * 6 + 4;
  });

  yPos += 20;

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(...grayColor);
  doc.setFont('helvetica', 'italic');
  doc.text('Este programa fue generado por Fitter - Tu plataforma de entrenamiento personalizado', margin, yPos);
  yPos += 5;
  doc.text('Para más información, visita nuestra plataforma', margin, yPos);

  // Generar el PDF como blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
};

/**
 * Descarga el PDF generado directamente en el navegador
 * @param {Object} routine - Rutina completa
 * @param {Object} purchaseInfo - Información de compra
 */
export const downloadRoutinePDF = (routine, purchaseInfo = {}) => {
  const doc = new jsPDF();
  const pdfBlob = generateRoutinePDF(routine, purchaseInfo);

  const fileName = `${(routine.name || routine.title || 'rutina').replace(/\s+/g, '_')}.pdf`;

  // Crear link de descarga
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default {
  generateRoutinePDF,
  downloadRoutinePDF,
};
