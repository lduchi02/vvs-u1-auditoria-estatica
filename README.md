# Auditoría estática del módulo de descuentos

Actividad de la **Unidad 1 – Evaluación estática** de la asignatura *Verificación y Validación de Software*.

**Autor:** Luis Duchi

## Propósito

Auditar, **antes de ejecutar el software**, un módulo JavaScript que calcula descuentos para una tienda digital:

- revisar requisitos ambiguos y reformularlos como requisitos verificables (RF-01 a RF-04) con trazabilidad;
- analizar el código con **ESLint** y conservar el análisis inicial y final;
- realizar una **inspección por pares** con roles de autor, revisor y registrador;
- registrar defectos y decisiones, y revisar las correcciones mediante un *pull request*.

## Estructura

```
.
├── src/
│   └── descuentos.js          # módulo inspeccionado (corregido tras la inspección)
├── docs/
│   ├── requisitos.md          # Fase A: problemas, RF-01..RF-04, supuestos y matriz de trazabilidad
│   ├── checklist.md           # Fase A/C: checklist de revisión (16 preguntas)
│   ├── reglas-eslint.md       # Fase B: configuración y justificación de reglas
│   ├── inspeccion.md          # Fase C: acta de inspección y tabla de hallazgos
│   └── acta-revision-pr.md    # Fase D: acta de la revisión del pull request
├── evidencias/
│   ├── lint-inicial.txt       # salida de ESLint sobre el código original
│   └── lint-final.txt         # salida de ESLint tras las correcciones
├── eslint.config.js           # configuración de ESLint (flat config)
├── package.json
├── package-lock.json
└── .gitignore
```

## Cómo reproducir

Requisitos: Node.js 18 o superior (usado: v24.22.1) y npm.

```bash
git clone https://github.com/lduchi02/vvs-u1-auditoria-estatica.git
cd vvs-u1-auditoria-estatica
npm install
npm run lint
```

Para ver el análisis del código **original**, se puede revisar el commit inicial:

```bash
git checkout 59ab063 -- src/descuentos.js
npm run lint        # muestra los 7 problemas de evidencias/lint-inicial.txt
git checkout HEAD -- src/descuentos.js
```

## Resultados

| Análisis | Resultado |
|----------|-----------|
| Lint inicial | 7 problemas (5 errores, 2 advertencias) – [`evidencias/lint-inicial.txt`](evidencias/lint-inicial.txt) |
| Lint final | 0 problemas – [`evidencias/lint-final.txt`](evidencias/lint-final.txt) |
| Inspección | 15 hallazgos (7 ESLint, 8 revisión humana) – [`docs/inspeccion.md`](docs/inspeccion.md) |

## Documentación

- [Requisitos y matriz de trazabilidad](docs/requisitos.md)
- [Checklist de revisión](docs/checklist.md)
- [Reglas de ESLint](docs/reglas-eslint.md)
- [Acta de inspección](docs/inspeccion.md)
- [Acta de revisión del pull request](docs/acta-revision-pr.md)

## Nota

La verificación es **estática**: no se ejecutaron pruebas funcionales. Los supuestos de negocio (bono VIP, promociones, redondeo) están documentados como *pendientes de confirmación*.
