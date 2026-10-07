/* =========================================================
   DELEGACIÓN DE EVENTOS
========================================================= */
const ACCIONES = {
  tab: (t) => cambiarTab(t),
  volver: () => {
    alumnoEnDetalle = null;
    render();
  },
  filtrarGradoAdmin: (v) => {
    filtroGradoAdmin = v;
    render();
  },
  filtrarLapsoProf: (v) => {
    filtroLapso = v;
    render();
  },
  seleccionarEval: (v) => {
    evalSeleccionada = v || null;
    render();
  },

  alumnoNuevo: () => abrirModalAlumno(),
  alumnoEditar: (id) => abrirModalAlumno(id),
  alumnoBorrar: (id) => {
    const a = getAlumno(id);
    if (!a) return;
    if (!confirm("¿Eliminar a " + a.nombre + " y todas sus notas?"))
      return;
    db.alumnos = db.alumnos.filter((x) => x.cedulaEscolar !== id);
    db.notas = db.notas.filter((n) => n.estudianteId !== id);
    guardarLocal();
    borrarEntidad("alumnos", id);
    render();
  },

  profesorNuevo: () => abrirModalProfesor(),
  profesorEditar: (id) => abrirModalProfesor(id),
  profesorBorrar: (id) => {
    const p = getProfesor(id);
    if (!p) return;
    const n = alumnosPorProfesor(id).length;
    if (
      n &&
      !confirm(
        p.nombre +
          " tiene " +
          n +
          " alumno(s). Al eliminarlo quedarán sin profesor asignado. ¿Continuar?",
      )
    )
      return;
    if (!confirm("¿Eliminar a " + p.nombre + "?")) return;
    db.profesores = db.profesores.filter((x) => x.id !== id);
    db.alumnos.forEach((a) => {
      if (a.profesorId === id) a.profesorId = "";
    });
    guardarLocal();
    borrarEntidad("profesores", id);
    db.alumnos
      .filter((a) => !a.profesorId)
      .forEach((a) =>
        encolar([{ op: "upsert", entity: "alumnos", row: a }]),
      );
    render();
  },
  profesorVerClave: (id) => {
    clavesVisibles[id] = !clavesVisibles[id];
    render();
  },
  profesorResetClave: (id) => {
    const p = getProfesor(id);
    if (!p) return;
    const nueva = prompt("Nueva clave para " + p.nombre + ":");
    if (nueva === null) return;
    if (nueva.trim().length < 4)
      return alert("La clave debe tener al menos 4 caracteres.");
    p.clave = nueva.trim();
    clavesVisibles[id] = true;
    guardarEntidad("profesores", p);
    render();
  },

  evalNueva: () => abrirModalEvaluacion(),
  evalEditar: (id) => abrirModalEvaluacion(id),
  evalBorrar: (id) => {
    const ev = getEvaluacion(id);
    if (!ev) return;
    if (!confirm('¿Eliminar "' + ev.titulo + '" y sus notas?')) return;
    db.evaluaciones = db.evaluaciones.filter((e) => e.id !== id);
    db.notas = db.notas.filter((n) => n.evaluacionId !== id);
    guardarLocal();
    borrarEntidad("evaluaciones", id);
    if (evalSeleccionada === id) evalSeleccionada = null;
    render();
  },
  cargarNotas: (id) => {
    evalSeleccionada = id;
    render();
  },
  guardarNotas: () => guardarNotas(),
  verAlumno: (id) => {
    alumnoEnDetalle = id;
    render();
  },

  constanciaHijo: (v) => {
    constanciaSeleccion = v;
    const al = getAlumno(v);
    const caja = document.getElementById("const-pago-estado");
    if (caja && al) caja.innerHTML = badgePago(al.pago);
  },
  boletaHijo: (v) => {
    boletaSeleccion = v;
    render();
  },
  solicitarConstancia: (tipo) => solicitarConstancia(tipo),
  descargarConstancia: (tipo) => descargarConstanciaDirecta(tipo),
  imprimirConstancia: (tipo) => imprimirConstanciaDirecta(tipo),
  descargarSolicitud: (id) => descargarSolicitud(id),
  imprimirSolicitud: (id) => imprimirSolicitud(id),
  borrarSolicitud: (id) => borrarSolicitud(id),
  descargarBoleta: () => descargarBoleta(),
  imprimirBoleta: () => imprimirBoleta(),

  probarConexion: () => probarConexion(),
  subirTodo: () => subirTodo(),
  vaciarHoja: () => vaciarHoja(),
  cambiarClaveAdmin: () => {
    document.getElementById("form-clave-admin").reset();
    abrirModal("modal-clave-admin");
  },

  whatsappEnviar: () => whatsappEnviar(),
  whatsappAbrir: (clave) => whatsappAbrirRepresentante(clave),
  whatsappAbrirAlumno: (id) => whatsappAbrirAlumno(id),
  whatsappTodos: (v) => marcarTodosRepresentantes(v === "si"),
};

document.addEventListener("click", function (ev) {
  const btn = ev.target.closest("[data-accion]");
  if (!btn) return;
  ev.preventDefault();
  const fn = ACCIONES[btn.dataset.accion];
  if (fn) fn(decodeURIComponent(btn.dataset.arg || ""), btn);
});
document.addEventListener("change", function (ev) {
  const el = ev.target.closest("[data-cambio]");
  if (!el) return;
  const fn = ACCIONES[el.dataset.cambio];
  if (fn) fn(el.value, el);
});
document.addEventListener("keydown", function (ev) {
  if (ev.key === "Escape") cerrarTodosModales();
});

function abrirModal(id) {
  const m = document.getElementById(id);
  m.classList.remove("hidden");
  m.classList.add("flex");
}
function cerrarModal(id) {
  const m = document.getElementById(id);
  m.classList.add("hidden");
  m.classList.remove("flex");
}
function cerrarTodosModales() {
  [
    "modal-alumno",
    "modal-profesor",
    "modal-evaluacion",
    "modal-clave-admin",
  ].forEach(cerrarModal);
}
