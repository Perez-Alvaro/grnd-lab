/* eslint-disable react-refresh/only-export-components */
import { View, Text, Link } from "@react-pdf/renderer";
import { indexLinkTarget } from "../utils/pdfAnchors.js";

const CATEGORY_LABELS = {
  carnes_y_huevos: "Carnes y huevos",
  lacteos: "Lácteos",
  verduleria: "Verdulería",
  frutas: "Frutas",
  almacen: "Almacén",
  aceites_y_condimentos: "Aceites y condimentos",
  congelados: "Congelados",
  otros: "Otros",
};

const prettyCat = (k) =>
  CATEGORY_LABELS[k] || String(k).replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

const hasShopping = (sl) => sl && Object.values(sl).some((arr) => Array.isArray(arr) && arr.length);

const ShoppingListPage = ({ plan, styles }) => {
  const sl = plan.shoppingList || {};
  const prep = plan.mealPrepGuide || [];
  const quick = plan.quickReference || [];

  return (
    <View>
      {/* Lista de compras */}
      {hasShopping(sl) && (
        <View style={{ marginBottom: 20 }}>
          <View style={styles.indexHeader}>
            <Text style={styles.sectionTitle}>Lista de compras</Text>
            <Link src={indexLinkTarget()} style={styles.backToIndex}>Volver al índice</Link>
          </View>
          {Object.entries(sl).map(([cat, items]) =>
            Array.isArray(items) && items.length ? (
              <View key={cat} style={styles.shopCategory}>
                <Text style={styles.shopCategoryTitle}>{prettyCat(cat)}</Text>
                {items.map((it, idx) => (
                  <View key={idx} style={styles.shopItem}>
                    <Text style={styles.shopBox}>{"☐"}</Text>
                    <Text style={styles.shopItemText}>
                      {it.item || it.nombre || "—"}
                      {it.cantidad ? <Text style={styles.prepMeta}>{`  ·  ${it.cantidad}`}</Text> : null}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null,
          )}
        </View>
      )}

      {/* Guía de meal prep */}
      {prep.length > 0 && (
        <View style={{ marginBottom: 20 }} break={hasShopping(sl)}>
          <View style={styles.indexHeader}>
            <Text style={styles.sectionTitle}>Preparación del domingo</Text>
            <Link src={indexLinkTarget()} style={styles.backToIndex}>Volver al índice</Link>
          </View>
          {prep.map((p, idx) => (
            <View key={idx} style={styles.prepItem}>
              <Text style={styles.prepText}>{`• ${p.preparacion || ""}`}</Text>
              <Text style={styles.prepMeta}>
                {[p.rinde, p.conservacion].filter(Boolean).join("  ·  ")}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Tarjeta de heladera (referencia rápida) */}
      {quick.length > 0 && (
        <View break={hasShopping(sl) || prep.length > 0}>
          <View style={styles.indexHeader}>
            <Text style={styles.sectionTitle}>Tarjeta de heladera</Text>
            <Link src={indexLinkTarget()} style={styles.backToIndex}>Volver al índice</Link>
          </View>
          {quick.map((d, idx) => (
            <View key={idx} style={[styles.dayContainer, { marginBottom: 8 }]} wrap={false}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayName}>{d.dia || `Día ${idx + 1}`}</Text>
                {(d.totalKcal === 0 || d.totalKcal) && (
                  <Text style={styles.dayTotal}>{d.totalKcal} kcal</Text>
                )}
              </View>
              {(d.comidas || []).map((c, i) => (
                <View key={i} style={styles.shopItem}>
                  <Text style={styles.shopItemText}>
                    {`${c.emoji ? c.emoji + " " : ""}${c.nombre || ""}`}
                    {c.hora ? <Text style={styles.prepMeta}>{`  ${c.hora}`}</Text> : null}
                  </Text>
                  {(c.kcal === 0 || c.kcal) && <Text style={styles.prepMeta}>{`${c.kcal} kcal`}</Text>}
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export const hasAppendix = (plan) =>
  hasShopping(plan.shoppingList) ||
  (plan.mealPrepGuide && plan.mealPrepGuide.length > 0) ||
  (plan.quickReference && plan.quickReference.length > 0);

export default ShoppingListPage;
