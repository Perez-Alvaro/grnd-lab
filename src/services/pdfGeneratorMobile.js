import jsPDF from "jspdf";
import { getPdfDesignSystem, hexToRgb } from "../pdf-design-system/index.js";

const formatValue = (value) =>
  value === 0 || value ? String(value) : "—";

const resolveValue = (source, keys) => {
  const hasKey = keys.some((key) => Object.prototype.hasOwnProperty.call(source, key));
  const value = keys.reduce(
    (found, key) => (found !== undefined ? found : source?.[key]),
    undefined,
  );

  return {
    exists: hasKey || value !== undefined,
    value: formatValue(value),
  };
};

const resolveNotes = (source) => {
  const keys = ["notes", "note", "notas"];
  const hasKey = keys.some((key) => Object.prototype.hasOwnProperty.call(source, key));
  const raw = keys.reduce(
    (found, key) => (found !== undefined ? found : source?.[key]),
    undefined,
  );

  if (Array.isArray(raw)) {
    const merged = raw.filter(Boolean).join(" • ");
    return {
      exists: hasKey || raw.length > 0,
      value: merged || "—",
    };
  }

  return {
    exists: hasKey || raw !== undefined,
    value: formatValue(raw),
  };
};

const resolveVideo = (source) => {
  const keys = ["videoUrl", "video", "youtubeLink"];
  const hasKey = keys.some((key) => Object.prototype.hasOwnProperty.call(source, key));
  const url = keys.reduce(
    (found, key) => (found !== undefined ? found : source?.[key]),
    undefined,
  );

  return {
    exists: hasKey || Boolean(url),
    url: url || "",
  };
};

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const drawRoundedCard = (doc, config) => {
  const { x, y, width, height, radius, fill, border, borderWidth } = config;
  doc.setFillColor(...fill);
  doc.setDrawColor(...border);
  doc.setLineWidth(borderWidth);
  doc.roundedRect(x, y, width, height, radius, radius, "FD");
};

const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.filter(Boolean).map(String);
  return String(tags)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const addCoverImage = (doc, imageData, x, y, width, height) => {
  if (!imageData || typeof imageData !== "string" || !imageData.startsWith("data:")) {
    return 0;
  }

  const format = imageData.split(";")[0].split("/")[1] || "JPEG";
  try {
    doc.addImage(imageData, format.toUpperCase(), x, y, width, height, undefined, "FAST");
    return height;
  } catch (error) {
    console.warn("No se pudo renderizar la imagen de portada", error);
    return 0;
  }
};

/**
 * Genera un PDF de una rutina de entrenamiento en formato MOBILE (estilo Mynter)
 * Diseño oscuro con tarjetas tipo Mynter - Exacto a la imagen de referencia
 * @param {Object} routine - Rutina completa con todos los detalles
 * @param {Object} purchaseInfo - Información de la compra (usuario, fecha, etc)
 * @returns {Blob} - PDF generado como blob
 */
