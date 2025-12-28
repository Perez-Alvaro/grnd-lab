# ⚡ Generación de Rutinas con IA - Guía Rápida

## 🎯 Dos Métodos Disponibles

### ✅ Método 1: Prompt Manual (RECOMENDADO - GRATIS)

**Workflow Copy/Paste sin costos, sin API keys**

1. **Copiar Prompt**: Click en "Copiar Prompt para IA"
2. **Pegar en IA**: ChatGPT, Claude, Gemini (versión gratis)
3. **Importar JSON**: Pega la respuesta en "Editor JSON"
4. **Guardar**: ¡Listo!

📚 **Guía completa**: `docs/GENERACION_IA_MANUAL.md`

**Ventajas**:
- ✅ 100% gratis
- ✅ Sin límites
- ✅ Editor en vivo (Split-View)
- ✅ Total control

---

### Método 2: API Directa (Requiere OpenAI API Key)

**Generación automática con un click**

#### Paso 1: Obtén API Key
Ve a [OpenAI Platform](https://platform.openai.com/api-keys)

#### Paso 2: Configura .env
```bash
VITE_OPENAI_API_KEY=sk-tu_api_key_aqui
```

#### Paso 3: Reinicia
```bash
npm run dev:all
```

**Ventajas**:
- ✅ Más rápido (un click)
- ✅ No requiere copiar/pegar

**Desventajas**:
- ❌ Requiere créditos en OpenAI
- ❌ Costo: ~$0.002 por rutina

---

## 💡 ¿Cuál Usar?

### Usa **Prompt Manual** si:
- Quieres **gratis absoluto**
- No tienes API key de OpenAI
- Prefieres control total
- Quieres editar el JSON manualmente

### Usa **API Directa** si:
- Ya tienes créditos en OpenAI
- Prefieres velocidad
- No te importa pagar ~$5/mes

---

## 🚀 Workflow Recomendado

1. **Empieza con Prompt Manual** (gratis)
2. Si generas MUCHAS rutinas, considera API Directa
3. Combina ambos: Prompt Manual para probar, API para producción

---

## 📚 Documentación Completa

- **Método Manual**: `docs/GENERACION_IA_MANUAL.md`
- **M étodo API**: `docs/AI_SETUP.md`

---

**Recomendación**: Usa el **Método 1 (Prompt Manual)** para empezar. Es gratis, fácil y te da máximo control 🎉
