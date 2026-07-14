import { View, Text, Link } from "@react-pdf/renderer";
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

const MealCard = ({ meal, styles }) => {
  const recipe = buildVideoUrl(meal.videoUrl);
  const variantes = meal.variantes || [];
  const macros = [
    num(meal.proteina_g) != null ? `P ${meal.proteina_g}g` : null,
    num(meal.carbos_g) != null ? `C ${meal.carbos_g}g` : null,
    num(meal.grasas_g) != null ? `G ${meal.grasas_g}g` : null,
  ].filter(Boolean);

  return (
    <View style={styles.mealCard} wrap={false}>
      <View style={styles.mealHeader}>
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

      {meal.sustituciones ? (
        <Text style={styles.subsText}>{`↔ ${meal.sustituciones}`}</Text>
      ) : null}

      {meal.nota_timing ? (
        <Text style={styles.timingText}>{`⏱ ${meal.nota_timing}`}</Text>
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
      <View style={styles.dayHeader}>
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
          <MealCard key={meal.id || idx} meal={meal} styles={styles} />
        ))
      )}
    </View>
  );
};

const NutritionWeekSection = ({ week, styles, breakBefore = false }) => (
  <View style={styles.weekSection} break={breakBefore} id={weekAnchorId(week.number)}>
    <View style={styles.weekHeader}>
      <Text style={styles.weekTitle}>{week.title || `Semana ${week.number}`}</Text>
      {week.notes ? <Text style={styles.weekSubtitle}>{week.notes}</Text> : null}
      <Link src={indexLinkTarget()} style={styles.backToIndex}>Volver al índice</Link>
    </View>
    {week.days.map((day, idx) => (
      <DayBlock key={`${week.number}-${idx}`} day={day} styles={styles} />
    ))}
  </View>
);

export default NutritionWeekSection;
