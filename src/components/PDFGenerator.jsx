import jsPDF from 'jspdf';

export const generateMobilePDF = (template, userInfo = null) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [210, 297] // A4 size
  });

  // Colors
  const primaryColor = [203, 255, 0]; // #CBFF00
  const darkColor = [45, 45, 45]; // #2D2D2D
  const grayColor = [120, 120, 120]; // #787878
    const genderLabel = { male: 'MASCULINO', female: 'FEMENINO' };
    const objectiveLabel = { volume: 'VOLUMEN', fat_loss: 'PÉRDIDA DE GRASA' };

  // Mobile-optimized layout
  const margin = 15;
  const pageWidth = 210;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Header
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 25, 'F');
  
  pdf.setTextColor(...darkColor);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FitPlan Selector', margin, 15);
  
  yPosition = 35;

  // Template Title
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text(template.name, margin, yPosition);
  yPosition += 10;

  // Template Info
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...grayColor);
  
  const infoText = `${genderLabel[template.gender]} • ${template.frequency} DÍAS/SEMANA • ${objectiveLabel[template.objective]}`;
  pdf.text(infoText, margin, yPosition);
  yPosition += 15;

  // User Info (if provided)
  if (userInfo) {
    pdf.setFillColor(248, 254, 159, 0.1); // Light background
    pdf.rect(margin, yPosition - 5, contentWidth, 20, 'F');
    
    pdf.setTextColor(...darkColor);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PERSONALIZADO PARA:', margin + 5, yPosition + 3);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${userInfo.firstName} ${userInfo.lastName} (${userInfo.email})`, margin + 5, yPosition + 10);
    yPosition += 25;
  }

  // Notes Section
  if (template.notes) {
    pdf.setFillColor(...primaryColor);
    pdf.rect(margin, yPosition, contentWidth, 8, 'F');
    
    pdf.setTextColor(...darkColor);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('NOTAS DE ENTRENAMIENTO', margin + 3, yPosition + 5);
    yPosition += 15;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const notesLines = pdf.splitTextToSize(template.notes, contentWidth - 10);
    notesLines.forEach(line => {
      pdf.text(line, margin + 5, yPosition);
      yPosition += 5;
    });
    yPosition += 10;
  }

  // Exercises Section
  pdf.setFillColor(...primaryColor);
  pdf.rect(margin, yPosition, contentWidth, 8, 'F');
  
  pdf.setTextColor(...darkColor);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PROGRAMA DE EJERCICIOS', margin + 3, yPosition + 5);
  yPosition += 15;

  template.exercises.forEach((exercise, index) => {
    // Check if we need a new page
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = margin;
    }

    // Exercise card background
    pdf.setFillColor(245, 245, 245);
    pdf.rect(margin, yPosition - 3, contentWidth, 20, 'F');
    
    // Exercise number
    pdf.setFillColor(...darkColor);
    pdf.circle(margin + 8, yPosition + 5, 6, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text((index + 1).toString(), margin + 6, yPosition + 7);

    // Exercise name
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(exercise.name, margin + 20, yPosition + 3);

    // Sets and reps
    pdf.setTextColor(...grayColor);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${exercise.sets} × ${exercise.reps}`, pageWidth - margin - 30, yPosition + 3);

    // Exercise notes
    if (exercise.notes) {
      pdf.setTextColor(...grayColor);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const exerciseNotesLines = pdf.splitTextToSize(exercise.notes, contentWidth - 25);
      let noteY = yPosition + 10;
      exerciseNotesLines.forEach(line => {
        pdf.text(line, margin + 20, noteY);
        noteY += 4;
      });
    }

    yPosition += 25;
  });

  // Footer
  if (yPosition > 250) {
    pdf.addPage();
    yPosition = margin;
  }

  yPosition = 280;
  pdf.setFillColor(...darkColor);
  pdf.rect(0, yPosition, pageWidth, 17, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Generado por FitPlan Selector', margin, yPosition + 8);
  pdf.text(new Date().toLocaleDateString(), pageWidth - margin - 30, yPosition + 8);

  if (template.youtubeLink) {
    pdf.text('Video: ' + template.youtubeLink, margin, yPosition + 13);
  }

  return pdf;
};

export const generateDesktopPDF = (template, userInfo = null) => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [297, 210] // A4 landscape
  });

  // Colors
  const primaryColor = [203, 255, 0]; // #CBFF00
  const darkColor = [45, 45, 45]; // #2D2D2D
  const grayColor = [120, 120, 120]; // #787878
  const genderLabel = { male: 'MASCULINO', female: 'FEMENINO' };
  const objectiveLabel = { volume: 'VOLUMEN', fat_loss: 'PÉRDIDA DE GRASA' };

  // Desktop layout with more space
  const margin = 20;
  const pageWidth = 297;
  const pageHeight = 210;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Header with logo area
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 35, 'F');
  
  pdf.setTextColor(...darkColor);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FitPlan Selector', margin, 20);

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Rutina de Fitness Profesional', margin, 28);

  yPosition = 50;

  // Two-column layout
  const leftColumnWidth = (contentWidth * 0.6) - 10;
  const rightColumnWidth = (contentWidth * 0.4) - 10;
  const rightColumnX = margin + leftColumnWidth + 20;

  // Left Column - Main Content
  // Template Title
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text(template.name, margin, yPosition);
  yPosition += 15;

  // Template Info Bar
  pdf.setFillColor(240, 240, 240);
  pdf.rect(margin, yPosition - 5, leftColumnWidth, 12, 'F');
  
  pdf.setTextColor(...grayColor);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${genderLabel[template.gender]} • ${template.frequency} DÍAS/SEMANA • ${objectiveLabel[template.objective]}`, margin + 5, yPosition + 3);
  yPosition += 20;

  // Exercises in a table format
  pdf.setFillColor(...darkColor);
  pdf.rect(margin, yPosition, leftColumnWidth, 10, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PROGRAMA DE EJERCICIOS', margin + 5, yPosition + 6);
  yPosition += 15;

  // Table headers
  pdf.setFillColor(220, 220, 220);
  pdf.rect(margin, yPosition, leftColumnWidth, 8, 'F');
  
  pdf.setTextColor(...darkColor);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('#', margin + 3, yPosition + 5);
  pdf.text('EJERCICIO', margin + 15, yPosition + 5);
  pdf.text('SERIES', margin + leftColumnWidth - 40, yPosition + 5);
  pdf.text('REPS', margin + leftColumnWidth - 20, yPosition + 5);
  yPosition += 12;

  template.exercises.forEach((exercise, index) => {
    // Alternating row colors
    if (index % 2 === 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(margin, yPosition - 2, leftColumnWidth, 12, 'F');
    }

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    // Exercise number
    pdf.setFont('helvetica', 'bold');
    pdf.text((index + 1).toString(), margin + 5, yPosition + 4);
    
    // Exercise name
    pdf.setFont('helvetica', 'normal');
    pdf.text(exercise.name, margin + 15, yPosition + 4);
    
    // Sets and reps
    pdf.setFont('helvetica', 'bold');
    pdf.text(exercise.sets.toString(), margin + leftColumnWidth - 37, yPosition + 4);
    pdf.text(exercise.reps, margin + leftColumnWidth - 17, yPosition + 4);

    yPosition += 12;

    // Exercise notes (if any)
    if (exercise.notes) {
      pdf.setTextColor(...grayColor);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'italic');
      const noteLines = pdf.splitTextToSize(exercise.notes, leftColumnWidth - 20);
      noteLines.forEach(line => {
        pdf.text(line, margin + 15, yPosition);
        yPosition += 4;
      });
      yPosition += 4;
    }
  });

  // Right Column - Additional Info
  let rightY = 50;

  // User Info Box
  if (userInfo) {
    pdf.setFillColor(...primaryColor);
    pdf.rect(rightColumnX, rightY, rightColumnWidth, 8, 'F');
    
    pdf.setTextColor(...darkColor);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PERSONALIZADO PARA', rightColumnX + 5, rightY + 5);
    rightY += 15;

    pdf.setFillColor(248, 254, 159, 0.2);
    pdf.rect(rightColumnX, rightY, rightColumnWidth, 25, 'F');
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${userInfo.firstName} ${userInfo.lastName}`, rightColumnX + 5, rightY + 8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(userInfo.email, rightColumnX + 5, rightY + 15);
    pdf.text(`Plan: ${planLabel[userInfo.plan] || 'BÁSICO'}`, rightColumnX + 5, rightY + 22);
    rightY += 35;
  }

  // Training Notes
  if (template.notes) {
    pdf.setFillColor(...darkColor);
    pdf.rect(rightColumnX, rightY, rightColumnWidth, 8, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('NOTAS DE ENTRENAMIENTO', rightColumnX + 5, rightY + 5);
    rightY += 15;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const notesLines = pdf.splitTextToSize(template.notes, rightColumnWidth - 10);
    notesLines.forEach(line => {
      pdf.text(line, rightColumnX + 5, rightY);
      rightY += 5;
    });
    rightY += 10;
  }

  // QR Code placeholder for YouTube link
  if (template.youtubeLink) {
    pdf.setFillColor(240, 240, 240);
    pdf.rect(rightColumnX, rightY, rightColumnWidth, 30, 'F');
    
    pdf.setTextColor(...grayColor);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('VIDEOS DE EJERCICIOS', rightColumnX + 5, rightY + 8);
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Escanea el código QR o visita:', rightColumnX + 5, rightY + 15);
    pdf.text(template.youtubeLink, rightColumnX + 5, rightY + 22);
    
    // QR code placeholder
    pdf.setFillColor(200, 200, 200);
    pdf.rect(rightColumnX + rightColumnWidth - 25, rightY + 5, 20, 20, 'F');
    pdf.setTextColor(100, 100, 100);
    pdf.text('QR', rightColumnX + rightColumnWidth - 17, rightY + 17);
  }

  // Footer
  pdf.setFillColor(...darkColor);
  pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Generado por FitPlan Selector - Rutinas de Fitness Profesionales', margin, pageHeight - 8);
  pdf.text(new Date().toLocaleDateString(), pageWidth - margin - 40, pageHeight - 8);

  return pdf;
};