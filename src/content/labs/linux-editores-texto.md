---
titulo: "Editores de texto en la terminal: nano y vim"
descripcion: "Cómo editar archivos directamente desde la terminal. Indispensable para configurar servidores remotos donde no hay interfaz gráfica."
fecha: 2026-05-19
fase: 0
dia: 5
tags: ["linux", "nano", "vim", "terminal", "principiante"]
imagen: "/images/tux-minimal.png"
draft: false
---

## Objetivo

Aprender a editar archivos directamente desde la terminal sin interfaz gráfica. Es la habilidad más básica y crítica del trabajo en servidores remotos: todo lo que configures en AWS, Docker o Kubernetes lo harás a través de un editor de terminal.

---

## Concepto clave del día

Cuando te conectas a un servidor via SSH no tienes VS Code, no tienes clic derecho, no hay GUI. Lo único que tienes es la terminal. Configurar Nginx, editar un Dockerfile, ajustar variables de entorno en producción — todo se hace con un editor de terminal. Hay dos que debes dominar: **nano** para ediciones rápidas y **vim** para cuando necesitas potencia real.

---

## Nano — El editor amigable

Nano muestra sus atajos en la parte inferior de la pantalla. Es el editor ideal para ediciones rápidas cuando no necesitas funcionalidades avanzadas.

### Abrir y crear archivos

```bash
nano archivo.txt           # abre si existe, crea si no existe
nano /etc/hosts            # editar archivos del sistema (requiere sudo)
sudo nano /etc/nginx/nginx.conf   # patrón común en administración de servidores
```

### Atajos esenciales de nano

```
Ctrl + O    → guardar (Write Out) — pide confirmar nombre, Enter para aceptar
Ctrl + X    → salir (si hay cambios sin guardar, pregunta antes)
Ctrl + W    → buscar texto (Where is)
Ctrl + K    → cortar línea completa
Ctrl + U    → pegar línea cortada
Ctrl + G    → ayuda completa
Ctrl + /    → ir a línea:columna específica
```

### Flujo de trabajo típico en nano

```bash
# 1. Abrir archivo
nano config.txt

# 2. Editar — escribes directamente, sin modos
# 3. Guardar: Ctrl+O → Enter
# 4. Salir: Ctrl+X
```

---

## Vim — El editor estándar del servidor

Vim está instalado en prácticamente todas las distribuciones Linux, incluidos los AMI de AWS. Su curva de aprendizaje es empinada porque es **modal**: no puedes escribir texto al abrirlo. Primero debes entender en qué modo estás.

### Los tres modos fundamentales

```
MODO NORMAL (default al abrir)
  → navegar, ejecutar comandos, copiar/pegar
  → es el modo "base" — vuelves aquí con Esc

MODO INSERTAR (presionar i)
  → escribir texto normalmente
  → Esc para volver a Normal

MODO COMANDO (presionar : en modo Normal)
  → ejecutar comandos de guardado, búsqueda, sustitución
  → Enter para ejecutar, Esc para cancelar
```

### Abrir y salir — los básicos

```bash
vim archivo.txt            # abrir archivo
vim +42 archivo.txt        # abrir en línea 42
vim -R archivo.txt         # abrir en modo solo lectura
```

```
:w          → guardar sin salir (write)
:q          → salir (solo si no hay cambios)
:wq         → guardar y salir
:q!         → salir sin guardar — descartar todos los cambios
ZZ          → atajo para :wq (modo Normal)
```

### Navegación en modo Normal

```
h j k l     → izquierda, abajo, arriba, derecha (también funcionan las flechas)
0           → inicio de línea
$           → fin de línea
gg          → ir al inicio del archivo
G           → ir al final del archivo
42G         → ir a la línea 42
Ctrl+f      → página siguiente
Ctrl+b      → página anterior
```

### Edición en modo Normal

