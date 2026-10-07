/* =========================================================
   VISTAS: REPRESENTANTE
========================================================= */
function vistaRepresentante(t) {
  if (alumnoEnDetalle) return fichaAlumno(alumnoEnDetalle);
  if (t === "constancias") return vistaConstancias();
  if (t === "boleta") return vistaBoleta();
  if (t !== "notas") return "";

  const hijos = hijosRepresentante();
  let html =
    '<section class="space-y-5">' +
    '<div class="card p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100"><div class="flex items-center gap-4">' +
    '<div class="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-lg shadow-md"><i class="fa-solid fa-graduation-cap"></i></div>' +
    '<div><h3 class="text-lg font-bold text-slate-800">Notas y Actividades</h3><p class="text-xs text-slate-600 mt-0.5">' +
    esc(currentUser.nombre) +
    " • " +
    hijos.length +
    " hijo(s) representado(s)</p></div></div></div>";

  if (!hijos.length) {
    html +=
      '<div class="card p-8 text-center text-slate-400">No hay alumnos vinculados a tu cédula.</div>';
  } else {
    hijos.forEach((a) => {
      const r = resumenAlumno(a.cedulaEscolar);
      const prom = r.promedio;
      const col =
        prom === null
          ? "text-slate-400"
          : prom >= NOTA_APROBACION
            ? "text-emerald-600"
            : "text-rose-600";
      html +=
        '<div class="card p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">' +
        '<div class="flex items-center gap-4">' +
        '<span class="w-11 h-11 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">' +
        iniciales(a.nombre) +
        "</span>" +
        '<div><h4 class="font-bold text-slate-800">' +
        esc(a.nombre) +
        '</h4><p class="text-xs text-slate-500 mt-0.5">' +
        esc(a.grado) +
        " • Cédula " +
        esc(a.cedulaEscolar) +
        '</p><div class="flex items-center gap-2 mt-2 flex-wrap">' +
        badgePago(a.pago) +
        '<span class="badge bg-slate-100 text-slate-600">' +
        r.calificadas +
        "/" +
        r.actividades +
        " actividades calificadas</span></div></div></div>" +
        '<div class="flex items-center gap-4"><div class="text-right"><p class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Promedio</p><p class="text-2xl font-bold font-heading ' +
        col +
        '">' +
        (prom === null ? "--" : prom.toFixed(1) + "%") +
        '</p></div><button data-accion="verAlumno" data-arg="' +
        attr(a.cedulaEscolar) +
        '" class="btn-pri text-sm">Ver notas <i class="fa-solid fa-arrow-right ml-1.5"></i></button></div></div>';
    });
  }

  html +=
    '<p class="text-xs text-slate-400 flex items-start gap-1.5"><i class="fa-solid fa-circle-info mt-0.5"></i><span>Si necesitas corregir algún dato de tu representado, comunícate con la administración de la escuela.</span></p>' +
    "</section>";
  return html;
}

/* ---------- Utilidades comunes ---------- */

function hijosRepresentante() {
  return currentUser && currentUser.hijos
    ? currentUser.hijos.map(getAlumno).filter(Boolean)
    : [];
}

function encabezadoTramite(clase, icono, iconoClase, titulo, subtitulo) {
  return (
    '<div class="card p-5 bg-gradient-to-r ' +
    clase +
    '"><div class="flex items-center gap-4">' +
    '<div class="w-12 h-12 rounded-2xl ' +
    iconoClase +
    ' text-white flex items-center justify-center text-lg shadow-md"><i class="fa-solid ' +
    icono +
    '"></i></div>' +
    "<div><h3 class=\"text-lg font-bold text-slate-800\">" +
    esc(titulo) +
    '</h3><p class="text-xs text-slate-600 mt-0.5">' +
    subtitulo +
    "</p></div></div></div>"
  );
}

function alumnoSeleccionado(claveState) {
  const hijos = hijosRepresentante();
  if (!hijos.length) return null;
  const sel = claveState === "boleta" ? boletaSeleccion : constanciaSeleccion;
  const a = getAlumno(sel);
  return a && hijos.some((h) => h.cedulaEscolar === a.cedulaEscolar)
    ? a
    : hijos[0];
}

