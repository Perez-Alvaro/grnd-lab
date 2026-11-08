import jsPDF from 'jspdf';
import { buildExerciseVideoUrl } from '../lib/recipeSearch.js';

const normalizeUrlText = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

/**
 * Genera un PDF de una rutina de entrenamiento en formato MOBILE (A4 vertical)
 * Sistema visual 100% mobile-first con cards tipo app y flujo continuo Mynter-style
 * @param {Object} routine - Rutina completa con todos los detalles
 * @returns {Blob} - PDF generado como blob
 */
export const generateRoutinePDFMobile = (routine) => {
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
  const cardRadius = 6;
  const cardGap = 7; // Reducido de 8.5mm a 7mm

  // Colores del sistema (NO MODIFICAR)
  const textPrimary = [28, 28, 28];     // #1C1C1C
  const textSecondary = [110, 110, 110]; // #6E6E6E
  const accent = [46, 74, 95];           // #2E4A5F
  const divider = [224, 224, 224];       // #E0E0E0
  const bgLight = [250, 250, 250];       // #FAFAFA

  let yPos = 0;

  // Banda reservada al pie para el footer (evita que el contenido lo pise)
  const footerReserve = 8;
  const pageBottomLimit = pageHeight - margin - footerReserve;
  // Alto útil de una página completa de contenido
  const usablePageHeight = pageBottomLimit - margin;

  // ============================================
  // HELPER: Verificar espacio en página
  // ============================================
  const checkPageSpace = (requiredSpace) => {
    if (yPos + requiredSpace > pageBottomLimit) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  const currentPage = () => doc.internal.getCurrentPageInfo().pageNumber;

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

  // Resolver marca personal / coach y logo
  const cleanBrand = (val) => (typeof val === 'string' && val.trim().length > 0 ? val.trim() : null);
  const brandName =
    cleanBrand(routine.metadata?.brandName) ||
    cleanBrand(routine.brandName) ||
    cleanBrand(routine.metadata?.author) ||
    cleanBrand(routine.author) ||
    cleanBrand(routine.metadata?.coach) ||
    cleanBrand(routine.coach) ||
    (typeof window !== 'undefined' && cleanBrand(window?.localStorage?.getItem?.('mock:coach-brand-name'))) ||
    'Mock';

  const brandLogo =
    cleanBrand(routine.metadata?.brandLogo) ||
    cleanBrand(routine.brandLogo) ||
    (typeof window !== 'undefined' && cleanBrand(window?.localStorage?.getItem?.('mock:coach-brand-logo'))) ||
    null;

  // Padding top: 32-40px
  yPos = spacing40;

  // Logo de marca en portada móvil (si existe)
  if (brandLogo) {
    try {
      const logoW = 38;
      const logoH = 14;
      doc.addImage(brandLogo, 'PNG', margin, yPos, logoW, logoH);
      yPos += logoH + 4;
    } catch (_err) {
      void _err;
    }
  }

  // Marca personal / Coach destacada directamente sobre el título
  if (brandName) {
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.setFont('helvetica', 'bold');
    doc.text(brandName.toUpperCase(), margin, yPos);
    yPos += 7;
  }

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

  // Coach / Marca (si existe)
  if (brandName || routine.author || routine.coach) {
    doc.setFontSize(11); // Reducido de 13px a 11px
    doc.setTextColor(...accent);
    doc.setFont('helvetica', 'bold');
    doc.text(`Coach / Marca: ${brandName || routine.author || routine.coach}`, margin, yPos);
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

  // Links internos del índice: las páginas reales se conocen recién al renderizar
  // el contenido (un día puede ocupar más de una página), así que acá solo se
  // guardan los rectángulos de cada card y los links se agregan al final.
  const indexLinkRects = [];
  const weekStartPage = {};

  // Renderizar cards de semanas
  // Cada ítem: padding vertical 12-16px, margin-bottom 12px
  weeks.forEach((week, weekIndex) => {
    const weekNum = week.weekNumber || weekIndex + 1;
    const days = week.days || [];
    const dayCount = days.length;
    
    // Padding reducido
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
    
    // Link clickeable (toda la card) — se agrega al final, cuando ya se conoce
    // la página real de destino de cada semana.
    indexLinkRects.push({
      page: currentPage(),
      x: margin, y: cardY, w: contentWidth, h: cardHeight,
      weekNum,
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

      // Primera página de la semana → destino del link del índice
      if (weekStartPage[weekNum] === undefined) {
        weekStartPage[weekNum] = currentPage();
      }

      // ============================================
      // HEADER DEL DÍA (Estilo App) con Marca Personal
      // ============================================

      // Running header: Marca Personal y Semana
      doc.setFontSize(9);
      doc.setTextColor(...accent);
      doc.setFont('helvetica', 'bold');
      const headerBrand = brandName ? `${brandName.toUpperCase()} · Semana ${weekNum}` : `Semana ${weekNum}`;
      doc.text(headerBrand, margin, yPos);
      yPos += spacing8 + 2;  // Más espaciado

      // Nombre del plan (discreto)
      doc.setFontSize(8);
      doc.setTextColor(...textSecondary);
      doc.setFont('helvetica', 'normal');
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
      // ENTRADA EN CALOR (si existe)
      // ============================================

      const warmup = Array.isArray(day.warmupExercises) ? day.warmupExercises : [];
      if (warmup.length) {
        checkPageSpace(spacing24);
        doc.setFontSize(12);
        doc.setTextColor(...textPrimary);
        doc.setFont('helvetica', 'bold');
        doc.text('Entrada en calor', margin, yPos);
        yPos += spacing16;

        warmup.forEach((w) => {
          const wName = w.name || 'Ejercicio';
          const wDuration = w.duration || w.duracion || '';
          const header = wDuration ? `${wName}  ·  ${wDuration}` : wName;
          const headerLines = doc.splitTextToSize(header, contentWidth);
          const wNoteLines = w.notes
            ? doc.splitTextToSize(String(w.notes), contentWidth - 4)
            : [];
          const headerLineH = 4.2;
          const noteLineH = 3.8;
          checkPageSpace(headerLines.length * headerLineH + wNoteLines.length * noteLineH + 2);

          doc.setFontSize(10);
          doc.setTextColor(...textPrimary);
          doc.setFont('helvetica', 'bold');
          doc.text(headerLines, margin, yPos);
          yPos += headerLines.length * headerLineH;

          if (wNoteLines.length) {
            doc.setFontSize(9);
            doc.setTextColor(...textSecondary);
            doc.setFont('helvetica', 'normal');
            doc.text(wNoteLines, margin + 4, yPos);
            yPos += wNoteLines.length * noteLineH;
          }
          yPos += 2;
        });
        yPos += spacing16;
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

        blockExercises.forEach((exercise) => {
          
          // ============================================
          // ESPECIFICACIONES UX/UI RIGUROSAS
          // ============================================
          
          const videoUrl = buildExerciseVideoUrl(exercise);
          const hasVideo = !!videoUrl;
          const hasNotes = !!(exercise.notes || exercise.note);
          
          // Card Container Specs (Reducidos para cards más pequeñas)
          const cardPaddingVertical = 4;    // Reducido de 6mm a 4mm
          const cardPaddingHorizontal = 6; // Reducido de 7mm a 6mm
          const cardBorderRadius = 4;      // Reducido de 5.6mm a 4mm
          
          // Spacing Specs (reducidos)
          const titleMarginBottom = 3;     // Reducido de 5mm a 3mm
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
          
          // Notas del ejercicio (separador + etiqueta + contenido multilínea)
          const noteText = hasNotes ? (exercise.notes || exercise.note) : '';
          const noteLines = hasNotes ? doc.splitTextToSize(noteText, availableCardWidth) : [];
          const noteLineHeight = (10 * 0.35) * 1.4; // pt a mm * line-height
          const notesHeight = hasNotes
            ? 4 + 5 + (noteLines.length * noteLineHeight) // Separador (4mm) + etiqueta (5mm) + contenido
            : 0;
          
          // Altura total de la card (compacta)
          const cardContentHeight = 
            cardPaddingVertical +              // Top padding
            titleHeight +                      // Título
            titleMarginBottom +                // Espacio después título
            metricsBlockHeight +               // Bloque de métricas
            (hasNotes ? notesMarginTop : 0) +  // Espacio antes de notas
            notesHeight +                      // Nota (si existe)
            cardPaddingVertical;               // Bottom padding
          
          // Si la card completa no entra ni en una página entera, se dibuja la
          // card solo con título + métricas y las notas fluyen debajo con salto
          // de página por línea (nunca se dibuja fuera de la hoja).
          const headerOnlyHeight =
            cardPaddingVertical + titleHeight + titleMarginBottom +
            metricsBlockHeight + cardPaddingVertical;
          const fitsInOnePage = cardContentHeight <= usablePageHeight;
          const boxHeight = fitsInOnePage ? cardContentHeight : headerOnlyHeight;

          // Verificar espacio en página
          checkPageSpace(boxHeight + cardGap);

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
            boxHeight,
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
          
          if (hasVideo && videoUrl) {
            const normalized = normalizeUrlText(videoUrl);
            if (normalized) {
              // textWithLink dibuja SOLO la etiqueta y la hace clickeable
              // (nunca la URL cruda), alineada a la derecha de la card.
              doc.setFontSize(8);
              doc.setTextColor(...accent);
              doc.setFont('helvetica', 'bold');

              const videoLinkText = 'VER VIDEO';
              const linkWidth = doc.getTextWidth(videoLinkText);
              const linkX = cardContentX + availableCardWidth - linkWidth;
              const linkY = metricsY + 2;

              doc.textWithLink(videoLinkText, linkX, linkY, { url: normalized });
            }
          }
          
          cardContentY += metricsBlockHeight;
          
          // ============================================
          // 4. NOTAS DEL EJERCICIO (Fila separada)
          // Font-size: 10px, Weight: 400, Line-height: 1.4
          // Separador visual + etiqueta clara
          // ============================================
          
          if (hasNotes && fitsInOnePage) {
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

            // Contenido de la nota (todas las líneas, ya entra en la card)
            doc.setFontSize(10);
            doc.setTextColor(...textSecondary);
            doc.setFont('helvetica', 'normal');
            doc.text(noteLines, cardContentX, cardContentY);
          }

          if (fitsInOnePage) {
            // Actualizar yPos para la siguiente card
            yPos += cardContentHeight + cardGap - 2;  // -2mm para cards más juntas
          } else {
            // Notas fuera de la card, fluyendo con saltos de página por línea
            yPos = cardY + boxHeight + notesMarginTop + 2;

            checkPageSpace(10);
            doc.setFontSize(10);
            doc.setTextColor(...accent);
            doc.setFont('helvetica', 'bold');
            doc.text('Notas:', cardContentX, yPos);
            yPos += 5;

            doc.setFontSize(10);
            doc.setTextColor(...textSecondary);
            doc.setFont('helvetica', 'normal');
            noteLines.forEach((ln) => {
              checkPageSpace(noteLineHeight);
              doc.text(ln, cardContentX, yPos);
              yPos += noteLineHeight;
            });
            yPos += cardGap - 2;
          }
        });
      });
    });
  });

  // ============================================
  // Footer discreto (en todas las páginas)
  // ============================================

  const footerY = pageHeight - margin;
  const currentDate = new Date().toLocaleDateString('es-AR');
  const totalPages = doc.internal.getNumberOfPages();

  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(...textSecondary);
    doc.setFont('helvetica', 'italic');
    const footerText = brandName && brandName !== 'Mock' ? `${brandName} · Generado por Mock` : 'Generado por Mock';
    doc.text(footerText, margin, footerY);
    doc.text(currentDate, pageWidth - margin, footerY, { align: 'right' });
  }

  // ============================================
  // Links del índice (con las páginas reales de cada semana)
  // ============================================

  indexLinkRects.forEach((rect) => {
    const targetPage = weekStartPage[rect.weekNum];
    if (!targetPage) return;
    doc.setPage(rect.page);
    doc.link(rect.x, rect.y, rect.w, rect.h, { pageNumber: targetPage });
  });

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
