/* =========================================================
   ALUMNO
========================================================= */
function abrirModalAlumno(id) {
  document.getElementById("form-alumno").reset();
  document.getElementById("alumno-id-orig").value = "";

  const selGrado = document.getElementById("alumno-grado");
  const selProf = document.getElementById("alumno-profesor");

  const grados =
    currentRole === "profesor" ? [currentUser.grado] : GRADOS_LIST;
  selGrado.innerHTML = grados
    .map((g) => '<option value="' + esc(g) + '">' + esc(g) + "</option>")
    .join("");
  selGrado.disabled = currentRole === "profesor";

  const profs =
    currentRole === "profesor"
      ? db.profesores.filter((p) => p.id === currentUser.id)
      : db.profesores;
  selProf.innerHTML =
    '<option value="">— Sin asignar —</option>' +
    profs
      .map(
        (p) =>
          '<option value="' +
          esc(p.id) +
          '">' +
          esc(p.nombre) +
          "</option>",
      )
      .join("");

  if (id) {
    const a = getAlumno(id);
    if (!a) return;
    document.getElementById("modal-alumno-title").innerText =
      "Editar Alumno";
    document.getElementById("alumno-id-orig").value = a.cedulaEscolar;
    document.getElementById("alumno-nombre").value = a.nombre;
    document.getElementById("alumno-cedula").value = a.cedulaEscolar;
    selGrado.value = a.grado;
    selProf.value = a.profesorId || "";
    document.getElementById("alumno-rep").value = a.representante || "";
    document.getElementById("alumno-repci").value = a.repCedula || "";
    document.getElementById("alumno-telefono").value = a.telefono || "";
    document.getElementById("alumno-pago").value = a.pago;
  } else {
    document.getElementById("modal-alumno-title").innerText =
      currentRole === "profesor"
        ? "Registrar Estudiante (Mi Aula)"
        : "Inscribir Nuevo Alumno";
    if (currentRole === "profesor") {
      selProf.value = currentUser.id;
    } else {
      const p = db.profesores.find((x) => x.grado === selGrado.value);
      if (p) selProf.value = p.id;
    }
  }
  abrirModal("modal-alumno");
}

function guardarAlumno(ev) {
  ev.preventDefault();
  const idOrig = document.getElementById("alumno-id-orig").value;
  const cedula = document.getElementById("alumno-cedula").value.trim();
  if (!cedula) return alert("La cédula escolar es obligatoria.");

  const existente = getAlumno(cedula);
  if (existente && existente.cedulaEscolar !== idOrig)
    return alert("Esa cédula escolar ya está registrada.");

  const registro = {
    cedulaEscolar: cedula,
    nombre: document.getElementById("alumno-nombre").value.trim(),
    grado: document.getElementById("alumno-grado").value,
    profesorId: document.getElementById("alumno-profesor").value,
    representante: document.getElementById("alumno-rep").value.trim(),
    repCedula: document.getElementById("alumno-repci").value.trim(),
    telefono: document.getElementById("alumno-telefono").value.trim(),
    pago: document.getElementById("alumno-pago").value,
  };
  if (!registro.repCedula)
    return alert(
      "La cédula del representante es obligatoria: es la clave con la que ese padre entra al sistema.",
    );
  if (!registro.representante)
    return alert("El nombre del representante es obligatorio.");

  if (idOrig) {
    const i = db.alumnos.findIndex((x) => x.cedulaEscolar === idOrig);
    if (i < 0) return;
    const anterior = db.alumnos[i];
    db.alumnos[i] = Object.assign({}, anterior, registro);
    guardarEntidad("alumnos", db.alumnos[i]);
    if (anterior.cedulaEscolar !== cedula) {
      db.notas.forEach((n) => {
        if (n.estudianteId === anterior.cedulaEscolar) {
          n.estudianteId = cedula;
          encolar([{ op: "upsert", entity: "notas", row: n }]);
        }
      });
      borrarEntidad("alumnos", anterior.cedulaEscolar);
    }
  } else {
    db.alumnos.push(registro);
    guardarEntidad("alumnos", registro);
  }
  guardarLocal();
  cerrarModal("modal-alumno");
  render();
}