function avisoEn(id, mensaje, ok) {
  const caja = document.getElementById(id);
  if (!caja) return;
  caja.className =
    "rounded-xl px-4 py-3 text-sm " +
    (ok
      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
      : "bg-rose-50 text-rose-700 border border-rose-100");
  caja.textContent = mensaje;
}

/* ---------- Constancias ---------- */

function vistaConstancias() {
  const hijos = hijosRepresentante();
  let html =
    '<section class="space-y-5">' +
    encabezadoTramite(
      "from-indigo-50 to-blue-50 border-indigo-100",
      "fa-file-signature",
      "bg-indigo-600",
      "Solicitar Constancias",
      esc(currentUser.nombre) +
        " • " +
        hijos.length +
        " hijo(s) representado(s)",
    );

  if (!hijos.length) {
    html +=
      '<div class="card p-8 text-center text-slate-400">No hay alumnos vinculados a tu cédula.</div></section>';
    return html;
  }
  if (!hijos.some((a) => a.cedulaEscolar === constanciaSeleccion)) {
    constanciaSeleccion = hijos[0].cedulaEscolar;
  }
  const alumno = getAlumno(constanciaSeleccion) || hijos[0];

  let opciones = "";
  hijos.forEach((a) => {
    opciones +=
      '<option value="' +
      attr(a.cedulaEscolar) +
      '"' +
      (a.cedulaEscolar === constanciaSeleccion ? " selected" : "") +
      ">" +
      esc(a.nombre) +
      " — " +
      esc(a.grado) +
      "</option>";
  });

  html +=
    '<div class="card p-5 space-y-4">' +
    '<div class="grid gap-4 sm:grid-cols-2">' +
    '<div><label class="block text-xs font-semibold text-slate-600 mb-1">Representado</label>' +
    '<select data-cambio="constanciaHijo" class="input">' +
    opciones +
    "</select></div>" +
    '<div><label class="block text-xs font-semibold text-slate-600 mb-1">Destino o motivo (opcional)</label>' +
    '<input type="text" id="const-destino" class="input" placeholder="Ej.: trámite bancario, notaría..." /></div>' +
    "</div>" +
    '<div id="const-aviso" class="hidden rounded-xl px-4 py-3 text-sm"></div>' +
    '<div class="grid gap-4 md:grid-cols-2">' +
    tarjetaConstancia("estudios", alumno) +
    tarjetaConstancia("pagos", alumno) +
    "</div></div>";

  const mias = solicitudesDeUsuario();
  html +=
    '<div class="card p-5"><div class="flex items-center justify-between mb-2">' +
    '<h4 class="font-bold text-slate-800">Mis solicitudes</h4>' +
    '<span class="badge bg-indigo-50 text-indigo-700">' +
    mias.length +
    "</span></div>" +
    '<div id="lista-solicitudes">' +
    htmlListaSolicitudes(mias) +
    "</div>" +
    '<p class="text-xs text-slate-400 mt-3 flex items-start gap-1.5"><i class="fa-solid fa-circle-info mt-0.5"></i><span>Tus solicitudes se guardan en este dispositivo con su folio para que puedas descargarlas o imprimirlas cuando quieras.</span></p>' +
    "</div></section>";
  return html;
}

