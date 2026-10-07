/* =========================================================
   PROFESOR
========================================================= */
function abrirModalProfesor(id) {
  document.getElementById("form-profesor").reset();
  document.getElementById("profesor-id-orig").value = "";
  document.getElementById("profesor-grado").innerHTML = GRADOS_LIST.map(
    (g) => '<option value="' + esc(g) + '">' + esc(g) + "</option>",
  ).join("");
  document.getElementById("profesor-clave").value = "";
  document.getElementById("profesor-activo").checked = true;

  if (id) {
    const p = getProfesor(id);
    if (!p) return;
    document.getElementById("modal-profesor-title").innerText =
      "Editar Profesor(a)";
    document.getElementById("profesor-id-orig").value = p.id;
    document.getElementById("profesor-nombre").value = p.nombre;
    document.getElementById("profesor-cedula").value = p.cedula;
    document.getElementById("profesor-telefono").value = p.telefono || "";
    document.getElementById("profesor-grado").value =
      p.grado || GRADOS_LIST[0];
    document.getElementById("profesor-clave").value = "";
    document.getElementById("profesor-activo").checked =
      p.activo !== false && p.activo !== "false";
  } else {
    document.getElementById("modal-profesor-title").innerText =
      "Agregar Profesor(a)";
  }
  abrirModal("modal-profesor");
}

function guardarProfesor(ev) {
  ev.preventDefault();
  const idOrig = document.getElementById("profesor-id-orig").value;
  const cedula = document.getElementById("profesor-cedula").value.trim();
  const nombre = document.getElementById("profesor-nombre").value.trim();
  const grado = document.getElementById("profesor-grado").value;
  const clave = document.getElementById("profesor-clave").value.trim();

  if (!cedula || !nombre)
    return alert("La cédula y el nombre son obligatorios.");
  const choque = db.profesores.find(
    (p) => norm(p.cedula) === norm(cedula) && p.id !== idOrig,
  );
  if (choque) return alert("Ya existe un profesor con esa cédula.");

  let registro;
  if (idOrig) {
    const p = getProfesor(idOrig);
    if (!p) return;
    registro = Object.assign({}, p);
    registro.cedula = cedula;
    registro.nombre = nombre;
    registro.grado = grado;
    registro.telefono = document
      .getElementById("profesor-telefono")
      .value.trim();
    registro.activo = document.getElementById("profesor-activo").checked;
    if (clave) registro.clave = clave;
  } else {
    const numericos = db.profesores
      .map((p) => p.id)
      .filter((x) => /^P\d+$/.test(x));
    numericos.sort((a, b) => num(b.slice(1)) - num(a.slice(1)));
    const siguiente = numericos.length
      ? "P" + String(num(numericos[0].slice(1)) + 1).padStart(3, "0")
      : "P001";
    registro = {
      id: siguiente,
      cedula: cedula,
      nombre: nombre,
      clave: clave || String(Math.floor(1000 + Math.random() * 9000)),
      telefono: document.getElementById("profesor-telefono").value.trim(),
      grado: grado,
      activo: document.getElementById("profesor-activo").checked,
    };
  }

  if (idOrig) {
    const i = db.profesores.findIndex((x) => x.id === idOrig);
    db.profesores[i] = registro;
  } else {
    db.profesores.push(registro);
    clavesVisibles[registro.id] = true;
  }
  guardarEntidad("profesores", registro);

  if (registro.grado) {
    db.alumnos.forEach((a) => {
      if (a.grado === registro.grado && !a.profesorId) {
        a.profesorId = registro.id;
        encolar([{ op: "upsert", entity: "alumnos", row: a }]);
      }
    });
  }
  guardarLocal();
  cerrarModal("modal-profesor");
  render();
}
