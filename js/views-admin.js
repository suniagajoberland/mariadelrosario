/* =========================================================
   VISTAS: ADMIN
========================================================= */
function vistaAdmin(t) {
  if (alumnoEnDetalle) return fichaAlumno(alumnoEnDetalle);
  if (t === "dashboard") return vistaDashboard();
  if (t === "alumnos") return vistaAlumnos();
  if (t === "profesores") return vistaProfesores();
  if (t === "notas") return vistaNotasAdmin();
  if (t === "whatsapp") return vistaWhatsApp();
  if (t === "config") return vistaConfig();
  return "";
}

function vistaDashboard() {
  const activos = db.profesores.filter(
    (p) => p.activo !== false && p.activo !== "false",
  ).length;
  const pendientes = db.alumnos.filter(
    (a) => a.pago !== "Solvente",
  ).length;
  const reps = new Set(db.alumnos.map((a) => a.repCedula).filter(Boolean))
    .size;
  const recientes = db.evaluaciones
    .slice()
    .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)))
    .slice(0, 6);

  const tarjetas = [
    {
      t: "Alumnos matriculados",
      v: db.alumnos.length,
      i: "fa-children",
      c: "text-brand-600 bg-brand-50",
    },
    {
      t: "Profesores activos",
      v: activos,
      i: "fa-chalkboard-user",
      c: "text-indigo-600 bg-indigo-50",
    },
    {
      t: "Actividades creadas",
      v: db.evaluaciones.length,
      i: "fa-clipboard-list",
      c: "text-amber-600 bg-amber-50",
    },
    {
      t: "Representantes",
      v: reps,
      i: "fa-user-group",
      c: "text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    '<section class="space-y-6">' +
    '<div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">' +
    tarjetas
      .map(
        (k) =>
          '<div class="card p-5"><div class="flex items-center justify-between"><div><p class="text-[11px] text-slate-500 font-bold uppercase tracking-wider">' +
          esc(k.t) +
          '</p><p class="text-3xl font-bold font-heading text-slate-800 mt-1">' +
          k.v +
          '</p></div><div class="w-11 h-11 rounded-xl ' +
          k.c +
          ' flex items-center justify-center"><i class="fa-solid ' +
          k.i +
          '"></i></div></div></div>',
      )
      .join("") +
    "</div>" +
    '<div class="grid lg:grid-cols-3 gap-6">' +
    '<div class="card lg:col-span-2 overflow-hidden">' +
    '<div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between"><h3 class="font-bold text-slate-800">Actividades registradas</h3>' +
    '<a href="#" data-accion="tab" data-arg="notas" class="text-xs text-brand-600 font-semibold">Ver notas <i class="fa-solid fa-arrow-right ml-1"></i></a></div>' +
    '<div class="overflow-x-auto"><table class="w-full border-collapse"><thead><tr><th class="th">Actividad</th><th class="th">Materia</th><th class="th">Lapso</th><th class="th">Fecha</th></tr></thead><tbody class="divide-y divide-slate-100 text-sm">' +
    (recientes.length
      ? recientes
          .map(
            (e) =>
              '<tr><td class="td font-medium">' +
              esc(e.titulo) +
              '</td><td class="td">' +
              esc(e.materia) +
              '</td><td class="td">Lapso ' +
              esc(e.lapso) +
              '</td><td class="td text-slate-500">' +
              fechar(e.fecha) +
              "</td></tr>",
          )
          .join("")
      : filaVacia("Todavía no hay actividades.", 4)) +
    "</tbody></table></div></div>" +
    '<div class="card p-5 space-y-4"><h3 class="font-bold text-slate-800">Accesos del sistema</h3><div class="space-y-2 text-sm">' +
    '<div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50"><i class="fa-solid fa-user-shield text-brand-600 w-5"></i><div class="flex-1"><p class="font-semibold text-slate-700">Administrador</p><p class="text-xs text-slate-500">Usuario + contraseña</p></div><a href="#" data-accion="tab" data-arg="config" class="text-xs text-brand-600 font-semibold">Configurar</a></div>' +
    '<div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50"><i class="fa-solid fa-chalkboard-user text-indigo-600 w-5"></i><div class="flex-1"><p class="font-semibold text-slate-700">Profesores</p><p class="text-xs text-slate-500">Cédula + clave que tú asignas</p></div><a href="#" data-accion="tab" data-arg="profesores" class="text-xs text-brand-600 font-semibold">Gestionar</a></div>' +
    '<div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50"><i class="fa-solid fa-user-group text-emerald-600 w-5"></i><div class="flex-1"><p class="font-semibold text-slate-700">Representantes</p><p class="text-xs text-slate-500">Su cédula es la clave</p></div><a href="#" data-accion="tab" data-arg="alumnos" class="text-xs text-brand-600 font-semibold">Alumnos</a></div>' +
    "</div>" +
    (pendientes
      ? '<div class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 flex items-center justify-between gap-3 flex-wrap"><span><i class="fa-solid fa-triangle-exclamation mr-1.5"></i>' +
        pendientes +
        ' alumno(s) con estatus de pago pendiente.</span><a href="#" data-accion="tab" data-arg="whatsapp" class="font-semibold text-amber-900 underline whitespace-nowrap"><i class="fa-brands fa-whatsapp mr-1"></i>Enviar recordatorios</a></div>'
      : "") +
    "</div></div></section>"
  );
}

