# LICENCIA MAESTRA — ceroaproduccion.dev
*Redactada y aprobada en sesión de Marzo-Abril 2026*

> Este documento es la base legal del proyecto. Los contenidos de `ceroaproduccion.dev` están bajo los términos aquí descritos.
> ADRs: [[Decisiones de Arquitectura]] · Backlog (pendiente agregar al repo): [[Backlog Activo]]

---

## Resumen Ejecutivo

El contenido de **ceroaproduccion.dev** está protegido bajo la licencia **Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)** con términos extendidos que cubren:

1. Protección contra uso comercial no autorizado
2. Bloqueo explícito de entrenamiento de IA
3. Cláusulas de comercialización bajo acuerdo previo
4. Jurisdicción y regulación internacional

---

## Texto Completo de la Licencia

**LICENCIA DE USO DE CONTENIDO — ceroaproduccion.dev**
**Versión 1.0 — 2026**
**Autor y Titular:** Diego Salazar
**Jurisdicción:** Internacional

### 1. LICENCIA BASE

El contenido publicado en ceroaproduccion.dev (en adelante "el Sitio") —incluyendo artículos, guías técnicas, tutoriales, código de ejemplo, gráficos explicativos y materiales didácticos— se publica bajo la licencia **Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)**.

Esto significa que usted puede:
- **Compartir:** copiar y redistribuir el material en cualquier medio o formato.

Bajo los siguientes términos:
- **Atribución (BY):** debe dar crédito apropiado al Sitio (ceroaproduccion.dev) y al autor (Diego Salazar).
- **No Comercial (NC):** no puede utilizar el material con fines comerciales sin autorización expresa.
- **Sin Derivados (ND):** si remezcla, transforma o crea a partir del material, no puede distribuir el material modificado.

### 2. TÉRMINOS ADICIONALES Y RESTRICCIONES EXTENDIDAS

#### 2.1 Prohibición de Uso para Entrenamiento de IA

Queda expresamente **prohibido**:
- Usar cualquier contenido del Sitio para entrenar, afinar (*fine-tune*), evaluar o mejorar modelos de inteligencia artificial, aprendizaje automático o sistemas similares.
- Incluir contenido del Sitio en conjuntos de datos (*datasets*) destinados a IA, independientemente de si el uso final es comercial o no.
- Usar *scraping* automatizado o sistemático del Sitio para cualquiera de los propósitos anteriores.

Esta restricción aplica a cualquier entidad, corporación, startup, proyecto de código abierto o individuo.

#### 2.2 Autorización Comercial Bajo Acuerdo

El uso comercial del contenido (incluyendo, sin limitarse a, reventa, inclusión en cursos pagos de terceros, uso en publicaciones impresas o digitales con fines lucrativos) requiere **autorización escrita previa** del titular.

Para solicitar licencias comerciales, contactar a: **contacto@ceroaproduccion.dev**

#### 2.3 Código de Ejemplo

Los fragmentos de código técnico (*snippets*, scripts, configuraciones) publicados en el Sitio se ofrecen bajo la licencia **MIT** de manera independiente a esta licencia, permitiendo su uso libre en proyectos personales y comerciales **sin necesidad de atribución**, salvo que se indique lo contrario en el archivo o publicación específica.

#### 2.4 Marca y Nombre

Los términos "Cero a Producción", "ceroaproduccion.dev" y sus variantes son marcas en uso del titular. No se autoriza su uso para servicios, productos o materiales que puedan generar confusión con el Sitio original.

### 3. DESCARGO DE RESPONSABILIDAD

El contenido del Sitio se ofrece con fines educativos e informativos. El titular no garantiza que el contenido esté libre de errores ni que sea apropiado para todos los entornos de producción. El lector asume la responsabilidad de verificar y adaptar cualquier información técnica antes de aplicarla.

### 4. JURISDICCIÓN Y LEY APLICABLE

El incumplimiento de este contrato intelectual terminará automáticamente cualquier permiso concedido, reservándonos el derecho a la denuncia legal pertinente bajo las leyes vigentes y demás convenios jurisdiccionales internacionales aplicados a los derechos de propiedad intelectual materializada.

### 5. VIGENCIA

Esta licencia entra en vigor desde la fecha de publicación del contenido y permanece vigente indefinidamente, salvo notificación expresa del titular de que los términos han sido actualizados.

---

## Estado de Implementación

| Elemento | Estado |
|---|---|
| Texto de licencia redactado | ✅ |
| Páginas `/privacidad`, `/terminos`, `/cookies` en el sitio | ✅ |
| `robots.txt` con bloqueo de IA bots | ✅ |
| `LICENSE_MAESTRA_ES.md` en repo ceroaproduccion | ⏳ Pendiente |
| `LICENSE` en repo aws-learning | ⏳ Pendiente |

---

## Extracto del robots.txt (protección técnica)

```
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Omgilibot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: *
Allow: /
```
