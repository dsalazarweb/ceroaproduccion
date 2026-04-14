---
titulo: "Día 04 — Procesos y servicios en Linux"
descripcion: "Cómo Linux gestiona todo lo que corre: procesos, servicios, systemd y logs. Base directa para administrar contenedores y servidores."
fecha: 2026-03-26
fase: 0
dia: 4
tags: ["linux", "procesos", "systemd", "principiante"]
draft: false
---

## Objetivo

Comprender cómo Linux gestiona procesos y servicios — ver qué está corriendo, controlarlo y entender systemd. Base directa para administrar servidores y contenedores en producción.

---

## Concepto clave del día

Todo lo que corre en Linux es un proceso. Cada servicio es un proceso gestionado por systemd. Entender PID, señales y estados de proceso es lo mismo que entender por qué un contenedor Docker no responde o por qué un servicio en un servidor EC2 está caído. El diagnóstico siempre empieza aquí.

---

## Comandos practicados

```bash
# Ver procesos activos
ps aux                              # todos los procesos del sistema
ps aux | grep bash                  # filtrar por nombre
ps -ef | head -20                   # formato alternativo, primeros 20

# Monitoreo en tiempo real
top                                 # monitor básico (M=memoria, P=CPU, q=salir)
htop                                # monitor interactivo mejorado (q=salir)

# Procesos en segundo plano
sleep 300 &                         # lanzar proceso en background
jobs                                # ver jobs activos en la sesión
kill PID                            # matar proceso por PID
killall sleep                       # matar todos los procesos con ese nombre

# Señales de kill
kill -15 PID                        # SIGTERM — terminación limpia (default)
kill -9 PID                         # SIGKILL — fuerza bruta, no ignorable

# Gestión de servicios con systemctl
systemctl status cron               # ver estado de un servicio
sudo systemctl stop cron            # detener servicio
sudo systemctl start cron           # iniciar servicio
sudo systemctl restart cron         # reiniciar servicio
sudo systemctl enable cron          # activar en arranque
sudo systemctl disable cron         # desactivar en arranque
systemctl list-units --type=service --state=running   # listar servicios activos

# Logs del sistema con journalctl
journalctl -n 20                    # últimas 20 líneas del sistema
journalctl -u cron -n 10            # logs de un servicio específico
journalctl -f                       # seguimiento en tiempo real (Ctrl+C para salir)
```

---

## Conceptos aprendidos

| Concepto | Descripción |
| --- | --- |
| `PID` | Process ID — identificador único de cada proceso en ejecución |
| `ps aux` | Snapshot de todos los procesos: usuario, PID, CPU, MEM, estado, comando |
| Estado `S` | Sleeping — proceso esperando evento (la mayoría del tiempo) |
| Estado `R` | Running — proceso usando CPU activamente |
| Estado `Z` | Zombie — proceso terminado que aún no fue recogido por su padre |
| `top` vs `htop` | `top` = disponible siempre; `htop` = más visual, requiere instalación |
| `&` al final | Lanza proceso en background, devuelve control al terminal |
| `jobs` | Lista procesos en background de la sesión actual |
| `kill -15` | SIGTERM: pide al proceso que termine limpiamente |
| `kill -9` | SIGKILL: fuerza terminación inmediata, no puede ser ignorada |
| `killall` | Mata todos los procesos con ese nombre de una vez |
| `systemctl` | Interfaz de systemd para gestionar servicios del sistema |
| `journalctl` | Visor de logs de systemd — centraliza todos los registros del sistema |
| PID cambia al reiniciar | Cada inicio de servicio genera un nuevo PID — nunca hardcodear PIDs |

**Estados de proceso en Linux:**

| Estado | Símbolo | Descripción |
| --- | --- | --- |
| Running | `R` | Usando CPU activamente |
| Sleeping | `S` | Esperando evento o I/O |
| Stopped | `T` | Pausado por señal |
| Zombie | `Z` | Terminado, esperando ser recogido |

**Señales de kill más usadas:**

| Señal | Número | Uso |
| --- | --- | --- |
| SIGTERM | 15 | Terminación limpia (default de `kill`) |
| SIGKILL | 9 | Fuerza bruta — último recurso |
| SIGHUP | 1 | Reload de configuración sin reiniciar |

---

## Lección del día

> "En Linux un proceso es cualquier cosa que corre. En AWS un contenedor es un proceso. En Kubernetes un pod es un proceso. El comando cambia, el concepto no."
