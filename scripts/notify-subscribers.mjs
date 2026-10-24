import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SITE_URL = 'https://ceroaproduccion.dev';
const SENDER_EMAIL = 'Diego de Cero a Producción <hola@ceroaproduccion.dev>';
const REPLY_TO_EMAIL = 'contacto@ceroaproduccion.dev';

// Parser simple y confiable de Frontmatter Markdown sin dependencias externas
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const yamlBlock = match[1];
  const metadata = {};

  const lines = yamlBlock.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    let value = trimmed.slice(colonIndex + 1).trim();

    // Limpiar comillas
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Parsear booleanos
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    // Parsear números
    else if (/^\d+$/.test(value)) value = parseInt(value, 10);
    // Parsear arrays inline (ej: ["git", "devops"])
    else if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(item => {
        let clean = item.trim();
        if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
          clean = clean.slice(1, -1);
        }
        return clean;
      }).filter(Boolean);
    }

    metadata[key] = value;
  }

  return metadata;
}

// Generador de plantilla HTML para email compatible con todos los clientes
function generateEmailHtml({ tipo, titulo, descripcion, url, imagenUrl, tags, tiempoLectura, fecha }) {
  const badgeLabel = tipo === 'Guía' ? '🚀 NUEVA GUÍA' : '🧪 NUEVO LABORATORIO';
  const tagList = Array.isArray(tags) ? tags.map(t => `#${t}`).join(' · ') : '';
  const metaInfo = [
    tiempoLectura ? `⏱️ ${tiempoLectura} min lectura` : '',
    tagList,
  ].filter(Boolean).join(' | ');

  const imageHtml = imagenUrl ? `
    <tr>
      <td style="padding: 0 0 24px 0;">
        <a href="${url}" target="_blank" style="text-decoration: none; display: block;">
          <img src="${imagenUrl}" alt="${titulo}" width="540" style="width: 100%; max-width: 540px; height: auto; border-radius: 12px; border: 1px solid #e8e8e4; display: block;" />
        </a>
      </td>
    </tr>
  ` : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titulo}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f1219; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
          <!-- Header Branding -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; border-bottom: 1px solid #f1f5f9; background-color: #0b0e14;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #7c8aff; display: block; margin-bottom: 4px;">CERO A PRODUCCIÓN</span>
                    <span style="font-size: 20px; font-weight: 700; color: #f8fafc; letter-spacing: -0.02em;">DevOps & Cloud</span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 10px; background-color: rgba(124, 138, 255, 0.15); border: 1px solid rgba(124, 138, 255, 0.3); border-radius: 999px; font-size: 11px; font-weight: 700; color: #7c8aff; text-transform: uppercase;">
                      ${badgeLabel}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                ${imageHtml}
                <tr>
                  <td style="padding-bottom: 16px;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; line-height: 1.3; color: #0f172a; letter-spacing: -0.02em;">
                      <a href="${url}" target="_blank" style="color: #0f172a; text-decoration: none;">${titulo}</a>
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 24px;">
                    <p style="margin: 0; font-size: 16px; line-height: 1.65; color: #475569;">
                      ${descripcion}
                    </p>
                  </td>
                </tr>
                ${metaInfo ? `
                <tr>
                  <td style="padding-bottom: 28px;">
                    <span style="font-size: 13px; color: #64748b; font-weight: 500;">${metaInfo}</span>
                  </td>
                </tr>` : ''}
                <tr>
                  <td style="padding-bottom: 32px;">
                    <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 28px; background-color: #443dee; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600; text-align: center;">
                      Leer publicación completa &rarr;
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="border-top: 1px solid #f1f5f9; padding-top: 24px;">
                    <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6;">
                      <em>"Documentando el camino en DevOps y Cloud desde los fundamentos hasta producción."</em>
                      <br>
                      <strong>Diego Salazar</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer legal con desuscripción -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.5;">
              <p style="margin: 0 0 8px 0;">
                Recibes este correo porque te suscribiste a las actualizaciones de <a href="${SITE_URL}" style="color: #64748b; text-decoration: underline;">ceroaproduccion.dev</a>.
              </p>
              <p style="margin: 0;">
                <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color: #64748b; text-decoration: underline;">Darte de baja de esta lista</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Detectar archivos markdown modificados o agregados en el commit actual