export const generateRoutinePDFMobile = (routine, purchaseInfo = {}) => {
  const doc = new jsPDF();
  const design = getPdfDesignSystem({ variant: "mobile" });
  const { colors, spacing, typography, cards } = design;
  const { sizes } = typography;

  // Configuración
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = spacing.pageMargin;
  let yPos = margin;
  const pagePadding = spacing.cardPadding;
  const cardRadius = cards.elevatedRadius;
  const cardBorderWidth = cards.borderWidth;
  const cardGap = spacing.cardGap;
  const sectionGap = spacing.sectionGap;

  // Colores
  const background = hexToRgb(colors.background);
  const surface = hexToRgb(colors.surface);
  const accent = hexToRgb(colors.accent);
  const accentStrong = hexToRgb(colors.accentStrong);
  const textPrimary = hexToRgb(colors.text);
  const textSecondary = hexToRgb(colors.textSecondary);
  const border = hexToRgb(colors.borderLight);

  const routineTitle =
    routine.name || routine.title || routine.planName || "Plan de Entrenamiento";
  const routineObjective = routine.objective || "";
  const routineFrequency = routine.frequency || "";
  const routineDuration = routine.durationWeeks || routine.duration || "";
  const routineLevel = routine.level || "";
  const routineGender = routine.gender || routine.genre || "";
  const routineCoach = routine.author || routine.coach || routine.user || "";
  const routineEquipment = routine.equipment || "";
  const routinePrice = routine.price || "";
  const routineNotes = routine.notes || "";
  const routineTags = parseTags(routine.tags);
  const routineImage = routine.image || routine.imagen || routine.cover || "";

  // ============================================
  // PORTADA CON ÍNDICE DE SEMANAS CLICKEABLE
  // ============================================

  // Fondo oscuro de toda la página
  doc.setFillColor(...background);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  yPos = margin + sectionGap;

  // Imagen de portada (si existe)
  if (routineImage) {
    const imageHeight = 46;
    const imageWidth = pageWidth - 2 * margin;
    const renderedHeight = addCoverImage(
      doc,
      routineImage,
      margin,
      yPos,
      imageWidth,
      imageHeight,
    );
    if (renderedHeight) {
      yPos += renderedHeight + spacing.mediaGap;
    }
  }

  // Título de la rutina
  doc.setFontSize(sizes.display);
  doc.setTextColor(...textPrimary);
  doc.setFont("helvetica", "bold");
  const routineNameLines = doc.splitTextToSize(
    routineTitle,
    pageWidth - 2 * margin,
  );
  doc.text(routineNameLines, margin, yPos);
  yPos += routineNameLines.length * (sizes.display * 0.45) + spacing.rowGap;

  // Info del plan
  doc.setFontSize(sizes.bodySmall);
  doc.setTextColor(...accent);
  doc.setFont("helvetica", "normal");
  const planInfo = [routineObjective, routineFrequency]
    .filter(Boolean)
    .join(" • ");
  if (planInfo) {
    doc.text(planInfo, margin, yPos);
    yPos += sizes.bodySmall + 4;
  }

  // Nivel y duración
  doc.setFontSize(sizes.label);
  doc.setTextColor(...textSecondary);
  const secondaryInfo = [
    routineLevel ? `Nivel: ${routineLevel}` : null,
    routineDuration ? `Duración: ${routineDuration}` : null,
  ]
    .filter(Boolean)
    .join(" • ");
  if (secondaryInfo) {
    doc.text(secondaryInfo, margin, yPos);
    yPos += sizes.label + 6;
  }

  if (routineCoach) {
    doc.setFontSize(sizes.label);
    doc.setTextColor(...accent);
    doc.setFont("helvetica", "bold");
    doc.text("COACH", margin, yPos);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textPrimary);
    doc.text(routineCoach, margin + 24, yPos);
    yPos += sizes.label + 6;
  }

  yPos += spacing.rowGap;

  const metadataItems = [
    { label: "Objetivo", value: routineObjective },
    { label: "Frecuencia", value: routineFrequency },
    { label: "Duración", value: routineDuration },
    { label: "Género", value: routineGender },
    { label: "Nivel", value: routineLevel },
    { label: "Equipo", value: routineEquipment },
    { label: "Precio", value: routinePrice },
  ].filter((item) => item.value);

  if (metadataItems.length) {
    const cardWidth = (pageWidth - 2 * margin - spacing.columnGap) / 2;
    const cardsPerRow = 2;

    chunkArray(metadataItems, cardsPerRow).forEach((rowItems) => {
      const heights = rowItems.map((item) => {
        const valueLines = doc.splitTextToSize(
          String(item.value),
          cardWidth - pagePadding * 2,
        );
        return (
          pagePadding * 1.5 +
          sizes.label +
          4 +
          valueLines.length * (sizes.bodySmall + 2)
        );
      });
      const rowHeight = Math.max(...heights, 24);

      rowItems.forEach((item, idx) => {
        const x = margin + idx * (cardWidth + spacing.columnGap);
        drawRoundedCard(doc, {
          x,
          y: yPos,
          width: cardWidth,
          height: rowHeight,
          radius: cards.radius,
          fill: surface,
          border,
          borderWidth: cardBorderWidth,
        });

        doc.setFontSize(sizes.label);
        doc.setTextColor(...accent);
        doc.setFont("helvetica", "bold");
        doc.text(item.label.toUpperCase(), x + pagePadding, yPos + pagePadding + 4);

        doc.setFontSize(sizes.bodySmall);
        doc.setTextColor(...textPrimary);
        doc.setFont("helvetica", "normal");
        const valueLines = doc.splitTextToSize(
          String(item.value),
          cardWidth - pagePadding * 2,
        );
        doc.text(
          valueLines,
          x + pagePadding,
          yPos + pagePadding + sizes.label + 8,
        );
      });

      yPos += rowHeight + spacing.rowGap;
    });
  }

  if (routineTags.length) {
    doc.setFontSize(sizes.label);
    doc.setTextColor(...accent);
    doc.setFont("helvetica", "bold");
    doc.text("TAGS", margin, yPos);
    yPos += sizes.label + 4;

    let tagX = margin;
    let tagY = yPos;
    routineTags.forEach((tag) => {
      const tagText = `#${tag}`;
      const tagWidth = doc.getTextWidth(tagText) + 10;
      if (tagX + tagWidth > pageWidth - margin) {
        tagX = margin;
        tagY += sizes.label + 6;
      }
      drawRoundedCard(doc, {
        x: tagX,
        y: tagY - sizes.label + 1,
        width: tagWidth,
        height: sizes.label + 6,
        radius: 6,
        fill: surface,
        border: accentStrong,
        borderWidth: 0.6,
      });
      doc.setTextColor(...accent);
      doc.setFont("helvetica", "normal");
      doc.text(tagText, tagX + 5, tagY + 2);
      tagX += tagWidth + 6;
    });
    yPos = tagY + sizes.label + spacing.rowGap;
  }

  if (routineNotes) {
    const notesTitle = "Notas generales";
    doc.setFontSize(sizes.bodySmall);
    doc.setTextColor(...accent);
    doc.setFont("helvetica", "bold");
    doc.text(notesTitle.toUpperCase(), margin, yPos);
    yPos += sizes.bodySmall + 4;

    doc.setFontSize(sizes.bodySmall);
    doc.setTextColor(...textSecondary);
    doc.setFont("helvetica", "normal");
    const noteLines = doc.splitTextToSize(routineNotes, pageWidth - 2 * margin);
    doc.text(noteLines, margin, yPos);
    yPos += noteLines.length * (sizes.bodySmall + 2) + spacing.rowGap;
  }

  // ÍNDICE DE SEMANAS
  doc.setFontSize(sizes.sectionTitle);
  doc.setTextColor(...textPrimary);
  doc.setFont("helvetica", "bold");
  doc.text("ÍNDICE DE SEMANAS", margin, yPos);
  yPos += sizes.sectionTitle + 6;

  const weeks = routine.weeks || [];

  // Crear un mapa de páginas para los links (calcularemos las páginas dinámicamente)
  const weekPageMap = {};
  let currentPage = 2; // La portada es página 1, contenido empieza en 2

  weeks.forEach((week, weekIndex) => {
    const weekNum = week.weekNumber || week.number || weekIndex + 1;
    weekPageMap[weekNum] = currentPage;

    // Calcular páginas que ocupará esta semana (1 página por día aproximadamente)
    const days = week.days || [];
    currentPage += days.length || 1;
  });

  weeks.forEach((week, weekIndex) => {
    const weekNum = week.weekNumber || week.number || weekIndex + 1;
    const cardHeight = 32;

    if (yPos > pageHeight - 40) {
      doc.addPage();
      doc.setFillColor(...background);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      yPos = margin + 8;
    }

    drawRoundedCard(doc, {
      x: margin,
      y: yPos,
      width: pageWidth - 2 * margin,
      height: cardHeight,
      radius: cards.radius,
      fill: surface,
      border: accentStrong,
      borderWidth: cardBorderWidth,
    });

    doc.setFontSize(sizes.body);
    doc.setTextColor(...accent);
    doc.setFont("helvetica", "bold");
    doc.text(`SEMANA ${weekNum}`, margin + pagePadding, yPos + 11);

    if (week.summary || week.title) {
      doc.setFontSize(sizes.label);
      doc.setTextColor(...textSecondary);
      doc.setFont("helvetica", "normal");
      const desc = week.summary || week.title;
      const descLines = doc.splitTextToSize(
        desc,
        pageWidth - 2 * margin - pagePadding * 2,
      );
      const linesToShow = Math.min(descLines.length, 2);
      for (let i = 0; i < linesToShow; i += 1) {
        doc.text(descLines[i], margin + pagePadding, yPos + 14 + i * 4);
      }
    }

    const dayCount = (week.days || []).length;
    doc.setFontSize(sizes.label);
    doc.setTextColor(...textPrimary);
    doc.text(
      `${dayCount} día${dayCount !== 1 ? "s" : ""} de entrenamiento`,
      margin + pagePadding,
      yPos + 25,
    );

    doc.link(margin, yPos, pageWidth - 2 * margin, cardHeight, {
      pageNumber: weekPageMap[weekNum],
    });

    yPos += cardHeight + cardGap;
  });

  yPos += spacing.rowGap;
  doc.setFontSize(sizes.label);
  doc.setTextColor(...textSecondary);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Toca sobre cada semana para ir directamente a su contenido",
    margin,
    yPos,
  );

  // ============================================
  // CONTENIDO: DÍAS Y EJERCICIOS
  // ============================================

  weeks.forEach((week, weekIndex) => {
    const days = week.days || [];

    days.forEach((day, dayIndex) => {
      doc.addPage();
      doc.setFillColor(...background);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      yPos = margin;

      doc.setFontSize(sizes.label);
      doc.setTextColor(...textSecondary);
      doc.setFont("helvetica", "normal");
      doc.text(`Semana ${week.weekNumber || week.number || weekIndex + 1}`, margin, yPos);
      yPos += sizes.label + 4;

      doc.setFontSize(sizes.body);
      doc.setTextColor(...textPrimary);
      doc.setFont("helvetica", "bold");
      doc.text(routineTitle, margin, yPos);
      yPos += sizes.body + 4;

      const subtitle = [routineGender, routineFrequency]
        .filter(Boolean)
        .join(" • ");
      if (subtitle) {
        doc.setFontSize(sizes.label);
        doc.setTextColor(...textSecondary);
        doc.setFont("helvetica", "normal");
        doc.text(subtitle, margin, yPos);
        yPos += sizes.label + sectionGap * 0.4;
      } else {
        yPos += sectionGap * 0.4;
      }

      doc.setFontSize(sizes.title);
      doc.setTextColor(...accent);
      doc.setFont("helvetica", "bold");
      doc.text(day.name || `Día ${day.dayNumber || dayIndex + 1}`, margin, yPos);
      yPos += sizes.title * 0.6 + spacing.rowGap;

      doc.setFontSize(sizes.body);
      doc.setTextColor(...textPrimary);
      doc.setFont("helvetica", "bold");
      doc.text("Entrenamiento principal", margin, yPos);
      yPos += sectionGap * 0.6;

      if (day.type === "DESCANSO") {
        const restCardHeight = 28;
        drawRoundedCard(doc, {
          x: margin,
          y: yPos,
          width: pageWidth - 2 * margin,
          height: restCardHeight,
          radius: cardRadius,
          fill: surface,
          border: accentStrong,
          borderWidth: cardBorderWidth,
        });
        doc.setFontSize(sizes.bodySmall);
        doc.setTextColor(...textSecondary);
        doc.setFont("helvetica", "italic");
        doc.text("Día de descanso activo", margin + pagePadding, yPos + 16);
        yPos += restCardHeight + cardGap;
        return;
      }

      const exercises = day.exercises || [];

      exercises.forEach((exercise) => {
        const normalized = {
          name: exercise.name || exercise.nombre || exercise.ejercicio || "Ejercicio",
          series: resolveValue(exercise, ["series", "sets"]),
          reps: resolveValue(exercise, ["reps"]),
          rest: resolveValue(exercise, ["descanso", "rest"]),
          duration: resolveValue(exercise, ["duracion", "duration"]),
          cadence: resolveValue(exercise, ["cadencia", "tempo"]),
          rir: resolveValue(exercise, ["rir", "rpe"]),
          notes: resolveNotes(exercise),
          video: resolveVideo(exercise),
        };

        const hasNotes = normalized.notes.exists;
        const hasVideo = normalized.video.url;
        const nameLines = doc.splitTextToSize(
          normalized.name,
          pageWidth - 2 * margin - pagePadding * 2,
        );
        const noteLines = hasNotes
          ? doc.splitTextToSize(
              normalized.notes.value,
              pageWidth - 2 * margin - pagePadding * 2,
            )
          : [];

        const baseCardHeight = 42 + nameLines.length * (sizes.bodySmall * 0.6);
        const notesHeight = hasNotes
          ? noteLines.length * (sizes.bodySmall * 0.6) + 6
          : 0;
        const videoHeight = hasVideo ? 10 : 0;
        const cardHeight = baseCardHeight + notesHeight + videoHeight;

        if (yPos > pageHeight - cardHeight - margin) {
          doc.addPage();
          doc.setFillColor(...background);
          doc.rect(0, 0, pageWidth, pageHeight, "F");
          yPos = margin;
        }

        drawRoundedCard(doc, {
          x: margin,
          y: yPos,
          width: pageWidth - 2 * margin,
          height: cardHeight,
          radius: cardRadius,
          fill: surface,
          border: accentStrong,
          borderWidth: cardBorderWidth,
        });

        let cardYPos = yPos + pagePadding;

        doc.setFontSize(sizes.body);
        doc.setTextColor(...textPrimary);
        doc.setFont("helvetica", "bold");
        doc.text(nameLines, margin + pagePadding, cardYPos + sizes.body);
        cardYPos += nameLines.length * (sizes.bodySmall * 0.9) + 10;

        const detailFields = [
          { label: "Series", value: normalized.series.value },
          { label: "Reps", value: normalized.reps.value },
          { label: "Desc", value: normalized.rest.value },
          { label: "Dur", value: normalized.duration.value },
          { label: "Cad", value: normalized.cadence.value },
          { label: "RIR", value: normalized.rir.value },
        ];

        const columnsPerRow = 3;
        const detailsX = margin + pagePadding;
        const detailsWidth = pageWidth - 2 * margin - pagePadding * 2;
        const detailSpacing = detailsWidth / columnsPerRow;

        const renderDetailRow = (rowFields) => {
          doc.setFontSize(sizes.label);
          doc.setTextColor(...textSecondary);
          doc.setFont("helvetica", "normal");
          rowFields.forEach((detail, idx) => {
            const x = detailsX + idx * detailSpacing;
            doc.text(detail.label, x, cardYPos);
          });

          cardYPos += sizes.label + 2;

          doc.setFontSize(sizes.bodySmall);
          doc.setTextColor(...textPrimary);
          doc.setFont("helvetica", "bold");
          rowFields.forEach((detail, idx) => {
            const x = detailsX + idx * detailSpacing;
            doc.text(detail.value, x, cardYPos);
          });

          cardYPos += sizes.bodySmall + 6;
        };

        const rows = chunkArray(detailFields, columnsPerRow);
        rows.forEach(renderDetailRow);

        if (hasNotes) {
          doc.setFontSize(sizes.label);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(...textSecondary);
          doc.text(noteLines, margin + pagePadding, cardYPos);
          cardYPos += noteLines.length * (sizes.bodySmall * 0.6) + 4;
        }

        if (hasVideo) {
          const buttonText = "Ver video";
          doc.setFontSize(sizes.label);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...accent);
          const buttonWidth = doc.getTextWidth(buttonText) + 14;
          const buttonHeight = sizes.label + 6;
          drawRoundedCard(doc, {
            x: margin + pagePadding,
            y: cardYPos - 2,
            width: buttonWidth,
            height: buttonHeight,
            radius: 6,
            fill: background,
            border: accentStrong,
            borderWidth: 0.6,
          });
          doc.text(buttonText, margin + pagePadding + 6, cardYPos + sizes.label / 2);
          doc.link(margin + pagePadding, cardYPos - 2, buttonWidth, buttonHeight, {
            url: normalized.video.url,
          });
          cardYPos += buttonHeight + 2;
        }

        yPos += cardHeight + cardGap;
      });
    });
  });

  // ============================================
  // ÚLTIMA PÁGINA: CONSEJOS
  // ============================================

  doc.addPage();

  doc.setFillColor(...background);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  yPos = margin + sectionGap;

  doc.setFontSize(sizes.sectionTitle);
  doc.setTextColor(...accent);
  doc.setFont("helvetica", "bold");
  doc.text("Consejos Importantes", margin, yPos);
  yPos += sizes.sectionTitle + 8;

  doc.setFontSize(sizes.bodySmall);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textPrimary);

  const tips = [
    "Registra tus cargas y progresiones semanalmente",
    "Mantén una hidratación adecuada durante el entrenamiento",
    "Asegura un consumo proteico adecuado para la recuperación",
    "Prioriza 7-9 horas de sueño de calidad",
    "Incluye trabajo de movilidad y estiramiento regular",
    "Si sientes dolor, consulta con un profesional",
    "El progreso requiere consistencia y paciencia",
  ];

  tips.forEach((tip) => {
    const tipLines = doc.splitTextToSize(`• ${tip}`, pageWidth - 2 * margin);
    doc.text(tipLines, margin, yPos);
    yPos += tipLines.length * (sizes.bodySmall + 2) + 2;
  });

  yPos += spacing.rowGap;

  if (purchaseInfo.userName || purchaseInfo.purchaseDate) {
    doc.setFontSize(sizes.label);
    doc.setTextColor(...textSecondary);
    doc.setFont("helvetica", "normal");

    if (purchaseInfo.userName) {
      doc.text(`Cliente: ${purchaseInfo.userName}`, margin, yPos);
      yPos += sizes.label + 4;
    }

    if (purchaseInfo.purchaseDate) {
      const date = new Date(purchaseInfo.purchaseDate).toLocaleDateString("es-AR");
      doc.text(`Fecha de compra: ${date}`, margin, yPos);
      yPos += sizes.label + 4;
    }

    yPos += sizes.label + 4;
  }

  yPos = pageHeight - 12;
  doc.setFontSize(sizes.micro);
  doc.setTextColor(...textSecondary);
  doc.setFont("helvetica", "italic");
  doc.text("Generado por Grind-Lab", margin, yPos);

  const pdfBlob = doc.output("blob");
  return pdfBlob;
};

/**
 * Descarga el PDF Mobile generado directamente en el navegador
 * @param {Object} routine - Rutina completa
 * @param {Object} purchaseInfo - Información de compra
 */
export const downloadRoutinePDFMobile = (routine, purchaseInfo = {}) => {
  const pdfBlob = generateRoutinePDFMobile(routine, purchaseInfo);

  const fileName = `${(routine.name || routine.title || "rutina").replace(/\s+/g, "_")}_mobile.pdf`;

  // Crear link de descarga
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement("a");
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
