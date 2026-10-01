// Generador de PDF mínimo, sin dependencias — usado por ChatResultCard para
// que "Descargar PDF" produzca un archivo .pdf real y abrible (no un .txt
// disfrazado). Un único objeto de página, fuente Helvetica estándar con
// WinAnsiEncoding (cubre tildes/ñ del español) y un stream de texto simple
// (una línea por Tj). No soporta wrap de texto largo — quien llama corta las
// líneas antes de pasarlas.

function escapePdfText(text) {
  return String(text).replace(/[\\()]/g, (c) => `\\${c}`);
}

function toWinAnsiBytes(text) {
  const bytes = [];
  for (const ch of String(text)) {
    const code = ch.codePointAt(0);
    bytes.push(code <= 255 ? code : 0x3f); // '?' fallback fuera de Latin-1
  }
  return bytes;
}

export function generateSimplePdf(lines, { title } = {}) {
  const pageWidth = 612;
  const pageHeight = 792;
  const marginLeft = 56;
  const marginTop = 742;
  const lineHeight = 18;
  const titleFontSize = 16;
  const bodyFontSize = 11;

  const streamParts = ['BT'];
  let y = marginTop;

  if (title) {
    streamParts.push(`/F1 ${titleFontSize} Tf`);
    streamParts.push(`${marginLeft} ${y} Td`);
    streamParts.push(`(${escapePdfText(title)}) Tj`);
    y -= lineHeight + 6;
    streamParts.push(`0 -${lineHeight + 6} Td`);
    streamParts.push(`/F1 ${bodyFontSize} Tf`);
  } else {
    streamParts.push(`/F1 ${bodyFontSize} Tf`);
    streamParts.push(`${marginLeft} ${y} Td`);
  }

  lines.forEach((line, i) => {
    if (title && i === 0) {
      streamParts.push(`(${escapePdfText(line)}) Tj`);
    } else {
      streamParts.push(`0 -${lineHeight} Td`);
      streamParts.push(`(${escapePdfText(line)}) Tj`);
    }
  });

  streamParts.push('ET');
  const streamContent = streamParts.join('\n');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>`,
    null, // contents stream — se arma abajo (necesita /Length en bytes)
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
  ];

  const streamBytes = toWinAnsiBytes(streamContent);
  objects[3] = { isStream: true, dict: `<< /Length ${streamBytes.length} >>`, bytes: streamBytes };

  const chunks = [];
  const offsets = [];
  let cursor = 0;

  function push(str) {
    const bytes = toWinAnsiBytes(str);
    chunks.push(bytes);
    cursor += bytes.length;
  }

  push('%PDF-1.4\n');

  objects.forEach((obj, i) => {
    offsets[i + 1] = cursor;
    push(`${i + 1} 0 obj\n`);
    if (obj && obj.isStream) {
      push(`${obj.dict}\nstream\n`);
      chunks.push(obj.bytes);
      cursor += obj.bytes.length;
      push('\nendstream\nendobj\n');
    } else {
      push(`${obj}\nendobj\n`);
    }
  });

  const xrefStart = cursor;
  const count = objects.length + 1;
  push(`xref\n0 ${count}\n`);
  push('0000000000 65535 f \n');
  for (let i = 1; i < count; i++) {
    push(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
  }
  push(`trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);

  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const out = new Uint8Array(totalLength);
  let pos = 0;
  for (const c of chunks) {
    out.set(c, pos);
    pos += c.length;
  }

  return new Blob([out], { type: 'application/pdf' });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