function tarjetaConstancia(tipo, alumno) {
  const esPagos = tipo === "pagos";
  return (
    '<div class="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 flex flex-col gap-3">' +
    '<div class="flex items-start gap-3">' +
    '<span class="w-10 h-10 rounded-xl flex items-center justify-center ' +
    (esPagos
      ? "bg-emerald-100 text-emerald-700"
      : "bg-indigo-100 text-indigo-700") +
    '"><i class="fa-solid ' +
    (esPagos ? "fa-money-bill-wave" : "fa-graduation-cap") +
    '"></i></span>' +
    '<div><h4 class="font-bold text-slate-800">' +
    (esPagos ? "Constancia de pagos" : "Constancia de estudios") +
    '</h4><p class="text-xs text-slate-500 mt-1">' +
    (esPagos
      ? "Estatus de cuenta del representado."
      : "Inscripción y situación académica actual.") +
    "</p></div></div>" +
    (esPagos
      ? '<div id="const-pago-estado">' + badgePago(alumno.pago) + "</div>"
      : "") +
    '<div class="flex flex-wrap gap-2 mt-auto pt-1">' +
    '<button data-accion="solicitarConstancia" data-arg="' +
    tipo +
    '" class="btn-pri text-sm">Solicitar <i class="fa-solid fa-download ml-1"></i></button>' +
    '<button data-accion="descargarConstancia" data-arg="' +
    tipo +
    '" class="btn-sec text-sm"><i class="fa-solid fa-file-arrow-down mr-1"></i>Descargar</button>' +
    '<button data-accion="imprimirConstancia" data-arg="' +
    tipo +
    '" class="btn-sec text-sm"><i class="fa-solid fa-print mr-1"></i>Imprimir</button>' +
    "</div>" +
    '<p class="text-[11px] text-slate-400">Solicitar deja constancia con folio y descarga el PDF; Descargar da una copia sin registrar.</p>' +
    "</div>"
  );
}

function solicitudesDeUsuario() {
  const hijos = hijosRepresentante().map((a) => a.cedulaEscolar);
  return db.solicitudes
    .filter((s) => hijos.indexOf(s.alumno) >= 0)
    .slice()
    .sort((a, b) =>
      String(b.fecha + b.hora).localeCompare(String(a.fecha + a.hora)),
    );
}

function solicitudDeUsuario(id) {
  return solicitudesDeUsuario().find((s) => s.id === id) || null;
}

function filaSolicitud(s) {
  const pendiente = s.estado !== "Aprobada";
  return (
    '<div class="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-100 py-3 last:border-b-0">' +
    '<span class="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 rounded-lg px-2 py-1">' +
    esc(s.id) +
    "</span>" +
    '<div><p class="text-sm font-semibold text-slate-800">' +
    esc(s.tipo) +
    '</p><p class="text-xs text-slate-500">' +
    esc(s.alumnoNombre) +
    " · " +
    esc(s.grado) +
    "</p></div>" +
    '<span class="text-xs text-slate-400">' +
    esc(s.fecha) +
    " " +
    esc(s.hora) +
    "</span>" +
    (s.destino
      ? '<span class="text-xs text-slate-400 max-w-[180px] truncate" title="' +
        attr(s.destino) +
        '">Para: ' +
        esc(s.destino) +
        "</span>"
      : "") +
    '<span class="badge ' +
    (pendiente
      ? "bg-amber-50 text-amber-700"
      : "bg-emerald-50 text-emerald-700") +
    '">' +
    esc(s.estado) +
    "</span>" +
    '<div class="ml-auto flex items-center gap-3">' +
    '<button data-accion="descargarSolicitud" data-arg="' +
    attr(s.id) +
    '" class="text-xs font-semibold text-indigo-600 hover:text-indigo-800"><i class="fa-solid fa-download mr-1"></i>Descargar</button>' +
    '<button data-accion="imprimirSolicitud" data-arg="' +
    attr(s.id) +
    '" class="text-xs font-semibold text-indigo-600 hover:text-indigo-800"><i class="fa-solid fa-print mr-1"></i>Imprimir</button>' +
    '<button data-accion="borrarSolicitud" data-arg="' +
    attr(s.id) +
    '" class="text-xs font-semibold text-rose-600 hover:text-rose-800">Cancelar</button>' +
    "</div></div>"
  );
}

function htmlListaSolicitudes(mias) {
  const lista = mias || solicitudesDeUsuario();
  if (!lista.length) {
    return '<p class="text-sm text-slate-400 text-center py-6">Aún no has solicitado constancias.</p>';
  }
  return lista.map(filaSolicitud).join("");
}

function refrescarListaSolicitudes() {
  const lista = document.getElementById("lista-solicitudes");
  if (lista) lista.innerHTML = htmlListaSolicitudes();
}

