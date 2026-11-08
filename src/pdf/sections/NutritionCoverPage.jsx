import { StyleSheet, View, Text, Link, Image } from "@react-pdf/renderer";
import {
  INDEX_ANCHOR,
  weekLinkTarget,
  anchorTarget,
  SHOPPING_ANCHOR,
  MEALPREP_ANCHOR,
  FRIDGE_ANCHOR,
} from "../utils/pdfAnchors.js";
import { hasShopping } from "./ShoppingListPage.jsx";

const localStyles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  brandLogo: {
    maxHeight: 48,
    maxWidth: 160,
    objectFit: "contain",
  },
  brandTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#2E4A5F",
    textAlign: "center",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
});

const MetadataRow = ({ items, styles }) => (
  <View style={styles.metadataRow}>
    {items.filter((item) => item.value === 0 || item.value).map((item, idx) => (
      <View key={idx} style={styles.metadataCard}>
        <Text style={styles.metadataCardLabel}>{item.label}</Text>
        <Text style={styles.metadataCardValue}>{item.value}</Text>
      </View>
    ))}
  </View>
);

const NutritionCoverPage = ({ plan, styles }) => {
  const pm = plan.planMeta || {};
  const cleanBrand = (val) => (typeof val === "string" && val.trim().length > 0 ? val.trim() : null);
  const brandName =
    cleanBrand(plan.brandName) ||
    cleanBrand(plan.metadata?.brandName) ||
    cleanBrand(plan.metadata?.author) ||
    cleanBrand(plan.metadata?.coach) ||
    cleanBrand(plan.author) ||
    cleanBrand(plan.coach) ||
    (typeof window !== "undefined" && cleanBrand(window?.localStorage?.getItem?.("mock:coach-brand-name"))) ||
    "Mock";

  const brandLogo =
    cleanBrand(plan.brandLogo) ||
    cleanBrand(plan.metadata?.brandLogo) ||
    cleanBrand(plan.logo) ||
    cleanBrand(plan.metadata?.logo) ||
    (typeof window !== "undefined" && cleanBrand(window?.localStorage?.getItem?.("mock:coach-brand-logo"))) ||
    null;

  // Accesos del índice a las secciones del apéndice (evitan scrollear todo el
  // PDF): mismas cards que las semanas para que no pasen desapercibidos.
  const quickAccess = [
    hasShopping(plan.shoppingList)
      ? {
          label: "LISTA DE COMPRAS",
          desc: "Todo lo de la semana en unidades de súper",
          target: anchorTarget(SHOPPING_ANCHOR),
        }
      : null,
    plan.mealPrepGuide?.length
      ? {
          label: "PREPARACIÓN DEL DOMINGO",
          desc: "Meal prep: qué dejar listo y cuánto rinde",
          target: anchorTarget(MEALPREP_ANCHOR),
        }
      : null,
    plan.quickReference?.length
      ? {
          label: "TARJETA DE HELADERA",
          desc: "Resumen del día para imprimir y pegar",
          target: anchorTarget(FRIDGE_ANCHOR),
        }
      : null,
  ].filter(Boolean);

  return (
    <View style={styles.coverWrapper} id={INDEX_ANCHOR}>
      <View style={styles.coverHeader}>
        <View style={styles.headerSection}>
          {brandLogo ? (
            <View style={localStyles.logoContainer}>
              <Image src={brandLogo} style={localStyles.brandLogo} />
            </View>
          ) : null}
          <Text style={[localStyles.brandTitle, styles.brandTitle]}>
            {String(brandName).toUpperCase()}
          </Text>
          <Text style={styles.planTitle}>{plan.title}</Text>
          {plan.author ? (
            <Text style={styles.planDescription}>Plan nutricional · {plan.author}</Text>
          ) : (
            <Text style={styles.planDescription}>Plan nutricional</Text>
          )}
        </View>

        {/* Targets diarios */}
        <View style={styles.metadataSection}>
          {(pm.targetKcal || pm.proteina_g || pm.carbos_g || pm.grasas_g) ? (
            <MetadataRow
              items={[
                { label: "KCAL / DÍA", value: pm.targetKcal },
                { label: "PROTEÍNA", value: pm.proteina_g ? `${pm.proteina_g} g` : "" },
                { label: "CARBOS", value: pm.carbos_g ? `${pm.carbos_g} g` : "" },
                { label: "GRASAS", value: pm.grasas_g ? `${pm.grasas_g} g` : "" },
              ]}
              styles={styles}
            />
          ) : null}
          {(pm.tmb || pm.tdee || pm.deficit) ? (
            <MetadataRow
              items={[
                { label: "TMB", value: pm.tmb ? `${pm.tmb} kcal` : "" },
                { label: "TDEE", value: pm.tdee ? `${pm.tdee} kcal` : "" },
                {
                  label: pm.deficit && pm.deficit > 0 ? "SUPERÁVIT" : "DÉFICIT",
                  value: pm.deficit ? `${pm.deficit > 0 ? "+" : ""}${pm.deficit} kcal` : "",
                },
              ]}
              styles={styles}
            />
          ) : null}
        </View>

        {/* Racional del plan */}
        {pm.rationale ? (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>RACIONAL DEL PLAN</Text>
            <View style={styles.notesDivider} />
            <Text style={styles.notesText}>{pm.rationale}</Text>
          </View>
        ) : null}

        {/* Aviso de derivación */}
        {pm.requiereDerivacion ? (
          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>Requiere derivación a profesional</Text>
            <Text style={styles.warningText}>
              {pm.notaDerivacion ||
                "Se detectó una condición de salud. Recomendá consulta con un profesional matriculado en nutrición."}
            </Text>
          </View>
        ) : null}

        {/* Notas generales de la semana */}
        {plan.notasSemana && plan.notasSemana.length > 0 ? (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>NOTAS GENERALES</Text>
            <View style={styles.notesDivider} />
            {plan.notasSemana.map((n, idx) => (
              <Text key={idx} style={[styles.notesText, { marginBottom: 3 }]}>• {n}</Text>
            ))}
          </View>
        ) : null}

        <Text style={styles.legalNote}>
          Este plan fue generado con asistencia de IA. No reemplaza la consulta con un profesional matriculado en nutrición.
        </Text>
      </View>

      {/* Índice de semanas + accesos al apéndice: viaja ENTERO a la página
          siguiente si no entra (planes de 1-4 semanas siempre caben). */}
      <View style={styles.indexSection} wrap={false}>
        <View style={styles.indexHeader}>
          <Text style={styles.indexTitle}>CONTENIDO DEL PLAN</Text>
          <Text style={styles.indexSubtitle}>
            {plan.weeks.length} {plan.weeks.length === 1 ? "semana" : "semanas"} · tocá una para ir directo
          </Text>
        </View>
        <View style={styles.indexGrid}>
          {plan.weeks.map((week) => (
            <Link key={week.number} src={weekLinkTarget(week.number)} style={styles.indexCard} wrap={false}>
              <Text style={styles.indexCardTitle}>{week.title || `SEMANA ${week.number}`}</Text>
              <Text style={styles.indexCardDescription}>
                {week.days.length} {week.days.length === 1 ? "día" : "días"} · {week.summary || "Plan de comidas detallado"}
              </Text>
            </Link>
          ))}
          {/* Accesos al apéndice: lista de compras, meal prep y heladera */}
          {quickAccess.map((item) => (
            <Link key={item.target} src={item.target} style={styles.indexCard} wrap={false}>
              <Text style={styles.indexCardTitle}>{item.label}</Text>
              <Text style={styles.indexCardDescription}>{item.desc}</Text>
            </Link>
          ))}
        </View>
      </View>
    </View>
  );
};

export default NutritionCoverPage;
