/* =========================================================
   WHATSAPP: RECORDATORIOS A REPRESENTANTES
========================================================= */
function actualizarMensajeWA(v) {
  waMensaje = v;
}
function marcarRepresentante(clave, marcado) {
  waSeleccion[clave] = !!marcado;
}
function marcarTodosRepresentantes(marcado) {
  representantes().forEach((r) => {
    waSeleccion[r.clave] = !!marcado;
  });
  render();
}
function usarPlantillaWhatsApp(id) {
  const p = PLANTILLAS_WA.find((x) => x.id === id);
  if (!p) return;
  waMensaje = p.texto;
  const ta = document.getElementById("wa-mensaje");
  if (ta) ta.value = waMensaje;
  document.querySelectorAll("[data-plantilla]").forEach((b) => {
    const activo = b.dataset.plantilla === id;
    b.classList.toggle("ring-2", activo);
    b.classList.toggle("ring-brand-500", activo);
    b.classList.toggle("border-brand-300", activo);
  });
}
function whatsappEnviar() {
  const ta = document.getElementById("wa-mensaje");
  if (ta) waMensaje = ta.value;
  const reps = representantes().filter(
    (r) => waSeleccion[r.clave] !== false,
  );
  if (!reps.length)
    return alert("Selecciona al menos un representante.");
  const sinTelefono = reps.filter((r) => !telefonoWhatsApp(r.telefono));
  if (
    sinTelefono.length &&
    !confirm(
      sinTelefono.length +
        " representante(s) no tienen teléfono registrado y serán omitidos. ¿Continuar?",
    )
  )
    return;
  waResultado = reps
    .map((r) => ({
      nombre: r.nombre,
      cedula: r.cedula,
      telefono: r.telefono,
      url: enlaceWhatsApp(r.telefono, aplicarPlantilla(waMensaje, r)),
    }))
    .filter((x) => x.url);
  if (!waResultado.length)
    return alert(
      "Ninguno de los representantes seleccionados tiene teléfono registrado.",
    );
  if (waResultado.length === 1)
    window.open(waResultado[0].url, "_blank");
  render();
}
function whatsappAbrirRepresentante(clave) {
  const ta = document.getElementById("wa-mensaje");
  if (ta) waMensaje = ta.value;
  const rep = representantes().find((r) => r.clave === clave);
  if (!rep) return;
  abrirWhatsApp(rep.telefono, aplicarPlantilla(waMensaje, rep));
}
function whatsappAbrirAlumno(id) {
  const a = getAlumno(id);
  if (!a) return;
  const rep = {
    nombre: a.representante || "",
    cedula: a.repCedula || "",
    hijos: [a],
  };
  abrirWhatsApp(a.telefono, aplicarPlantilla(waMensaje, rep));
}