function leerDestino() {
  const el = document.getElementById("const-destino");
  return el && el.value ? String(el.value).trim() : "";
}

function solicitarConstancia(tipo) {
  const alumno = alumnoSeleccionado("constancia");
  if (!alumno) {
    avisoEn("const-aviso", "No hay alumnos vinculados a tu cédula.", false);
    return;
  }
  const hoy = new Date();
  const solicitud = {
    id: uid("SOL"),
    fecha: fechaISO(hoy),
    hora: horaTexto(hoy),
    claveTipo: tipo === "pagos" ? "pagos" : "estudios",
    tipo:
      tipo === "pagos"
        ? "Constancia de pagos"
        : "Constancia de estudios",
    alumno: alumno.cedulaEscolar,
    alumnoNombre: alumno.nombre,
    grado: alumno.grado,
    representante: currentUser.nombre,
    repCedula: currentUser.cedula || "",
    destino: leerDestino(),
    estado: "Pendiente",
  };
  db.solicitudes = db.solicitudes.concat([solicitud]);
  guardarLocal();
  refrescarListaSolicitudes();
  const res = descargarSolicitud(solicitud.id, true);
  avisoEn(
    "const-aviso",
    "Solicitud " + solicitud.id + " registrada. " + textoDescarga(res),
    res === "pdf",
  );
}

function construirConstancia(solicitud) {
  const s = solicitud;
  const alumno = getAlumno(s.alumno);
  if (!alumno) return null;
  return crearConstanciaHTML(s.claveTipo, alumno, {
    destino: s.destino,
    folio: s.id,
    fecha: s.fecha,
  });
}

function descargarConstanciaDirecta(tipo) {
  const alumno = alumnoSeleccionado("constancia");
  if (!alumno) {
    avisoEn("const-aviso", "No hay alumnos vinculados a tu cédula.", false);
    return "error";
  }
  const res = descargarPDF(
    "constancia-" + tipo + "-" + alumno.cedulaEscolar + "-" + alumno.nombre,
    crearConstanciaHTML(tipo, alumno, { destino: leerDestino() }),
  );
  avisoEn("const-aviso", textoDescarga(res), res === "pdf");
  return res;
}

function imprimirConstanciaDirecta(tipo) {
  const alumno = alumnoSeleccionado("constancia");
  if (!alumno) {
    avisoEn("const-aviso", "No hay alumnos vinculados a tu cédula.", false);
    return;
  }
  const html = crearConstanciaHTML(tipo, alumno, {
    destino: leerDestino(),
  });
  imprimirHTML(html);
}

function descargarSolicitud(id, silencioso) {
  const s = solicitudDeUsuario(id);
  if (!s) {
    if (!silencioso)
      avisoEn("const-aviso", "La solicitud " + id + " no existe.", false);
    return "error";
  }
  const html = construirConstancia(s);
  if (!html) return "error";
  const res = descargarPDF(
    s.claveTipo + "-" + s.alumno + "-" + (s.alumnoNombre || "solicitud"),
    html,
  );
  if (!silencioso) avisoEn("const-aviso", textoDescarga(res), res === "pdf");
  return res;
}

function imprimirSolicitud(id) {
  const s = solicitudDeUsuario(id);
  if (!s)
    return avisoEn("const-aviso", "La solicitud " + id + " no existe.", false);
  const html = construirConstancia(s);
  if (html) imprimirHTML(html);
}

function borrarSolicitud(id) {
  const s = solicitudDeUsuario(id);
  if (!s) return;
  if (!confirm("¿Cancelar la solicitud " + s.id + "?")) return;
  db.solicitudes = db.solicitudes.filter((x) => x.id !== id);
  guardarLocal();
  refrescarListaSolicitudes();
  avisoEn("const-aviso", "Solicitud " + id + " cancelada.", true);
}

/* ---------- Boleta de notas ---------- */

