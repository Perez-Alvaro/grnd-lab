// Test script para verificar que las notas se imprimen correctamente en los PDFs
import { downloadRoutinePDFMobile } from './src/services/pdfGeneratorMobile.js';
import { generateRoutinePDF } from './src/services/pdfGenerator.js';

const testData = {
  "name": "Masculino Volumen FST-7 3dias/semana - Metodo PPL + Brazos",
  "description": "Plan enfocado en hipetrofia basado en distribucion push pull legs agregando brazos y hombros en cada dia, con no mas de 80 min de entrenamiento incluyendo la entrada en calor y la elongacion, alta intensidad volumen medio",
  "metadata": {
    "author": "Hany Rambod",
    "gender": "Masculino",
    "objective": "muscle_gain",
    "level": "Avanzado",
    "frequency": "3",
    "durationWeeks": "2",
    "tags": "funcional, hipertrofia, fuerza, FST-7 , REST PAUSE, DROPSET, BISERIES, 80 MIN WORKOUT"
  },
  "weeks": [
    {
      "name": "Semana 1",
      "days": [
        {
          "name": "Día 1 - Push (Pecho, Hombro Lateral/Frontal, Tríceps)",
          "type": "training",
          "exercises": [
            {
              "name": "Press de Banca con Barra",
              "sets": "3",
              "reps": "6-8",
              "rir": "1",
              "tempo": "3110",
              "rest": "120s",
              "notes": "Enfoque en fuerza explosiva. Mantén retracción escapular. La última serie aplica un Drop Set del 25% al fallar.",
              "video": "https://www.youtube.com/watch?v=rT7DgCr-3pg"
            }
          ]
        }
      ]
    }
  ]
};

console.log("Testing notes field...");
console.log("Exercise notes:", testData.weeks[0].days[0].exercises[0].notes);
console.log("Has notes:", !!(testData.weeks[0].days[0].exercises[0].notes));

// Test the PDF generation
console.log("\nGenerating mobile PDF...");
downloadRoutinePDFMobile(testData);