function vistaWhatsApp() {
  const reps = representantes();
  const seleccionados = reps.filter(
    (r) => waSeleccion[r.clave] !== false,
  ).length;

  let html =
    '<section class="space-y-5">' +
    '<div class="card p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">' +
    '<div class="flex items-center gap-3">' +
    '<span class="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg"><i class="fa-brands fa-whatsapp"></i></span>' +
    '<div><h3 class="text-lg font-bold text-slate-800">Recordatorios por WhatsApp</h3>' +
    '<p class="text-xs text-slate-500 mt-1">' +
    NOMBRE_ESCUELA +
    " • " +
    reps.length +
    " representante(s) registrado(s)</p></div></div>" +
    '<button data-accion="whatsappEnviar" class="btn-pri text-sm flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25"><i class="fa-brands fa-whatsapp"></i> Enviar a seleccionados</button></div>';

  if (!reps.length) {
    html +=
      '<div class="card p-8 text-center text-slate-400 text-sm">Todavía no hay representantes. Inscribe alumnos en <strong>Matrícula Alumnos</strong> para poder enviarles recordatorios.</div></section>';
    return html;
  }

  html +=
    '<div class="grid lg:grid-cols-2 gap-5">' +
    '<div class="card p-5 space-y-4"><div><h4 class="font-bold text-slate-800">Mensaje</h4>' +
    '<p class="text-xs text-slate-500 mt-0.5">Elige una plantilla o escribe tu propio mensaje.</p></div>' +
    '<div class="flex flex-wrap gap-2">' +
    PLANTILLAS_WA.map(
      (p) =>
        '<button type="button" data-plantilla="' +
        esc(p.id) +
        '" onclick="usarPlantillaWhatsApp(' +
        "'" +
        esc(p.id) +
        "'" +
        ')" class="border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition"><i class="fa-solid ' +
        p.ico +
        ' text-emerald-500"></i> ' +
        esc(p.titulo) +
        "</button>",
    ).join("") +
    "</div>" +
    '<textarea id="wa-mensaje" rows="7" class="input resize-y" oninput="actualizarMensajeWA(this.value)">' +
    esc(waMensaje) +
    "</textarea>" +
    '<p class="text-[11px] text-slate-400 leading-relaxed"><i class="fa-solid fa-wand-magic-sparkles text-brand-500 mr-1"></i>Puedes usar <code class="bg-slate-100 px-1 rounded">{representante}</code>, <code class="bg-slate-100 px-1 rounded">{alumno}</code>, <code class="bg-slate-100 px-1 rounded">{grado}</code> y <code class="bg-slate-100 px-1 rounded">{cedula}</code>; se reemplazan por los datos de cada representante.</p></div>';

  html +=
    '<div class="card overflow-hidden"><div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">' +
    '<div><h4 class="font-bold text-slate-800">Destinatarios</h4>' +
    '<p class="text-xs text-slate-500 mt-0.5">' +
    seleccionados +
    " de " +
    reps.length +
    " seleccionado(s)</p></div>" +
    '<div class="flex items-center gap-2">' +
    '<button data-accion="whatsappTodos" data-arg="si" class="text-xs font-semibold text-brand-600 hover:text-brand-700">Todos</button>' +
    '<span class="text-slate-300">|</span>' +
    '<button data-accion="whatsappTodos" data-arg="no" class="text-xs font-semibold text-slate-500 hover:text-slate-700">Ninguno</button>' +
    "</div></div>" +
    '<div class="max-h-96 overflow-y-auto custom-scrollbar divide-y divide-slate-100">' +
    reps
      .map((r) => {
        const marcado = waSeleccion[r.clave] !== false;
        const tel = telefonoWhatsApp(r.telefono);
        const pendiente = r.hijos.some((h) => h.pago !== "Solvente");
        return (
          '<div class="px-5 py-3 flex items-center gap-3">' +
          '<input type="checkbox" ' +
          (marcado ? "checked " : "") +
          'onchange="marcarRepresentante(\'' +
          r.clave +
          "', this.checked)\" class=\"w-4 h-4 rounded border-slate-300 text-emerald-600\" />" +
          '<span class="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0">' +
          iniciales(r.nombre) +
          "</span>" +
          '<div class="flex-1 min-w-0"><p class="font-semibold text-slate-700 truncate">' +
          esc(r.nombre) +
          '</p><p class="text-[11px] text-slate-400">' +
          esc(r.cedula || "-") +
          " • " +
          r.hijos.length +
          " hijo(s)" +
          (tel ? "" : ' • <span class="text-rose-500">sin teléfono</span>') +
          "</p></div>" +
          (pendiente
            ? '<span class="badge bg-amber-50 text-amber-700 flex-shrink-0">Pago pendiente</span>'
            : '<span class="badge bg-emerald-50 text-emerald-700 flex-shrink-0">Solvente</span>') +
          '<button data-accion="whatsappAbrir" data-arg="' +
          attr(r.clave) +
          '" title="Abrir chat" class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex-shrink-0"><i class="fa-brands fa-whatsapp"></i></button>' +
          "</div>"
        );
      })
      .join("") +
    "</div></div></div>";

  if (waResultado.length) {
    html +=
      '<div class="card p-5"><div class="flex items-center gap-2 mb-3"><i class="fa-solid fa-link text-emerald-500"></i><h4 class="font-bold text-slate-800">Enlaces listos (' +
      waResultado.length +
      ")</h4></div>" +
      '<p class="text-xs text-slate-500 mb-3">Si el navegador bloqueó la apertura múltiple, pulsa cada enlace para abrir el chat.</p>' +
      '<div class="grid sm:grid-cols-2 gap-2">' +
      waResultado
        .map(
          (w) =>
            '<a href="' +
            esc(w.url) +
            '" target="_blank" rel="noopener" class="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-slate-200 hover:bg-emerald-50 text-sm"><span class="truncate"><i class="fa-brands fa-whatsapp text-emerald-500 mr-1.5"></i>' +
            esc(w.nombre) +
            '</span><span class="text-[11px] text-slate-400 flex-shrink-0">+' +
            esc(w.telefono || "-") +
            "</span></a>",
        )
        .join("") +
      "</div></div>";
  }

  html +=
    '<p class="text-xs text-slate-400 flex items-start gap-1.5"><i class="fa-solid fa-circle-info mt-0.5"></i><span>Los mensajes se abren en WhatsApp Web o en la aplicación con el chat del representante ya listo. Los teléfonos locales (por ejemplo 0414...) se convierten automáticamente al formato internacional.</span></p>' +
    "</section>";
  return html;
}
