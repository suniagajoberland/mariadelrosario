/* =========================================================
   VISTAS: PROFESOR
========================================================= */
function vistaProfesor(t) {
  if (t === "notas") return vistaNotasProfesor();
  if (t === "estudiantes") return vistaEstudiantesProfesor();
  if (t === "evaluaciones") return vistaActividadesProfesor();
  return "";
}

function vistaEstudiantesProfesor() {
  const p = currentUser;
  const mis = alumnosPorProfesor(p.id);
  let html =
    '<section class="space-y-5">' +
    '<div class="card p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">' +
    '<div><h3 class="text-lg font-bold text-slate-800">Mis Estudiantes</h3><p class="text-xs text-slate-500 mt-1">' +
    esc(p.grado || "Sin grado") +
    " • " +
    mis.length +
    " estudiante(s)</p></div>" +
    '<button data-accion="alumnoNuevo" class="btn-pri text-sm flex items-center gap-2"><i class="fa-solid fa-user-plus"></i> Registrar Estudiante</button></div>' +
    '<div class="card overflow-hidden"><div class="overflow-x-auto"><table class="w-full border-collapse"><thead><tr>' +
    '<th class="th">Cédula Escolar</th><th class="th">Estudiante</th><th class="th">Representante</th><th class="th">Cédula Rep.</th>' +
    '<th class="th">WhatsApp</th><th class="th">Pago</th><th class="th text-right">Acciones</th>' +
    '</tr></thead><tbody class="divide-y divide-slate-100 text-sm">';

  if (!mis.length) {
    html += filaVacia(
      "Aún no tienes estudiantes registrados en " +
        (p.grado || "tu grado") +
        ".",
      7,
    );
  } else {
    mis.forEach((s) => {
      html +=
        "<tr>" +
        '<td class="td font-medium">' +
        esc(s.cedulaEscolar) +
        "</td>" +
        '<td class="td font-semibold">' +
        esc(s.nombre) +
        "</td>" +
        '<td class="td">' +
        esc(s.representante) +
        "</td>" +
        '<td class="td"><span class="badge bg-slate-100 text-slate-600">' +
        esc(s.repCedula || "-") +
        "</span></td>" +
        '<td class="td text-slate-500">+' +
        esc(s.telefono) +
        "</td>" +
        '<td class="td">' +
        badgePago(s.pago) +
        "</td>" +
        '<td class="td"><div class="flex items-center justify-end gap-1.5">' +
        '<button data-accion="alumnoEditar" data-arg="' +
        attr(s.cedulaEscolar) +
        '" class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200" title="Editar"><i class="fa-solid fa-pen"></i></button>' +
        '<button data-accion="alumnoBorrar" data-arg="' +
        attr(s.cedulaEscolar) +
        '" class="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100" title="Eliminar"><i class="fa-solid fa-trash-can"></i></button>' +
        "</div></td></tr>";
    });
  }

  html +=
    "</tbody></table></div></div>" +
    '<p class="text-xs text-slate-400 flex items-start gap-1.5"><i class="fa-solid fa-circle-info mt-0.5"></i><span>Registra la cédula del representante para que pueda ver las notas de su hijo con esa cédula.</span></p>' +
    "</section>";
  return html;
}

