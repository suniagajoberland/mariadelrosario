/* =========================================================
   UTILIDADES
========================================================= */
function norm(x) {
  return String(x == null ? "" : x)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}
function esc(x) {
  return String(x == null ? "" : x)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function attr(x) {
  return encodeURIComponent(String(x == null ? "" : x));
}
function uid(prefijo) {
  return (
    prefijo +
    "-" +
    Date.now().toString(36).toUpperCase() +
    Math.floor(Math.random() * 900 + 100)
  );
}
function iniciales(nombre) {
  return String(nombre || "")
    .replace(/^(Prof\.?|Profa\.?|Sr\.?|Sra\.?|Sr(a)\.?)\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .map((x) => x[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}
function num(x) {
  const n = parseFloat(x);
  return isNaN(n) ? 0 : n;
}
function fechar(x) {
  if (!x) return "-";
  const f = new Date(String(x) + "T00:00:00");
  if (isNaN(f.getTime())) return String(x);
  return f.toLocaleDateString("es-VE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
function badgePago(p) {
  return p === "Solvente"
    ? '<span class="badge bg-emerald-50 text-emerald-700">Solvente</span>'
    : '<span class="badge bg-amber-50 text-amber-700">Pendiente</span>';
}
function filaVacia(mensaje, colspan) {
  return (
    '<tr><td colspan="' +
    colspan +
    '" class="td text-center text-slate-400 py-6">' +
    esc(mensaje) +
    "</td></tr>"
  );
}
