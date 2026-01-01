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
  
  // Márgenes y espaciados (optimizados para densidad)
  const margin = 8;
  const contentWidth = pageWidth - (margin * 2);
  
  // Sistema de ritmo vertical (8px system: 8/16/24/32)
  const spacing8 = 2.8;   // 8px
  const spacing16 = 5.6;  // 16px
  const spacing24 = 8.5;  // 24px
  const spacing32 = 11.3; // 32px
  const spacing40 = 14;   // 40px
  
  // Card styling
  const cardPadding = 6;
  const cardRadius = 6;
  const cardGap = 8.5; // 24px entre cards
  const cardMinHeight = 24;
  
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
  
  doc.setFontSize(28); // 28px
  doc.setTextColor(...textPrimary);
  doc.setFont('helvetica', 'bold');
  
  const routineTitle = routine.name || routine.title || 'Plan de Entrenamiento';
  const titleLines = doc.splitTextToSize(routineTitle, contentWidth);
  const finalTitleLines = titleLines.slice(0, 2); // Máximo 2 líneas
  
  doc.text(finalTitleLines, margin, yPos);
  yPos += (finalTitleLines.length * 10) + spacing16; // Margin-bottom: 16px

  // ============================================
  // METADATA (Agrupada, 13-14px, line-height 1.5)
  // ============================================
  
  doc.setFontSize(14); // 14px
  doc.setTextColor(...textSecondary);
  doc.setFont('helvetica', 'normal');
  
  const objective = routine.objective || 'Objetivo personalizado';
  const frequency = routine.frequency || 3;
  const subtitle = `${objective} • ${frequency} días por semana`;
  
  doc.text(subtitle, margin, yPos);
  yPos += 6; // Line-height 1.5 spacing

  // Metadatos secundarios
  doc.setFontSize(13); // 13px
  doc.setTextColor(...textSecondary);
  
  const level = routine.level || 'Intermedio';
  const duration = routine.durationWeeks || routine.weeks?.length || 4;
  const metadata = `Nivel: ${level} • Duración: ${duration} semanas`;
  
  doc.text(metadata, margin, yPos);
  yPos += 5; // Spacing dentro del bloque

  // Coach (si existe)
  if (routine.author || routine.coach) {
    doc.setFontSize(13);
    doc.setTextColor(...accent);
    doc.setFont('helvetica', 'bold');
    doc.text(`Coach: ${routine.author || routine.coach}`, margin, yPos);
    yPos += 5;
  }

  // Margin-bottom del bloque metadata: 24px
  yPos += spacing24;

  // ============================================
  // SECCIÓN "ÍNDICE"
  // Font-size: 16-18px, Font-weight: 600
  // Margin-top: 32px (ya aplicado), Margin-bottom: 12px
  // ============================================

  doc.setFontSize(18); // 18px
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
    
    // Padding Material Design: 16px vertical, 24px horizontal
    const weekCardPaddingV = 5.6;  // 16px
    const weekCardPaddingH = 8.5;  // 24px (Material Design)
    
    // Altura dinámica de la card
    const hasDescription = !!(week.summary || week.title);
    const cardHeight = hasDescription ? 38 : 32;
    
    // Verificar espacio
    checkPageSpace(cardHeight + spacing16);
    
    const cardY = yPos;
    
    // Dibujar card
    drawCard(margin, cardY, contentWidth, cardHeight, false);
    
    // Contenido centrado vertical y horizontalmente con padding Material Design
    const cardContentWidth = contentWidth - (weekCardPaddingH * 2);
    
    // Calcular altura total del contenido para centrar verticalmente
    const lineHeight = 6;
    let totalContentHeight = 14 * 0.35 * 1.3; // Título
    totalContentHeight += lineHeight; // Spacing después del título
    if (hasDescription) {
      totalContentHeight += 10 * 0.35 * 1.3; // Descripción
      totalContentHeight += 5; // Spacing
    }
    totalContentHeight += 9 * 0.35 * 1.3; // Días de entrenamiento
    
    // Posición Y inicial centrada
    let contentY = cardY + (cardHeight - totalContentHeight) / 2;
    
    // Título de semana (centrado)
    doc.setFontSize(14);
    doc.setTextColor(...accent);
    doc.setFont('helvetica', 'bold');
    const weekTitle = `SEMANA ${weekNum}`;
    const weekTitleWidth = doc.getTextWidth(weekTitle);
    const weekTitleX = margin + (contentWidth - weekTitleWidth) / 2; // Centrado
    doc.text(weekTitle, weekTitleX, contentY);
    contentY += lineHeight;
    
    // Descripción (si existe, centrada, max 1 línea)
    if (hasDescription) {
      doc.setFontSize(10);
      doc.setTextColor(...textSecondary);
      doc.setFont('helvetica', 'normal');
      
      const desc = week.summary || week.title;
      const descLines = doc.splitTextToSize(desc, cardContentWidth);
      const descText = descLines[0];
      const descWidth = doc.getTextWidth(descText);
      const descX = margin + (contentWidth - descWidth) / 2; // Centrado
      doc.text(descText, descX, contentY);
      contentY += 5;
    }
    
    // Días de entrenamiento (centrado)
    doc.setFontSize(9);
    doc.setTextColor(...textSecondary);
    const daysText = `${dayCount} día${dayCount !== 1 ? 's' : ''} de entrenamiento`;
    const daysWidth = doc.getTextWidth(daysText);
    const daysX = margin + (contentWidth - daysWidth) / 2; // Centrado
    doc.text(daysText, daysX, contentY);
    
    // Link clickeable (toda la card)
    doc.link(margin, cardY, contentWidth, cardHeight, { 
      pageNumber: weekPageMap[weekNum] 
    });
    
    // Margin-bottom: 12px entre items de semana
    yPos += cardHeight + spacing16;
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
      yPos = margin + spacing8;

      // ============================================
      // HEADER DEL DÍA (Estilo App)
      // ============================================

      // Badge discreto: Semana X
      doc.setFontSize(9);
      doc.setTextColor(...textSecondary);
      doc.setFont('helvetica', 'normal');
      doc.text(`Semana ${weekNum}`, margin, yPos);
      yPos += spacing8;

      // Nombre del plan (discreto)
      doc.setFontSize(8);
      doc.setTextColor(...textSecondary);
      const planName = (routine.name || routine.title || '').substring(0, 40);
      doc.text(planName, margin, yPos);
      yPos += spacing16;

      // Título del día (muy dominante)
      doc.setFontSize(20);
      doc.setTextColor(...textPrimary);
      doc.setFont('helvetica', 'bold');
      
      const dayTitle = day.name || `Día ${day.dayNumber || dayIndex + 1}`;
      const dayTitleLines = doc.splitTextToSize(dayTitle, contentWidth);
      doc.text(dayTitleLines, margin, yPos);
      yPos += (dayTitleLines.length * 8) + spacing16;

      // Separación clara antes del contenido
      doc.setDrawColor(...divider);
      doc.setLineWidth(0.3);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += spacing16;

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
          
          // Card Container Specs (Sin cambios)
          const cardPaddingVertical = 7;    // 20px ≈ 7mm
          const cardPaddingHorizontal = 8.5; // 24px ≈ 8.5mm
          const cardBorderRadius = 5.6;      // 16px ≈ 5.6mm
          
          // Spacing Specs (Mejorados para eliminar texto pegado)
          const titleMarginBottom = 5.6;     // 16px (respiración clara)
          const metricsGapHorizontal = 5.6;  // 16-20px gap entre métricas
          const notesMarginTop = 4.9;        // 14px antes de notas
          
          // Calcular ancho disponible
          const availableCardWidth = contentWidth - (cardPaddingHorizontal * 2);
          
          // ============================================
          // CÁLCULO DE ALTURA DE LA CARD
          // ============================================
          
          // Título del ejercicio (14pt - AÚN MÁS REDUCIDO, bold, line-height 1.3)
          const titleFontSize = 14; // pt (antes 16pt, original 20pt)
          const nameLines = doc.splitTextToSize(
            exercise.name || 'Ejercicio sin nombre',
            availableCardWidth
          );
          const titleLineHeight = (titleFontSize * 0.35) * 1.3; // pt to mm * line-height
          const titleHeight = nameLines.length * titleLineHeight;
          
          // Bloque de métricas (altura fija para consistencia)
          const metricsBlockHeight = 12; // Label + Value + spacing
          
          // Nota técnica (max 1 línea, 9pt - AÚN MÁS REDUCIDO)
          let notesHeight = 0;
          if (hasNotes) {
            const noteText = exercise.notes || exercise.note;
            const noteLines = doc.splitTextToSize(noteText, availableCardWidth);
            // Solo mostrar la primera línea
            const noteFontSize = 9; // pt (antes 11pt, original 13pt)
            notesHeight = (noteFontSize * 0.35) * 1.4; // pt to mm * line-height
          }
          
          // Altura total de la card
          const cardContentHeight = 
            cardPaddingVertical +              // Top padding (20px)
            titleHeight +                      // Título
            titleMarginBottom +                // Espacio después título (16px)
            metricsBlockHeight +               // Bloque de métricas
            (hasNotes ? notesMarginTop : 0) +  // Espacio antes de notas (14px)
            notesHeight +                      // Nota (si existe)
            cardPaddingVertical;               // Bottom padding (20px) - Simétrico
          
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
          
          let cardContentY = cardY + cardPaddingVertical;
          const cardContentX = margin + cardPaddingHorizontal;
          
          // ============================================
          // 1. TÍTULO DEL EJERCICIO (Jerarquía Principal)
          // Font-size AÚN MÁS REDUCIDO: 14pt (mucho menos invasivo)
          // Font-weight: 600-700, Margin-bottom: 16px
          // ============================================
          
          doc.setFontSize(14); // 14pt (antes 16pt, original 20pt - menos invasivo)
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
            
            // Label (11-12px, weight 400-500, reducir opacidad visual)
            doc.setFontSize(12); // 12pt
            doc.setTextColor(...textSecondary); // Opacidad visual reducida
            doc.setFont('helvetica', 'normal'); // Weight 400
            doc.text(metric.label, centerX, metricsY, { align: 'center' });
            
            // Valor (14-16px, weight 600, alto contraste)
            doc.setFontSize(16); // 16pt
            doc.setTextColor(...textPrimary); // Alto contraste
            doc.setFont('helvetica', 'bold'); // Weight 600
            doc.text(metric.value, centerX, metricsY + 6, { align: 'center' });
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
          // 4. TEXTO DESCRIPTIVO / NOTA TÉCNICA
          // Font-size: 13-14px, Weight: 400, Line-height: 1.4
          // Max 1 línea visible, Margin-top: 12-14px
          // ============================================
          
          if (hasNotes) {
            cardContentY += notesMarginTop;
            
            doc.setFontSize(9); // 9pt (antes 11pt, original 13pt - mucho menos invasivo)
            doc.setTextColor(...textSecondary);
            doc.setFont('helvetica', 'normal'); // Weight 400
            
            const noteText = exercise.notes || exercise.note;
            const noteLines = doc.splitTextToSize(noteText, availableCardWidth);
            
            // Solo mostrar primera línea (max 1 línea visible)
            doc.text(noteLines[0], cardContentX, cardContentY);
          }
          
          // Actualizar yPos para la siguiente card
          yPos += cardContentHeight + cardGap;
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
