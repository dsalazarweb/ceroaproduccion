---
titulo: "Git desde cero (II): ramas, conflictos sin pánico y cómo subir tu código a GitHub"
descripcion: "Aprende a trabajar en caminos paralelos con git switch, fusionar código sin miedo a los conflictos y sincronizar tu proyecto con GitHub usando llaves SSH."
fecha: 2026-10-24
tags: ["git", "github", "ramas", "ssh", "principiante"]
dificultad: "principiante"
tiempo_lectura: 15
serie: "git-desde-cero"
orden: 2
draft: false
imagen: "/images/guia-git-02-hero.png"
---

En la [primera entrega de esta serie](/guias/git-desde-cero-fundamentos) dejamos las bases bien sentadas: entendimos las 3 áreas de trabajo (mesa, caja y álbum), configuramos la terminal y aprendimos a tomar fotografías históricas (*commits*) dentro de nuestro propio computador. 

Hasta ahí todo marcha sobre ruedas mientras trabajes solo en un archivo a la vez. Pero en el mundo real, en cualquier equipo o proyecto serio de desarrollo y DevOps, tarde o temprano pasa esto:

* Tienes que probar una función nueva sin dañar la versión que ya está funcionando en producción.
* Dos personas editan partes del mismo archivo el mismo día.
* Necesitas compartir tu código en un repositorio remoto en la nube (como GitHub) sin exponer contraseñas ni desarmar la historia.

Aquí es donde entra la verdadera potencia de Git. En esta segunda entrega vamos a perderle el miedo a las **ramas**, entenderemos cómo desarmar un **conflicto** sin sudar frío y conectaremos nuestro repositorio local con **GitHub** usando una conexión segura con llaves SSH.

---

## 1. ¿Qué es una rama en la vida real?

Casi siempre nos explican las ramas con árboles y flechas abstractas. Para mí, la mejor forma de entenderlo es con una analogía cotidiana:

> Imagina que tienes el borrador original de un contrato o una receta de cocina en tu escritorio. Quieres experimentar agregándole un ingrediente raro o cambiando una cláusula arriesgada. 
> 
> En vez de rayar el documento original con bolígrafo, **le sacas una fotocopia idéntica**. Te vas a otra mesa, rayas, tachas, pruebas. Si la idea fracasa, simplemente arrugas la fotocopia y la tiras a la basura: el original sigue intacto. Pero si la idea queda perfecta, pasas esos cambios limpios al documento principal.

Eso es exactamente una **rama** (*branch*). 

Por defecto, Git te crea una línea de tiempo principal llamada `main`. Trabajar directamente en `main` para hacer experimentos es una pésima práctica. Lo profesional es abrir una rama paralela, terminar la tarea, probarla y luego fusionarla (*merge*).

---

## 2. Comandos modernos para moverte entre ramas

Durante muchos años, la gente usó un comando sobrecargado llamado `git checkout` tanto para cambiar de rama como para restaurar archivos. Era confuso y fácil de equivocar. 

Desde la versión 2.23, Git introdujo un comando mucho más claro y especializado: **`git switch`** (literalmente: *"cambiar de interruptor"*).

### Crear y saltar a una rama nueva en un solo paso
```bash
git switch -c feature/boton-contacto
```
La bandera `-c` viene de *create*. Git te responderá:  
`Switched to a new branch 'feature/boton-contacto'`.

A partir de este segundo, cualquier commit que hagas quedará registrado en este camino paralelo. `main` se queda congelada en el estado anterior.

### Ver en qué rama estás parado
```bash
git branch
```
Verás la lista de ramas y un asterisco verde marcando la activa:
```text
* feature/boton-contacto
  main
```

### Regresar a la rama principal
Cuando quieras volver al camino central, simplemente dices:
```bash
git switch main
```
Tu editor de código actualizará los archivos al instante, ocultando lo que hiciste en la rama secundaria. No se ha borrado nada; simplemente cambiaste de carril.

---

## 3. El misterio de `HEAD`: ¿dónde tienes puesta la aguja?

