---
titulo: "SSH desde cero: cómo conectarte a un servidor con llaves"
descripcion: "Aprende a generar llaves SSH, levantar un servidor, copiar tu llave pública y dejar la conexión lista con un solo comando. La base para administrar cualquier máquina en la nube, explicada para quien empieza."
fecha: 2026-06-20
fase: 0
dia: 6
tags: ["linux", "ssh", "seguridad", "servidores", "principiante"]
imagen: "/images/lab06-ssh.png"
draft: false
---

## ¿Qué vamos a hacer hoy?

Si en algún momento vas a trabajar con servidores —y en DevOps vas a vivir de eso— lo primero que necesitas saber es **cómo entrar a una máquina que no tienes enfrente**. No hay monitor, no hay teclado, no hay mouse: solo una dirección y tu terminal. La herramienta para eso se llama **SSH**, y hoy la vamos a usar de principio a fin.

Lo bonito de este lab es que **no necesitas pagar por un servidor en la nube todavía**. Vamos a convertir tu propia máquina (en mi caso, Ubuntu dentro de WSL2 en Windows) en un servidor SSH y a conectarnos a ella como si estuviera al otro lado del mundo. El procedimiento es **exactamente el mismo** que usarás cuando rentes tu primera instancia EC2 en AWS. Aprendes gratis ahora, y en la Fase 4 ya lo sabrás de memoria.

> Este es el día 6 de mi camino aprendiendo DevOps desde cero. Si algo no te queda claro, no te preocupes: yo también estoy empezando, y precisamente por eso intento explicar el *por qué* de cada paso, no solo el comando.

---

## La idea detrás de SSH (sin tecnicismos)

Imagina que SSH es una puerta con una cerradura especial. En vez de una contraseña que se puede adivinar o robar, usamos **dos piezas que forman pareja**:

- 🔑 Una **llave privada**, que se queda contigo y **nunca le das a nadie**. Es tu identidad.
- 🔒 Una **llave pública**, que sí puedes repartir. Es la cerradura que solo abre con tu llave privada.

Le pones la cerradura (la pública) al servidor, te guardas la llave (la privada), y a partir de ahí entras sin escribir contraseña. Si alguien copia tu llave pública no logra nada, porque sin la privada que hace pareja, la cerradura no abre.

Es el mismo principio que ya usas sin darte cuenta cuando tu navegador se conecta a una página con candado (HTTPS). Y, mirando hacia adelante, es la misma idea detrás de los permisos de AWS: identidades que demuestran quién eres antes de dejarte hacer algo.

---

## Paso 1 · Crear tu par de llaves

Lo primero es generar las dos llaves. Esto se hace con un comando llamado `ssh-keygen`:

```bash
ssh-keygen -t ed25519 -C "lab-ssh-dia06" -f ~/.ssh/id_ed25519_lab
```

Vamos por partes, porque cada pedacito importa:

- `-t ed25519` es el **tipo de llave**. Ed25519 es el estándar moderno: rápido, seguro y con llaves cortitas. Vas a ver mucho el viejo "RSA" en tutoriales antiguos, pero hoy se prefiere este.
- `-C "lab-ssh-dia06"` es solo un **comentario** para reconocer la llave más adelante. Como ponerle etiqueta a una caja.
- `-f ~/.ssh/id_ed25519_lab` es el **nombre del archivo**, y aquí va el consejo más importante del día: **siempre dale un nombre propio a tus llaves de práctica.** Si no lo haces, `ssh-keygen` propone el nombre por defecto (`id_ed25519`) y, si ya tenías una llave ahí —por ejemplo la de GitHub—, **la sobrescribes y pierdes el acceso**. A mí me pasó por poco. Con `-f` y un nombre distinto, tu llave del lab vive aparte y no toca nada más.

Cuando te pida una *passphrase* (una contraseña para proteger la llave), puedes dejarla vacía dándole Enter dos veces, porque es un lab local. En un servidor de verdad sí conviene ponerle una.

