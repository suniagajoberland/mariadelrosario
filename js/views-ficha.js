/* =========================================================
   FICHA DE ALUMNO (notas y actividades)
========================================================= */
function fichaAlumno(alumnoId) {
  const a = getAlumno(alumnoId);
  if (!a)
    return '<div class="card p-8 text-center text-slate-400">Alumno no encontrado.</div>';

  const acts = actividadesDeAlumno(alumnoId);
  const r = resumenAlumno(alumnoId);
  const prom = r.promedio;
  const col =
    prom === null
      ? "text-slate-400"
      : prom >= NOTA_APROBACION
        ? "text-emerald-600"
        : "text-rose-600";

  let html =
    '<section class="space-y-5">' +
    '<div class="card p-5"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">' +
    '<div class="flex items-center gap-4">' +
    '<button data-accion="volver" class="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center" title="Volver"><i class="fa-solid fa-arrow-left"></i></button>' +
    '<div><h3 class="text-lg font-bold text-slate-800">' +
    esc(a.nombre) +
    '</h3><p class="text-xs text-slate-500 mt-0.5">' +
    esc(a.grado) +
    " • Cédula " +
    esc(a.cedulaEscolar) +
    "</p></div></div>" +
    '<div class="flex items-center gap-5"><div class="text-right"><p class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Promedio general</p><p class="text-2xl font-bold font-heading ' +
    col +
    '">' +
    (prom === null ? "--" : prom.toFixed(1) + "%") +
    '</p></div><div class="hidden sm:block h-10 w-px bg-slate-200"></div><div class="text-right"><p class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Desempeño</p><p class="mt-1">' +
    (prom === null
      ? '<span class="badge bg-slate-100 text-slate-600">Sin notas</span>'
      : prom >= NOTA_APROBACION
        ? '<span class="badge bg-emerald-50 text-emerald-700">Aprobado</span>'
        : '<span class="badge bg-rose-50 text-rose-700">En riesgo</span>') +
    "</p></div></div></div></div>" +
    '<div class="card overflow-hidden"><div class="px-5 py-4 border-b border-slate-100">' +
    '<h4 class="font-bold text-slate-800">Actividades y notas</h4>' +
    '<p class="text-xs text-slate-500 mt-0.5">' +
    r.calificadas +
    " de " +
    r.actividades +
    " actividades tienen nota registrada</p></div>" +
    '<div class="overflow-x-auto"><table class="w-full border-collapse"><thead><tr>' +
    '<th class="th">Lapso</th><th class="th">Actividad</th><th class="th">Materia</th><th class="th">Tipo</th>' +
    '<th class="th">Fecha</th><th class="th text-center">Nota</th><th class="th text-center">% Obtenido</th><th class="th">Estado</th>' +
    '</tr></thead><tbody class="divide-y divide-slate-100 text-sm">';

  if (!acts.length) {
    html += filaVacia("Todavía no hay actividades para este grado.", 8);
  } else {
    acts.forEach((e) => {
      const n = getNota(e.id, alumnoId);
      const pct = n === null ? null : porcentaje(e, n);
      const estado =
        n === null
          ? '<span class="badge bg-slate-100 text-slate-500">Pendiente</span>'
          : pct >= NOTA_APROBACION
            ? '<span class="badge bg-emerald-50 text-emerald-700">Aprobado</span>'
            : '<span class="badge bg-rose-50 text-rose-700">Bajo el mínimo</span>';
      html +=
        "<tr>" +
        '<td class="td"><span class="badge bg-blue-50 text-blue-700">Lapso ' +
        esc(e.lapso) +
        "</span></td>" +
        '<td class="td font-semibold text-slate-700">' +
        esc(e.titulo) +
        "</td>" +
        '<td class="td">' +
        esc(e.materia) +
        "</td>" +
        '<td class="td text-slate-500">' +
        esc(e.tipo) +
        "</td>" +
        '<td class="td text-slate-500">' +
        fechar(e.fecha) +
        "</td>" +
        '<td class="td text-center font-semibold">' +
        (n === null ? "-" : n + " / " + esc(e.notaMax)) +
        "</td>" +
        '<td class="td text-center ' +
        (n === null
          ? "text-slate-300"
          : pct >= NOTA_APROBACION
            ? "text-emerald-600 font-semibold"
            : "text-rose-600 font-semibold") +
        '">' +
        (pct === null ? "-" : pct.toFixed(1) + "%") +
        "</td>" +
        '<td class="td">' +
        estado +
        "</td></tr>";
    });
  }

  html += "</tbody></table></div></div></section>";
  return html;
}