function vistaAlumnos() {
  let html =
    '<section class="space-y-5">' +
    '<div class="card p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">' +
    '<div><h3 class="text-lg font-bold text-slate-800">Matrícula de Alumnos</h3><p class="text-xs text-slate-500 mt-1">' +
    db.alumnos.length +
    " alumno(s) registrado(s)</p></div>" +
    '<button data-accion="alumnoNuevo" class="btn-pri text-sm flex items-center gap-2"><i class="fa-solid fa-user-plus"></i> Inscribir Alumno</button></div>' +
    '<div class="card overflow-hidden"><div class="overflow-x-auto"><table class="w-full border-collapse"><thead><tr>' +
    '<th class="th">Cédula Escolar</th><th class="th">Alumno</th><th class="th">Grado</th><th class="th">Profesor(a)</th>' +
    '<th class="th">Representante</th><th class="th">Cédula Rep.</th><th class="th">WhatsApp</th><th class="th">Pago</th><th class="th text-right">Acciones</th>' +
    '</tr></thead><tbody class="divide-y divide-slate-100 text-sm">';

  if (!db.alumnos.length) {
    html += filaVacia("No hay alumnos registrados.", 9);
  } else {
    db.alumnos
      .slice()
      .sort(
        (a, b) =>
          a.grado.localeCompare(b.grado) ||
          a.nombre.localeCompare(b.nombre),
      )
      .forEach((a) => {
        const p = getProfesor(a.profesorId);
        html +=
          "<tr>" +
          '<td class="td font-medium text-slate-700">' +
          esc(a.cedulaEscolar) +
          "</td>" +
          '<td class="td font-semibold">' +
          esc(a.nombre) +
          "</td>" +
          '<td class="td">' +
          esc(a.grado) +
          "</td>" +
          '<td class="td text-slate-600">' +
          (p
            ? esc(p.nombre)
            : '<span class="text-amber-600 text-xs">Sin asignar</span>') +
          "</td>" +
          '<td class="td">' +
          esc(a.representante) +
          "</td>" +
          '<td class="td"><span class="badge bg-slate-100 text-slate-600">' +
          esc(a.repCedula || "-") +
          "</span></td>" +
          '<td class="td text-slate-500">+' +
          esc(a.telefono) +
          "</td>" +
          '<td class="td">' +
          badgePago(a.pago) +
          "</td>" +
          '<td class="td"><div class="flex items-center justify-end gap-1.5">' +
          '<button data-accion="whatsappAbrirAlumno" data-arg="' +
          attr(a.cedulaEscolar) +
          '" title="Recordatorio por WhatsApp" class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"><i class="fa-brands fa-whatsapp"></i></button>' +
          '<button data-accion="alumnoEditar" data-arg="' +
          attr(a.cedulaEscolar) +
          '" title="Editar" class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"><i class="fa-solid fa-pen"></i></button>' +
          '<button data-accion="alumnoBorrar" data-arg="' +
          attr(a.cedulaEscolar) +
          '" title="Eliminar" class="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"><i class="fa-solid fa-trash-can"></i></button>' +
          "</div></td></tr>";
      });
  }

  html +=
    "</tbody></table></div></div>" +
    '<p class="text-xs text-slate-400 flex items-start gap-1.5"><i class="fa-solid fa-circle-info mt-0.5"></i><span>La cédula del representante es la clave con la que ese padre entra al sistema a ver las notas de sus hijos.</span></p>' +
    "</section>";
  return html;
}

