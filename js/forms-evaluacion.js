/* =========================================================
   EVALUACIÓN / NOTAS
========================================================= */
function abrirModalEvaluacion(id) {
  document.getElementById("form-evaluacion").reset();
  document.getElementById("evaluacion-id-orig").value = "";
  document.getElementById("evaluacion-materia").innerHTML =
    MATERIAS_PRIMARIA.map(
      (m) => '<option value="' + esc(m) + '">' + esc(m) + "</option>",
    ).join("");
  document.getElementById("evaluacion-fecha").value = new Date()
    .toISOString()
    .split("T")[0];
  document.getElementById("evaluacion-ponderacion").value = 100;
  document.getElementById("evaluacion-notamax").value = 20;

  if (id) {
    const e = getEvaluacion(id);
    if (!e) return;
    document.getElementById("modal-evaluacion-title").innerText =
      "Editar Actividad";
    document.getElementById("evaluacion-id-orig").value = e.id;
    document.getElementById("evaluacion-titulo").value = e.titulo;
    document.getElementById("evaluacion-materia").value = e.materia;
    document.getElementById("evaluacion-tipo").value = e.tipo;
    document.getElementById("evaluacion-lapso").value = e.lapso;
    document.getElementById("evaluacion-fecha").value = e.fecha || "";
    document.getElementById("evaluacion-ponderacion").value =
      e.ponderacion;
    document.getElementById("evaluacion-notamax").value = e.notaMax;
  } else {
    document.getElementById("modal-evaluacion-title").innerText =
      "Nueva Actividad";
  }
  abrirModal("modal-evaluacion");
}

function guardarEvaluacion(ev) {
  ev.preventDefault();
  if (currentRole !== "profesor")
    return alert("Solo el profesor puede crear actividades.");
  const idOrig = document.getElementById("evaluacion-id-orig").value;
  const base = {
    profesorId: currentUser.id,
    grado: currentUser.grado,
    titulo: document.getElementById("evaluacion-titulo").value.trim(),
    materia: document.getElementById("evaluacion-materia").value,
    tipo: document.getElementById("evaluacion-tipo").value,
    lapso: document.getElementById("evaluacion-lapso").value,
    fecha: document.getElementById("evaluacion-fecha").value,
    ponderacion:
      document.getElementById("evaluacion-ponderacion").value || "100",
    notaMax: document.getElementById("evaluacion-notamax").value || "20",
  };
  let registro;
  if (idOrig) {
    const i = db.evaluaciones.findIndex((x) => x.id === idOrig);
    if (i < 0) return;
    registro = Object.assign({}, db.evaluaciones[i], base);
    db.evaluaciones[i] = registro;
  } else {
    registro = Object.assign({ id: uid("EV") }, base);
    db.evaluaciones.push(registro);
  }
  guardarEntidad("evaluaciones", registro);
  cerrarModal("modal-evaluacion");
  render();
}

function guardarNotas() {
  if (!evalSeleccionada)
    return alert("Selecciona una actividad antes de guardar.");
  const ev = getEvaluacion(evalSeleccionada);
  if (!ev) return;
  const ops = [];
  document.querySelectorAll(".nota-input").forEach((inp) => {
    const estId = inp.dataset.est;
    const bruto = inp.value.trim();
    const i = db.notas.findIndex(
      (n) => n.evaluacionId === ev.id && n.estudianteId === estId,
    );
    if (bruto === "") {
      if (i >= 0) {
        db.notas.splice(i, 1);
        ops.push({
          op: "borrar",
          entity: "notas",
          id: ev.id + "|" + estId,
        });
      }
      return;
    }
    const max = num(ev.notaMax) || 20;
    const valor = Math.max(0, Math.min(parseFloat(bruto), max));
    if (isNaN(valor)) return;
    const registro = {
      evaluacionId: ev.id,
      estudianteId: estId,
      nota: valor,
    };
    if (i >= 0) db.notas[i] = registro;
    else db.notas.push(registro);
    ops.push({ op: "upsert", entity: "notas", row: registro });
  });
  guardarLocal();
  encolar(ops);
  render();
}

function guardarClaveAdmin(ev) {
  ev.preventDefault();
  const a = document.getElementById("admin-clave-nueva").value;
  const b = document.getElementById("admin-clave-repetir").value;
  if (a.length < 4) return alert("Mínimo 4 caracteres.");
  if (a !== b) return alert("Las contraseñas no coinciden.");
  const u = db.usuarios.find((x) => x.rol === "admin");
  if (!u) return;
  u.clave = a;
  guardarEntidad("usuarios", u);
  cerrarModal("modal-clave-admin");
  render();
}
