/* =========================================================
   CAPA DE DATOS (Google Sheets + cache local)
========================================================= */
function guardarLocal() {
  try {
    localStorage.setItem(LS_DB, JSON.stringify(db));
  } catch (e) {
    console.warn("No se pudo guardar en el navegador", e);
  }
}
function cargarLocal() {
  try {
    const crudo = localStorage.getItem(LS_DB);
    if (!crudo) return false;
    const obj = JSON.parse(crudo);
    Object.keys(db).forEach((k) => {
      if (Array.isArray(obj[k])) db[k] = obj[k];
    });
    return true;
  } catch (e) {
    return false;
  }
}
function normalizar() {
  db.alumnos = db.alumnos || [];
  db.profesores = db.profesores || [];
  db.evaluaciones = db.evaluaciones || [];
  db.notas = db.notas || [];
  db.usuarios = db.usuarios || [];
  db.solicitudes = db.solicitudes || [];
  if (!db.usuarios.some((u) => u.rol === "admin")) {
    db.usuarios.push({
      id: "admin-default",
      usuario: "admin",
      clave: "admin",
      rol: "admin",
      nombre: "Administrador",
    });
  }
  db.profesores.forEach((p) => {
    if (p.activo === undefined || p.activo === "") p.activo = true;
  });
  db.alumnos.forEach((a) => {
    if (a.repCedula === undefined) a.repCedula = "";
    if (!a.profesorId) {
      const p = db.profesores.find((x) => x.grado === a.grado);
      a.profesorId = p ? p.id : "";
    }
  });
  guardarLocal();
}

async function llamarHoja(accion) {
  if (!urlHoja) throw new Error("Sin URL de Google Sheets");
  const esLectura = accion === "leer";
  const url = esLectura ? urlHoja + "?accion=leer" : urlHoja;
  const opciones = { method: esLectura ? "GET" : "POST" };
  if (!esLectura) {
    opciones.headers = { "Content-Type": "text/plain;charset=utf-8" };
    opciones.body = JSON.stringify(accion);
  }
  const res = await fetch(url, opciones);
  if (!res.ok) {
    if (res.status === 403 || res.status === 401) {
      const err = new Error(
        "HTTP " +
          res.status +
          " - el Web App no es público. Vuelve a Apps Script > Implementar > Nueva implementación > Aplicación web > Quién tiene acceso: Cualquiera"
      );
      err.codigo = res.status;
      throw err;
    }
    throw new Error("HTTP " + res.status);
  }
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "Error desconocido");
  return json;
}

function marcarSync(estado, texto) {
  estadoSync = estado;
  const punto = document.getElementById("sync-dot");
  const txt = document.getElementById("sheet-status-text");
  if (!punto || !txt) return;
  const estilos = {
    conectado: ["bg-emerald-500", "Google Sheets conectado"],
    sincronizando: [
      "bg-amber-400 animate-pulse",
      "Guardando en la hoja...",
    ],
    error: ["bg-rose-500", "Error al guardar en la hoja"],
    local: ["bg-slate-300", "Modo local (sin Sheets)"],
  };
  const e = estilos[estado] || estilos.local;
  punto.className = "w-2 h-2 rounded-full " + e[0];
  txt.innerText = texto || e[1];
}

async function sincronizar() {
  if (!urlHoja) {
    marcarSync("local");
    return false;
  }
  marcarSync("sincronizando");
  try {
    const r = await llamarHoja("leer");
    const datosLocales = db;
    const hayLocal =
      db.alumnos.length +
        db.profesores.length +
        db.evaluaciones.length +
        db.notas.length >
      0;
    const hayRemoto =
      r.data.alumnos.length +
        r.data.profesores.length +
        r.data.evaluaciones.length +
        r.data.notas.length >
      0;
    if (!hayRemoto && hayLocal) {
      await llamarHoja({ op: "sembrar", data: datosLocales });
      marcarSync("conectado", "Hoja inicializada con tus datos");
      return true;
    }
    Object.keys(db).forEach((k) => {
      if (Array.isArray(r.data[k])) db[k] = r.data[k];
    });
    normalizar();
    marcarSync("conectado");
    return true;
  } catch (e) {
    console.warn("No se pudo leer de la hoja", e);
    ultimoErrorSync = e.message || String(e);
    marcarSync("error");
    return false;
  }
}

function encolar(ops) {
  if (!ops || !ops.length) return;
  if (!urlHoja) return;
  colaSync = colaSync.concat(ops);
  marcarSync("sincronizando");
  clearTimeout(temporizadorCola);
  temporizadorCola = setTimeout(vaciarCola, 500);
}

async function vaciarCola() {
  if (!urlHoja || colaSync.length === 0) return;
  const lote = colaSync;
  colaSync = [];
  try {
    await llamarHoja({ op: "lote", ops: lote });
    ultimoErrorSync = "";
    marcarSync("conectado");
  } catch (e) {
    console.warn("No se pudo guardar en la hoja", e);
    ultimoErrorSync = e.message || String(e);
    colaSync = lote.concat(colaSync);
    marcarSync("error");
  }
}

function guardarEntidad(entidad, fila) {
  guardarLocal();
  encolar([{ op: "upsert", entity: entidad, row: fila }]);
}
function borrarEntidad(entidad, id) {
  guardarLocal();
  encolar([{ op: "borrar", entity: entidad, id: id }]);
}

function iniciarDatos() {
  let guardada = "";
  try {
    guardada = localStorage.getItem(LS_URL) || "";
  } catch (e) {
    guardada = "";
  }
  urlHoja = guardada || URL_HOJA_POR_DEFECTO;
  if (!cargarLocal()) db = JSON.parse(JSON.stringify(SEMILLA));
  normalizar();
  marcarSync(
    urlHoja ? "sincronizando" : "local",
    urlHoja ? "Conectando..." : null,
  );
  if (urlHoja) {
    sincronizar().then(() => {
      if (estadoSync === "error") marcarSync("local", "Sin conexión con la hoja");
    });
  }
}
