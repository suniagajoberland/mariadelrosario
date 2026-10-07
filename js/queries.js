/* =========================================================
   CONSULTAS
========================================================= */
function getAlumno(id) {
  return db.alumnos.find((a) => a.cedulaEscolar === id) || null;
}
function getProfesor(id) {
  return db.profesores.find((p) => p.id === id) || null;
}
function getEvaluacion(id) {
  return db.evaluaciones.find((e) => e.id === id) || null;
}
function alumnosPorGrado(g) {
  return db.alumnos.filter((a) => a.grado === g);
}
function alumnosPorProfesor(pid) {
  return db.alumnos
    .filter((a) => a.profesorId === pid)
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
}
function alumnosPorRepresentante(ci) {
  const clave = norm(ci);
  return db.alumnos
    .filter((a) => norm(a.repCedula) === clave)
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
}
function representantes() {
  const mapa = {};
  db.alumnos.forEach((a) => {
    const clave = norm(a.repCedula);
    if (!clave) return;
    if (!mapa[clave]) {
      mapa[clave] = {
        clave: clave,
        nombre: a.representante || "Representante",
        cedula: a.repCedula || "",
        telefono: a.telefono || "",
        hijos: [],
      };
    }
    mapa[clave].hijos.push(a);
    if (!mapa[clave].telefono && a.telefono)
      mapa[clave].telefono = a.telefono;
  });
  return Object.keys(mapa)
    .map((k) => mapa[k])
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
}
function telefonoWhatsApp(t) {
  let d = String(t == null ? "" : t).replace(/\D/g, "");
  if (!d) return "";
  if (d.indexOf("58") === 0) return d;
  if (d.charAt(0) === "0") return "58" + d.slice(1);
  if (d.length === 10) return "58" + d;
  return d;
}
function enlaceWhatsApp(telefono, mensaje) {
  const numero = telefonoWhatsApp(telefono);
  if (!numero) return "";
  const texto = encodeURIComponent(String(mensaje || ""));
  return "https://wa.me/" + numero + (texto ? "?text=" + texto : "");
}
function abrirWhatsApp(telefono, mensaje) {
  const url = enlaceWhatsApp(telefono, mensaje);
  if (!url)
    return alert("Este representante no tiene un teléfono registrado.");
  window.open(url, "_blank");
}
function aplicarPlantilla(texto, rep) {
  const hijos = rep.hijos.map((h) => h.nombre).join(", ");
  const grados = Array.from(new Set(rep.hijos.map((h) => h.grado)))
    .filter(Boolean)
    .join(", ");
  return String(texto == null ? "" : texto)
    .replace(/\{representante\}/g, rep.nombre || "")
    .replace(/\{alumno\}/g, hijos || "su representado(a)")
    .replace(/\{grado\}/g, grados || "")
    .replace(/\{cedula\}/g, rep.cedula || "");
}
function getNota(evId, estId) {
  const n = db.notas.find(
    (x) => x.evaluacionId === evId && x.estudianteId === estId,
  );
  if (!n || n.nota === "" || n.nota === null || n.nota === undefined)
    return null;
  return num(n.nota);
}
function porcentaje(ev, nota) {
  const max = num(ev.notaMax) || 20;
  return max > 0 ? (nota / max) * 100 : 0;
}
function actividadesDeAlumno(alumnoId) {
  const alumno = getAlumno(alumnoId);
  if (!alumno) return [];
  const grado = alumno.grado;
  return db.evaluaciones
    .filter((e) => {
      if (e.grado === grado) return true;
      const prof = getProfesor(e.profesorId);
      return !!prof && prof.grado === grado;
    })
    .sort(
      (a, b) =>
        String(a.lapso).localeCompare(String(b.lapso)) ||
        String(a.fecha).localeCompare(String(b.fecha)),
    );
}
function resumenAlumno(alumnoId) {
  const acts = actividadesDeAlumno(alumnoId);
  let suma = 0;
  let n = 0;
  acts.forEach((ev) => {
    const nota = getNota(ev.id, alumnoId);
    if (nota === null) return;
    suma += porcentaje(ev, nota);
    n++;
  });
  return {
    actividades: acts.length,
    calificadas: n,
    promedio: n > 0 ? suma / n : null,
  };
}