function getChangedContentFiles() {
  try {
    const output = execSync('git diff --name-only --diff-filter=AM HEAD~1 HEAD', { encoding: 'utf-8', cwd: ROOT_DIR });
    return output
      .split('\n')
      .map(f => f.trim())
      .filter(f => (f.startsWith('src/content/guias/') || f.startsWith('src/content/labs/')) && f.endsWith('.md'));
  } catch (err) {
    console.warn('⚠️ No se pudo obtener git diff de HEAD~1. Revisando el commit actual (HEAD)...');
    try {
      const output = execSync('git show --name-only --diff-filter=AM --pretty="" HEAD', { encoding: 'utf-8', cwd: ROOT_DIR });
      return output
        .split('\n')
        .map(f => f.trim())
        .filter(f => (f.startsWith('src/content/guias/') || f.startsWith('src/content/labs/')) && f.endsWith('.md'));
    } catch {
      return [];
    }
  }
}

async function sendBroadcast({ apiKey, audienceId, payload, isDryRun }) {
  if (isDryRun) {
    console.log('\n🔎 [MODO DRY-RUN SIMULADO] Payload que se enviaría a Resend:');
    console.log(JSON.stringify({
      from: payload.from,
      reply_to: payload.reply_to,
      subject: payload.subject,
      audience_id: audienceId,
      send: true,
      html_length: payload.html.length,
    }, null, 2));
    console.log('✅ Simulación completada con éxito. No se realizó ninguna llamada a Resend.');
    return { id: 'dry-run-broadcast-id', status: 'simulated' };
  }

  const response = await fetch('https://api.resend.com/broadcasts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audience_id: audienceId,
      from: payload.from,
      reply_to: payload.reply_to,
      subject: payload.subject,
      html: payload.html,
      // Resend restringe el campo interno `name` a un máximo estricto de 70 caracteres
      name: (payload.name || payload.subject).slice(0, 65).trim(),
      send: true,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Error en Resend API (${response.status}): ${JSON.stringify(data)}`);
  }

  return data;
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');

  let targetFile = null;
  const fileArgIndex = args.indexOf('--file');
  if (fileArgIndex !== -1 && args[fileArgIndex + 1]) {
    targetFile = args[fileArgIndex + 1];
  }

  console.log('🚀 Iniciando proceso de notificación a suscriptores de Resend...');

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!isDryRun && (!apiKey || !audienceId)) {
    console.error('❌ Error: Variables RESEND_API_KEY y RESEND_AUDIENCE_ID requeridas.');
    process.exit(1);
  }

  const filesToProcess = targetFile ? [targetFile] : getChangedContentFiles();

  if (filesToProcess.length === 0) {
    console.log('ℹ️ No se detectaron archivos de Guías o Labs nuevos/modificados para notificar.');
    return;
  }

  console.log(`📋 Archivos candidatos a evaluar (${filesToProcess.length}):`, filesToProcess);

  for (const relPath of filesToProcess) {
    const fullPath = path.resolve(ROOT_DIR, relPath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ Archivo no encontrado: ${relPath}`);
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    const meta = parseFrontmatter(content);

    if (!meta) {
      console.warn(`⚠️ No se pudo leer el frontmatter de ${relPath}`);
      continue;
    }

    if (meta.draft === true) {
      console.log(`⏭️ Omitiendo ${relPath} porque tiene "draft: true".`);
      continue;
    }

    const isGuia = relPath.includes('/guias/');
    const tipo = isGuia ? 'Guía' : 'Laboratorio';
    const slug = path.basename(relPath, '.md');
    const url = `${SITE_URL}/${isGuia ? 'guias' : 'labs'}/${slug}`;
    const imagenUrl = meta.imagen ? (meta.imagen.startsWith('http') ? meta.imagen : `${SITE_URL}${meta.imagen}`) : null;

    const subject = `🚀 Nueva ${tipo}: ${meta.titulo}`;
    const html = generateEmailHtml({
      tipo,
      titulo: meta.titulo,
      descripcion: meta.descripcion || '',
      url,
      imagenUrl,
      tags: meta.tags || [],
      tiempoLectura: meta.tiempo_lectura,
      fecha: meta.fecha,
    });

    console.log(`\n📢 Preparando broadcast para: "${meta.titulo}"`);
    console.log(`   URL: ${url}`);
    console.log(`   Asunto: ${subject}`);

    const broadcastName = `${tipo}: ${meta.titulo}`.slice(0, 65).trim();

    try {
      const result = await sendBroadcast({
        apiKey,
        audienceId,
        isDryRun,
        payload: {
          from: SENDER_EMAIL,
          reply_to: REPLY_TO_EMAIL,
          subject,
          html,
          name: broadcastName,
        },
      });

      console.log(`✅ Broadcast enviado exitosamente. ID: ${result.id}`);
    } catch (err) {
      console.error(`❌ Error al enviar broadcast para ${relPath}:`, err.message);
      process.exit(1);
    }
  }

  console.log('\n✨ Proceso de notificación finalizado.');
}

main().catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