function vistaProfesores() {
  let html =
    '<section class="space-y-5">' +
    '<div class="card p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">' +
    '<div><h3 class="text-lg font-bold text-slate-800">Profesores y Claves</h3><p class="text-xs text-slate-500 mt-1">' +
    db.profesores.length +
    " profesor(es) • el profesor entra con su cédula y la clave que definas aquí</p></div>" +
    '<button data-accion="profesorNuevo" class="btn-pri text-sm flex items-center gap-2"><i class="fa-solid fa-user-plus"></i> Agregar Profesor</button></div>' +
    '<div class="card overflow-hidden"><div class="overflow-x-auto"><table class="w-full border-collapse"><thead><tr>' +
    '<th class="th">Profesor(a)</th><th class="th">Cédula</th><th class="th">Grado</th><th class="th">Alumnos</th>' +
    '<th class="th">Clave de acceso</th><th class="th">Estado</th><th class="th text-right">Acciones</th>' +
    '</tr></thead><tbody class="divide-y divide-slate-100 text-sm">';

  if (!db.profesores.length) {
    html += filaVacia("No hay profesores registrados.", 7);
  } else {
    db.profesores.forEach((p) => {
      const n = alumnosPorProfesor(p.id).length;
      const visible = clavesVisibles[p.id];
      const inactivo = p.activo === false || p.activo === "false";
      html +=
        "<tr>" +
        '<td class="td"><div class="flex items-center gap-3">' +
        '<span class="w-9 h-9 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">' +
        iniciales(p.nombre) +
        "</span>" +
        '<div><p class="font-semibold text-slate-700">' +
        esc(p.nombre) +
        '</p><p class="text-[11px] text-slate-400">' +
        esc(p.telefono || "-") +
        "</p></div></div></td>" +
        '<td class="td font-medium">' +
        esc(p.cedula) +
        "</td>" +
        '<td class="td">' +
        esc(p.grado || "-") +
        "</td>" +
        '<td class="td"><span class="badge bg-slate-100 text-slate-600">' +
        n +
        "</span></td>" +
        '<td class="td"><div class="flex items-center gap-2">' +
        '<code class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs tracking-wider">' +
        (visible ? esc(p.clave) : "••••••") +
        "</code>" +
        '<button data-accion="profesorVerClave" data-arg="' +
        attr(p.id) +
        '" class="text-xs text-slate-400 hover:text-slate-600" title="' +
        (visible ? "Ocultar" : "Ver") +
        ' clave"><i class="fa-solid ' +
        (visible ? "fa-eye-slash" : "fa-eye") +
        '"></i></button></div></td>' +
        '<td class="td">' +
        (inactivo
          ? '<span class="badge bg-slate-200 text-slate-600">Inactivo</span>'
          : '<span class="badge bg-emerald-50 text-emerald-700">Activo</span>') +
        "</td>" +
        '<td class="td"><div class="flex items-center justify-end gap-1.5">' +
        '<button data-accion="profesorResetClave" data-arg="' +
        attr(p.id) +
        '" title="Cambiar clave" class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100"><i class="fa-solid fa-key"></i></button>' +
        '<button data-accion="profesorEditar" data-arg="' +
        attr(p.id) +
        '" title="Editar" class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"><i class="fa-solid fa-pen"></i></button>' +
        '<button data-accion="profesorBorrar" data-arg="' +
        attr(p.id) +
        '" title="Eliminar" class="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"><i class="fa-solid fa-trash-can"></i></button>' +
        "</div></td></tr>";
    });
  }

  html +=
    "</tbody></table></div></div>" +
    '<div class="card p-5"><h4 class="font-bold text-slate-800 mb-3"><i class="fa-solid fa-circle-info text-brand-500 mr-1.5"></i>Cómo acceden los profesores</h4><div class="grid sm:grid-cols-3 gap-3 text-sm">' +
    '<div class="p-3 rounded-xl bg-slate-50"><p class="font-semibold text-slate-700">1. Cédula</p><p class="text-xs text-slate-500 mt-1">La que registras en el formulario, con o sin guiones.</p></div>' +
    '<div class="p-3 rounded-xl bg-slate-50"><p class="font-semibold text-slate-700">2. Clave</p><p class="text-xs text-slate-500 mt-1">La defines tú. Si la dejas vacía al crear, se genera una.</p></div>' +
    '<div class="p-3 rounded-xl bg-slate-50"><p class="font-semibold text-slate-700">3. Cambio</p><p class="text-xs text-slate-500 mt-1">Con el botón <i class="fa-solid fa-key text-amber-500"></i> cambias la clave cuando quieras.</p></div>' +
    "</div></div></section>";
  return html;
}

