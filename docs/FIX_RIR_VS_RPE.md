# ✅ Corrección: RIR vs RPE

## 🐛 Error Identificado

En el PDF, la columna mostraba **"RPE"** cuando debería mostrar **"RIR"**.

## ❌ ¿Por qué es importante?

**RIR** y **RPE** son dos métricas **completamente diferentes**:

### RIR (Reps In Reserve)
- **Qué es**: Repeticiones en Reserva
- **Rango**: Típicamente 0-3
- **Significado**: Cuántas repeticiones más podrías haber hecho
- **Ejemplo**: 
  - RIR 0 = Fallo muscular (no podías hacer ni una más)
  - RIR 1 = Te quedaba 1 rep en el tanque
  - RIR 2 = Te quedaban 2 reps en el tanque
  - RIR 3 = Te quedaban 3 reps en el tanque

### RPE (Rate of Perceived Exertion)
- **Qué es**: Tasa de Esfuerzo Percibido
- **Rango**: Escala 1-10
- **Significado**: Qué tan duro fue el esfuerzo percibido
- **Ejemplo**:
  - RPE 6 = Moderado
  - RPE 7 = Difícil
  - RPE 8 = Muy difícil
  - RPE 9 = Casi fallo
  - RPE 10 = Fallo completo

### Relación entre RIR y RPE

Aunque están relacionadas, son escalas diferentes:

| RIR | RPE | Descripción |
|-----|-----|-------------|
| 3+ | 6-7 | Moderado, reserva alta |
| 2 | 8 | Difícil, 2 reps en reserva |
| 1 | 9 | Muy difícil, 1 rep en reserva |
| 0 | 10 | Fallo muscular |

## ✅ Corrección Aplicada

**Archivo:** `src/pdf/sections/WeekSection.jsx`

```jsx
// ❌ ANTES - Incorrecto
<Text style={[styles.tableCell, styles.rirCol]}>RPE</Text>

// ✅ AHORA - Correcto
<Text style={[styles.tableCell, styles.rirCol]}>RIR</Text>
```

## 📊 Tabla Resultante

**Ahora en el PDF:**

```
┌────────────┬────────┬───────┬──────┬───────┬─────┬────────┬───────┐
│ Ejercicio  │Series │ Reps  │ Desc │ Durac │ RIR │ Tempo  │ Video │
├────────────┼────────┼───────┼──────┼───────┼─────┼────────┼───────┤
│Press Banca │   4    │ 8-10  │ 90s  │ 3min  │  2  │3-0-1-0 │  Ver  │
└────────────┴────────┴───────┴──────┴───────┴─────┴────────┴───────┘
              ✅ Correcto ahora muestra "RIR"
```

## 🔍 Nota Importante

### El sistema internamente usa `rir`

En todo el código, el campo se llama y se ha llamado siempre `rir`:

**Editor:**
```javascript
{
  name: "Press Banca",
  sets: "4",
  reps: "8-10",
  rest: "90s",
  rir: "2",  // ← Siempre ha sido RIR
  tempo: "3-0-1-0"
}
```

**PDF (antes de la corrección):**
```javascript
{
  name: "Press Banca",
  series: "4",
  reps: "8-10", 
  descanso: "90s",
  rir: "2",  // ← Campo correcto
  cadencia: "3-0-1-0"
}
```

**El error era SOLO visual** en el header de la tabla del PDF, no en los datos.

## ✅ Verificación

Para verificar que está corregido:

1. Importa una rutina con RIR
2. Exporta a PDF
3. Verifica que el header diga **"RIR"** (no "RPE")
4. Verifica que los valores se muestren correctamente (0, 1, 2, 3, etc.)

## 📝 Resumen

- ✅ Header de columna corregido de "RPE" → "RIR"
- ✅ Datos siempre fueron correctos (campo `rir`)
- ✅ Error era solo en la etiqueta visual
- ✅ Ahora la tabla es coherente con el concepto usado

**¡Corrección aplicada!** 🎯
