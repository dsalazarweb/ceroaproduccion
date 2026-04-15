---
titulo: "DevOps en Windows: cómo monté mi entorno con WSL"
descripcion: "De Linux Mint a Windows y de vuelta. Cómo instalé WSL, configuré Git con SSH, VS Code y NVM para no perder mi entorno Linux."
fecha: 2026-04-15
tags: ["windows", "wsl", "terminal", "entorno"]
dificultad: "principiante"
tiempo_lectura: 10
serie: "devops-en-windows"
orden: 1
draft: false
imagen: "/images/guia1-hero.png"
---

La verdad es que cuando empecé con Linux Mint todo iba bien. Terminal nativa, scripts en bash funcionando, SSH directo a GitHub sin drama. Pero por temas de trabajo me tocó volver a Windows y ahí el tema se complicó. ¿Perder todo el entorno Linux? No. 

La solución fue WSL (Windows Subsystem for Linux), que básicamente te da lo mejor de ambos mundos: la interfaz de Windows para tu día a día, y una terminal Linux real para meter las manos al código sin perder nada de lo que ya tenías.

Esta guía documenta exactamente cómo monté este entorno. Si estás en Windows y quieres empezar con DevOps de forma seria, esto es todo lo que necesitas saber.

## ¿Por qué WSL y no PowerShell?

A ver, PowerShell es algo potente, no te voy a decir que no, pero no es Unix. Los scripts de bash no funcionan, las rutas son diferentes, y los permisos se manejan muy distinto. 

En DevOps, el 90% del mundo real corre sobre Linux. Docker, Kubernetes, AWS EC2 — todo es Linux. Usar WSL te permite practicar exactamente en el mismo entorno que te vas a encontrar en producción, sin tener la fricción de adaptar comandos.

Para que lo veas más claro:

| | PowerShell | WSL (Ubuntu) |
|---|---|---|
| Scripts bash | ❌ No compatibles | ✅ Nativos |
| SSH keys | ⚠️ Configuración diferente | ✅ Estándar Linux |
| Docker | ✅ Con Docker Desktop | ✅ Nativo |
| Rutas | `D:\Diego\Proyectos\` | `/mnt/d/Diego/Proyectos/` |

## Instalar WSL 2 con Ubuntu

Hacer esto es bastante directo. Abres una terminal (PowerShell por esta única vez, como administrador preferiblemente) y ejecutas este comando:

```bash
wsl --install -d Ubuntu
```

Dejas que Windows reinicie, configuras tu usuario y contraseña de Ubuntu cuando te lo pida. Para confirmar la versión, revisa esto:

```bash
wsl --list --verbose
# Debe mostrar Ubuntu con VERSION 2
```

> **Nota si usas Mac o Linux:** Si ya estás en macOS o una distro Linux nativa, ya tienes un entorno Unix. Puedes saltar tranquilamente al paso de herramientas y usar tu terminal preferida (iTerm2, GNOME Terminal, o la que gustes).

## Herramientas que necesitas instalar

### NVM (Node Version Manager)

Lo primero que aprendí a no hacer: dejen de instalar Node global de forma directa. Instalen NVM. Así puedes cambiar la versión de Node de un proyecto a otro sin romper nada.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install --lts
node -v   # v24.x
npm -v    # 11.x
```

Un truco importante: a veces NVM no se reconoce al abrir una nueva terminal bash. Si te pasa, agrega esto al final de tu archivo `~/.bashrc`:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

### Git + SSH Keys

Ahora vamos por el acceso a GitHub para tus repositorios. Y como vas a subir código seguido, mejor usar SSH.

```bash
# ⚠️ Cambia "Diego Salazar" por tu nombre real
git config --global user.name "Diego Salazar"

# ⚠️ Cambia este email por el tuyo. Yo uso el de admin de mi dominio.
git config --global user.email "admin@ceroaproduccion.dev"
```

**Tip de privacidad:** Si no tienes dominio propio o prefieres no exponer tu email personal, GitHub te proporciona un email `noreply` privado. Lo encuentras en tu GitHub, en **Settings → Emails → "Keep my email addresses private"**. Te asignan algo tipo `12345678+tuusuario@users.noreply.github.com`. Puedes usar ese como tu `user.email` global, y tus commits quedan asociados a tu perfil pero tu correo real queda a salvo.

Ahora, para generar tu par de llaves SSH:

```bash
# ⚠️ Cambia el email por el mismo que configuraste arriba
ssh-keygen -t ed25519 -C "admin@ceroaproduccion.dev"
# Dale Enter sin tipear nada para aceptar ruta por defecto (~/.ssh/id_ed25519)
# Puedes agregar passphrase o presionar Enter para dejarlo sin ninguna
```

Agrega la llave pública a GitHub:

```bash
cat ~/.ssh/id_ed25519.pub
# Vas a copiar el output de este archivo y pegarlo en:
# GitHub → Settings → SSH Keys → New SSH Key
```

Vamos a verificar que la conexión se hizo bien:

```bash
ssh -T git@github.com
# ⚠️ Debe responder con TU usuario de GitHub:
# "Hi dsalazarweb! You've successfully authenticated..."
```

Configura tu remote para que dejes de usar HTTPS y empieces a usar SSH definitivamente:

```bash
# ⚠️ Cambia la URL por la de TU repositorio
git remote set-url origin git@github.com:dsalazarweb/ceroaproduccion.git
```

### VS Code + Extensión WSL

- Instala **Visual Studio Code** normal en Windows.
- Instala la extensión **WSL** (de Microsoft).
- Abres WSL en tu terminal, cambias de directorio y lo abres así de fácil:

```bash
cd /mnt/d/Diego/Proyectos/ceroaproduccion
code .
```

¡Listo! VS Code se abrirá, y fíjate en el indicador en la esquina inferior izquierda: te debe mostrar que está usando **"WSL: Ubuntu"**.

## Organización de carpetas

![Diagrama de tres bloques: ceroaproduccion, aws-learning y Obsidian Vault](/images/guia1-diagram.png)

Esta es mi estructura real sin rodeos:

```
D:\Diego\
├── Proyectos\
│   ├── ceroaproduccion\     ← Blog (Astro) — ceroaproduccion.dev
│   └── aws-learning\        ← Labs y scripts — patio de juegos
└── dsalazar\                 ← Vault de Obsidian — cerebro del proyecto
```

Para ver esto en ambos lados, aquí la equivalencia:

| Lado Windows | Lado WSL |
|---------|-----|
| `D:\Diego\Proyectos\ceroaproduccion` | `/mnt/d/Diego/Proyectos/ceroaproduccion` |
| `D:\Diego\Proyectos\aws-learning` | `/mnt/d/Diego/Proyectos/aws-learning` |
| `D:\Diego\dsalazar` | `/mnt/d/Diego/dsalazar` |

Separo mis proyectos de código de mis notas personales (el vault de Obsidian). Se explica brevemente, pero es importante tener ese orden. Así nunca toco un repo que no debo, o lo ensucio con archivos basura.

## Errores que me encontré

![Ilustración minimalista de un error en terminal resuelto](/images/guia1-error.png)

Si trabajas con Windows Subsystem para algo, en algún momento tendrás fricción con el filesystem de Windows. Dímelo a mí que me pasaron las de Caín al hacer mi instalación.

### npm install falla en /mnt/d/

A veces tiras `npm install` y recibes un `EACCES permission denied` o `ENOMEM`. Resulta que el filesystem de Windows que se monta en WSL (/mnt/d/) sufre un poco al lidiar con muchísimos archivos ultra pequeños como la de los amados `node_modules`.

La solución usual que uso:

```bash
rm -rf node_modules package-lock.json
npm install
```

### git push pide usuario y contraseña

Si de la nada al mandar un commit Git te pide username/password en vez de agarrar tu bonita llave SSH, es que tienes el protocolo mal en el repositorio local. Confirma esto:

```bash
git remote -v
# Si resulta que dice "https://...", ahí está el problema, cámbiala a SSH:
# ⚠️ Cambia la URL por la tuya
git remote set-url origin git@github.com:dsalazarweb/ceroaproduccion.git
ssh -T git@github.com
```

> "Tu entorno de desarrollo es tu taller. Si el taller está desorganizado, cada proyecto empieza con fricción. Invertir un par de horas en montarlo bien te ahorra semanas de frustración."

En la siguiente guía explico cómo organizo todo lo que aprendo sin perderme: mi vault de Obsidian, dos repositorios y un sistema de notas que realmente funciona. 

[Siguiente guía: Cómo organizo mi aprendizaje →](/guias/metodologia-proyecto)
