import { Page, View, Text, Link } from "@react-pdf/renderer";
import { indexLinkTarget, weekAnchorId } from "../utils/pdfAnchors.js";

// Devuelve SIEMPRE una URL válida; si el valor no es una URL con host, lo
// convierte en búsqueda de YouTube (mismo criterio que la preview web).
const buildVideoUrl = (raw) => {
  if (!raw) return "";
  const t = String(raw).trim();
  if (!t) return "";
  if (!/\s/.test(t)) {
    const candidate = /^https?:\/\//i.test(t) ? t : `https://${t}`;
    try {
      const u = new URL(candidate);
      if (u.hostname.includes(".")) return u.href;
    } catch { /* fallback búsqueda */ }
  }
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(t.replace(/^https?:\/\/+/i, ""))}`;
};

const num = (v) => (v === 0 || v ? v : null);

const MealCard = ({ meal, styles, breakBefore = false }) => {
  const recipe = buildVideoUrl(meal.videoUrl);
  const variantes = meal.variantes || [];
  const macros = [
    num(meal.proteina_g) != null ? `P ${meal.proteina_g}g` : null,
    num(meal.carbos_g) != null ? `C ${meal.carbos_g}g` : null,
    num(meal.grasas_g) != null ? `G ${meal.grasas_g}g` : null,
  ].filter(Boolean);

  return (
    // Máximo 2 comidas por página: la 3.ª, 5.ª, etc. fuerzan salto de página
    // (breakBefore) y cada card se mantiene ENTERA (wrap={false}) para que la
    // tabla principal nunca quede cortada entre páginas.
    <View style={styles.mealCard} wrap={false} break={breakBefore} minPresenceAhead={70}>
      <View style={styles.mealHeader} wrap={false}>
        <Text style={styles.mealName}>
          {meal.name || "Comida"}
          {meal.hora ? <Text style={styles.mealHora}>{`  ${meal.hora}`}</Text> : null}
        </Text>
        {num(meal.kcal) != null && <Text style={styles.mealKcal}>{meal.kcal} kcal</Text>}
      </View>

      {macros.length > 0 && (
        <View style={styles.mealMacros}>
          {macros.map((m, i) => <Text key={i} style={styles.macroChip}>{m}</Text>)}
        </View>
      )}

      {meal.ingredientes ? (
        <>
          <Text style={styles.fieldLabel}>Ingredientes</Text>
          <Text style={styles.fieldText}>{meal.ingredientes}</Text>
        </>
      ) : null}

      {meal.preparacion ? (
        <>
          <Text style={styles.fieldLabel}>Preparación</Text>
          <Text style={styles.fieldText}>{meal.preparacion}</Text>
        </>
      ) : null}

      {/* Sin ↔ ni ⏱: Helvetica (WinAnsi) no tiene esos glifos y se ven como letras raras */}
      {meal.sustituciones ? (
        <Text style={styles.subsText}>{`Sustituciones: ${meal.sustituciones}`}</Text>
      ) : null}

      {meal.nota_timing ? (
        <Text style={styles.timingText}>{`Timing: ${meal.nota_timing}`}</Text>
      ) : null}

      {recipe ? (
        <Link src={recipe} style={styles.recipeLink}>VER RECETA</Link>
      ) : null}

      {variantes.length > 0 && (
        <View style={styles.variantesWrap}>
          {variantes.map((v, i) => {
            const vRecipe = buildVideoUrl(v.videoUrl);
            return (
              <View key={v.id || i} style={styles.varianteRow}>
                <Text style={styles.varianteLabel}>
                  {v.label || `Opción ${i + 1}`}
                  {num(v.kcal) != null ? <Text style={styles.varianteText}>{`  (${v.kcal} kcal)`}</Text> : null}
                </Text>
                {v.ingredientes ? <Text style={styles.varianteText}>{v.ingredientes}</Text> : null}
                {vRecipe ? <Link src={vRecipe} style={styles.recipeLink}>Ver receta</Link> : null}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const DayBlock = ({ day, styles }) => {
  const total = day.totalDia || {};
  return (
    <View style={styles.dayContainer}>
      <View style={styles.dayHeader} wrap={false}>
        <Text style={styles.dayName}>{day.name}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {day.esDiaEntreno && <Text style={styles.dayBadgeTraining}>Entreno</Text>}
          {num(total.kcal) != null && <Text style={styles.dayTotal}>{total.kcal} kcal</Text>}
        </View>
      </View>
      {(day.meals || []).length === 0 ? (
        <Text style={styles.restMessage}>Sin comidas cargadas.</Text>
      ) : (
        (day.meals || []).map((meal, idx) => (
          <MealCard
            key={meal.id || idx}
            meal={meal}
            styles={styles}
            breakBefore={idx > 0 && idx % 2 === 0}
          />
        ))
      )}
    </View>
  );
};

/**
 * Una página (o más, si el día desborda) por DÍA. El encabezado corrido
 * (fixed) repite "Día · Semana X" en TODAS las páginas del día para que el
 * lector nunca se pierda, con link permanente al índice.
 */
export const NutritionDayPage = ({ week, day, isFirstDayOfWeek, styles }) => {
  const weekLabel = week.title || `Semana ${week.number}`;
  return (
    <Page size="A4" orientation="portrait" style={styles.pageWithRunningHeader} wrap>
      <View fixed style={styles.runningHeader}>
        <Text style={styles.runningHeaderDay}>{`${day.name}  ·  ${weekLabel}`}</Text>
        <Link src={indexLinkTarget()} style={styles.runningHeaderLink}>Volver al índice</Link>
      </View>

      {isFirstDayOfWeek ? (
        <View style={styles.weekHeader} id={weekAnchorId(week.number)} wrap={false}>
          <Text style={styles.weekTitle}>{weekLabel}</Text>
          {week.notes ? <Text style={styles.weekSubtitle}>{week.notes}</Text> : null}
        </View>
      ) : null}

      <DayBlock day={day} styles={styles} />
    </Page>
  );
};

/** Página mínima para una semana sin días: mantiene vivo el anchor del índice. */
export const NutritionEmptyWeekPage = ({ week, styles }) => (
  <Page size="A4" orientation="portrait" style={styles.page} wrap>
    <View id={weekAnchorId(week.number)}>
      <Text style={styles.weekTitle}>{week.title || `Semana ${week.number}`}</Text>
      <Text style={styles.restMessage}>Sin días cargados.</Text>
    </View>
  </Page>
);

export default NutritionDayPage;