Al terminar verás un dibujito raro hecho de símbolos (lo llaman *randomart*): es solo una huella visual de tu llave, no tienes que hacer nada con él. Y si listas la carpeta, ahí están tus dos archivos: `id_ed25519_lab` (la privada) y `id_ed25519_lab.pub` (la pública, fíjate en el `.pub`).

---

## Paso 2 · Montar el servidor SSH

Para que podamos "entrar" a algún lado, necesitamos algo que **escuche** y nos abra la puerta. Ese programa se llama `openssh-server`:

```bash
sudo apt update && sudo apt install -y openssh-server
```

Una vez instalado, vamos a cambiarle el puerto. Por defecto SSH usa el puerto 22, pero lo moveremos al 2222:

```bash
sudo sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config
```

¿Por qué cambiarlo? Por dos razones. La primera es práctica: el puerto 22 es tan conocido que los robots de internet lo escanean todo el día buscando entrar; moverlo reduce ese ruido. La segunda es de aprendizaje: nos obliga a abrir y entender `/etc/ssh/sshd_config`, que es el archivo donde se configura cómo se comporta el servidor.

Reiniciamos el servicio para aplicar el cambio y revisamos su estado:

```bash
sudo service ssh restart
sudo service ssh status
```

---

## Paso 3 · Mi primer tropiezo (y por qué me alegra)

Aquí me pasó algo que, sinceramente, al principio me frustró y luego me encantó. El servicio decía estar "activo", pero al final del mensaje aparecía esto:

```
Server listening on 0.0.0.0 port 22.
```

**¡Seguía en el puerto 22!** Yo había escrito `Port 2222` en el archivo, lo confirmé y todo... pero el servidor lo ignoraba. ¿Qué estaba pasando?

La pista estaba en una línea que decía `TriggeredBy: ssh.socket`. Resulta que Ubuntu 24.04 trae algo llamado **activación por socket**: en vez de tener el servidor encendido todo el tiempo, el sistema deja "vigilando" el puerto 22 y solo enciende SSH cuando llega alguien. El detalle es que **esa vigilancia manda más** que lo que tú escribas en el archivo de configuración. Por eso mi `Port 2222` no servía de nada.

Lo confirmé con un comando que muestra quién está escuchando en cada puerto:

```bash
sudo ss -tlnp | grep ssh
```

La solución fue apagar esa vigilancia por socket y decirle al servicio que arranque por su cuenta, leyendo mi configuración:

```bash
sudo systemctl disable --now ssh.socket
sudo systemctl enable --now ssh.service
sudo systemctl restart ssh.service
```

Y al volver a revisar el puerto, ahora sí: escuchando en el **2222**. 🎉

Te cuento este tropiezo a propósito, porque es justo lo que diferencia seguir un tutorial de verdad de aprender DevOps. **Cuando algo "no agarra" tu configuración, casi siempre hay una capa por encima decidiendo.** Aprender a detectarla —leer el mensaje completo, buscar la pista, comprobar con `ss`— es el músculo que de verdad vas a usar en el trabajo. Los comandos se olvidan; saber diagnosticar, no.

---

## Paso 4 · Entregarle tu llave al servidor

Ahora le instalamos al servidor nuestra llave pública, para que reconozca quién somos. Esto lo hace un comando muy cómodo, `ssh-copy-id`:

```bash
ssh-copy-id -i ~/.ssh/id_ed25519_lab.pub -p 2222 dsalazar@localhost
```

- `-i ~/.ssh/id_ed25519_lab.pub` le dice **cuál** llave pública copiar (la del lab, no todas las que tengas).
- `-p 2222` es el puerto del servidor. Ojo con esto: aquí el puerto se escribe con `-p` minúscula.
- `dsalazar@localhost` es "el usuario @ la dirección". Como el servidor es mi propia máquina, uso `localhost`.

