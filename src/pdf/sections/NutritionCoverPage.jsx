import { View, Text, Link } from "@react-pdf/renderer";
import { INDEX_ANCHOR, weekLinkTarget } from "../utils/pdfAnchors.js";

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

  return (
    <View style={styles.coverWrapper} id={INDEX_ANCHOR}>
      <View style={styles.coverHeader}>
        <View style={styles.headerSection}>
          <Text style={styles.planTitle}>{plan.title}</Text>
          {plan.author ? (
            <Text style={styles.planDescription}>Plan nutricional · {plan.author}</Text>
          ) : (
            <Text style={styles.planDescription}>Plan nutricional</Text>
          )}
        </View>

        {/* Targets diarios */}
        <View style={styles.metadataSection}>
          {(pm.targetKcal || pm.proteina_g || pm.carbos_g || pm.grasas_g) && (
            <MetadataRow
              items={[
                { label: "KCAL / DÍA", value: pm.targetKcal },
                { label: "PROTEÍNA", value: pm.proteina_g ? `${pm.proteina_g} g` : "" },
                { label: "CARBOS", value: pm.carbos_g ? `${pm.carbos_g} g` : "" },
                { label: "GRASAS", value: pm.grasas_g ? `${pm.grasas_g} g` : "" },
              ]}
              styles={styles}
            />
          )}
          {(pm.tmb || pm.tdee || pm.deficit) && (
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
          )}
        </View>

        {/* Racional del plan */}
        {pm.rationale && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>RACIONAL DEL PLAN</Text>
            <View style={styles.notesDivider} />
            <Text style={styles.notesText}>{pm.rationale}</Text>
          </View>
        )}

        {/* Aviso de derivación */}
        {pm.requiereDerivacion && (
          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>Requiere derivación a profesional</Text>
            <Text style={styles.warningText}>
              {pm.notaDerivacion ||
                "Se detectó una condición de salud. Recomendá consulta con un profesional matriculado en nutrición."}
            </Text>
          </View>
        )}

        {/* Notas generales de la semana */}
        {plan.notasSemana && plan.notasSemana.length > 0 && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>NOTAS GENERALES</Text>
            <View style={styles.notesDivider} />
            {plan.notasSemana.map((n, idx) => (
              <Text key={idx} style={[styles.notesText, { marginBottom: 3 }]}>• {n}</Text>
            ))}
          </View>
        )}

        <Text style={styles.legalNote}>
          Este plan fue generado con asistencia de IA. No reemplaza la consulta con un profesional matriculado en nutrición.
        </Text>
      </View>

      {/* Índice de semanas (links internos) */}
      <View style={styles.indexSection}>
        <View style={styles.indexHeader}>
          <Text style={styles.indexTitle}>CONTENIDO DEL PLAN</Text>
          <Text style={styles.indexSubtitle}>
            {plan.weeks.length} {plan.weeks.length === 1 ? "semana" : "semanas"} · tocá una para ir directo
          </Text>
        </View>
        <View style={styles.indexGrid}>
          {plan.weeks.map((week) => (
            <Link key={week.number} src={weekLinkTarget(week.number)} style={styles.indexCard}>
              <Text style={styles.indexCardTitle}>{week.title || `SEMANA ${week.number}`}</Text>
              <Text style={styles.indexCardDescription}>
                {week.days.length} {week.days.length === 1 ? "día" : "días"} · {week.summary || "Plan de comidas detallado"}
              </Text>
            </Link>
          ))}
        </View>
      </View>
    </View>
  );
};

export default NutritionCoverPage;
