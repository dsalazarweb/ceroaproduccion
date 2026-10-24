---
titulo: "Git desde cero (III): cómo deshacer errores, stash y buenas prácticas de equipo"
descripcion: "El botiquín de primeros auxilios de Git. Aprende a deshacer cambios con git restore y revert, guardar ideas al vuelo con stash y estructurar commits profesionales."
fecha: 2026-10-24
tags: ["git", "devops", "avanzado", "buenas-practicas"]
dificultad: "avanzado"
tiempo_lectura: 14
serie: "git-desde-cero"
orden: 3
draft: false
imagen: "/images/guia-git-03-hero.png"
---

Llegamos al final de esta trilogía. En la [primera parte](/guias/git-desde-cero-fundamentos) construimos el modelo mental de las 3 áreas y sellamos nuestro primer commit. En la [segunda parte](/guias/git-desde-cero-ramas-github) aprendimos a abrir universos paralelos con ramas, resolver choques de código y conectar todo con GitHub mediante llaves SSH.

Hasta este punto tienes cubierto el 80% de lo que harás en el día a día. Pero el verdadero nivel técnico de un desarrollador o ingeniero DevOps no se nota cuando todo sale bien en un tutorial de laboratorio: **se nota cuando algo sale mal en producción un viernes por la tarde y no sabes cómo devolverte sin destruir el trabajo de los demás**.

En este último post vamos a equiparte con un auténtico **botiquín de primeros auxilios** para Git: aprenderás a corregir errores con precisión milimétrica, a guardar ideas al vuelo cuando surgen urgencias, a estructurar commits como en las mejores empresas de tecnología y a mantener tu terminal rápida y productiva.

---

## 1. El botiquín de emergencias: cómo deshacer cambios sin pánico

El miedo más grande de cualquiera con Git es meter la pata y creer que no hay vuelta atrás. La realidad es que Git es casi imposible de romper si entiendes qué herramienta usar según la gravedad del problema.

Aquí tienes los 4 escenarios más comunes:

### Escenario A · Rayaste un archivo en tu mesa y quieres devolverlo a como estaba
Hiciste experimentos en un archivo de tu taller, no te gustó cómo quedó y quieres descartar todo lo nuevo para volver a la última foto limpia:

```bash
git restore archivo.txt
```
> **¿Qué hace?** Borra las modificaciones no guardadas de ese archivo en tu mesa de trabajo y lo deja idéntico al último commit. Úsalo con cuidado: los cambios que nunca pasaron por `git add` no tienen copia.

### Escenario B · Metiste un archivo a la caja de empaque por error y quieres sacarlo
Escribiste `git add .` o agregaste un archivo que todavía no estaba listo para salir en la foto:

```bash
git restore --staged archivo.txt
```
> **¿Qué hace?** Saca el archivo de la caja de empaque (*Staging Area*) y lo devuelve a tu mesa de trabajo. **No borra tu código**: solo le dice a Git que no lo incluya en el próximo commit.

### Escenario C · Ya hiciste commit (e incluso lo subiste a GitHub) y necesitas anularlo
Subiste un commit que rompió algo en el servidor o introdujo un bug. La tentación de los novatos es intentar "borrar" el commit de la historia a la fuerza, lo cual rompe los repositorios de todos tus compañeros de equipo.

La forma sana, limpia y profesional es usar **`git revert`**:

```bash
git revert a1b2c3d
```
*(Donde `a1b2c3d` es el hash del commit problemático).*

> **¿Cómo funciona?** Git analiza qué hiciste en ese commit y **crea un commit nuevo exactamente opuesto**. Si agregaste 10 líneas, las borra; si borraste una función, la vuelve a pegar. La historia no se altera hacia atrás: se documenta de forma transparente que hubo un cambio y luego su corrección. En producción esto es oro puro para auditorías.

### Escenario D · `git reset`: el botón de demolición (úsalo con pinzas)
`git reset` es una herramienta potente que literalmente rebobina el tiempo. Tiene tres niveles de intensidad:

```bash
# Nivel 1 (Soft): Deshace el commit, pero deja tus archivos preparados en la caja (Staging)
git reset --soft HEAD~1

# Nivel 2 (Mixed - el predeterminado): Deshace el commit y saca los archivos a tu mesa de trabajo
git reset --mixed HEAD~1

# Nivel 3 (Hard): BORRA todo rastro del commit y de los archivos
git reset --hard HEAD~1
```

