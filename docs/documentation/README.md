# 📚 Documentación del Sistema Fitter

## Índice de Documentación Técnica

Esta carpeta contiene toda la documentación de arquitectura, diseño y especificaciones del sistema **Fitter** - Plataforma de Venta y Gestión de Rutinas de Entrenamiento.

---

## 📋 Documentos Disponibles

### 1. **Análisis de Requerimientos**
- [📄 01-requerimientos.md](./01-requerimientos.md)
  - Requerimientos funcionales
  - Requerimientos no funcionales
  - Restricciones y suposiciones

### 2. **Casos de Uso**
- [📐 02-casos-de-uso.puml](./02-casos-de-uso.puml)
  - Diagrama UML de casos de uso
  - Actores del sistema
  - Interacciones principales

### 3. **Modelo de Dominio**
- [📐 03-diagrama-clases.puml](./03-diagrama-clases.puml)
  - Diagrama de clases completo
  - Relaciones entre entidades
  - Atributos y métodos principales

### 4. **Flujos de Proceso**
- [📐 04-diagrama-secuencia.puml](./04-diagrama-secuencia.puml)
  - Secuencia de compra de rutina
  - Secuencia de creación de plantilla
  - Secuencia de generación de PDF
  - Secuencia de webhook Mercado Pago

### 5. **Arquitectura de Sistema**
- [📐 05-diagrama-componentes.puml](./05-diagrama-componentes.puml)
  - Arquitectura de componentes
  - Capas del sistema
  - Integraciones externas

### 6. **Base de Datos**
- [📐 06-diagrama-er.puml](./06-diagrama-er.puml)
  - Modelo Entidad-Relación
  - Esquema completo de tablas
  - Relaciones y cardinalidades

### 7. **Historias de Usuario**
- [📄 07-user-stories.md](./07-user-stories.md)
  - Historias de usuario detalladas
  - Criterios de aceptación
  - Estimaciones

### 8. **Roadmap de Producto**
- [📄 08-roadmap.md](./08-roadmap.md)
  - Fases de implementación
  - Características futuras
  - Evolución del producto

### 9. **Diagrama de Despliegue**
- [📄 despliegue.drawio](./despliegue.drawio)
  - Arquitectura de despliegue
  - Infraestructura cloud

---

## 🎯 Cómo Usar Esta Documentación

### Para Desarrolladores
1. Comienza con `01-requerimientos.md` para entender el alcance
2. Revisa `02-casos-de-uso.puml` para conocer las funcionalidades
3. Estudia `03-diagrama-clases.puml` para el modelo de datos
4. Consulta `04-diagrama-secuencia.puml` para implementar flujos

### Para Product Owners
1. Lee `01-requerimientos.md` para validar el alcance
2. Revisa `07-user-stories.md` para priorizar funcionalidades
3. Consulta `08-roadmap.md` para planificar releases

### Para Stakeholders
1. Empieza con `08-roadmap.md` para ver la visión
2. Revisa `01-requerimientos.md` para el resumen ejecutivo
3. Consulta `02-casos-de-uso.puml` para ver capacidades

---

## 🛠️ Herramientas Recomendadas

### Para Visualizar Diagramas PlantUML (.puml)

1. **VS Code** (Recomendado)
   - Instalar extensión: [PlantUML](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml)
   - Ver preview: `Alt + D`

2. **Online**
   - [PlantUML Web Server](http://www.plantuml.com/plantuml/uml/)
   - Copiar y pegar el contenido

3. **IntelliJ IDEA**
   - Plugin integrado de PlantUML

4. **CLI**
   ```bash
   # Instalar PlantUML
   npm install -g node-plantuml

   # Generar imagen PNG
   puml generate docs/02-casos-de-uso.puml -o docs/images/
   ```

### Para Editar Draw.io
- [Draw.io Desktop](https://github.com/jgraph/drawio-desktop/releases)
- [Draw.io Online](https://app.diagrams.net/)

---

## 📊 Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| Casos de Uso | 15+ |
| Entidades de Dominio | 12 |
| Requerimientos Funcionales | 30+ |
| Requerimientos No Funcionales | 10+ |
| User Stories | 25+ |
| Diagramas UML | 6 |

---

## 🔄 Mantenimiento

Esta documentación debe actualizarse cuando:
- ✅ Se agreguen nuevas funcionalidades
- ✅ Cambien los requerimientos
- ✅ Se modifique la arquitectura
- ✅ Se lancen nuevas versiones

**Última actualización:** 2025-11-13

---

## 📞 Contacto

Para consultas sobre esta documentación:
- **Arquitecto de Software:** [Tu nombre]
- **Product Owner:** [Nombre del PO]
- **Email:** dev@fitter.com

---

## 📜 Licencia

Esta documentación es propiedad de **Fitter** y es confidencial.
© 2025 Fitter. Todos los derechos reservados.
