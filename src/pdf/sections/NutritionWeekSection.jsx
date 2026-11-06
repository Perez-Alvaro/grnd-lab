import { Page, View, Text, Link } from "@react-pdf/renderer";
import { indexLinkTarget, weekAnchorId } from "../utils/pdfAnchors.js";
import { buildRecipeSearchUrl } from "../../lib/recipeSearch.js";
import {
  PAGE_WIDTH,
  estimateNutritionPageHeight,
  estimateNutritionEmptyWeekPageHeight,
} from "../utils/pageSizing.js";

const num = (v) => (v === 0 || v ? v : null);

const MealCard = ({ meal, styles }) => {
  const recipe = buildRecipeSearchUrl(meal.videoUrl);
  const variantes = meal.variantes || [];
  const macros = [
    num(meal.proteina_g) != null ? `P ${meal.proteina_g}g` : null,
    num(meal.carbos_g) != null ? `C ${meal.carbos_g}g` : null,
    num(meal.grasas_g) != null ? `G ${meal.grasas_g}g` : null,
  ].filter(Boolean);

  return (
    // La página del día tiene alto dinámico (ver pageSizing), así que todas las
    // comidas entran en una sola página. wrap={false} mantiene la card entera.
    <View style={styles.mealCard} wrap={false}>
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
            const vRecipe = buildRecipeSearchUrl(v.videoUrl);
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
          <MealCard key={meal.id || idx} meal={meal} styles={styles} />
        ))
      )}
    </View>
  );
};

/**
 * Una página por DÍA, con alto DINÁMICO (ver pageSizing) para que todas las
 * comidas entren sin cortarse y sin páginas fijas A4. El encabezado corrido
 * (fixed) repite "Día · Semana X" con link permanente al índice.
 */
export const NutritionDayPage = ({ week, day, brandName, isFirstDayOfWeek, styles }) => {
  const weekLabel = week.title || `Semana ${week.number}`;
  const cleanBrand = (val) => (typeof val === "string" && val.trim().length > 0 ? val.trim() : null);
  const resolvedBrandName =
    cleanBrand(brandName) ||
    cleanBrand(week?.brandName) ||
    (typeof window !== "undefined" && cleanBrand(window?.localStorage?.getItem?.("mock:coach-brand-name"))) ||
    "Mock";
  return (
    <Page
      size={{ width: PAGE_WIDTH, height: estimateNutritionPageHeight(day, { isFirstDayOfWeek }) }}
      style={styles.pageWithRunningHeader}
      wrap={false}
    >
      <View fixed style={styles.runningHeader}>
        <Text style={styles.runningHeaderDay}>{`${resolvedBrandName}  ·  ${day.name}  ·  ${weekLabel}`}</Text>
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
  <Page
    size={{ width: PAGE_WIDTH, height: estimateNutritionEmptyWeekPageHeight() }}
    style={styles.page}
    wrap={false}
  >
    <View id={weekAnchorId(week.number)}>
      <Text style={styles.weekTitle}>{week.title || `Semana ${week.number}`}</Text>
      <Text style={styles.restMessage}>Sin días cargados.</Text>
    </View>
  </Page>
);

export default NutritionDayPage;
