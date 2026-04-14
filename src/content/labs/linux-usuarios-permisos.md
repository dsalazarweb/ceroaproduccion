---
titulo: "Usuarios, grupos y permisos en Linux"
descripcion: "La base de toda seguridad Unix y el concepto detrás de AWS IAM. Permisos, chmod, chown y sudo desde cero."
fecha: 2026-02-23
fase: 0
dia: 3
tags: ["linux", "seguridad", "permisos", "principiante"]
imagen: "/images/lab03-permissions.png"
draft: false
---

## Objetivo

Comprender y gestionar usuarios, grupos y permisos en Linux — la base de toda la seguridad en sistemas Unix y el concepto detrás de AWS IAM.

---

## Concepto clave del día

Todo en Linux tiene un propietario y un conjunto de permisos. Cada archivo, directorio, proceso y servicio pertenece a un usuario y a un grupo. Este modelo es exactamente el mismo que AWS implementa con IAM: identidades, grupos y permisos granulares. Entenderlo aquí es entenderlo allá.

---

## Comandos practicados

### Identidad del usuario
Descubre quién eres en el sistema, tu UID, y a qué grupos perteneces:
```bash
whoami                              # usuario actual
id                                  # uid, gid y todos los grupos
groups                              # grupos del usuario actual
groups dsalazar                     # grupos de un usuario específico
```

### Archivos del sistema de usuarios
Linux almacena la información de usuarios y contraseñas en archivos de texto plano:
```bash
cat /etc/passwd                     # todos los usuarios del sistema
awk -F: '$3 >= 1000 {print $1, $3, $6}' /etc/passwd   # solo usuarios reales
cat /etc/group                      # todos los grupos
cat /etc/shadow                     # hashes de contraseñas (requiere sudo)
```

### Ver permisos de archivos
Cada archivo tiene permisos para usuario (u), grupo (g), y otros (o):
```bash
ls -la archivo.txt                  # permisos detallados
stat archivo.txt                    # información completa incluyendo permisos en octal
```

### chmod numérico
Cambia permisos usando números octales — la forma más directa y usada en producción:
```bash
chmod 755 archivo.txt               # rwxr-xr-x
chmod 644 archivo.txt               # rw-r--r--
chmod 600 archivo.txt               # rw------- (solo propietario)
chmod 700 directorio/               # drwx------ (solo propietario puede entrar)
```

### chmod simbólico
La forma legible de modificar permisos, útil cuando quieres cambiar solo un aspecto:
```bash
chmod u+x archivo.txt               # agregar ejecución al usuario
chmod g-w archivo.txt               # quitar escritura al grupo
chmod o= archivo.txt                # quitar todo a otros
chmod a+r archivo.txt               # agregar lectura a todos
```

### chown — cambiar propietario
Solo root puede cambiar el dueño de un archivo:
```bash
sudo chown root:root archivo.txt    # cambiar a root
sudo chown dsalazar:dsalazar archivo.txt  # devolver al usuario
```

### sudo — ejecutar como root
`sudo` te da poderes de administrador temporalmente — requiere estar en el grupo `sudo`:
```bash
sudo ls /root                       # ejecutar como root
sudo mkdir /opt/proyecto-test       # crear en directorio del sistema
sudo cat /etc/sudoers | head -30    # ver configuración de sudo
```

---

## Conceptos aprendidos

| Concepto | Descripción |
|----------|-------------|
| `uid / gid` | Identificador numérico de usuario y grupo |
| `UID >= 1000` | Usuarios reales del sistema (los del sistema son < 1000) |
| Grupos del usuario | `sudo`, `docker`, `adm` — cada uno otorga privilegios específicos |
| `/etc/passwd` | Base de datos de usuarios del sistema |
| `/etc/shadow` | Contraseñas hasheadas — solo root puede leerlo |
| `chmod numérico` | 7=rwx, 6=rw-, 5=r-x, 4=r--, 0=--- |
| `chmod simbólico` | u/g/o/a + +/-/= + r/w/x |
| `chown` | Cambiar propietario y grupo de un archivo |
| `sudo` | Ejecutar como root — requiere estar en el grupo sudo |
| Permisos en dirs | `x` en directorio = permiso para entrar con `cd` |

**Tabla de permisos más usados:**

| Octal | Simbólico | Uso típico |
|-------|-----------|------------|
| 600 | rw------- | Llaves SSH privadas |
| 644 | rw-r--r-- | Archivos de configuración |
| 700 | rwx------ | Directorios privados |
| 755 | rwxr-xr-x | Scripts ejecutables, directorios públicos |
| 777 | rwxrwxrwx | Nunca en producción |

**Dato del sistema propio:**
```
uid=1000(dsalazar) grupos: adm, sudo, docker
```
- `sudo` → permisos de administrador
- `docker` → acceso a Docker sin sudo — listo para la Fase 2

---

## Lección del día

> "En Linux todo tiene un dueño y un permiso. En AWS todo tiene un rol y una política. Son el mismo concepto — quien no entiende `chmod` no entiende IAM."
