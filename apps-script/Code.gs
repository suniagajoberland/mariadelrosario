/**
 * U.E. Primaria "María del Rosario" - Backend de datos
 * ---------------------------------------------------------------
 * Google Apps Script que expone la hoja de calculo como una API
 * sencilla para el sistema de gestion escolar (index.html).
 *
 * Una hoja por entidad:
 *   Alumnos, Profesores, Evaluaciones, Notas, Usuarios
 *
 * Publicacion:
 *   Implementar > Nueva implementacion > Aplicacion web
 *   Ejecutar como: Yo
 *   Quien tiene acceso: Cualquiera
 *
 * La aplicacion usa POST con Content-Type text/plain para evitar
 * el preflight CORS, por eso no hace falta cambiar nada mas.
 */

var ENTIDADES = {
  alumnos: {
    hoja: "Alumnos",
    idField: "cedulaEscolar",
    headers: [
      "cedulaEscolar",
      "nombre",
      "grado",
      "representante",
      "repCedula",
      "telefono",
      "pago",
      "profesorId",
    ],
  },
  profesores: {
    hoja: "Profesores",
    idField: "id",
    headers: ["id", "cedula", "nombre", "clave", "telefono", "grado", "activo"],
  },
  evaluaciones: {
    hoja: "Evaluaciones",
    idField: "id",
    headers: [
      "id",
      "profesorId",
      "grado",
      "titulo",
      "materia",
      "tipo",
      "lapso",
      "fecha",
      "ponderacion",
      "notaMax",
    ],
  },
  notas: {
    hoja: "Notas",
    idField: "__comp",
    headers: ["evaluacionId", "estudianteId", "nota"],
  },
  usuarios: {
    hoja: "Usuarios",
    idField: "id",
    headers: ["id", "usuario", "clave", "rol", "nombre"],
  },
};

function doGet(e) {
  try {
    var accion = (e && e.parameter && e.parameter.accion) || "leer";
    if (accion === "ping") {
      return json_({ ok: true, mensaje: "Conexion correcta", ts: Date.now() });
    }
    return json_(leerTodo_());
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  }
}

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var op = body.op || "leer";

    if (op === "ping") {
      return json_({ ok: true, mensaje: "Conexion correcta", ts: Date.now() });
    }
    if (op === "leer") {
      return json_(leerTodo_());
    }
    if (op === "upsert") {
      return json_(upsert_(body.entity, body.row));
    }
    if (op === "lote") {
      var ok = 0;
      var errores = [];
      var ops = body.ops || [];
      for (var i = 0; i < ops.length; i++) {
        var o = ops[i];
        var r = o.op === "borrar" ? borrar_(o.entity, o.id) : upsert_(o.entity, o.row);
        if (r.ok) {
          ok++;
        } else {
          errores.push(String(r.error));
        }
      }
      return json_({ ok: errores.length === 0, guardados: ok, errores: errores });
    }
    if (op === "borrar") {
      return json_(borrar_(body.entity, body.id));
    }
    if (op === "reemplazar") {
      return json_(reemplazar_(body.entity, body.rows || []));
    }
    if (op === "sembrar") {
      return json_(sembrar_(body.data || {}));
    }
    return json_({ ok: false, error: "Operacion desconocida: " + op });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  }
}

// -------------------------------------------------------------------
// Lectura
// -------------------------------------------------------------------

function leerTodo_() {
  var data = {};
  Object.keys(ENTIDADES).forEach(function (clave) {
    data[clave] = leer_(clave);
  });
  asegurarAdmin_();
  return { ok: true, data: data, vacia: esVacia_(data), ts: Date.now() };
}

function esVacia_(data) {
  return (
    data.alumnos.length === 0 &&
    data.profesores.length === 0 &&
    data.evaluaciones.length === 0 &&
    data.notas.length === 0
  );
}

function leer_(claveEntidad) {
  var cfg = ENTIDADES[claveEntidad];
  if (!cfg) return [];
  var hoja = obtenerHoja_(cfg.hoja, cfg.headers);
  var ultimaFila = hoja.getLastRow();
  if (ultimaFila < 2) return [];

  var encabezados = hoja
    .getRange(1, 1, 1, cfg.headers.length)
    .getValues()[0]
    .map(function (h) {
      return String(h).trim();
    });

  var valores = hoja.getRange(2, 1, ultimaFila - 1, encabezados.length).getValues();
  var salida = [];

  valores.forEach(function (fila) {
    if (fila.every(function (c) { return c === "" || c === null; })) return;
    var obj = {};
    encabezados.forEach(function (h, i) {
      obj[h] = fila[i] === null ? "" : fila[i];
    });
    if (cfg.idField === "__comp") {
      obj.__comp = String(obj.evaluacionId) + "|" + String(obj.estudianteId);
      if (!obj.evaluacionId || !obj.estudianteId) return;
    } else if (!obj[cfg.idField]) {
      return;
    }
    salida.push(obj);
  });

  return salida;
}

