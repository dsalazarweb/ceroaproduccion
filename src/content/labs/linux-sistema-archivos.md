---
titulo: "Día 01 — Sistema de archivos y navegación en Linux"
descripcion: "Cómo está organizado Linux por dentro y cómo navegar con confianza desde la terminal. Primer día del roadmap DevOps."
fecha: 2026-02-19
fase: 0
dia: 1
tags: ["linux", "terminal", "filesystem", "principiante"]
draft: false
---

## Objetivo
Entender cómo está organizado Linux por dentro y navegar con confianza desde la terminal.

**Tiempo invertido:** ~2 horas
**Entorno:** Linux Mint 22.3 "Zena" — Usuario: dsalazar

---

## Concepto clave del día

Todo en Linux parte de un único árbol que empieza en `/` (raíz). No existen letras de unidad como en Windows — todo, incluyendo discos, dispositivos y procesos, es un archivo dentro de ese árbol.

---

## Comandos practicados
```bash
pwd && whoami && hostname
ls && ls -l && ls -la && ls -lh
cd /etc && cd ~ && cd .. && cd -
sudo apt install tree -y
tree ~/aws-learning -L 2
cat /etc/os-release
free -h && df -h && nproc && uptime
find ~/aws-learning -name "*.md"
which python3 && which git
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
