import jsPDF from 'jspdf';

/**
 * Genera un PDF de una rutina de entrenamiento en formato MOBILE (A4 vertical)
 * Sistema visual 100% mobile-first con cards tipo app y flujo continuo Mynter-style
 * @param {Object} routine - Rutina completa con todos los detalles
 * @param {Object} purchaseInfo - Información de la compra (usuario, fecha, etc)
 * @returns {Blob} - PDF generado como blob
 */
export const generateRoutinePDFMobile = (routine, purchaseInfo = {}) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // ============================================
  // CONFIGURACIÓN VISUAL MOBILE-FIRST
  // ============================================
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Márgenes y espaciados (aumentados para mejor respiración)
  const margin = 12;  // Aumentado de 8mm a 12mm
  const contentWidth = pageWidth - (margin * 2);
  
  // Sistema de ritmo vertical (8px system: 8/16/24/32)
  const spacing8 = 2.8;   // 8px
  const spacing16 = 5.6;  // 16px
  const spacing24 = 8.5;  // 24px
  const spacing32 = 11.3; // 32px
  const spacing40 = 14;   // 40px
  
  // Card styling (reducidos para cards más compactas)
  const cardPadding = 5;  // Reducido de 6mm a 5mm
  const cardRadius = 6;
  const cardGap = 7; // Reducido de 8.5mm a 7mm
  const cardMinHeight = 20;  // Reducido de 24mm a 20mm
  
  // Colores del sistema (NO MODIFICAR)
  const textPrimary = [28, 28, 28];     // #1C1C1C
  const textSecondary = [110, 110, 110]; // #6E6E6E
  const accent = [46, 74, 95];           // #2E4A5F
  const divider = [224, 224, 224];       // #E0E0E0
  const bgWhite = [255, 255, 255];       // #FFFFFF
  const bgLight = [250, 250, 250];       // #FAFAFA

  let yPos = 0;

  // ============================================
  // HELPER: Verificar espacio en página
  // ============================================
  const checkPageSpace = (requiredSpace) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // ============================================
  // HELPER: Dibujar card con borde sutil
  // ============================================
  const drawCard = (x, y, width, height, fill = false) => {
    doc.setDrawColor(...divider);
    doc.setLineWidth(0.5);
    
    if (fill) {
      doc.setFillColor(...bgLight);
      doc.roundedRect(x, y, width, height, cardRadius, cardRadius, 'FD');
    } else {
      doc.roundedRect(x, y, width, height, cardRadius, cardRadius, 'S');
    }
  };

  // ============================================
  // PORTADA + ÍNDICE INTERACTIVO
  // ============================================

  // Padding top: 32-40px
  yPos = spacing40;

  // ============================================
  // TÍTULO PRINCIPAL (24-28px, bold, line-height 1.3)
  // ============================================
  
  doc.setFontSize(22); // Reducido de 28px a 22px
  doc.setTextColor(...textPrimary);
  doc.setFont('helvetica', 'bold');
  
  const routineTitle = routine.name || routine.title || 'Plan de Entrenamiento';
  const titleLines = doc.splitTextToSize(routineTitle, contentWidth);
  const finalTitleLines = titleLines.slice(0, 2); // Máximo 2 líneas
  
  doc.text(finalTitleLines, margin, yPos);
  yPos += (finalTitleLines.length * 8) + spacing24; // Más espaciado después del título

  // ============================================
  // METADATA (Agrupada, 13-14px, line-height 1.5)
  // ============================================
  
  doc.setFontSize(12); // Reducido de 14px a 12px
  doc.setTextColor(...textSecondary);
  doc.setFont('helvetica', 'normal');
  
  const objective = routine.objective || 'Objetivo personalizado';
  const frequency = routine.frequency || 3;
  const subtitle = `${objective} • ${frequency} días por semana`;
  
  doc.text(subtitle, margin, yPos);
  yPos += 7; // Más espaciado vertical

  // Metadatos secundarios
  doc.setFontSize(11); // Reducido de 13px a 11px
  doc.setTextColor(...textSecondary);
  
  const level = routine.level || 'Intermedio';
  const duration = routine.durationWeeks || routine.weeks?.length || 4;
  const metadata = `Nivel: ${level} • Duración: ${duration} semanas`;
  
  doc.text(metadata, margin, yPos);
  yPos += 6; // Más espaciado

  // Coach (si existe)
  if (routine.author || routine.coach) {
    doc.setFontSize(11); // Reducido de 13px a 11px
    doc.setTextColor(...accent);
    doc.setFont('helvetica', 'bold');
    doc.text(`Coach: ${routine.author || routine.coach}`, margin, yPos);
    yPos += 6; // Más espaciado
  }

  // Margin-bottom del bloque metadata: 24px
  yPos += spacing24;

  // ============================================
  // SECCIÓN "ÍNDICE"
  // Font-size: 16-18px, Font-weight: 600
  // Margin-top: 32px (ya aplicado), Margin-bottom: 12px
  // ============================================

  doc.setFontSize(16); // Reducido de 18px a 16px
  doc.setTextColor(...textPrimary);
  doc.setFont('helvetica', 'bold');
  doc.text('ÍNDICE', margin, yPos);
  yPos += spacing16; // Margin-bottom: 16px (respiración)

  const weeks = routine.weeks || [];
  
  // Mapa de páginas para links internos
  const weekPageMap = {};
  let pageCounter = 2; // Página 1 es la portada
  
  weeks.forEach((week, weekIndex) => {
    const weekNum = week.weekNumber || weekIndex + 1;
    weekPageMap[weekNum] = pageCounter;
    
    const days = week.days || [];
    pageCounter += days.length; // 1 página por día
  });

  // Renderizar cards de semanas
  // Cada ítem: padding vertical 12-16px, margin-bottom 12px
  weeks.forEach((week, weekIndex) => {
    const weekNum = week.weekNumber || weekIndex + 1;
    const days = week.days || [];
    const dayCount = days.length;
    
    // Padding reducido
    const weekCardPaddingV = 4;  // Reducido
    const weekCardPaddingH = 6;  // Reducido
    
    // Altura dinámica de la card (reducida)
    const hasDescription = !!(week.summary || week.title);
    const cardHeight = hasDescription ? 28 : 22;  // Reducido de 38/32 a 28/22
    
    // Verificar espacio
    checkPageSpace(cardHeight + spacing8);
    
    const cardY = yPos;
    
    // Dibujar card
    drawCard(margin, cardY, contentWidth, cardHeight, false);
    
    // Contenido centrado vertical y horizontalmente
    const cardContentWidth = contentWidth - (weekCardPaddingH * 2);
    
    // Calcular altura total del contenido para centrar verticalmente
    const lineHeight = 5;  // Reducido
    let totalContentHeight = 12 * 0.35 * 1.3; // Título (font reducido)
    totalContentHeight += lineHeight; // Spacing después del título
    if (hasDescription) {
      totalContentHeight += 9 * 0.35 * 1.3; // Descripción (font reducido)
      totalContentHeight += 3; // Spacing reducido
    }
    totalContentHeight += 8 * 0.35 * 1.3; // Días de entrenamiento
    
    // Posición Y inicial centrada + offset para bajar más
    let contentY = cardY + (cardHeight - totalContentHeight) / 2 + 3;  // +3 para bajar
    
    // Título de semana (centrado)
    doc.setFontSize(12);  // Reducido de 14 a 12
    doc.setTextColor(...accent);
    doc.setFont('helvetica', 'bold');
    const weekTitle = `SEMANA ${weekNum}`;
    const weekTitleWidth = doc.getTextWidth(weekTitle);
    const weekTitleX = margin + (contentWidth - weekTitleWidth) / 2;
    doc.text(weekTitle, weekTitleX, contentY);
    contentY += lineHeight;
    
    // Descripción (si existe, centrada, max 1 línea)
    if (hasDescription) {
      doc.setFontSize(9);  // Reducido de 10 a 9
      doc.setTextColor(...textSecondary);
      doc.setFont('helvetica', 'normal');
      
      const desc = week.summary || week.title;
      const descLines = doc.splitTextToSize(desc, cardContentWidth);
      const descText = descLines[0];
      const descWidth = doc.getTextWidth(descText);
      const descX = margin + (contentWidth - descWidth) / 2;
      doc.text(descText, descX, contentY);
      contentY += 3;  // Reducido de 5 a 3
    }
    
    // Días de entrenamiento (centrado)
    doc.setFontSize(8);  // Reducido de 9 a 8
    doc.setTextColor(...textSecondary);
    const daysText = `${dayCount} día${dayCount !== 1 ? 's' : ''} de entrenamiento`;
    const daysWidth = doc.getTextWidth(daysText);
    const daysX = margin + (contentWidth - daysWidth) / 2;
    doc.text(daysText, daysX, contentY);
    
    // Link clickeable (toda la card)
    doc.link(margin, cardY, contentWidth, cardHeight, { 
      pageNumber: weekPageMap[weekNum] 
    });
    
    // Margin-bottom reducido entre items de semana
    yPos += cardHeight + spacing8;  // Reducido de spacing16 a spacing8
  });

  // Texto de ayuda
  // Font-size: 12-13px, Margin-top: 20px, Opacidad visual menor
  yPos += spacing24; // Margin-top: 24px (separado del índice)
  doc.setFontSize(12); // 12px
  doc.setTextColor(...textSecondary);
  doc.setFont('helvetica', 'italic');
  const instruction = doc.splitTextToSize(
    'Toca sobre cada semana para ir directamente a su contenido',
    contentWidth
  );
  doc.text(instruction, margin, yPos);

  // ============================================
  // CONTENIDO: SEMANAS → DÍAS → EJERCICIOS
  // ============================================

  weeks.forEach((week, weekIndex) => {
    const weekNum = week.weekNumber || weekIndex + 1;
    const days = week.days || [];

    days.forEach((day, dayIndex) => {
      // ============================================
      // NUEVA PÁGINA POR DÍA (Regla estricta)
      // ============================================
      
      doc.addPage();
      yPos = margin + spacing16;  // Aumentado para más espacio arriba

      // ============================================
      // HEADER DEL DÍA (Estilo App)
      // ============================================

      // Badge discreto: Semana X
      doc.setFontSize(9);
      doc.setTextColor(...textSecondary);
      doc.setFont('helvetica', 'normal');
      doc.text(`Semana ${weekNum}`, margin, yPos);
      yPos += spacing8 + 2;  // Más espaciado

      // Nombre del plan (discreto)
      doc.setFontSize(8);
      doc.setTextColor(...textSecondary);
      const planName = (routine.name || routine.title || '').substring(0, 40);
      doc.text(planName, margin, yPos);
      yPos += spacing16 + 2;  // Más espaciado

      // Link "Volver al indice" alineado a la derecha (sin emoji)
      doc.setFontSize(9);
      doc.setTextColor(...accent);
      doc.setFont('helvetica', 'normal');
      const backText = '< Volver al indice';
      const backTextWidth = doc.getTextWidth(backText);
      doc.text(backText, pageWidth - margin - backTextWidth, margin + spacing8);
      // Link clickeable para volver a la primera página
      doc.link(pageWidth - margin - backTextWidth - 2, margin + spacing8 - 4, backTextWidth + 4, 8, { pageNumber: 1 });

      // Título del día (muy dominante)
      doc.setFontSize(18);  // Reducido de 20 a 18
      doc.setTextColor(...textPrimary);
      doc.setFont('helvetica', 'bold');
      
      const dayTitle = day.name || `Día ${day.dayNumber || dayIndex + 1}`;
      const dayTitleLines = doc.splitTextToSize(dayTitle, contentWidth);
      doc.text(dayTitleLines, margin, yPos);
      yPos += (dayTitleLines.length * 7) + spacing24;  // Más espaciado después del título

      // Separación clara antes del contenido
      doc.setDrawColor(...divider);
      doc.setLineWidth(0.3);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += spacing24;  // Más espaciado después de la línea

      // ============================================
      // DÍA DE DESCANSO (Si aplica)
      // ============================================

      if (day.type === 'DESCANSO') {
        doc.setFontSize(12);
        doc.setTextColor(...textSecondary);
        doc.setFont('helvetica', 'italic');
        doc.text('Día de descanso activo', margin, yPos);
        return;
      }

      // ============================================
      // BLOQUES DE ENTRENAMIENTO
      // ============================================

      const exercises = day.exercises || [];
      
      // Agrupar ejercicios por bloque (si tienen)
      const exercisesByBlock = {};
      exercises.forEach(exercise => {
        const blockName = exercise.block || 'Principal';
        if (!exercisesByBlock[blockName]) {
          exercisesByBlock[blockName] = [];
        }
        exercisesByBlock[blockName].push(exercise);
      });

      Object.entries(exercisesByBlock).forEach(([blockName, blockExercises]) => {
        
        // ============================================
        // SEPARADOR DE BLOQUE
        // ============================================
        
        if (blockName && blockName !== 'Principal') {
          checkPageSpace(spacing32);
          
          doc.setFontSize(15);
          doc.setTextColor(...textPrimary);
          doc.setFont('helvetica', 'bold');
          doc.text(blockName, margin, yPos);
          yPos += spacing16;
        }

        // ============================================
        // EJERCICIOS (Card Mobile Style)
        // ============================================

        blockExercises.forEach((exercise, exIdx) => {
          
          // ============================================
          // ESPECIFICACIONES UX/UI RIGUROSAS
          // ============================================
          
          const hasVideo = !!(exercise.video || exercise.videoUrl);
          const hasNotes = !!(exercise.notes || exercise.note);
          
          // Card Container Specs (Reducidos para cards más pequeñas)
          const cardPaddingVertical = 4;    // Reducido de 6mm a 4mm
          const cardPaddingHorizontal = 6; // Reducido de 7mm a 6mm
          const cardBorderRadius = 4;      // Reducido de 5.6mm a 4mm
          
          // Spacing Specs (reducidos)
          const titleMarginBottom = 3;     // Reducido de 5mm a 3mm
          const metricsGapHorizontal = 4;  // Reducido
          const notesMarginTop = 3;        // Reducido de 4.9mm a 3mm
          
          // Calcular ancho disponible
          const availableCardWidth = contentWidth - (cardPaddingHorizontal * 2);
          
          // ============================================
          // CÁLCULO DE ALTURA DE LA CARD
          // ============================================
          
          // Título del ejercicio (12pt - Reducido aún más para cards compactas)
          const titleFontSize = 12; // pt (reducido de 14pt a 12pt)
          const nameLines = doc.splitTextToSize(
            exercise.name || 'Ejercicio sin nombre',
            availableCardWidth
          );
          const titleLineHeight = (titleFontSize * 0.35) * 1.3; // pt to mm * line-height
          const titleHeight = nameLines.length * titleLineHeight;
          
          // Bloque de métricas (altura reducida)
          const metricsBlockHeight = 9; // Reducido de 11mm a 9mm
          
          // Notas del ejercicio (ahora con separador + etiqueta + contenido multilínea)
          let notesHeight = 0;
          if (hasNotes) {
            const noteText = exercise.notes || exercise.note;
            const noteLines = doc.splitTextToSize(noteText, availableCardWidth);
            const noteFontSize = 10; // pt
            const lineHeight = (noteFontSize * 0.35) * 1.4; // pt to mm * line-height
            notesHeight = 4 + 5 + (noteLines.length * lineHeight); // Separador (4mm) + etiqueta (5mm) + contenido
          }
          
          // Altura total de la card (compacta)
          const cardContentHeight = 
            cardPaddingVertical +              // Top padding
            titleHeight +                      // Título
            titleMarginBottom +                // Espacio después título
            metricsBlockHeight +               // Bloque de métricas
            (hasNotes ? notesMarginTop : 0) +  // Espacio antes de notas
            notesHeight +                      // Nota (si existe)
            cardPaddingVertical;               // Bottom padding
          
          // Verificar espacio en página
          checkPageSpace(cardContentHeight + cardGap);
          
          const cardY = yPos;
          
          // ============================================
          // DIBUJAR CARD (Border-radius: 16px)
          // ============================================
          
          doc.setDrawColor(...divider);
          doc.setLineWidth(0.5);
          doc.setFillColor(...bgLight);
          doc.roundedRect(
            margin, 
            cardY, 
            contentWidth, 
            cardContentHeight, 
            cardBorderRadius, 
            cardBorderRadius, 
            'FD'
          );
          
          // ============================================
          // CONTENIDO DE LA CARD
          // ============================================
          
          let cardContentY = cardY + cardPaddingVertical + 1;  // +1mm para leve offset
          const cardContentX = margin + cardPaddingHorizontal;
          
          // ============================================
          // 1. TÍTULO DEL EJERCICIO (Jerarquía Principal)
          // Font-size REDUCIDO: 12pt (compacto)
          // Font-weight: 600-700, Margin-bottom reducido
          // ============================================
          
          doc.setFontSize(11); // Reducido de 12pt a 11pt para cards compactas
          doc.setTextColor(...textPrimary);
          doc.setFont('helvetica', 'bold');
          doc.text(nameLines, cardContentX, cardContentY);
          cardContentY += titleHeight + titleMarginBottom;
          
          // ============================================
          // 2. BLOQUE DE MÉTRICAS (Flex horizontal, space-between)
          // Labels: 11-12px, weight 400-500
          // Valores: 14-16px, weight 600
          // ============================================
          
          const metricsY = cardContentY;
          
          // Preparar datos
          const formatValue = (value) => {
            if (value === null || value === undefined || value === '') return '-';
            return `${value}`;
          };
          
          const setsValue = exercise.series ?? exercise.sets;
          const repsValue = exercise.reps;
          const restValue = exercise.rest ?? exercise.descanso;
          const rirValue = exercise.rir;
          const tempoValue = exercise.tempo ?? exercise.cadencia;
          
          const metrics = [
            { label: 'Series', value: formatValue(setsValue) },
            { label: 'Rep.', value: formatValue(repsValue) },
            { label: 'Desc.', value: formatValue(restValue) },
            { label: 'Cadencia', value: formatValue(tempoValue) },
            { label: 'RIR', value: formatValue(rirValue) },
          ];
          
          // Calcular espacio para botón VIDEO
          const videoButtonSpace = hasVideo ? 20 : 0; // ~56px de ancho
          const metricsAvailableWidth = availableCardWidth - videoButtonSpace;
          const metricWidth = metricsAvailableWidth / metrics.length;
          
          // Renderizar métricas con layout space-between
          metrics.forEach((metric, idx) => {
            const metricX = cardContentX + (idx * metricWidth);
            const centerX = metricX + (metricWidth / 2);
            
            // Label (reducido)
            doc.setFontSize(9); // Reducido de 10pt a 9pt
            doc.setTextColor(...textSecondary);
            doc.setFont('helvetica', 'normal');
            doc.text(metric.label, centerX, metricsY, { align: 'center' });
            
            // Valor (reducido)
            doc.setFontSize(12); // Reducido de 13pt a 12pt
            doc.setTextColor(...textPrimary);
            doc.setFont('helvetica', 'bold');
            doc.text(metric.value, centerX, metricsY + 4, { align: 'center' });  // +4 en vez de +5
          });
          
          // ============================================
          // 3. BOTÓN "VIDEO" (Integrado en el eje vertical de métricas)
          // Altura: 32-36px, Padding: 12-16px, Border-radius: 8px
          // Jerarquía: Acción secundaria
          // ============================================
          
          if (hasVideo) {
            const buttonWidth = 18;        // ~50px
            const buttonHeight = 11;       // ~31px (32-36px target)
            const buttonRadius = 2.8;      // 8px
            const buttonX = cardContentX + metricsAvailableWidth + 2;
            const buttonY = metricsY - 1.5; // Centrado con métricas
            
            // Fondo del botón (acción secundaria)
            doc.setFillColor(...accent);
            doc.roundedRect(buttonX, buttonY, buttonWidth, buttonHeight, buttonRadius, buttonRadius, 'F');
            
            // Texto del botón (no competir visualmente)
            doc.setFontSize(8); // Texto más discreto
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            const buttonText = 'VIDEO';
            const textWidth = doc.getTextWidth(buttonText);
            const textX = buttonX + (buttonWidth - textWidth) / 2;
            doc.text(buttonText, textX, buttonY + 7);
            
            // Link clickeable
            const videoUrl = exercise.video || exercise.videoUrl;
            doc.link(buttonX, buttonY, buttonWidth, buttonHeight, { url: videoUrl });
          }
          
          cardContentY += metricsBlockHeight;
          
          // ============================================
          // 4. NOTAS DEL EJERCICIO (Fila separada)
          // Font-size: 10px, Weight: 400, Line-height: 1.4
          // Separador visual + etiqueta clara
          // ============================================
          
          if (hasNotes) {
            cardContentY += notesMarginTop;
            
            // Separador visual discreto
            doc.setDrawColor(...divider);
            doc.setLineWidth(0.3);
            doc.line(cardContentX, cardContentY, cardContentX + availableCardWidth, cardContentY);
            cardContentY += 4; // Espacio después del separador
            
            // Etiqueta "Notas:" (sin emoji para evitar problemas de encoding)
            doc.setFontSize(10);
            doc.setTextColor(...accent);
            doc.setFont('helvetica', 'bold');
            doc.text('Notas:', cardContentX, cardContentY);
            cardContentY += 5;
            
            // Contenido de la nota
            doc.setFontSize(10);
            doc.setTextColor(...textSecondary);
            doc.setFont('helvetica', 'normal');
            
            const noteText = exercise.notes || exercise.note;
            const noteLines = doc.splitTextToSize(noteText, availableCardWidth);
            
            // Mostrar todas las líneas (sin limitación)
            doc.text(noteLines, cardContentX, cardContentY);
          }
          
          // Actualizar yPos para la siguiente card
          yPos += cardContentHeight + cardGap - 2;  // -2mm para cards más juntas
        });
      });
    });
  });

  // ============================================
  // ÚLTIMA PÁGINA: CONSEJOS IMPORTANTES
  // ============================================

  doc.addPage();
  yPos = spacing32 + 6;

  // Título de la sección
  doc.setFontSize(20);
  doc.setTextColor(...accent);
  doc.setFont('helvetica', 'bold');
  doc.text('Consejos Importantes', margin, yPos);
  yPos += spacing24;

  // Lista de consejos
  doc.setFontSize(11);
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
    const tipLines = doc.splitTextToSize(tip, contentWidth);
    doc.text(tipLines, margin, yPos);
    yPos += (tipLines.length * 6) + spacing8;
  });

  yPos += spacing16;

  // ============================================
  // Información de compra (si existe)
  // ============================================
  
  if (purchaseInfo.userName || purchaseInfo.purchaseDate) {
    doc.setFontSize(9);
    doc.setTextColor(...textSecondary);
    doc.setFont('helvetica', 'normal');

    if (purchaseInfo.userName) {
      doc.text(`Cliente: ${purchaseInfo.userName}`, margin, yPos);
      yPos += spacing8;
    }

    if (purchaseInfo.purchaseDate) {
      const date = new Date(purchaseInfo.purchaseDate).toLocaleDateString('es-AR');
      doc.text(`Fecha de compra: ${date}`, margin, yPos);
      yPos += spacing8;
    }

    yPos += spacing16;
  }

  // ============================================
  // Footer discreto
  // ============================================
  
  const footerY = pageHeight - margin;
  doc.setFontSize(8);
  doc.setTextColor(...textSecondary);
  doc.setFont('helvetica', 'italic');
  doc.text('Generado por Grind-Lab', margin, footerY);
  
  const currentDate = new Date().toLocaleDateString('es-AR');
  doc.text(currentDate, pageWidth - margin, footerY, { align: 'right' });

  // ============================================
  // Generar PDF como blob
  // ============================================
  
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

  const fileName = `${(routine.name || routine.title || 'rutina')
    .replace(/\s+/g, '_')
    .toLowerCase()}_mobile.pdf`;

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