// -------------------------------------------------------------------
// Escritura
// -------------------------------------------------------------------

function upsert_(claveEntidad, fila) {
  var cfg = ENTIDADES[claveEntidad];
  if (!cfg) return { ok: false, error: "Entidad desconocida: " + claveEntidad };
  if (!fila) return { ok: false, error: "Fila vacia" };

  var hoja = obtenerHoja_(cfg.hoja, cfg.headers);
  var id = claveCompuesta_(cfg, fila);
  if (!id) return { ok: false, error: "Falta el identificador" };

  var indiceId = cfg.headers.indexOf(cfg.idField);
  if (indiceId < 0) indiceId = 0;

  var filaExistente = buscarFilaId_(hoja, cfg, id);
  var valores = cfg.headers.map(function (h) {
    return fila[h] === undefined || fila[h] === null ? "" : fila[h];
  });

  if (filaExistente > 0) {
    hoja.getRange(filaExistente, 1, 1, valores.length).setValues([valores]);
  } else {
    hoja.appendRow(valores);
  }
  return { ok: true, id: id };
}

function borrar_(claveEntidad, id) {
  var cfg = ENTIDADES[claveEntidad];
  if (!cfg) return { ok: false, error: "Entidad desconocida: " + claveEntidad };

  var hoja = obtenerHoja_(cfg.hoja, cfg.headers);
  var fila = buscarFilaId_(hoja, cfg, id);
  if (fila > 0) {
    hoja.deleteRow(fila);
    return { ok: true, id: id };
  }
  return { ok: false, error: "Registro no encontrado" };
}

function reemplazar_(claveEntidad, filas) {
  var cfg = ENTIDADES[claveEntidad];
  if (!cfg) return { ok: false, error: "Entidad desconocida: " + claveEntidad };

  var hoja = obtenerHoja_(cfg.hoja, cfg.headers);
  if (hoja.getLastRow() > 1) {
    hoja.getRange(2, 1, hoja.getLastRow() - 1, cfg.headers.length).clearContent();
  }
  if (filas && filas.length) {
    var valores = filas.map(function (obj) {
      return cfg.headers.map(function (h) {
        return obj[h] === undefined || obj[h] === null ? "" : obj[h];
      });
    });
    hoja.getRange(2, 1, valores.length, cfg.headers.length).setValues(valores);
  }
  return { ok: true, total: (filas || []).length };
}

function sembrar_(data) {
  var resultado = { ok: true, sembrado: {} };
  Object.keys(data).forEach(function (entidad) {
    if (!ENTIDADES[entidad]) return;
    var r = reemplazar_(entidad, data[entidad]);
    resultado.sembrado[entidad] = r.ok ? r.total : r.error;
  });
  asegurarAdmin_();
  return resultado;
}

// -------------------------------------------------------------------
// Utilidades
// -------------------------------------------------------------------

function claveCompuesta_(cfg, fila) {
  if (cfg.idField === "__comp") {
    if (!fila.evaluacionId || !fila.estudianteId) return "";
    return String(fila.evaluacionId) + "|" + String(fila.estudianteId);
  }
  return String(fila[cfg.idField] || "");
}

function buscarFilaId_(hoja, cfg, id) {
  var columna = cfg.headers.indexOf(cfg.idField) + 1;
  if (columna < 1) columna = 1;
  var ultima = hoja.getLastRow();
  if (ultima < 2) return 0;
  var valores = hoja.getRange(2, columna, ultima - 1, 1).getValues();
  for (var i = 0; i < valores.length; i++) {
    if (String(valores[i][0]).trim() === String(id).trim()) return i + 2;
  }
  return 0;
}

function obtenerHoja_(nombre, encabezados) {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = libro.getSheetByName(nombre);
  if (!hoja) hoja = libro.insertSheet(nombre);
  var rango = hoja.getRange(1, 1, 1, encabezados.length);
  var actuales = rango.getValues()[0].map(function (h) { return String(h).trim(); });
  var faltaAlgo = encabezados.some(function (h, i) { return actuales[i] !== h; });
  if (faltaAlgo) rango.setValues([encabezados]);
  return hoja;
}

function asegurarAdmin_() {
  var hoja = obtenerHoja_("Usuarios", ENTIDADES.usuarios.headers);
  var ultima = hoja.getLastRow();
  if (ultima > 1) return;
  hoja.appendRow(["admin-default", "admin", "admin", "admin", "Administrador"]);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * Prueba rapida desde el editor de Apps Script.
 * Ejecuta esta funcion y revisa la ejecucion; debe responder { ok: true }.
 */
function probarConexion() {
  var r = leerTodo_();
  Logger.log(
    "Alumnos: %s | Profesores: %s | Evaluaciones: %s | Notas: %s | Usuarios: %s",
    r.data.alumnos.length,
    r.data.profesores.length,
    r.data.evaluaciones.length,
    r.data.notas.length,
    r.data.usuarios.length
  );
}