#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Enviador de Tandas Diarias de Emails con Control Humano — MOCK
--------------------------------------------------------------
Remitente oficial: Álvaro Pérez <perezalvaroraul26@gmail.com>
Demo oficial: https://mock-para-entrenadores.vercel.app/

Modos de uso:
1. Vista previa (sin enviar nada):
   python docs/outreach_baserutina/enviar_tanda_mails.py --tanda 1 --modo preview

2. Crear borradores en tu Gmail vía IMAP (Opción A):
   $env:MOCK_SMTP_PASS="tu_contraseña_de_aplicacion_16_letras"
   python docs/outreach_baserutina/enviar_tanda_mails.py --tanda 1 --modo borradores-gmail

3. Enviar por SMTP con confirmación humana correo por correo:
   $env:MOCK_SMTP_PASS="tu_contraseña_de_aplicacion_16_letras"
   python docs/outreach_baserutina/enviar_tanda_mails.py --tanda 1 --modo enviar-smtp
"""

import argparse
import csv
import email.message
import imaplib
import json
import os
import smtplib
import ssl
import time
import urllib.request
from datetime import datetime

DIR = os.path.dirname(os.path.abspath(__file__))
BRAIN_DIR = r"C:\Users\perez\.gemini\antigravity\brain\7eac1c9c-bbb0-4ac1-a939-314f3519f9ed"

# Resolver rutas con fallback
QUEUE_CSV = os.path.join(DIR, "cola_borradores_mails_20_por_dia.csv")
if not os.path.exists(QUEUE_CSV):
    QUEUE_CSV = os.path.join(BRAIN_DIR, "cola_borradores_mails_20_por_dia.csv")

CRM_CSV = os.path.join(DIR, "tablero_seguimiento_crm.csv")
if not os.path.exists(CRM_CSV):
    CRM_CSV = os.path.join(BRAIN_DIR, "tablero_seguimiento_crm.csv")

MAX_DAILY_EMAILS = 20
DEFAULT_DEMO_URL = "https://mock-para-entrenadores.vercel.app/"
DEFAULT_SENDER_EMAIL = "perezalvaroraul26@gmail.com"
DEFAULT_SENDER_NAME = "Álvaro Pérez"


def load_bajas():
    bajas = set()
    if os.path.exists(CRM_CSV):
        with open(CRM_CSV, "r", encoding="utf-8-sig") as f:
            for r in csv.DictReader(f):
                if (r.get("pidio_baja") or "").strip().upper() == "SI" or (r.get("estado") or "").strip().lower() == "no_contactar":
                    em = (r.get("email_publico") or "").strip().lower()
                    if em:
                        bajas.add(em)
    return bajas


def create_gmail_draft_imap(smtp_user, smtp_pass, sender_name, to_email, subject, body):
    msg = email.message.EmailMessage()
    msg["From"] = f"{sender_name} <{smtp_user}>"
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content(body)

    context = ssl.create_default_context()
    with imaplib.IMAP4_SSL("imap.gmail.com", 993, ssl_context=context) as imap:
        imap.login(smtp_user, smtp_pass)
        # Intentar carpeta de borradores en español o inglés
        draft_folders = ['"[Gmail]/Borradores"', '"[Gmail]/Drafts"', 'Drafts', '"[Google Mail]/Drafts"']
        for folder in draft_folders:
            try:
                status, _ = imap.append(folder, "\\Draft", imaplib.Time2Internaldate(time.time()), msg.as_bytes())
                if status == "OK":
                    return True
            except Exception:
                continue
    return False


def send_via_smtp(smtp_host, smtp_port, smtp_user, smtp_pass, sender_name, to_email, subject, body):
    msg = email.message.EmailMessage()
    msg["From"] = f"{sender_name} <{smtp_user}>"
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content(body)

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context) as server:
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)


def send_via_resend(resend_api_key, from_address, to_email, subject, body):
    payload = json.dumps({
        "from": from_address,
        "to": [to_email],
        "subject": subject,
        "text": body
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=payload,
        headers={
            "Authorization": f"Bearer {resend_api_key}",
            "Content-Type": "application/json"
        },
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.status in (200, 201)


def main():
    parser = argparse.ArgumentParser(description="Sistema de Envío de Mails con Control Humano — MOCK")
    parser.add_argument("--tanda", type=int, default=1, help="Número de tanda diaria a procesar (1 a 8)")
    parser.add_argument("--modo", choices=["preview", "borradores-gmail", "enviar-smtp", "enviar-resend"], default="preview",
                        help="preview: solo muestra en pantalla | borradores-gmail: crea borradores en tu Gmail | enviar-smtp: envía por Gmail con confirmación")
    parser.add_argument("--demo-url", default=DEFAULT_DEMO_URL, help="URL de la demo de MOCK")
    parser.add_argument("--email-remitente", default=DEFAULT_SENDER_EMAIL, help="Email remitente de Gmail")
    args = parser.parse_args()

    if not os.path.exists(QUEUE_CSV):
        print(f"No se encontró el archivo de cola: {QUEUE_CSV}")
        return

    bajas = load_bajas()
    with open(QUEUE_CSV, "r", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))

    prefix = f"Tanda Día {args.tanda} "
    batch = [r for r in rows if r.get("tanda_dia", "").startswith(prefix)]
    batch = batch[:MAX_DAILY_EMAILS]

    print("=" * 72)
    print(f"MOCK — TANDA DÍA {args.tanda} | Modo: {args.modo.upper()}")
    print(f"Remitente: {args.email_remitente} | Total en tanda: {len(batch)} (Máx diario: {MAX_DAILY_EMAILS})")
    print(f"Demo URL:  {args.demo_url}")
    print("=" * 72)

    smtp_user = os.environ.get("MOCK_SMTP_USER", args.email_remitente)
    smtp_pass = os.environ.get("MOCK_SMTP_PASS", "").replace(" ", "").strip()
    smtp_host = os.environ.get("MOCK_SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.environ.get("MOCK_SMTP_PORT", "465"))
    sender_name = os.environ.get("MOCK_SENDER_NAME", DEFAULT_SENDER_NAME)
    resend_key = os.environ.get("RESEND_API_KEY", "")
    resend_from = os.environ.get("MOCK_RESEND_FROM", f"{sender_name} <{smtp_user}>")

    if args.modo in ("borradores-gmail", "enviar-smtp") and not smtp_pass:
        print("\n[!] ATENCIÓN: Falta configurar la contraseña de aplicación de Google.")
        print("    Generala en https://myaccount.google.com/apppasswords y ejecutá:")
        print(f'    $env:MOCK_SMTP_PASS="tu_contraseña_16_letras"')
        print(f'    python docs/outreach_baserutina/enviar_tanda_mails.py --tanda {args.tanda} --modo {args.modo}\n')
        return

    processed = 0
    for idx, r in enumerate(batch, 1):
        to_email = (r.get("email_destino") or "").strip()
        if not to_email or to_email.lower() in bajas:
            print(f"[{idx}] SALTADO ({to_email}) — Figura en lista de BAJA / no_contactar.")
            continue

        subject = r["asunto_borrador"]
        body = r["cuerpo_borrador_mail"]
        if args.demo_url:
            body = body.replace("[LINK_DEMO_MOCK]", args.demo_url)
            body = body.replace("[INSERTAR_URL_DEMO]", args.demo_url)

        print(f"\n--- [{idx}/{len(batch)}] {r['id_lead']} | {r['nombre']} ({r['negocio']}) — {r['ciudad']} ---")
        print(f"Para:     {to_email}")
        print(f"Variante: {r['variante']}")
        print(f"Asunto:   {subject}")
        print("-" * 40)
        print(body)
        print("-" * 40)

        if args.modo == "preview":
            processed += 1
            continue

        ans = input(f"¿Aprobar este correo para {to_email}? [s/N/q=salir]: ").strip().lower()
        if ans == "q":
            print("Operación detenida por el usuario.")
            break
        if ans != "s":
            print(" -> Omitido por control humano.")
            continue

        if args.modo == "borradores-gmail":
            ok = create_gmail_draft_imap(smtp_user, smtp_pass, sender_name, to_email, subject, body)
            if ok:
                print(" -> Borrador guardado con éxito en tu Gmail.")
                r["aprobacion_humana"] = "BORRADOR_GMAIL_CREADO"
            else:
                print(" -> No se pudo guardar el borrador en Gmail. Verificá IMAP en la cuenta.")
        elif args.modo == "enviar-smtp":
            send_via_smtp(smtp_host, smtp_port, smtp_user, smtp_pass, sender_name, to_email, subject, body)
            r["aprobacion_humana"] = "APROBADO_ALVARO"
            r["estado_envio"] = f"enviado_{datetime.now().strftime('%Y-%m-%d')}"
            print(" -> Enviado por SMTP con éxito. Pausa de 8 segundos (ritmo humano)...")
            time.sleep(8)
        elif args.modo == "enviar-resend":
            send_via_resend(resend_key, resend_from, to_email, subject, body)
            r["aprobacion_humana"] = "APROBADO_ALVARO"
            r["estado_envio"] = f"enviado_{datetime.now().strftime('%Y-%m-%d')}"
            print(" -> Enviado vía Resend con éxito. Pausa de 5 segundos...")
            time.sleep(5)

        processed += 1

    if args.modo != "preview" and processed > 0:
        for out_path in [QUEUE_CSV, os.path.join(BRAIN_DIR, "cola_borradores_mails_20_por_dia.csv")]:
            if os.path.exists(os.path.dirname(out_path)):
                with open(out_path, "w", encoding="utf-8-sig", newline="") as f:
                    writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
                    writer.writeheader()
                    writer.writerows(rows)
        print(f"\n[OK] Se actualizó el estado de {processed} correos en la cola diaria.")


if __name__ == "__main__":
    main()
