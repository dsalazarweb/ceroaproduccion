---
titulo: "Sistema de archivos y navegación en Linux"
descripcion: "Cómo está organizado Linux por dentro y cómo navegar con confianza desde la terminal. Primer día del roadmap DevOps."
fecha: 2026-02-19
fase: 0
dia: 1
tags: ["linux", "terminal", "filesystem", "principiante"]
imagen: "/images/tux-minimal.png"
draft: false
---

## Objetivo
Entender cómo está organizado Linux por dentro y navegar con confianza desde la terminal.

---

## Concepto clave del día

Todo en Linux parte de un único árbol que empieza en `/` (raíz). No existen letras de unidad como en Windows — todo, incluyendo discos, dispositivos y procesos, es un archivo dentro de ese árbol.

---

## Comandos practicados

### Identidad y Ubicación
Conoce quién eres en el sistema y en qué directorio exacto te encuentras:
```bash
pwd && whoami && hostname
```

### Explorando Directorios (Listar)
Observa qué hay dentro de las carpetas, desde una vista rápida hasta la jerarquía y archivos ocultos:
```bash
ls && ls -l && ls -la && ls -lh
```

### Navegación Ágil (Change Directory)
Avanza y retrocede rápidamente entre directorios clave:
```bash
cd /etc && cd ~ && cd .. && cd -
```

### Instalación de Paquetes
Instalamos herramientas nuevas en nuestro Linux usando el gestor de paquetes avanzado:
```bash
sudo apt install tree -y
```

### Visualización en Árbol
Vemos de forma gráfica cómo se estructuran las carpetas:
```bash
tree ~/aws-learning -L 2
```

### Información del Sistema Operativo
Revisamos qué distribución de Linux estamos corriendo exactamente:
```bash
cat /etc/os-release
```

### Monitoreo de Recursos
Comprobamos RAM disponible, uso de disco duro y el tiempo que lleva encendida la máquina:
```bash
free -h && df -h && nproc && uptime
```

### Búsqueda de Archivos
Buscamos todos los archivos Markdown esparcidos dentro de un directorio específico:
```bash
find ~/aws-learning -name "*.md"
```

### Localización de Ejecutables
Si no sabes dónde está instalado silenciosamente un programa, pregúntale al sistema:
```bash
which python3 && which git
```

### Auditoría (Historial)
Trae los últimos 20 comandos introducidos a la terminal para recordar tu rastro:
```bash
history | tail -20
```

---

## Directorios clave

| Directorio | Propósito |
|-----------|-----------|
| `/` | Raíz — todo el sistema parte aquí |
| `/home` | Carpetas personales de usuarios |
| `/etc` | Configuraciones del sistema |
| `/var/log` | Logs del sistema y aplicaciones |
| `/tmp` | Archivos temporales |
| `/proc` | Info del kernel (virtual, no ocupa disco) |

---

## Lección del día

> En Linux todo es un archivo. Cuando domines la navegación, entenderás Docker, SSH, configuraciones de AWS y logs de aplicaciones — todo usa esta misma lógica.
