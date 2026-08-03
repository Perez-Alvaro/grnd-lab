/**
 * src/pdf/sections/LegalPage.jsx
 * Última página de TODOS los PDF (rutina y nutrición): términos y condiciones
 * de Mock.
 *
 * El TEXTO no vive acá: viene de src/lib/legalTerms.js, que es la misma fuente
 * que consume la aceptación del registro. Así el documento que firma el coach
 * al registrarse y el que entrega a su cliente nunca se desincronizan.
 */
import { View, Text } from "@react-pdf/renderer";
import { palette } from "../utils/pdfStyles.js";
import {
  buildTermsClauses,
  TERMS_TITLE,
  TERMS_INTRO,
  TERMS_ACCEPTANCE,
  TERMS_VERSION,
} from "../../lib/legalTerms.js";

/** Cláusula: título + cuerpo + fundamento normativo. */
const Clausula = ({ n, titulo, cuerpo, base }) => (
  <View style={{ marginBottom: 9 }} wrap={false}>
    <Text style={{ fontSize: 9, fontWeight: 700, color: palette.text, marginBottom: 2 }}>
      {n}. {titulo}
    </Text>
    <Text style={{ fontSize: 8.5, color: palette.text, lineHeight: 1.45, textAlign: "justify" }}>
      {cuerpo}
    </Text>
    {base ? (
      <Text style={{ fontSize: 7.5, color: palette.neutral, marginTop: 2, fontStyle: "italic" }}>
        Fundamento: {base}
      </Text>
    ) : null}
  </View>
);

/**
 * @param {'workout'|'nutrition'} variant - define cuál de las dos cláusulas de
 *   salud se incluye (derivación nutricional o aptitud física).
 * @param {string} author - quién firma el plan, para nombrarlo como responsable.
 */
const LegalPage = ({ variant = "workout", author = "" }) => (
  <View>
    <View style={{ borderBottomWidth: 2, borderBottomColor: palette.text, paddingBottom: 6, marginBottom: 4 }}>
      <Text style={{ fontSize: 15, fontWeight: 700, color: palette.text, letterSpacing: 0.5 }}>
        {TERMS_TITLE}
      </Text>
    </View>
    <Text style={{ fontSize: 8, color: palette.neutral, marginBottom: 12 }}>{TERMS_INTRO}</Text>

    {buildTermsClauses({ variant, author }).map((c) => (
      <Clausula key={c.n} {...c} />
    ))}

    <View
      style={{ marginTop: 6, borderWidth: 1, borderColor: palette.text, borderRadius: 4, padding: 8 }}
      wrap={false}
    >
      <Text style={{ fontSize: 8.5, color: palette.text, lineHeight: 1.45, textAlign: "justify" }}>
        <Text style={{ fontWeight: 700 }}>Aceptación. </Text>
        {TERMS_ACCEPTANCE}
      </Text>
    </View>

    <Text style={{ fontSize: 7.5, color: palette.neutral, marginTop: 8, textAlign: "center" }}>
      {`Mock — Términos y condiciones v${TERMS_VERSION}. Documento generado el ${new Date().toLocaleDateString("es-AR")}. República Argentina.`}
    </Text>
  </View>
);

export default LegalPage;