La primera vez te preguntará si confías en el servidor (escribes `yes`) y te pedirá tu contraseña **una última vez**. A partir de ahí, ya no la necesitarás: tu llave hace el trabajo. Lo que hizo el comando por dentro fue copiar tu llave pública a un archivo del servidor llamado `authorized_keys`, que no es más que la lista de "llaves con permiso de entrar".

### Los permisos: el error número uno con servidores

Antes de conectarnos, hay que ajustar los permisos de los archivos. Esto **no es opcional**: SSH es tan estricto con la seguridad que **se niega a usar una llave si otros usuarios del sistema pueden leerla**.

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys ~/.ssh/id_ed25519_lab
chmod 644 ~/.ssh/id_ed25519_lab.pub
```

En cristiano:

| Permiso | Significa | Para qué |
|---|---|---|
| `700` en la carpeta `~/.ssh` | solo tú puedes entrar | nadie más husmea tus llaves |
| `600` en la llave privada | solo tú la lees y escribes | es secreta, debe estar blindada |
| `600` en `authorized_keys` | solo tú la modificas | nadie agrega llaves a escondidas |
| `644` en la llave pública | todos pueden leerla | no es secreta, puede ser pública |

Recuerda este apartado, porque el error *"Permissions are too open"* al conectarte a una EC2 lo vas a ver tarde o temprano, y casi siempre se arregla justo aquí.

---

## Paso 5 · El archivo de configuración (la joya del día)

Hasta ahora, para conectarnos tendríamos que escribir un comando larguísimo cada vez:

```bash
ssh -i ~/.ssh/id_ed25519_lab -p 2222 dsalazar@localhost
```

Nadie quiere memorizar eso por cada servidor. Para eso existe `~/.ssh/config`: un archivo donde guardas todos esos datos bajo un **apodo**.

```bash
cat > ~/.ssh/config <<'EOF'
Host labserver
    HostName localhost
    Port 2222
    User dsalazar
    IdentityFile ~/.ssh/id_ed25519_lab
EOF
chmod 600 ~/.ssh/config
```

Cada bloque `Host` describe un servidor:

- `Host labserver` → el apodo que vas a escribir.
- `HostName` → la dirección real (una IP o un dominio; aquí `localhost`).
- `Port` → el puerto (2222).
- `User` → con qué usuario entrar.
- `IdentityFile` → qué llave privada usar.

En tu trabajo real vas a tener un bloque por cada máquina: `prod-web`, `staging-db`, `cliente-x`... y conectarte a cualquiera será tan fácil como escribir su apodo. Esto es, literalmente, la diferencia entre andar copiando IPs en una libreta y trabajar como profesional.

---

## Paso 6 · La recompensa

Después de todo el camino, la conexión se reduce a esto:

```bash
ssh labserver
```

Sin contraseña, sin puerto, sin acordarte de la llave. Entras directo. Esa sensación de "todo el trabajo previo se paga en este momento" es exactamente lo que vas a sentir la primera vez que entres a un servidor de verdad en la nube.

---

## Lo que me llevo de hoy

| Concepto | En una frase |
|---|---|
| Par de llaves | Una privada que guardas, una pública que repartes |
| `ssh-keygen -f` | Dale nombre propio a tus llaves para no pisar otras |
| `openssh-server` | El programa que escucha conexiones en el servidor |
| Activación por socket | En Ubuntu 24.04 manda más que `sshd_config`; hay que conocerla |
| Permisos `600` / `700` | Sin esto, SSH rechaza tus llaves |
| `~/.ssh/config` | Apodos para conectarte con un solo comando |

> "El servidor cambia —hoy mi propia máquina, mañana una instancia en AWS— pero el ciclo es siempre el mismo: crear la llave, copiarla, ajustar permisos, configurar y conectar. Quien domina esto en local, domina la puerta de entrada a toda la nube."

Nos vemos en el día 7, donde toca aprender a leer los **logs del sistema** para entender qué le pasa a una máquina cuando algo va mal.