function vistaBoleta() {
  const hijos = hijosRepresentante();
  let html =
    '<section class="space-y-5">' +
    encabezadoTramite(
      "from-violet-50 to-purple-50 border-violet-100",
      "fa-file-lines",
      "bg-violet-600",
      "Boleta de Notas",
      "Promedios por lapso · " + esc(currentUser.nombre),
    );

  if (!hijos.length) {
    html +=
      '<div class="card p-8 text-center text-slate-400">No hay alumnos vinculados a tu cédula.</div></section>';
    return html;
  }
  if (!hijos.some((a) => a.cedulaEscolar === boletaSeleccion)) {
    boletaSeleccion = hijos[0].cedulaEscolar;
  }
  const alumno = getAlumno(boletaSeleccion) || hijos[0];

  let opciones = "";
  hijos.forEach((a) => {
    opciones +=
      '<option value="' +
      attr(a.cedulaEscolar) +
      '"' +
      (a.cedulaEscolar === boletaSeleccion ? " selected" : "") +
      ">" +
      esc(a.nombre) +
      " — " +
      esc(a.grado) +
      "</option>";
  });

  const d = boletaDatos(alumno.cedulaEscolar);
  const prom = d.promedioGeneral;
  const col =
    prom === null
      ? "text-slate-400"
      : prom >= NOTA_APROBACION
        ? "text-emerald-600"
        : "text-rose-600";

  html +=
    '<div class="card p-5"><div class="grid gap-4 sm:grid-cols-3 items-end">' +
    '<div class="sm:col-span-2"><label class="block text-xs font-semibold text-slate-600 mb-1">Representado</label>' +
    '<select data-cambio="boletaHijo" class="input">' +
    opciones +
    "</select></div>" +
    '<div class="text-right"><p class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Promedio general</p>' +
    '<p class="text-3xl font-bold font-heading ' +
    col +
    '">' +
    (prom === null ? "--" : prom.toFixed(1) + "%") +
    '</p><p class="text-xs text-slate-500">' +
    d.resumen.calificadas +
    "/" +
    d.resumen.actividades +
    " actividades calificadas · " +
    desempenoTexto(prom) +
    "</p></div></div></div>";

  html +=
    '<div class="card p-5 space-y-4">' +
    '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">' +
    '<div><h4 class="font-bold text-slate-800">Boleta con lapsos</h4>' +
    '<p class="text-xs text-slate-500 mt-0.5">Año escolar ' +
    anioEscolar() +
    " · Notas expresadas en porcentaje (mínimo " +
    NOTA_APROBACION +
    "%)</p></div>" +
    '<div class="flex gap-2">' +
    '<button data-accion="descargarBoleta" class="btn-pri text-sm"><i class="fa-solid fa-download mr-1.5"></i>Descargar</button>' +
    '<button data-accion="imprimirBoleta" class="btn-sec text-sm"><i class="fa-solid fa-print mr-1.5"></i>Imprimir</button>' +
    "</div></div>" +
    '<div id="boleta-aviso" class="hidden rounded-xl px-4 py-3 text-sm"></div>' +
    '<div class="overflow-x-auto">' +
    tablaBoletaHTML(d, false) +
    "</div>" +
    '<p class="text-xs text-slate-400">La descarga genera un archivo PDF listo para imprimir o compartir.</p>' +
    "</div></section>";
  return html;
}

function descargarBoleta() {
  const alumno = alumnoSeleccionado("boleta");
  if (!alumno) {
    avisoEn("boleta-aviso", "No hay alumnos vinculados a tu cédula.", false);
    return "error";
  }
  const res = descargarPDF(
    "boleta-" + alumno.cedulaEscolar + "-" + alumno.nombre,
    crearBoletaHTML(alumno),
  );
  avisoEn("boleta-aviso", textoDescarga(res), res === "pdf");
  return res;
}

function imprimirBoleta() {
  const alumno = alumnoSeleccionado("boleta");
  if (!alumno) {
    avisoEn("boleta-aviso", "No hay alumnos vinculados a tu cédula.", false);
    return;
  }
  if (imprimirHTML(crearBoletaHTML(alumno)))
    avisoEn("boleta-aviso", "Boleta enviada a la impresora.", true);
}