Cada vez que ejecutas `git log` o miras la terminal, aparece una palabra en mayúsculas: **`HEAD`**.

No te compliques con definiciones teóricas: **`HEAD` es el cabezal de lectura de un tocadiscos o la aguja de un cassette**.

* Te indica exactamente **en qué rama y en qué commit tienes puestos los ojos en este instante**.
* Si ves `(HEAD -> main)`, la aguja está sonando en la punta de la rama principal.
* Si haces `git switch feature/boton-contacto`, la aguja se mueve hacia esa rama: `(HEAD -> feature/boton-contacto)`.

---

## 4. Fusionar caminos (`git merge`)

Hiciste tus cambios en `feature/boton-contacto`, hiciste commit y probaste que todo funciona impecable. Ahora toca traer esa mejora a la rama principal.

El proceso siempre tiene dos pasos lógicos:

1. **Pararte en la rama receptora** (donde quieres recibir los cambios):
   ```bash
   git switch main
   ```
2. **Llamar la rama que quieres incorporar**:
   ```bash
   git merge feature/boton-contacto
   ```

### ¿Qué ocurre detrás de escena?
* **Fast-forward (Avance rápido):** Si nadie tocó `main` mientras trabajabas en tu rama, Git simplemente rueda la aguja hacia adelante. No hay mezclas raras: es una línea recta continua.
* **Merge commit (Fusión de caminos):** Si `main` también recibió otros commits en el camino, Git crea un commit especial que une ambas historias de forma limpia.

Una vez fusionada, esa rama temporal ya cumplió su ciclo de vida y la puedes eliminar para mantener la casa ordenada:
```bash
git branch -d feature/boton-contacto
```

---

## 5. Conflictos: cómo resolverlos sin entrar en pánico

El mayor susto de cualquier persona que empieza con Git es ver la palabra **CONFLICT** en la terminal. Parece que hubieras roto el proyecto, pero en realidad es Git protegiendo tu trabajo.

### ¿Por qué pasa?
Ocurre únicamente cuando **dos ramas modificaron exactamente las mismas líneas del mismo archivo** y luego intentas fusionarlas. Git dice: *"Amigo, tú cambiaste la línea 15 diciendo 'azul' y la otra rama cambió la misma línea diciendo 'rojo'. Yo no puedo adivinar cuál prefieres tú. Dime tú cuál dejamos"*.

Cuando hay un conflicto, Git detiene la fusión y marca el archivo afectado con unos separadores muy característicos:

```text
<<<<<<< HEAD (Current Change: lo que tienes en tu rama actual)
El color del botón es azul marino.
=======
El color del botón es verde esmeralda.
>>>>>>> feature/boton-contacto (Incoming Change: lo que viene de la otra rama)
```

### Cómo resolverlo en 30 segundos (con VS Code)
No necesitas comandos raros. Abres el archivo en **Visual Studio Code** y el editor te pintará el bloque de colores con botones interactivos arriba del texto:

1. **Accept Current Change:** Te quedas con tu versión actual.
2. **Accept Incoming Change:** Te quedas con la versión que viene de la otra rama.
3. **Accept Both Changes:** Dejas ambas cosas.
4. **Editar a mano:** Borras los marcadores (`<<<<<<<`, `=======`, `>>>>>>>`) y dejas el texto redactado exactamente como debe quedar.

Una vez decidido el texto final:
```bash
# 1. Guardas el archivo y lo pasas a staging
git add archivo-con-conflicto.txt

# 2. Concluyes la fusión
git commit -m "merge: resuelve conflicto de colores en boton principal"
```
Listo. El susto terminó y el historial continúa impecable.

---

## 6. El salto a la nube: conectar tu repositorio con GitHub

Hasta ahora todo ha vivido en el disco duro de tu máquina. Llegó el momento de respaldarlo y compartirlo en **GitHub**.