```
i           → insertar antes del cursor
a           → insertar después del cursor (append)
o           → nueva línea debajo y entrar en Insert
O           → nueva línea arriba y entrar en Insert
dd          → cortar línea completa
yy          → copiar línea completa (yank)
p           → pegar debajo del cursor
u           → deshacer (undo)
Ctrl+r      → rehacer (redo)
x           → borrar carácter bajo el cursor
```

### Búsqueda y sustitución

```bash
/patron         → buscar hacia adelante (n = siguiente, N = anterior)
?patron         → buscar hacia atrás
:s/viejo/nuevo/         → sustituir primera ocurrencia en la línea actual
:s/viejo/nuevo/g        → sustituir todas en la línea actual
:%s/viejo/nuevo/g       → sustituir todas en todo el archivo
:%s/viejo/nuevo/gc      → sustituir todas con confirmación por cada una
```

---

## Laboratorio práctico

### Lab 1 — Nano: crear un archivo de configuración

```bash
# Crear directorio de trabajo
mkdir -p ~/labs/dia05 && cd ~/labs/dia05

# Crear archivo con nano
nano servidor-web.conf

# Dentro de nano, escribir:
# server {
#     listen 80;
#     server_name localhost;
#     root /var/www/html;
# }

# Guardar: Ctrl+O → Enter
# Salir: Ctrl+X

# Verificar
cat servidor-web.conf
```

### Lab 2 — Nano: buscar y editar

```bash
# Crear archivo con múltiples líneas
nano notas-devops.txt

# Escribir varias líneas, luego:
# Buscar una palabra: Ctrl+W → escribir término → Enter
# Editar el texto
# Guardar y salir
```

### Lab 3 — Vim: edición básica

```bash
# Abrir vim
vim practica.txt

# SECUENCIA:
# 1. Abres en modo Normal (no puedes escribir aún)
# 2. Presiona 'i' → entras en modo Insertar
# 3. Escribe: "Vim es el estándar en servidores AWS y Kubernetes"
# 4. Presiona Esc → vuelves a modo Normal
# 5. Escribe ':wq' → Enter → guardas y sales

# Verificar
cat practica.txt
```

### Lab 4 — Vim: sustitución global

```bash
vim config.env

# En modo Insertar (i), escribir:
# ENV=development
# DB_HOST=localhost
# API_URL=http://localhost:3000

# Esc para volver a Normal
# Sustituir 'localhost' por '10.0.1.5' en todo el archivo:
# :%s/localhost/10.0.1.5/g

# Guardar y salir: :wq
cat config.env
```

---

## Conceptos aprendidos

| Concepto | Descripción |
| --- | --- |
| Editor modal | Vim separa modos: Normal (navegar), Insertar (escribir), Comando (ejecutar) |
| `Ctrl+O` | Guardar en nano (Write Out) |
| `Ctrl+X` | Salir en nano |
| `Ctrl+W` | Buscar en nano |
| `:wq` | Guardar y salir en vim |
| `:q!` | Salir sin guardar — descartar cambios |
| `i` / `Esc` | Entrar y salir del modo Insertar en vim |
| `dd` / `yy` | Cortar / copiar línea en vim |
| `u` | Deshacer en vim |
| `:%s/old/new/g` | Sustitución global en todo el archivo |
| `/patron` | Búsqueda en vim (n = siguiente resultado) |

**Nano vs Vim — cuándo usar cada uno:**

| Situación | Editor |
| --- | --- |
| Edición rápida de un archivo de config | Nano |
| Editar un archivo sin saber su estructura | Nano |
| Sustitución masiva en un archivo grande | Vim |
| Servidor donde solo hay vi/vim instalado | Vim (obligatorio) |
| Automatización / scripting de edición | Vim (`:` commands) |
| Aprendiendo | Nano primero, Vim después |

---

## Lección del día

> "Nano para cuando tienes 30 segundos y quieres cambiar una línea. Vim para cuando eres el único que puede arreglar producción a las 2am y el servidor tiene 10,000 líneas de config. Aprende los dos."
