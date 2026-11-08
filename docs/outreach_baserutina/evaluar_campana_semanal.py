#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Evaluador Semanal de Métricas de Prospección — BaseRutina / Mock (Fase 6)
Lee tablero_seguimiento_crm.csv y calcula:
- Total de enviados, respuestas, interesados y demos hechas.
- Tasa de respuesta por Variante (A, B, C), por Perfil (ICP-A, ICP-B, ICP-C) y por Ciudad.
- Alerta automática de Freno y Rediseño si tras >= 100 contactos la tasa de respuesta es < 5%.
"""

import csv
import os
from collections import Counter, defaultdict

CRM_PATH = os.path.join(os.path.dirname(__file__), "tablero_seguimiento_crm.csv")
REPORT_OUT = os.path.join(os.path.dirname(__file__), "reporte_semanal_calculado.md")

CONTACTED_STATES = {"contactado", "respondio", "respondió", "interesado", "demo_hecha", "demo hecha", "no_interesado", "no interesado"}
REPLIED_STATES = {"respondio", "respondió", "interesado", "demo_hecha", "demo hecha", "no_interesado", "no interesado"}
POSITIVE_STATES = {"interesado", "demo_hecha", "demo hecha"}

def main():
    if not os.path.exists(CRM_PATH):
        print(f"No se encontró {CRM_PATH}")
        return

    with open(CRM_PATH, "r", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))

    sent_by_var = Counter()
    rep_by_var = Counter()
    pos_by_var = Counter()

    sent_by_prof = Counter()
    rep_by_prof = Counter()

    sent_by_city = Counter()
    rep_by_city = Counter()

    objections = []
    bajas = 0
    total_sent = 0
    total_replied = 0
    total_positive = 0

    for r in rows:
        estado = (r.get("estado") or "nuevo").strip().lower()
        baja = (r.get("pidio_baja") or "NO").strip().upper()
        if baja == "SI" or estado == "no_contactar":
            bajas += 1

        if estado in CONTACTED_STATES:
            total_sent += 1
            var = r.get("variante_asignada", "N/A")
            prof = r.get("perfil", "N/A")
            city = "Córdoba" if "córdoba" in r.get("ciudad", "").lower() or "cordoba" in r.get("ciudad", "").lower() else "Resto Argentina"

            sent_by_var[var] += 1
            sent_by_prof[prof] += 1
            sent_by_city[city] += 1

            if estado in REPLIED_STATES:
                total_replied += 1
                rep_by_var[var] += 1
                rep_by_prof[prof] += 1
                rep_by_city[city] += 1

            if estado in POSITIVE_STATES:
                total_positive += 1
                pos_by_var[var] += 1

            obj = (r.get("objecion_o_comentario_textual") or "").strip()
            if obj:
                objections.append((r.get("nombre"), prof, var, obj))

    overall_rate = (total_replied / total_sent * 100.0) if total_sent > 0 else 0.0

    lines = [
        "# Reporte Semanal Automático — BaseRutina / Mock",
        "",
        f"- **Total contactados acumulados:** {total_sent}",
        f"- **Total respuestas recibidas:** {total_replied} ({overall_rate:.1f}%)",
        f"- **Interesados / Demos probadas:** {total_positive}",
        f"- **Solicitudes de BAJA (No contactar):** {bajas}",
        ""
    ]

    if total_sent >= 100 and overall_rate < 5.0:
        lines.extend([
            "> [!CAUTION]",
            f"> **FRENO OBLIGATORIO ACTIVADO (Regla Fase 6):** Se superaron los 100 contactos ({total_sent}) y la tasa de respuesta global es {overall_rate:.1f}% (< 5.0%).",
            "> **Acción inmediata:** Pausar las tandas diarias, descartar la variante de menor rendimiento y rediseñar el gancho inicial antes de reanudar.",
            ""
        ])
    else:
        lines.extend([
            "> [!TIP]",
            f"> **Estado del Semáforo de Fase 6:** Dentro de parámetros saludables ({total_sent}/100 contactos evaluados para umbral mínimo del 5%).",
            ""
        ])

    lines.append("## Rendimiento por Variante (A / B / C)")
    lines.append("| Variante | Enviados | Respuestas | % Respuesta | Interesados / Demo |")
    lines.append("| :--- | :---: | :---: | :---: | :---: |")
    for v in sorted(sent_by_var.keys()):
        s = sent_by_var[v]
        rp = rep_by_var[v]
        ps = pos_by_var[v]
        rate = (rp / s * 100.0) if s else 0.0
        lines.append(f"| `{v}` | {s} | {rp} | {rate:.1f}% | {ps} |")

    lines.append("\n## Rendimiento por Perfil (ICP)")
    lines.append("| Perfil | Enviados | Respuestas | % Respuesta |")
    lines.append("| :--- | :---: | :---: | :---: |")
    for p in sorted(sent_by_prof.keys()):
        s = sent_by_prof[p]
        rp = rep_by_prof[p]
        rate = (rp / s * 100.0) if s else 0.0
        lines.append(f"| `{p}` | {s} | {rp} | {rate:.1f}% |")

    lines.append("\n## Rendimiento Geográfico (Córdoba vs Resto de Argentina)")
    lines.append("| Región | Enviados | Respuestas | % Respuesta |")
    lines.append("| :--- | :---: | :---: | :---: |")
    for c in sorted(sent_by_city.keys()):
        s = sent_by_city[c]
        rp = rep_by_city[c]
        rate = (rp / s * 100.0) if s else 0.0
        lines.append(f"| {c} | {s} | {rp} | {rate:.1f}% |")

    lines.append("\n## Objeciones y Respuestas Textuales Registradas")
    if objections:
        for nombre, prof, var, obj in objections:
            lines.append(f"- **{nombre}** (`{prof}` / `{var}`): *\"{obj}\"*")
    else:
        lines.append("- *(Sin objeciones registradas todavía — la campaña está en estado inicial pendiente de envío de la Tanda 1)*")

    with open(REPORT_OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

    print(f"Reporte generado en: {REPORT_OUT}")

if __name__ == "__main__":
    main()