### Paso 1 · Crear el repositorio en GitHub
1. Entra a [github.com](https://github.com) e inicia sesión.
2. Haz clic en el botón verde **New** (Nuevo repositorio).
3. Ponle nombre (por ejemplo `mi-laboratorio`).
4. **REGLA DE ORO:** Déjalo **público o privado**, pero **NO marques** las casillas de *"Add a README file"*, *"Add .gitignore"* ni *"Choose a license"*. Queremos un cascarón 100% vacío para no generar choques con lo que ya creamos en local.

### Paso 2 · Autenticación segura con SSH (olvídate de las contraseñas)
Desde hace un buen tiempo, GitHub ya no acepta tu contraseña de usuario para subir código desde la terminal; te exige usar tokens o llaves SSH.

Como vimos a fondo en nuestra guía sobre [cómo configurar llaves SSH para conectarte a servidores](/labs/linux-ssh-llaves-config), las llaves SSH son la forma más cómoda y segura de trabajar:

1. Copia tu llave pública:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
2. En GitHub, ve a **Settings → SSH and GPG keys → New SSH key**.
3. Pega el contenido y guarda.

Para confirmar que tienes paso libre:
```bash
ssh -T git@github.com
# Te debe responder: "Hi tu-usuario! You've successfully authenticated..."
```

### Paso 3 · Enlazar el remoto y hacer el primer Push
En tu terminal local, parado dentro de tu proyecto, ejecutas estos dos comandos que GitHub te indica:

```bash
# 1. Bautizar el servidor remoto con el alias estándar 'origin'
git remote add origin git@github.com:tu-usuario/mi-laboratorio.git

# 2. Subir tu rama main por primera vez y dejarla enlazada
git push -u origin main
```

> **¿Qué hace esa bandera `-u`?**  
> Significa *upstream*. Le dice a Git: *"Enlaza mi rama local `main` con la rama `main` de GitHub"*. Gracias a esto, la próxima vez que quieras subir cambios solo tendrás que escribir **`git push`** a secas, sin volver a escribir todo el chorizo de parámetros.

---

## 7. El flujo de trabajo diario en equipo (la rutina sana)

Si vas a colaborar o a trabajar desde varios equipos, tu rutina diaria se reduce a este ciclo de 4 pasos:

```text
1. Sincronizar  (git pull origin main)
         │
         ▼
2. Crear rama   (git switch -c feature/...)
         │
         ▼
3. Producir     (git add + git commit)
         │
         ▼
4. Subir        (git push -u origin feature/...)
```

1. **Al iniciar el día:** Siempre descarga lo último que hayan subido otros:
   ```bash
   git switch main
   git pull origin main
   ```
2. **Para cada tarea nueva:** Abres una rama descriptiva:
   ```bash
   git switch -c fix/corregir-alineacion-menu
   ```
3. **Trabajas, pruebas y documentas:**
   ```bash
   git add .
   git commit -m "fix: alinea contenedor de navegacion en pantallas moviles"
   ```
4. **Subes tu rama a GitHub para revisión:**
   ```bash
   git push -u origin fix/corregir-alineacion-menu
   ```
En la web de GitHub verás un botón para abrir un **Pull Request (PR)**, permitiendo que tu equipo revise los cambios antes de mezclarlos definitivamente con `main`.

---

## ¿Qué sigue ahora?

Ya dominas el flujo moderno: creas ramas sin romper la línea principal, resuelves conflictos con calma y tienes tu código respaldado en la nube con llaves criptográficas seguras.

Pero en el día a día real, las cosas a veces fallan: cometes un error grave en un commit, necesitas borrar cambios antes de que nadie los vea o te toca pausar lo que estás haciendo porque surgió una emergencia en producción.

En la [Entrega 3 (Post final)](/guias/git-desde-cero-deshacer-buenas-practicas), abriremos el botiquín de emergencias de Git:
* Cómo deshacer cambios con precisión quirúrgica (`restore`, `revert` y cuándo tenerle respeto a `reset`).
* Guardar ideas a medio cocinar sin ensuciar la historia con `git stash`.
* El estándar de mensajes profesionales en español que usamos en producción.
* Y como cierre especial: nuestro hub curado con los mejores cursos completos en video para continuar tu camino.
