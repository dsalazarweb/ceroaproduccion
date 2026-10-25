---
titulo: "Git desde cero (I): el modelo mental, instalación y tu primer commit"
descripcion: "La guía que me hubiera gustado encontrar al arrancar. Entiende las 3 áreas de Git sin tecnicismos raros, instálalo en Windows, Mac o Linux y toma tu primera foto segura."
fecha: 2026-10-24
tags: ["git", "devops", "terminal", "principiante"]
dificultad: "principiante"
tiempo_lectura: 12
serie: "git-desde-cero"
orden: 1
draft: false
imagen: "/images/guia-git-01-hero.png"
---

Durante mucho tiempo vi a amigos y compañeros guardar copias de sus proyectos con nombres como `proyecto_final_v2.zip`, `proyecto_definitivo_ahora_si.zip` o `entrega_final_final_real.rar`. Y siendo totalmente sincero: yo también cometí ese error al comenzar en tecnología. 

Parecía la forma más rápida y lógica de no perder nada... hasta el día en que un archivo se dañaba, no sabías cuál versión era la buena o intentabas combinar dos cambios hechos por personas distintas la misma noche. Ahí el desastre era total.

> Esta es la primera entrega de una serie de tres guías prácticas donde documento cómo dominar Git desde cero, con los pies en la tierra. Cuando empecé en DevOps, la terminal me parecía un campo minado de comandos que asustaban. Por eso aquí vamos a ir sin enredarnos con la pita: explicando el porqué de cada cosa, con calma y directo al grano.

---

## 1. El gran error: ¿por qué no basta con Google Drive o Dropbox?

Servicios como Google Drive, OneDrive o Dropbox son una maravilla para respaldar fotos familiares, PDFs de la universidad o documentos personales, pero para programar o manejar infraestructura tienen dos problemas gigantes:

1. **Guardan estados automáticos, no intenciones:** Si te equivocas en una línea de código que rompe toda la aplicación y le das guardar, la nube sincroniza ese error de inmediato y sobreescribe lo que sí servía.
2. **No entienden de caminos paralelos:** Si dos personas tocan el mismo archivo al mismo tiempo, el sistema crea el clásico `archivo (copia en conflicto de Diego).txt` en vez de mezclar los cambios de forma inteligente.

Git no es un servicio de almacenamiento en la nube. Es un **sistema de control de versiones**. Cada vez que tú decides registrar un punto en el tiempo (lo que llamamos un *commit*), Git no guarda una copia pesada de todo tu disco: toma una **fotografía instantánea** (*snapshot*) del estado exacto de tus archivos, permitiéndote viajar a cualquier punto de la historia cuando lo necesites.

Y lo mejor: todo esto vive **100% dentro de tu propio computador**. No necesitas internet, ni servidores externos, ni pagar un solo peso para usar Git en tu día a día.

---

## 2. El modelo mental: las 3 áreas de Git explicadas con calma

Casi todo el mundo se frustra con Git porque intenta memorizar comandos antes de entender dónde está parado. Para no perderte nunca, solo imagínate este taller de trabajo:

```text
🛠️ Working Directory  (Tu mesa de trabajo: archivos vivos)
         │
         │  git add
         ▼
📦 Staging Area       (La caja de empaque: cambios preparados)
         │
         │  git commit
         ▼
📸 Repositorio Local  (El álbum histórico: fotos selladas en .git)
```

1. 🛠️ **Directorio de Trabajo (Working Directory):** Es la carpeta real en tu computador. Aquí abres tu editor, creas archivos, borras código y experimentas. Todo lo que esté aquí es borrador vivo.
2. 📦 **Área de Preparación (Staging Area / Index):** Imagínate una caja de empaque abierta al lado de tu mesa. Cuando terminas de pulir un archivo específico, no lo guardas de inmediato en el historial: lo metes a la caja con `git add`. Esto te permite elegir con pinzas qué cambios van a salir en el paquete y cuáles se quedan todavía en borrador.
3. 📸 **Repositorio Local (.git):** Cuando la caja tiene exactamente lo que querías, la sellas con `git commit`. Git le pega una etiqueta con tu nombre, la fecha, un identificador único y una descripción de lo que hiciste. Ese paquete queda guardado para siempre en una carpeta oculta llamada `.git`.

---

## 3. Instalación limpia multiplataforma (sin enredos)

Para que esta guía le sirva a cualquiera, aquí tienes la forma más limpia de instalarlo en tu sistema operativo:

### En Windows
El error más común en Windows es quedarse con la consola tradicional (CMD) o enredarse con instaladores viejos. La recomendación de la industria es usar **Git Bash** (que viene incluido en el paquete oficial y te da una terminal con sabor a Linux):

* **Opción rápida por terminal (PowerShell como Administrador):**
  ```powershell
  winget install --id Git.Git -e --source winget
  ```
* **Detalle vital durante la instalación:** Si lo instalas con el asistente gráfico de ventanas, asegúrate de marcar la opción de saltos de línea: *"Checkout Windows-style, commit Unix-style line endings"* (`core.autocrlf = true`). Así evitas problemas cuando compartas código con gente en Linux o Mac.

### En macOS
En Mac la ruta más ordenada y profesional es a través del gestor de paquetes **Homebrew**:

```bash
brew install git
```
*(Alternativa sin Homebrew: si abres tu terminal y escribes `git --version`, el mismo sistema operativo te preguntará si deseas instalar las herramientas de línea de comandos de Xcode, que ya traen Git incluido).*

### En Linux
En cualquier distribución Linux moderna se instala en un par de segundos desde los repositorios oficiales:

* **Ubuntu / Debian / Linux Mint:**
  ```bash
  sudo apt update && sudo apt install git -y
  ```
* **Fedora / RHEL:**
  ```bash
  sudo dnf install git -y
  ```
* **Arch Linux / Manjaro:**
  ```bash
  sudo pacman -S git
  ```

Para verificar que quedó bien instalado en cualquiera de los tres sistemas:
```bash
git --version
# Debe responderte algo como: git version 2.4x.x
```

---

## 4. Configuración inicial obligatoria (solo se hace una vez)

Antes de crear tu primer proyecto, tienes que decirle a Git quién eres. Esto es sagrado: si no lo configuras, Git no sabrá a quién atribuirle los cambios.

Abre tu terminal y corre estos comandos:

```bash
# 1. Tu nombre público para firmar el historial
git config --global user.name "Tu Nombre"

# 2. Tu correo electrónico (el mismo que uses en GitHub)
git config --global user.email "tu-correo@ejemplo.com"

# 3. Establecer 'main' como el nombre estándar de la rama principal
git config --global init.defaultBranch main

# 4. Normalizar saltos de línea para evitar advertencias molestas
# Si estás en Windows:
git config --global core.autocrlf true
# Si estás en Mac o Linux:
git config --global core.autocrlf input
```

Si quieres comprobar que todo quedó bien guardado:
```bash
git config --global --list
```

---

## 5. El ciclo fundamental: de carpeta vacía a tu primera foto

Vamos a ensuciarnos las manos con un ejemplo real. Abre tu terminal y sigue estos 5 pasos:

### Paso 1 · Crear e inicializar el proyecto
```bash
mkdir mi-laboratorio
cd mi-laboratorio
git init
```
¿Qué pasó aquí? Git acaba de crear una carpeta invisible llamada `.git/`. A partir de este segundo, esa carpeta se convierte en un radar que vigila todo lo que ocurra dentro de `mi-laboratorio`.

### Paso 2 · Crear un archivo y pedir el reporte
Crea un archivo llamado `notas.txt` (puedes escribirle cualquier frase adentro) y pregúntale a Git cómo ve el panorama:
```bash
git status
```
Verás un mensaje en rojo que dice: `Untracked files: notas.txt`. Git te está diciendo: *"Veo que creaste este archivo en la mesa de trabajo, pero todavía no me has dicho si quieres que lo vigile"*.

### Paso 3 · Meter el archivo a la caja (Staging)
```bash
git add notas.txt
```
Si vuelves a ejecutar `git status`, la magia ocurre: el archivo ahora aparece en color verde bajo `Changes to be committed`. Ya está empacado en la caja de cartón, listo para el envío.

### Paso 4 · Sellar la foto histórica (Commit)
```bash
git commit -m "feat: crear archivo de notas inicial del laboratorio"
```
¡Listo! Acabas de tomar tu primera fotografía formal en el tiempo. Git te responderá confirmando que se guardó el cambio y asignándole un identificador único (un código alfanumérico corto llamado *hash*).

### Paso 5 · Revisar el álbum de fotos
```bash
git log --oneline
```
Verás algo como esto:
```text
a1b2c3d (HEAD -> main) feat: crear archivo de notas inicial del laboratorio
```
Ese `HEAD -> main` significa que estás parado en la rama principal (`main`) y que el visor de la cámara (`HEAD`) está apuntando exactamente a esa última foto que acabas de tomar.

---

## 6. La regla de oro: el archivo `.gitignore`

No todo lo que vive en tu mesa de trabajo debe guardarse en el álbum. Hay cosas que **nunca** deberían entrar a Git:
- Archivos temporales o basura del sistema (`.DS_Store` en Mac, `Thumbs.db` en Windows).
- Carpetas de dependencias pesadas (`node_modules/` o entornos virtuales de Python `venv/`).
- Archivos con credenciales, contraseñas o llaves privadas (`.env`).

Para evitar meterlos por descuido, creas un archivo llamado exactamente `.gitignore` en la raíz de tu proyecto:

```text
# Dependencias pesadas
node_modules/
venv/
__pycache__/

# Basura del sistema operativo
.DS_Store
Thumbs.db

# Secretos y variables de entorno
.env
```

A partir de ese momento, Git actuará como si esos archivos no existieran: no te los mostrará en rojo ni te dejará cometer el error de agregarlos por accidente.

---

## ¿Qué sigue ahora?

Ya tienes tu taller montado, tus herramientas configuradas y sabes cómo tomar fotos seguras de tu trabajo en local. 

En la [Entrega 2](/guias/git-desde-cero-ramas-github), daremos el gran salto: aprenderemos a abrir universos paralelos con ramas (`git switch`), a resolver choques de código sin entrar en pánico cuando dos personas modifican el mismo archivo, y a conectar todo este trabajo con **GitHub** en la nube usando llaves SSH seguras.