> ⚠️ **REGLA DE ORO DE SEGURIDAD:**  
> **Jamás uses `git reset --hard` en una rama que ya compartiste o subiste a GitHub.** Si lo haces, descuadras la historia de todo tu equipo. `reset` es únicamente para limpiar borradores en tu máquina local antes de compartirlos.

---

## 2. `git stash`: el cajón de emergencia cuando surge una urgencia

Imagina esta situación: estás en la mitad de una tarea larga (digamos, rediseñando el carrito de compras), tienes 5 archivos a medio escribir con errores de sintaxis y de repente tu jefe o un cliente te dice: *"¡Se cayó la página de inicio, arréglala ya!"*.

No puedes hacer commit de código a medias que no compila, pero tampoco puedes cambiar de rama con archivos a medio guardar.

Para eso existe **`git stash`** (tu cajón de sastre):

```bash
# 1. Guardar todo tu trabajo a medias en el cajón con una nota descriptiva
git stash push -m "wip: rediseno de carrito de compras"
```

En un instante, Git limpia tu mesa de trabajo y la deja impecable como en el último commit. Ahora puedes saltar de rama con tranquilidad:

```bash
# 2. Atiendes la urgencia
git switch main
# corriges el problema, haces commit y push...

# 3. Vuelves a tu rama de trabajo
git switch feature/carrito

# 4. Sacas tus cosas del cajón exactamente como las dejaste
git stash pop
```

Si tienes varios cambios guardados y quieres ver qué hay en el cajón:
```bash
git stash list
```

---

## 3. Etiquetas de versión (`git tag`): marcando hitos en el camino

Los commits se identifican con hashes raros como `7f3a8b1`. Pero tus usuarios y los despliegues de infraestructura no entienden de hashes: entienden de **versiones** (`v1.0.0`, `v2.1.0`).

Para congelar una foto histórica como una versión oficial de lanzamiento, usamos etiquetas (*tags*):

```bash
# Crear una etiqueta anotada con mensaje y versión
git tag -a v1.0.0 -m "release: primera version oficial en produccion"

# Subir las etiquetas a GitHub
git push origin --tags
```

En GitHub, esto generará automáticamente una entrada en la pestaña de **Releases** con el código fuente empaquetado en un archivo descargable.

---

## 4. Rebase vs Merge: ¿cuándo usar cada uno sin enredarse?

En la [Entrega 2](/guias/git-desde-cero-ramas-github) vimos cómo funciona `git merge`. Pero en proyectos medianos y grandes escucharás hablar mucho de **`git rebase`**.

La diferencia fundamental es puramente estética y de orden histórico:

* **`git merge` (Preserva la realidad):** Une dos ramas creando un commit de fusión. Si hubo desvíos, el historial muestra los caminos que se abrieron y se volvieron a juntar. Es fiel a lo que ocurrió en el tiempo.
* **`git rebase` (Reescribe la historia lineal):** Toma los commits de tu rama, los "despega" temporalmente, adelanta tu rama para que nazca desde la última foto de `main` y vuelve a "pegar" tus commits uno por uno encima. El resultado es una línea recta perfecta, como si nadie más hubiera trabajado al mismo tiempo.

```text
Con Merge:   o───o───o (main)
                  \       \
                   o───o───M (commit de mezcla)

Con Rebase:  o───o───o (main) ───o'───o' (tus commits pegados al final)
```

> **La regla de oro del Rebase:**  
> Puedes hacer rebase en **tus propias ramas de trabajo locales** para dejarlas limpias antes de abrir un Pull Request. Pero **nunca** hagas rebase sobre ramas públicas o compartidas como `main`.

---

## 5. La firma editorial: cómo redactar commits profesionales en español

Uno de los mayores defectos en la industria hispanohablante es escribir commits como:
* ❌ `"arreglos varios"`
* ❌ `"subiendo cambios"`
* ❌ `"por fin sirvio esta vaina"`

En `ceroaproduccion.dev` aplicamos el estándar internacional de **Conventional Commits**, pero redactado en un **español claro y directo** con formato `tipo(alcance opcional): descripción`:

| Prefijo | Cuándo se usa | Ejemplo real |
| :--- | :--- | :--- |
| `feat:` | Una característica o función nueva para el usuario | `feat: anade calculadora de presupuestos en pesos` |
| `fix:` | Corrección de un error o bug en el código | `fix: corrige error de desborde en tarjetas de productos` |
| `docs:` | Cambios exclusivos en documentación o notas | `docs: actualiza guia de instalacion en linux` |
| `style:` | Ajustes de formato, espaciados o CSS sin tocar lógica | `style: normaliza margenes en el pie de pagina` |
| `refactor:` | Mejorar código existente sin añadir funciones ni corregir bugs | `refactor: simplifica funcion de autenticacion de supabase` |
| `chore:` | Tareas de mantenimiento, actualización de librerías o gitignore | `chore: migra dependencias de npm a pnpm` |