function vistaActividadesProfesor() {
  const p = currentUser;
  const evs = db.evaluaciones
    .filter((e) => e.profesorId === p.id)
    .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
  const lista =
    filtroLapso === "todos"
      ? evs
      : evs.filter((e) => e.lapso === filtroLapso);
  const totalAlumnos = alumnosPorProfesor(p.id).length;

  let html =
    '<section class="space-y-5">' +
    '<div class="card p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">' +
    '<div><h3 class="text-lg font-bold text-slate-800">Actividades</h3><p class="text-xs text-slate-500 mt-1">' +
    esc(p.grado || "") +
    " • " +
    evs.length +
    " actividad(es) creada(s)</p></div>" +
    '<div class="flex items-center gap-2 flex-wrap">' +
    '<select data-cambio="filtrarLapsoProf" class="input w-auto">' +
    '<option value="todos"' +
    (filtroLapso === "todos" ? " selected" : "") +
    ">Todos los lapsos</option>" +
    '<option value="I"' +
    (filtroLapso === "I" ? " selected" : "") +
    ">Lapso I</option>" +
    '<option value="II"' +
    (filtroLapso === "II" ? " selected" : "") +
    ">Lapso II</option>" +
    '<option value="III"' +
    (filtroLapso === "III" ? " selected" : "") +
    ">Lapso III</option></select>" +
    '<button data-accion="evalNueva" class="btn-pri text-sm flex items-center gap-2"><i class="fa-solid fa-plus"></i> Nueva Actividad</button></div></div>' +
    '<div class="space-y-3">';

  if (!lista.length) {
    html +=
      '<div class="card p-8 text-center text-slate-400 text-sm">No has creado actividades' +
      (filtroLapso !== "todos" ? " en el Lapso " + filtroLapso : "") +
      ".</div>";
  } else {
    lista.forEach((e) => {
      const n = db.notas.filter(
        (x) =>
          x.evaluacionId === e.id && x.nota !== "" && x.nota !== null,
      ).length;
      html +=
        '<div class="card p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"><div class="flex-1">' +
        '<h4 class="font-bold text-slate-800">' +
        esc(e.titulo) +
        '</h4><div class="flex flex-wrap items-center gap-2 mt-2 text-xs">' +
        '<span class="badge bg-slate-100 text-slate-600">' +
        esc(e.materia) +
        "</span>" +
        '<span class="badge bg-blue-50 text-blue-700">Lapso ' +
        esc(e.lapso) +
        "</span>" +
        '<span class="badge bg-slate-100 text-slate-600">' +
        esc(e.tipo) +
        "</span>" +
        '<span class="badge bg-slate-100 text-slate-600">' +
        fechar(e.fecha) +
        "</span>" +
        '<span class="badge bg-emerald-50 text-emerald-700">Pond. ' +
        esc(e.ponderacion) +
        "%</span>" +
        '<span class="badge bg-slate-100 text-slate-600">Máx. ' +
        esc(e.notaMax) +
        "</span>" +
        '<span class="badge ' +
        (n === totalAlumnos
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700") +
        '">' +
        n +
        "/" +
        totalAlumnos +
        " con nota</span></div></div>" +
        '<div class="flex items-center gap-2 flex-wrap">' +
        '<button data-accion="cargarNotas" data-arg="' +
        attr(e.id) +
        '" class="btn-sec text-xs flex items-center gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"><i class="fa-solid fa-table-list"></i> Cargar Notas</button>' +
        '<button data-accion="evalEditar" data-arg="' +
        attr(e.id) +
        '" class="btn-sec text-xs flex items-center gap-1.5"><i class="fa-solid fa-pen"></i> Editar</button>' +
        '<button data-accion="evalBorrar" data-arg="' +
        attr(e.id) +
        '" class="btn-sec text-xs flex items-center gap-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100"><i class="fa-solid fa-trash-can"></i> Eliminar</button>' +
        "</div></div>";
    });
  }

  html += "</div></section>";
  return html;
}

function vistaNotasProfesor() {
  const p = currentUser;
  const mis = alumnosPorProfesor(p.id);
  const evs = db.evaluaciones
    .filter((e) => e.profesorId === p.id)
    .sort(
      (a, b) =>
        String(a.lapso).localeCompare(String(b.lapso)) ||
        String(a.titulo).localeCompare(String(b.titulo)),
    );

  if (alumnoEnDetalle) return fichaAlumno(alumnoEnDetalle);

  let html =
    '<section class="space-y-5">' +
    '<div class="card p-5"><div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">' +
    '<div><h3 class="text-lg font-bold text-slate-800">Notas y Actividades</h3>' +
    '<p class="text-xs text-slate-500 mt-1">' +
    esc(p.grado || "") +
    " • selecciona una actividad para cargar las notas</p></div>" +
    '<div class="flex items-center gap-3 flex-wrap w-full lg:w-auto">' +
    '<select data-cambio="seleccionarEval" class="input lg:w-80"><option value="">— Seleccionar actividad —</option>' +
    evs
      .map(
        (e) =>
          '<option value="' +
          esc(e.id) +
          '"' +
          (evalSeleccionada === e.id ? " selected" : "") +
          ">[Lapso " +
          esc(e.lapso) +
          "] " +
          esc(e.titulo) +
          " — " +
          esc(e.materia) +
          " (" +
          esc(e.notaMax) +
          " pts)</option>",
      )
      .join("") +
    "</select>" +
    '<button data-accion="guardarNotas" class="btn-pri text-sm flex items-center gap-2' +
    (evalSeleccionada ? "" : " opacity-50 pointer-events-none") +
    '"><i class="fa-solid fa-floppy-disk"></i> Guardar Notas</button></div></div></div>';

  if (evalSeleccionada) {
    const ev = getEvaluacion(evalSeleccionada);
    if (ev) {
      html +=
        '<div class="card overflow-hidden"><div class="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center gap-2">' +
        '<span class="font-bold text-slate-800">' +
        esc(ev.titulo) +
        '</span><span class="badge bg-slate-100 text-slate-600">' +
        esc(ev.materia) +
        '</span><span class="badge bg-blue-50 text-blue-700">Lapso ' +
        esc(ev.lapso) +
        '</span><span class="badge bg-slate-100 text-slate-600">' +
        esc(ev.tipo) +
        '</span><span class="badge bg-emerald-50 text-emerald-700">Pond. ' +
        esc(ev.ponderacion) +
        '%</span><span class="badge bg-slate-100 text-slate-600">Máx. ' +
        esc(ev.notaMax) +
        '</span></div><div class="overflow-x-auto"><table class="w-full border-collapse"><thead><tr>' +
        '<th class="th w-12">#</th><th class="th">Estudiante</th><th class="th text-center w-44">Nota (max. ' +
        esc(ev.notaMax) +
        ')</th><th class="th text-center w-32">% Obtenido</th></tr></thead><tbody class="divide-y divide-slate-100 text-sm">';
      if (!mis.length) {
        html += filaVacia("No tienes estudiantes asignados.", 4);
      } else {
        mis.forEach((s, i) => {
          const n = getNota(ev.id, s.cedulaEscolar);
          const pct = n === null ? null : porcentaje(ev, n);
          const color =
            n === null
              ? "text-slate-300"
              : pct >= NOTA_APROBACION
                ? "text-emerald-600 font-semibold"
                : "text-rose-600 font-semibold";
          html +=
            "<tr>" +
            '<td class="td text-slate-400">#' +
            (i + 1) +
            "</td>" +
            '<td class="td font-medium">' +
            esc(s.nombre) +
            '</td><td class="td text-center"><input type="number" min="0" max="' +
            esc(ev.notaMax) +
            '" step="0.1" data-est="' +
            esc(s.cedulaEscolar) +
            '" class="nota-input w-28 text-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" value="' +
            (n === null ? "" : n) +
            '" /></td>' +
            '<td class="td text-center ' +
            color +
            '">' +
            (pct === null ? "-" : pct.toFixed(1) + "%") +
            "</td></tr>";
        });
      }
      html += "</tbody></table></div></div>";
    }
  }

  html += "</section>";
  return html;
}