function vistaNotasAdmin() {
  const grados = Array.from(
    new Set(db.alumnos.map((a) => a.grado)),
  ).sort();
  const lista =
    filtroGradoAdmin === "todos"
      ? db.alumnos
      : alumnosPorGrado(filtroGradoAdmin);

  let html =
    '<section class="space-y-5">' +
    '<div class="card p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">' +
    '<div><h3 class="text-lg font-bold text-slate-800">Notas y Actividades</h3><p class="text-xs text-slate-500 mt-1">Vista general de toda la institución</p></div>' +
    '<select data-cambio="filtrarGradoAdmin" class="input sm:w-64"><option value="todos"' +
    (filtroGradoAdmin === "todos" ? " selected" : "") +
    ">Todos los grados</option>" +
    grados
      .map(
        (g) =>
          '<option value="' +
          esc(g) +
          '"' +
          (filtroGradoAdmin === g ? " selected" : "") +
          ">" +
          esc(g) +
          "</option>",
      )
      .join("") +
    "</select></div>" +
    '<div class="card overflow-hidden"><div class="overflow-x-auto"><table class="w-full border-collapse"><thead><tr>' +
    '<th class="th">Alumno</th><th class="th">Cédula</th><th class="th">Grado</th><th class="th">Representante</th>' +
    '<th class="th text-center">Actividades</th><th class="th text-center">Calificadas</th><th class="th text-center">Promedio</th>' +
    '<th class="th">Desempeño</th><th class="th text-right">Detalle</th>' +
    '</tr></thead><tbody class="divide-y divide-slate-100 text-sm">';

  if (!lista.length) {
    html += filaVacia("No hay alumnos para este filtro.", 9);
  } else {
    lista
      .slice()
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .forEach((a) => {
        const r = resumenAlumno(a.cedulaEscolar);
        const prom = r.promedio;
        const col =
          prom === null
            ? "bg-slate-100 text-slate-500"
            : prom >= NOTA_APROBACION
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700";
        html +=
          "<tr>" +
          '<td class="td font-semibold">' +
          esc(a.nombre) +
          "</td>" +
          '<td class="td text-slate-500">' +
          esc(a.cedulaEscolar) +
          "</td>" +
          '<td class="td">' +
          esc(a.grado) +
          "</td>" +
          '<td class="td">' +
          esc(a.representante) +
          '<p class="text-[11px] text-slate-400">' +
          esc(a.repCedula || "-") +
          "</p></td>" +
          '<td class="td text-center">' +
          r.actividades +
          "</td>" +
          '<td class="td text-center">' +
          r.calificadas +
          "</td>" +
          '<td class="td text-center font-semibold">' +
          (prom === null ? "-" : prom.toFixed(1) + "%") +
          "</td>" +
          '<td class="td"><span class="badge ' +
          col +
          '">' +
          (prom === null
            ? "Sin notas"
            : prom >= NOTA_APROBACION
              ? "Aprobado"
              : "En riesgo") +
          "</span></td>" +
          '<td class="td text-right"><button data-accion="verAlumno" data-arg="' +
          attr(a.cedulaEscolar) +
          '" class="text-xs font-semibold text-brand-600 hover:text-brand-700 whitespace-nowrap">Ver más <i class="fa-solid fa-arrow-right ml-1"></i></button></td></tr>';
      });
  }

  html += "</tbody></table></div></div></section>";
  return html;
}

