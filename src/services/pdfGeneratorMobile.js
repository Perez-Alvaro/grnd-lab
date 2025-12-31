import jsPDF from 'jspdf';
import { isBlockStart } from '../utils/blockDetector.js';

/**
 * Genera un PDF de una rutina de entrenamiento en formato MOBILE (A4 vertical)
 * Sistema visual optimizado para impresión y lectura móvil
 * @param {Object} routine - Rutina completa con todos los detalles
 * @param {Object} purchaseInfo - Información de la compra (usuario, fecha, etc)
 * @returns {Blob} - PDF generado como blob
 */
export const generateRoutinePDFMobile = (routine, purchaseInfo = {}) => {
  const doc = new jsPDF();

  // Configuración
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  let yPos = margin;
  const pagePadding = 10;
  const cardRadius = 6;
  const cardBorderWidth = 0.6;
  const cardGap = 8;
  const sectionGap = 14;

  // Colores del sistema visual (impresión)
  const textPrimary = [28, 28, 28]; // #1C1C1C
  const textSecondary = [110, 110, 110]; // #6E6E6E
  const accent = [46, 74, 95]; // #2E4A5F
  const divider = [224, 224, 224]; // #E0E0E0

  // ============================================
  // PORTADA CON ÍNDICE DE SEMANAS CLICKEABLE
  // ============================================

  yPos = 24;

  // Título de la rutina
  doc.setFontSize(24);
  doc.setTextColor(...textPrimary);
  doc.setFont('helvetica', 'bold');
  const routineNameLines = doc.splitTextToSize(
    routine.name || routine.title || 'Plan de Entrenamiento',
    pageWidth - 2 * margin,
  );
  doc.text(routineNameLines, margin, yPos);
  yPos += routineNameLines.length * 10 + sectionGap;

  // Info del plan
  doc.setFontSize(12);
  doc.setTextColor(...textSecondary);
  doc.setFont('helvetica', 'normal');
  const planInfo = `${routine.objective || 'Objetivo'} • ${routine.frequency || 3} días/semana`;
  doc.text(planInfo, margin, yPos);
  yPos += 10;

  // Nivel y duración
  doc.setFontSize(10);
  doc.setTextColor(...textSecondary);
  doc.text(`Nivel: ${routine.level || 'Intermedio'} • Duración: ${routine.durationWeeks || 4} semanas`, margin, yPos);
  yPos += 10;

  // Coach
  if (routine.author || routine.coach) {
    doc.setFontSize(9);
    doc.setTextColor(...textSecondary);
    doc.setFont('helvetica', 'bold');
    doc.text('COACH', margin, yPos);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...accent);
    doc.text(routine.author || routine.coach, margin + 20, yPos);
    yPos += 12;
  } else {
    yPos += 2;
  }

  yPos += sectionGap;

  // ÍNDICE DE SEMANAS
  doc.setFontSize(14);
  doc.setTextColor(...textPrimary);
  doc.setFont('helvetica', 'bold');
  doc.text('ÍNDICE DE SEMANAS', margin, yPos);
  yPos += 12;

  const weeks = routine.weeks || [];

  // Crear un mapa de páginas para los links
  const weekPageMap = {};
  let currentPage = 2; // La portada es página 1, contenido empieza en 2

  weeks.forEach((week, weekIndex) => {
    const weekNum = week.weekNumber || weekIndex + 1;
    weekPageMap[weekNum] = currentPage;

    // Calcular páginas que ocupará esta semana (1 página por día aproximadamente)
    const days = week.days || [];
    currentPage += days.length;
  });

  // Dibujar el índice con links clickeables
  weeks.forEach((week, weekIndex) => {
    const weekNum = week.weekNumber || weekIndex + 1;
    const cardHeight = 30;

    // Verificar espacio
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = 22;
    }

    // Tarjeta de semana
    doc.setDrawColor(...divider);
    doc.setLineWidth(cardBorderWidth);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, cardHeight, cardRadius, cardRadius, 'S');

    // Título de semana
    doc.setFontSize(12);
    doc.setTextColor(...accent);
    doc.setFont('helvetica', 'bold');
    doc.text(`SEMANA ${weekNum}`, margin + pagePadding, yPos + 11);

    // Descripción de la semana
    if (week.summary || week.title) {
      doc.setFontSize(9);
      doc.setTextColor(...textSecondary);
      doc.setFont('helvetica', 'normal');
      const desc = week.summary || week.title;
      const descLines = doc.splitTextToSize(desc, pageWidth - 2 * margin - pagePadding * 2);
      const linesToShow = Math.min(descLines.length, 2);
      for (let i = 0; i < linesToShow; i++) {
        doc.text(descLines[i], margin + pagePadding, yPos + 14 + (i * 4));
      }
    }

    // Número de días
    const dayCount = (week.days || []).length;
    doc.setFontSize(8);
    doc.setTextColor(...textSecondary);
    doc.text(`${dayCount} día${dayCount !== 1 ? 's' : ''} de entrenamiento`, margin + pagePadding, yPos + 25);

    // Link interno al inicio de la semana
    doc.link(margin, yPos, pageWidth - 2 * margin, cardHeight, { pageNumber: weekPageMap[weekNum] });

    yPos += cardHeight + cardGap;
  });

  // Instrucción para el usuario
  yPos += sectionGap;
  doc.setFontSize(9);
  doc.setTextColor(...textSecondary);
  doc.setFont('helvetica', 'italic');
  doc.text('Toca sobre cada semana para ir directamente a su contenido', margin, yPos);

  // ============================================
  // CONTENIDO: DÍAS Y EJERCICIOS
  // ============================================

  weeks.forEach((week, weekIndex) => {
    const days = week.days || [];

    days.forEach((day, dayIndex) => {
      // Nueva página para cada día
      doc.addPage();

      yPos = 20;

      // Badge de Semana
      doc.setFontSize(9);
      doc.setTextColor(...textSecondary);
      doc.setFont('helvetica', 'normal');
      doc.text(`Semana ${week.weekNumber || weekIndex + 1}`, margin, yPos);
      yPos += 8;

      // HEADER: Nombre de la rutina
      doc.setFontSize(11);
      doc.setTextColor(...textPrimary);
      doc.setFont('helvetica', 'bold');
      doc.text(routine.name || routine.title || 'Rutina', margin, yPos);
      yPos += 8;

      // Subtítulo: Info de la rutina
      doc.setFontSize(9);
      doc.setTextColor(...textSecondary);
      doc.setFont('helvetica', 'normal');
      const subtitle = `${routine.gender || routine.genre || 'Fuerza'} y potencia • ${routine.frequency || 6} días/semana`;
      doc.text(subtitle, margin, yPos);
      yPos += sectionGap;

      // TÍTULO DEL DÍA
      doc.setFontSize(16);
      doc.setTextColor(...textPrimary);
      doc.setFont('helvetica', 'bold');
      doc.text(day.name || `Día ${day.dayNumber || dayIndex + 1}`, margin, yPos);
      yPos += 12;

      // Subtítulo "Entrenamiento Principal"
      doc.setFontSize(14);
      doc.setTextColor(...textSecondary);
      doc.setFont('helvetica', 'bold');
      doc.text('Entrenamiento Principal', margin, yPos);
      yPos += sectionGap;

      // Tipo de día
      if (day.type === 'DESCANSO') {
        const restCardHeight = 26;
        doc.setDrawColor(...divider);
        doc.setLineWidth(cardBorderWidth);
        doc.roundedRect(margin, yPos, pageWidth - 2 * margin, restCardHeight, cardRadius, cardRadius, 'S');
        doc.setFontSize(10);
        doc.setTextColor(...textSecondary);
        doc.setFont('helvetica', 'italic');
        doc.text('Día de descanso activo', margin + pagePadding, yPos + 16);
        yPos += restCardHeight + cardGap;
        return;
      }

      // EJERCICIOS
      const exercises = day.exercises || [];

      exercises.forEach((exercise, exIndex) => {
        // Calcular altura de la tarjeta DINÁMICAMENTE
        const hasNotes = exercise.notes || exercise.note;
        const baseCardHeight = 38;

        let extraHeight = 0;
        if (hasNotes) {
          const noteText = exercise.notes || exercise.note;
          const noteLines = doc.splitTextToSize(noteText, pageWidth - 2 * margin - pagePadding * 2);
          extraHeight = noteLines.length * 4 + 8;
        }

        const cardHeight = baseCardHeight + extraHeight;

        // Verificar espacio
        if (yPos > pageHeight - cardHeight - 8) {
          doc.addPage();
          yPos = 20;
        }

        // TARJETA DEL EJERCICIO
        doc.setDrawColor(...divider);
        doc.setLineWidth(cardBorderWidth);
        doc.roundedRect(margin, yPos, pageWidth - 2 * margin, cardHeight, cardRadius, cardRadius, 'S');

        let cardYPos = yPos + 12;

        // NOMBRE DEL EJERCICIO
        doc.setFontSize(13);
        doc.setTextColor(...textPrimary);
        doc.setFont('helvetica', 'bold');

        const exerciseNameLines = doc.splitTextToSize(exercise.name, pageWidth - 2 * margin - pagePadding * 2);
        doc.text(exerciseNameLines, margin + pagePadding, cardYPos);

        // Ajustar posición si el nombre ocupa más de una línea
        if (exerciseNameLines.length > 1) {
          cardYPos += (exerciseNameLines.length - 1) * 6;
        }
        cardYPos += 10;

        // DETALLES EN 2 FILAS
        const detailsX = margin + pagePadding;
        const detailsWidth = pageWidth - 2 * margin - pagePadding * 2;
        const columnsPerRow = 3;
        const detailSpacing = detailsWidth / columnsPerRow;

        // Recopilar detalles
        const details = [];
        if (exercise.sets) details.push({ label: 'Series', value: exercise.sets });
        if (exercise.reps) details.push({ label: 'Reps', value: exercise.reps });
        if (exercise.rest) details.push({ label: 'Desc.', value: exercise.rest });
        if (exercise.tempo) details.push({ label: 'Cadencia', value: exercise.tempo });
        if (exercise.rir !== undefined && exercise.rir !== null) details.push({ label: 'RIR', value: exercise.rir });

        // Dividir en 2 filas si hay más de 3 columnas
        const firstRow = details.slice(0, 3);
        const secondRow = details.slice(3);

        // PRIMERA FILA
        doc.setFontSize(10);
        doc.setTextColor(...textSecondary);
        doc.setFont('helvetica', 'normal');
        firstRow.forEach((detail, idx) => {
          const x = detailsX + (idx * detailSpacing);
          doc.text(detail.label, x, cardYPos);
        });

        cardYPos += 5;

        doc.setFontSize(11);
        doc.setTextColor(...textPrimary);
        doc.setFont('helvetica', 'bold');
        firstRow.forEach((detail, idx) => {
          const x = detailsX + (idx * detailSpacing);
          doc.text(`${detail.value}`, x, cardYPos);
        });

        cardYPos += 8;

        // SEGUNDA FILA (si existe)
        if (secondRow.length > 0) {
          doc.setFontSize(10);
          doc.setTextColor(...textSecondary);
          doc.setFont('helvetica', 'normal');
          secondRow.forEach((detail, idx) => {
            const x = detailsX + (idx * detailSpacing);
            doc.text(detail.label, x, cardYPos);
          });

          cardYPos += 5;

          doc.setFontSize(11);
          doc.setTextColor(...textPrimary);
          doc.setFont('helvetica', 'bold');
          secondRow.forEach((detail, idx) => {
            const x = detailsX + (idx * detailSpacing);
            doc.text(`${detail.value}`, x, cardYPos);
          });

          cardYPos += 8;
        } else {
          cardYPos += 6;
        }

        // NOTAS
        if (hasNotes) {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...textSecondary);
          const noteText = exercise.notes || exercise.note;
          const noteLines = doc.splitTextToSize(noteText, pageWidth - 2 * margin - pagePadding * 2);
          doc.text(noteLines, margin + pagePadding, cardYPos);
          cardYPos += noteLines.length * 4 + 6;
        }

        // Video link (si existe)
        if (exercise.video || exercise.videoUrl) {
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...accent);

          const videoText = 'Ver técnica';
          doc.text(videoText, margin + pagePadding, cardYPos);

          // Link clickeable
          const videoUrl = exercise.video || exercise.videoUrl;
          doc.link(margin + pagePadding, cardYPos - 3, 44, 5, { url: videoUrl });
          cardYPos += 6;
        }

        yPos += cardHeight + cardGap;
      });
    });
  });

  // ============================================
  // ÚLTIMA PÁGINA: CONSEJOS
  // ============================================

  doc.addPage();
  yPos = 24;

  doc.setFontSize(18);
  doc.setTextColor(...accent);
  doc.setFont('helvetica', 'bold');
  doc.text('Consejos Importantes', margin, yPos);
  yPos += 14;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textPrimary);

  const tips = [
    '📊 Registra tus cargas y progresiones semanalmente',
    '💧 Mantén una hidratación adecuada durante el entrenamiento',
    '🍽️ Asegura un consumo proteico adecuado para la recuperación',
    '😴 Prioriza 7-9 horas de sueño de calidad',
    '🧘 Incluye trabajo de movilidad y estiramiento regular',
    '⚠️ Si sientes dolor, consulta con un profesional',
    '📈 El progreso requiere consistencia y paciencia',
  ];

  tips.forEach(tip => {
    const tipLines = doc.splitTextToSize(tip, pageWidth - 2 * margin);
    doc.text(tipLines, margin, yPos);
    yPos += tipLines.length * 6 + 4;
  });

  yPos += 10;

  // Información de compra (si existe)
  if (purchaseInfo.userName || purchaseInfo.purchaseDate) {
    doc.setFontSize(9);
    doc.setTextColor(...textSecondary);
    doc.setFont('helvetica', 'normal');

    if (purchaseInfo.userName) {
      doc.text(`Cliente: ${purchaseInfo.userName}`, margin, yPos);
      yPos += 6;
    }

    if (purchaseInfo.purchaseDate) {
      const date = new Date(purchaseInfo.purchaseDate).toLocaleDateString('es-AR');
      doc.text(`Fecha de compra: ${date}`, margin, yPos);
      yPos += 6;
    }

    yPos += 6;
  }

  // Footer
  yPos = pageHeight - 12;
  doc.setFontSize(8);
  doc.setTextColor(...textSecondary);
  doc.setFont('helvetica', 'italic');
  doc.text('Generado por Grind-Lab', margin, yPos);

  // Generar el PDF como blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
};

/**
 * Descarga el PDF Mobile generado directamente en el navegador
 * @param {Object} routine - Rutina completa
 * @param {Object} purchaseInfo - Información de compra
 */
export const downloadRoutinePDFMobile = (routine, purchaseInfo = {}) => {
  const pdfBlob = generateRoutinePDFMobile(routine, purchaseInfo);

  const fileName = `${(routine.name || routine.title || 'rutina').replace(/\s+/g, '_')}_mobile.pdf`;

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
  generateRoutinePDFMobile,
  downloadRoutinePDFMobile,
};
