---
titulo: "Cómo uso la IA en mi aprendizaje DevOps (sin copiar y pegar)"
descripcion: "Transparencia total sobre cómo uso herramientas de IA para documentar, depurar errores y organizar mi proyecto. Qué funciona, qué no, y por qué la honestidad importa."
fecha: 2026-04-15
tags: ["ia", "productividad", "documentacion", "herramientas"]
dificultad: "principiante"
tiempo_lectura: 8
serie: "devops-en-windows"
orden: 3
draft: false
imagen: "/images/guia3-hero.png"
---

Uso inteligencia artificial en este proyecto. Ahí lo dije. De forma muy puntual, transparente y sin vergüenza.

Desde el día 1, la IA ha sido parte de mi flujo de trabajo. No pienses que la uso como un generador de código mágico para "picar" y hacer que el sitio salga al aire mientras yo veo la televisión, sino como una herramienta de apoyo — literal, casi de la misma manera que usaría `grep` para buscar en archivos grandes o un `git log` para trazar el progreso de un bug eterno.

En el mismo [README de mi repositorio base `aws-learning`](https://github.com/dsalazarweb/aws-learning), ya lo dejaba en claro: *"La IA es una herramienta de apoyo en este aprendizaje, no un sustituto del mismo"*. Y en esta guía te digo exactamente para qué SÍ la uso, para qué NO, y por qué la honestidad en este proceso de aprendizaje (para mí, como Devops en transición) importa muchísimo.

## Mi filosofía sobre la IA

Esta es la filosofía de mi día a día, y así he logrado aprender:

> "Se usa para mejorar la estructura y redacción de la documentación, revisar errores de sintaxis cuando no es posible identificarlos manualmente, y entender el por qué detrás de cada solución — lo que luego se documenta para poder replicarlo sin asistencia."

Yo me tomé muy a pecho este concepto. Para que quede claro, el reto real es usar la IA sin caer en el típico y letal hábito de copiar y pegar sin entender de qué van los bloques de comandos.

Te comparto una reflexión directa: la IA no te va a reemplazar el aprendizaje. Lo puede acelerar cuando la usas sobre áreas donde ya tienes bases sólidas, pero si no tienes los fundamentos bien armados, te terminarás convirtiendo en un robot o un loro que repite comandos que, a la mínima de un bug ajeno a tu conocimiento, estallará tu sistema completo. 

Un profesional que sabe trabajar tanto de forma manual como asistida por estas herramientas, definitivamente se vuelve adaptable al entorno de DevOps.

## Para qué SÍ la uso

![Diagrama de flujo: Error, IA analiza, humano verifica, documenta solución](/images/guia3-para-que-si.png)

No creas que soy de los que reniega la asistencia. Si a la IA le saco jugo, se lo saco en las siguientes 4 cosas enormes:

### 1. Documentación y redacción de mis archivos
Durante un laboratorio pesado con Bash Scripts, a veces suelo ser desordenado usando la shell de WSL. Escribo un montón en Obsidian tirando "borradores rápidos". Ahí meto a la IA. Le digo *"Toma mis notas en bruto y pule este desmadre"*. Ella genera un formato prolijo de mis tablas de datos y de bloques.

De nuevo: *lo que NO hace la IA es inventar lo que aprendí*. Mi labor está completada. Ella toma mis piezas y me ayuda a organizarlas. Todos los scripts de comandos los he pensado yo, y mis conclusiones igual.

### 2. Debugging... porque los errores no siempre tienen un sentido lógico
Aquí voy con el ejemplo real y crudo que viví en el proyecto: tuve el mítico Error E002 del proyecto. Yo usaba Astro en versión antigua y me había migrado a Astro 6. De repente las colecciones de la sección de Labs me daban vacías. Usé mi AI (Antigravity/Claude en mi IDE) y me detectó rapidísimo que Astro 6 había modificado su estructura pasando todo de `type: 'content'` a requerir un importador `glob` para el Loader.

Era una tontería de sintaxis y arquitectura interna.

```typescript
// ❌ API antigua (Astro 4) — lo que yo tenía
const labs = defineCollection({ type: 'content', schema: z.object({...}) });

// ✅ API nueva (Astro 6) — lo que la IA me ayudó a encontrar
import { glob } from 'astro/loaders';
const labs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/labs' }),
  schema: z.object({...})
});
```

Lo pude reparar y entenderlo gracias a la explicación técnica.

### 3. Auditoría y detección de inconsistencias internas
Cuando has montado dos repos, un sistema local Vault de Obsidian, URLs, carpetitas MDX y variables `.env` para servicios ajenos, y un Cloudflare al medio... la probabilidad de que una cosa se rompa y otra no... es muy alta.

He ordenado una auditoría que logró revisar de arriba a abajo mi entorno detectando enlaces rotos que hice yo mismo (ejemplo enlaces de notas), me encontró dependencias de versión, y me revisó por variables estáticas olvidadas. Me ahorró un bloque de unas 5 horas buscando línea por línea.

### 4. Mantener el Contexto (Knowledge Items) entre Sesiones
El mejor de los mundos: un compañero que literalmente no se olvida lo que hablamos hace 3 ciclos de la sesión. El sistema de mi IA puede generar unas notas de referencia y mantener a tope qué cosas resolví 2 días atrás o saber específicamente hacia dónde apunto y qué estoy ignorando.

## Para qué NO la uso

Aquí la cosa cambia. Hay tres niveles donde está bloqueadísima la intervención de ella:

1. **Escribir código que no entiendo:** Regla del día uno. Si me tira una línea de JS o Bash rebuscada y yo le pregunto qué es, y la explicación no me dice ni jota (o la olvido)... ese código no entra a mi proyecto, de ninguna manera.
2. **Tomar decisiones de arquitectura sin que yo haya investigado:** Sé que a la IA le puedes pedir cosas para armar CMS robustos (Keystatic, Decap, Tina), pero la decisión final debe ser basada en mi concepto sobre Trade-offs. La IA expone y plantea, yo tomo la última palabra tras testear.
3. **No te va a asistir en los laboratorios como un reemplazo directo a tu práctica:** Cuando yo teclee en WSL los comandos como el de instalar certificados, o crear los scripts sh, usar permisos con un simple pero letal `kill -9`... ese proceso no lo ha tipeado la IA. Yo puse mis manos sobre el teclado para ejecutar los permisos.

## ¿Es trampa usar IA en tu desarrollo?

![Dos herramientas lado a lado: manual y asistida, ambas legítimas](/images/guia3-es-trampa.png)

No, simple, y la industria también sabe esto de memoria. Las empresas más locas y top del mercado en DevOps andan con copilotos en toda la plataforma: GitHub Copilot, integraciones internas de LLMs y demás. Son de a deveras, no son adornos.

¿Sabes de verdad dónde está la frontera divisoria aquí?

La frontera se encuentra en que un junior (al que le asista la IA) simplemente "copiará" las cajas negras pre-generadas que salieron sin siquiera saber el por qué (papagayo modo). El profesional de verdad te dirá qué significa el Output y, sobre todas las cosas, podrá **protegerte del código fallido** tras una revisión analítica manual.

Yo no vengo aquí a darles mentiras por la cara simulando un mundo feliz que controlo solo de memoria. Yo busco solucionar y escalar efectivamente, todo a través de documentación fiel en el proyecto. 

> "Un mecánico no es menos profesional por usar un diagnóstico electrónico en lugar de adivinar el problema. Lo que importa es que sabe interpretar el resultado y reparar el motor."

Es vital.

> "La IA más poderosa del mundo no te va a dar experiencia. Eso solo se consigue equivocándote, arreglándolo, y documentándolo. La IA solo hace que el camino sea menos solitario."

En la última guía de la serie llega el momento de la verdad: poner todo en internet. De `localhost:4321` a un dominio `.dev` real con deploy automático. Veremos el poder de Astro con Cloudflare Pages.

[Siguiente guía: De localhost a producción →](/guias/astro-a-produccion)
