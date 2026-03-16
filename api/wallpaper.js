function addYears(date, years) {
  const d = new Date(date);
  const m = d.getMonth();
  d.setFullYear(d.getFullYear() + years);
  if (d.getMonth() !== m) d.setDate(0);
  return d;
}

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

export default function handler(req, res) {
  try {
    const birthday = String(req.query.birthday || "2002-04-23");
    const age = Math.max(1, Math.min(120, parseInt(req.query.age || "70", 10)));
    const width = Math.max(300, Math.min(4000, parseInt(req.query.width || "1320", 10)));
    const height = Math.max(600, Math.min(5000, parseInt(req.query.height || "2868", 10)));

    const birth = new Date(`${birthday}T00:00:00Z`);
    if (Number.isNaN(birth.getTime())) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end("Invalid birthday. Use YYYY-MM-DD");
      return;
    }

    const end = addYears(birth, age);
    const now = new Date();

    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const totalWeeks = Math.ceil((end - birth) / weekMs);
    const livedWeeks = Math.max(
      0,
      Math.min(totalWeeks - 1, Math.floor((now - birth) / weekMs))
    );

    // --- ЩІЛЬНА СІТКА (як у референсі) ---
    const cols = Math.round(Math.sqrt(totalWeeks * (width / height))); 
    const rows = Math.ceil(totalWeeks / cols);

    // Відступи під iPhone lock screen
    const topPadding = Math.round(height * 0.30);
    const bottomPadding = Math.round(height * 0.10);
    const sidePadding = Math.round(width * 0.06);

    const gridWidth = width - sidePadding * 2;
    const gridHeight = height - topPadding - bottomPadding;

    const cellX = gridWidth / (cols - 1);
    const cellY = gridHeight / (rows - 1);

    const radius = Math.floor(Math.min(cellX, cellY) * 0.35);

    const startX = sidePadding;
    const startY = topPadding;

    let circles = "";

    for (let i = 0; i < totalWeeks; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = Math.round(startX + col * cellX);
      const y = Math.round(startY + row * cellY);

      let fill = "#3c3c40";
      if (i < livedWeeks) fill = "#f1f1f3";
      if (i === livedWeeks) fill = "#ff6a3d";

      circles += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}" />`;
    }

    const titleY = Math.round(height * 0.12);
    const subtitleY = Math.round(height * 0.16);

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#0b0b0d" />
  <text x="${width / 2}" y="${titleY}" fill="#8c8c90"
    font-size="40"
    font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display',Arial,sans-serif"
    text-anchor="middle">life in weeks · ${age} years</text>
  <text x="${width / 2}" y="${subtitleY}" fill="#5e5e62"
    font-size="28"
    font-family="-apple-system,BlinkMacSystemFont,'SF Pro Text',Arial,sans-serif"
    text-anchor="middle">born ${formatDate(birth)}</text>
  <g>${circles}</g>
</svg>`;

    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300");
    res.statusCode = 200;
    res.end(svg);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Failed to generate wallpaper");
  }
}
