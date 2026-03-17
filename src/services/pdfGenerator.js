import jsPDF from 'jspdf';

/**
 * Genera un PDF de una rutina de entrenamiento
 * @param {Object} routine - Rutina completa con todos los detalles
 * @param {Object} purchaseInfo - Información de la compra (usuario, fecha, etc)
 * @returns {Blob} - PDF generado como blob
 */
export const generateRoutinePDF = (routine, purchaseInfo = {}) => {
  const doc = new jsPDF({ orientation: 'portrait', format: 'a4' });

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
        yPos += 8; // Espacio antes de las notas/video

        // Botón de video (si existe)
        const videoUrl = exercise.video || exercise.videoUrl;
        if (videoUrl) {
          const linkText = 'VER VIDEO';
          const btnWidth = doc.getTextWidth(linkText) + 6;
          const btnHeight = 6;
          const btnX = margin + 10;
          const btnY = yPos - 4; // Ajuste para centrar verticalmente sobre el texto principal

          // Dibujar el fondo del botón
          doc.setFillColor(...primaryColor);
          doc.roundedRect(btnX - 3, btnY, btnWidth, btnHeight, 1.5, 1.5, 'F');
          
          // Escribir el texto sobre el botón
          doc.setFontSize(8);
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.text(linkText, btnX, btnY + 4.5);
          
          // Área de link interactiva (cubriendo todo el botón)
          doc.link(btnX - 3, btnY, btnWidth, btnHeight, { url: videoUrl });

          yPos += 8;
        }

        // Notas del ejercicio (fila separada debajo)
        const rawNoteText = exercise.notes || exercise.note;
        // Filtramos las notas para que no se duplique la URL del vídeo en el PDF
        const cleanNoteText = Array.isArray(rawNoteText) 
          ? rawNoteText.filter(note => note.trim() !== videoUrl.trim()).join(' | ') 
          : (String(rawNoteText).trim() === videoUrl.trim() ? '' : rawNoteText);

        if (cleanNoteText && cleanNoteText !== 'undefined') {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(...grayColor);
          const noteLines = doc.splitTextToSize(`💡 Notas: ${cleanNoteText}`, pageWidth - margin - 15);
          doc.text(noteLines, margin + 10, yPos);
          yPos += noteLines.length * 5 + 5;
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
  // Footer
  // ============================================

  // Nueva página para el footer
  doc.addPage();
  const footerY = pageHeight - margin;
  doc.setFontSize(8);
  doc.setTextColor(...grayColor);
  doc.setFont('helvetica', 'italic');
  doc.text('Generado por BaseRutina', margin, footerY);

  const currentDate = new Date().toLocaleDateString('es-AR');
  doc.text(currentDate, pageWidth - margin, footerY, { align: 'right' });

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