Escribir tus mensajes así convierte el historial de tu proyecto en un diario de bitácora profesional que cualquier reclutador o líder técnico sabrá valorar.

---

## 6. Productividad pura: mis aliases de terminal favoritos

Si vas a usar Git todos los días, escribir comandos largos se vuelve tedioso. Puedes enseñarle a Git tus propios atajos de teclado configurando **aliases** en tu archivo global:

```bash
# 'git st' en vez de 'git status'
git config --global alias.st status

# 'git cm' para hacer commit con mensaje
git config --global alias.cm "commit -m"

# 'git br' para listar ramas
git config --global alias.br branch

# 'git lg' para ver un árbol visual coloreado y compacto de la historia
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

Pruébalo corriendo simplemente:
```bash
git lg
```
Verás tu historial transformado en un diagrama interactivo con colores, autores y fechas relativas (*"hace 2 horas"*).

---

## 7. Tabla resumen de emergencias: ¿qué comando uso?

| Si te pasa esto... | El comando salvavidas es... |
| :--- | :--- |
| Modifiqué un archivo en mi mesa y quiero botar los cambios | `git restore archivo.txt` |
| Hice `git add` a un archivo que no quería incluir | `git restore --staged archivo.txt` |
| Me equivoqué en el texto del último commit que acabo de hacer | `git commit --amend -m "nuevo mensaje"` |
| Surgió una urgencia y tengo código a medias en borrador | `git stash push -m "mi nota"` |
| Quiero recuperar mis borradores del cajón | `git stash pop` |
| Subí un commit roto a GitHub y necesito anularlo limpiamente | `git revert <hash-del-commit>` |
| Quiero ver qué cambió en un archivo línea por línea | `git diff archivo.txt` |

---

## 📺 ¿Prefieres aprender en video? Cursos completos recomendados

Si llegaste hasta aquí, ya tienes todo el mapa conceptual y práctico necesario para moverte con seguridad profesional en Git. 

Si te gusta complementar tu aprendizaje viendo cómo otros ingenieros resuelven problemas en pantalla y con código en vivo, estos son los canales y cursos en español que tienen el contenido más completo y pedagógico publicado y de los cuales aprendí la mayoría de las cosas explicadas en esta trilogía:

* **[Píldoras de programación](https://www.youtube.com/@pildorasdeprogramacion)** — *Nelson* tiene un [curso completo de 8 horas](https://www.youtube.com/watch?v=ZCiKsdoPfhY) con una pedagogía impecable: pausado, transparente, explicando la lógica interna de Git paso a paso y con un tono sumamente cercano.
* **[Código Espinoza](https://www.youtube.com/@CodigoEspinoza)** — Su serie modular es ideal si tienes una duda muy puntual sobre cómo instalar o configurar una herramienta específica en pocos minutos.
* **[Soy Dalto](https://www.youtube.com/@soydalto)** — Curso intensivo y con un ritmo acelerado, perfecto para pegarte una maratón práctica de repaso en una sola tarde.
* **[TodoCode](https://www.youtube.com/@TodoCode)** — Explicaciones sumamente gráficas y paso a paso, ideales si estás dando tus primeros pasos absolutos en el mundo de la programación.
* **[Sergie Code](https://www.youtube.com/@sergiecode)** — Tutoriales muy bien estructurados con foco especial en el flujo de trabajo moderno para desarrollo web.
* **[freeCodeCamp Español](https://www.youtube.com/@freeCodeCampEspanol)** — Cursos extensos, completos y sin interrupciones, diseñados para sentarte a practicar con calma.

---

## El camino continúa

Con estas tres entregas tienes un fundamento de control de versiones que está al nivel de lo que exige la industria. Ya no eres alguien que memoriza comandos a ciegas esperando que nada se rompa: entiendes el taller, sabes cómo trabajar en equipo y tienes las herramientas para salir de cualquier atasco.

En los próximos labs de `ceroaproduccion.dev` seguiremos aplicando todo esto en entornos reales: administración de servidores Linux, contenedores con Docker y automatización en la nube con AWS. ¡Nos vemos en el siguiente commit!