function vistaConfig() {
  const admin = db.usuarios.find((u) => u.rol === "admin") || {};
  const insignias = {
    conectado:
      '<span class="badge bg-emerald-50 text-emerald-700">Conectado</span>',
    sincronizando:
      '<span class="badge bg-amber-50 text-amber-700">Sincronizando</span>',
    error:
      '<span class="badge bg-rose-50 text-rose-700">Error de conexión</span>',
    local:
      '<span class="badge bg-slate-100 text-slate-600">Modo local</span>',
  };
  const resumen = [
    ["Alumnos", db.alumnos.length],
    ["Profesores", db.profesores.length],
    ["Actividades", db.evaluaciones.length],
    ["Notas registradas", db.notas.length],
    [
      "Representantes",
      new Set(db.alumnos.map((a) => a.repCedula).filter(Boolean)).size,
    ],
  ];

  return (
    '<section class="space-y-6">' +
    '<div class="card p-6"><div class="flex items-start justify-between gap-4 flex-wrap">' +
    '<div><h3 class="text-lg font-bold text-slate-800">Conexión con Google Sheets</h3>' +
    '<p class="text-xs text-slate-500 mt-1">Alumnos, profesores, claves, actividades y notas se guardan en una hoja compartida.</p></div>' +
    (insignias[estadoSync] || insignias.local) +
    "</div>" +
    '<div class="mt-5 grid md:grid-cols-[1fr_auto] gap-3 items-end"><div>' +
    '<label class="block text-xs font-semibold text-slate-600 mb-1.5">URL del Web App de Apps Script</label>' +
    '<input type="url" id="input-url-hoja" placeholder="https://script.google.com/macros/s/AKfycb.../exec" class="input" />' +
    '<p class="text-[11px] text-slate-400 mt-1.5">Debe terminar en <code class="bg-slate-100 px-1 rounded">/exec</code>. Ver <code class="bg-slate-100 px-1 rounded">apps-script/INSTALACION.md</code>.</p></div>' +
    '<button data-accion="probarConexion" class="btn-pri text-sm py-3"><i class="fa-solid fa-plug-circle-check mr-1.5"></i> Conectar y probar</button></div>' +
    '<div class="mt-5 flex flex-wrap gap-2">' +
    '<button data-accion="subirTodo" class="btn-sec text-sm flex items-center gap-2"><i class="fa-solid fa-cloud-arrow-up text-brand-600"></i> Subir datos actuales a la hoja</button>' +
    '<button data-accion="vaciarHoja" class="btn-sec text-sm flex items-center gap-2 text-rose-600"><i class="fa-solid fa-trash-can"></i> Vaciar la hoja</button></div>' +
    '<p class="text-[11px] text-slate-400 mt-3 leading-relaxed">Sin conexión la aplicación sigue funcionando con los datos guardados en este navegador. <strong>Subir datos actuales</strong> reemplaza todo el contenido de las hojas con lo que tienes aquí, incluyendo las claves de los profesores.</p></div>' +
    '<div class="grid md:grid-cols-2 gap-6">' +
    '<div class="card p-6"><h4 class="font-bold text-slate-800 mb-1">Contraseña del administrador</h4>' +
    '<p class="text-xs text-slate-500 mb-4">Usuario actual: <strong class="text-slate-700">' +
    esc(admin.usuario || "admin") +
    '</strong></p><button data-accion="cambiarClaveAdmin" class="btn-sec text-sm flex items-center gap-2"><i class="fa-solid fa-key text-amber-500"></i> Cambiar contraseña</button></div>' +
    '<div class="card p-6"><h4 class="font-bold text-slate-800 mb-4">Resumen de la base de datos</h4><div class="space-y-2 text-sm">' +
    resumen
      .map(
        (k) =>
          '<div class="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0"><span class="text-slate-600">' +
          esc(k[0]) +
          '</span><span class="font-bold text-slate-800">' +
          k[1] +
          "</span></div>",
      )
      .join("") +
    "</div></div></div>" +
    '<div class="card p-6"><h4 class="font-bold text-slate-800 mb-3">Accesos y niveles de permiso</h4><div class="overflow-x-auto"><table class="w-full border-collapse text-sm"><thead><tr><th class="th">Rol</th><th class="th">Inicia sesión con</th><th class="th">Puede ver</th><th class="th">Puede hacer</th></tr></thead><tbody class="divide-y divide-slate-100">' +
    '<tr><td class="td font-semibold">Administrador</td><td class="td">Usuario + contraseña</td><td class="td">Todos los grados y notas</td><td class="td">Alumnos, profesores, claves, configuración</td></tr>' +
    '<tr><td class="td font-semibold">Profesor(a)</td><td class="td">Cédula + clave asignada</td><td class="td">Solo sus alumnos</td><td class="td">Crear actividades y cargar notas</td></tr>' +
    '<tr><td class="td font-semibold">Representante</td><td class="td">Su cédula</td><td class="td">Solo sus hijos representados</td><td class="td">Consultar notas y actividades</td></tr>' +
    "</tbody></table></div></div></section>"
  );
}

function restaurarInputUrl() {
  const inp = document.getElementById("input-url-hoja");
  if (inp && urlHoja) inp.value = urlHoja;
}
