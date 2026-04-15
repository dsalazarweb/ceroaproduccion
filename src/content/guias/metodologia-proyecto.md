---
titulo: "Cómo organizo mi aprendizaje: Obsidian, dos repos y un vault"
descripcion: "La estrategia de documentación que uso para no perderme en el camino. Obsidian como cerebro del proyecto, dos repositorios de Git y un sistema de carpetas que funciona."
fecha: 2026-04-15
tags: ["obsidian", "organizacion", "productividad", "git"]
dificultad: "principiante"
tiempo_lectura: 10
serie: "devops-en-windows"
orden: 2
draft: false
imagen: "/images/guia2-hero.png"
---

Cuando empecé a tomarme en serio estudiar DevOps, el desastre fue inminente. Tenía notas en Google Docs, miles de bookmarks en Chrome que nunca volvía a leer, un par de scripts sueltos, y hasta notas locas que tenía en un cuaderno físico tirado en mi escritorio. Todo estaba disperso. 

Llevaba muy mal los seguimientos, hasta que me obligué a frenar y decidí centralizar todo en un solo sistema. 

Ahí fue cuando establecí usar un vault de Obsidian en local que funcionara como un "cerebro" absoluto del proyecto, complementándolo con dos repositorios de Git separados y un flujo de trabajo que pudiera ejecutar sin rodeos día a día.

En esta guía te comparto exactamente cómo organizo y gestiono todo — la estructura de carpetas, mis reglas inamovibles, y por qué moverme a Obsidian fue la mejor decisión que pude haber tomado para mi organización.

## La estrategia de dos repositorios

![Diagrama de flujo: practicar en aws-learning, pulir y publicar en ceroaproduccion](/images/guia2-dos-repos.png)

Todo es Git, pero no hay por qué mezclar peras con manzanas. He separado de forma consciente toda mi información de esta manera:

| Repo | Propósito | Contenido |
|------|-----------|-----------|
| `aws-learning` | **Patio de juegos** — scripts, labs, experimentos | Bash scripts, configuraciones, labs crudos, logs y errores |
| `ceroaproduccion` | **Documentación pública** — blog, guías, portafolio | Astro, MD/MDX, CSS, posts limpios, identidad de este mismo blog |

La regla es sencilla: **`aws-learning` es para experimentar y para que el código explote.** **`ceroaproduccion` es para pulir la información de lo que funcionó y enseñarlo públicamente.** 

Por ejemplo, mis labs con Linux los destrozo y documento primero en `aws-learning/labs/fase0-linux`. Y solo cuando mis scripts no generan errores locos, los paso a limpio y construyo mi contenido en `ceroaproduccion/src/content/labs`. No hay manera de equivocarse así.

## ¿Por qué Obsidian y no Notion o Google Docs?

Para entender por qué uso Obsidian, dímelo sin vacilar, hay 5 razones puntuales:

1. **Archivos `.md` locales** — Nadie depente de internet o de cosas en la nube que un día cierran y te lo borran todo. Tus archivos en base local están en tu disco. Son tuyos, siempre.
2. **Usa el mismo formato que el core de mi blog** — Obsidian y Astro consumen lo mismo: Markdown. Escribo un post en Obsidian con buen formato y lo puedo pasar literal a Astro. Eso es oro productivo.
3. **Cero candados y ataduras** — O Lock-in. Mañana desaparecen los desarrolladores de Obsidian; mis archivos de Markdown vivirán dentro de otro editor o incluso en el Notepad sin dañarse.
4. **Offline al extremo** — Trabajas en una terminal, en un bus o si te fuiste al campo y se cayó el internet... mis archivos están allí. Es increíble esa tranquilidad.
5. **Es de a gratis (y de verdad)** — Todo el core principal está para instalar local de maravilla, todo gratuito.

Como te digo, y seré claro: Obsidian no es la herramienta divina que tiene que usar todo el mundo. Pero al enfocarnos hacia documentación de Markdown, integraciones a blog y cosas afines, tiene todo el sentido del mundo usarlo así.

## La estructura del vault

![Estructura visual del vault de Obsidian con carpetas organizadas](/images/guia2-estructura.png)

Las carpetas de mi Vault (en mi ruta `D:\Diego\dsalazar`) no son improvisadas, pero a la vez decidí armarlas con un enfoque para que se entendieran rápido y yo sintiera todo super fluido:

```
dsalazar/                          ← Mi vault de Obsidian
├── 01 - Arquitectura/             ← Stack, reglas, decisiones (ADRs)
├── 02 - Bitácora/                 ← Timeline día a día de lo que hice
├── 03 - Backlog y Roadmap/        ← Qué falta, qué sigue, plan a largo plazo
├── 04 - Creación de Contenido/    ← Borradores de posts y guías
├── 05 - Snippets y Recursos/      ← Errores frecuentes, comandos útiles
├── 06 - Auditoría/                ← Hallazgos, deuda técnica
├── 99 - Plantillas/               ← Templates reutilizables
└── Bienvenido.md                  ← Índice maestro del proyecto
```

Manejo estas carpetas porque me mantienen sobre mis metas:

| Carpeta | Qué guardo ahí | Ejemplo real |
|---------|----------------|--------------|
| 01 - Arquitectura | Las decisiones técnicas del proyecto | "¿Por qué Astro y no Next.js?" (DA-001) |
| 02 - Bitácora | Qué hice cada día, como un diario de trabajo | "Abr 14 — Migré los labs 2, 3 y 4" |
| 03 - Backlog | La lista de tareas pendientes y el roadmap | "Próximo: implementar CMS local" |
| 04 - Contenido | Borradores antes de publicar | Ideas de posts, notas de redacción |
| 05 - Snippets | Comandos que siempre olvido | "git remote set-url origin..." |
| 06 - Auditoría | Cosas que encontré mal y cómo las arreglé | "El header desaparece con overflow:hidden" |

Y ahora un consejo de la casa: no necesitas abrir y crear todas estas carpetas de primer impacto. Ojo, de verdad lo recomiendo: empieza abriendo nada más una o dos (ej. Bitácora de trabajo). Las demás irán apareciendo bajo necesidad porque vas acumulando muchas tareas. Eso fue lo que yo hice.

## Mi flujo de trabajo diario

Todo el proyecto orbita en torno en una secuencia de pasos para no volverme un ocho.

1. **Abro WSL:** Literalmente es mi inicio. Navego en la Shell hasta mi proyecto.
2. **Pongo a ensuciarme las manos:** Code, debug, experimentar... si algo estalla se arregla.
3. **Registro lo nuevo:** Lo que yo aprendí o entendí mejor, lo documento directamente en Bitácora (dentro de mi Obsidian).
4. **Snippets de emergencias:** Los comandos y los errores van para mis archivos del Vault.
5. **Subo el trabajo:** Al final todo debe ir al repositorio usando commit y push en la shell, no hay misterio.

> "El compromiso no es ser perfecto todos los días. Es documentar lo que hice, aunque sea una línea. Las sesiones de 15 minutos bien documentadas valen más que las de 3 horas sin registro."

## Las reglas que me salvaron

Todo esto sonaría estricto si no tuviera unas reglas core que yo he aplicado conscientemente, y ahora te las dejo aquí:

1. **Nunca violar el SSOT:** SSOT (Single Source of Truth). El Obsidian vault en mi carpeta `/dsalazar` es el santuario de verdad. Dejé atrás todos esos Notion y Google Docs redundantes. Nada de hacer copias sueltas o un mega-documento llamado viejo README. La bóveda manda.
2. **WSL domina el entorno:** Nunca ejecutar comandos `npm` y `git` directo en PowerShell. Las rutas van en conflicto y las firmas SSH siempre quedan horribles. Úsalo SIEMPRE todo corriendo local bajo la Bash del WSL (`/mnt/d/Diego...`).
3. **Todo commit debe ir en Español:** Mi repo, mi blog y mis historias se nutren en habla hispana y hay que tener un historial coherente.
4. **Documentación ardiente:** Entiende "documentación ardiente" como soltar las piezas en el momento de creación, y no esperar "al final de un semestre" o del "día de laburo" para anotarla. Todo se olvida tarde o temprano, y es mejor escribir fresco antes de arruinar el hilo de seguimiento.

> "La metodología no es burocracia. Es memoria. Cuando vuelves a un proyecto después de dos semanas y encuentras exactamente dónde lo dejaste, agradeces cada nota que tomaste."

En la siguiente guía hablo de algo que no mucha gente documenta honestamente: cómo uso la IA en mi aprendizaje — para qué sí, para qué no, y por qué la transparencia importa.

[Siguiente guía: Cómos uso la IA como Copiloto →](/guias/ia-en-mi-aprendizaje)
