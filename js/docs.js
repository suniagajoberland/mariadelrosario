/* =========================================================
   DOCUMENTOS: CONSTANCIAS Y BOLETA (descarga e impresión)
========================================================= */

const ESTILO_DOCUMENTO = `
  @page { margin: 16mm; }
  * { box-sizing: border-box; }
  body {
    font-family: Georgia, "Times New Roman", serif;
    color: #0f172a;
    background: #f1f5f9;
    margin: 0;
    padding: 24px;
  }
  .hoja {
    max-width: 800px;
    margin: 0 auto;
    background: #fff;
    padding: 44px 48px;
    box-shadow: 0 2px 14px rgba(15, 23, 42, 0.12);
  }
  .encabezado {
    text-align: center;
    border-bottom: 3px double #1d4ed8;
    padding-bottom: 14px;
    margin-bottom: 26px;
  }
  .escuela {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 21px;
    font-weight: 700;
    color: #1d4ed8;
    letter-spacing: 0.02em;
  }
  .lema {
    margin: 6px 0 0;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .titulo {
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 17px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin: 0 0 22px;
  }
  p { font-size: 15px; line-height: 1.9; margin: 0 0 14px; text-align: justify; }
  .datos {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 12px 16px;
    margin-bottom: 20px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
    line-height: 1.7;
  }
  .datos .fila { display: flex; justify-content: space-between; gap: 16px; }
  .datos .et { color: #64748b; }
  .datos .val { font-weight: 700; text-align: right; }
  .estatus {
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    font-size: 15px;
    letter-spacing: 0.06em;
    padding: 10px;
    border-radius: 6px;
    margin: 0 0 16px;
  }
  .estatus.ok { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
  .estatus.malo { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
  table { width: 100%; border-collapse: collapse; margin: 6px 0 18px; font-size: 14px; }
  th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: center; }
  th { background: #eff6ff; color: #1e3a8a; font-family: Arial, Helvetica, sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; }
  .izq, th.izq, td.izq { text-align: left; }
  tfoot td { background: #f8fafc; font-weight: 700; }
  .sin-datos { text-align: center; color: #64748b; font-style: italic; padding: 18px 0; }
  .firmas { display: flex; gap: 48px; justify-content: space-between; margin-top: 52px; }
  .firma { flex: 1; text-align: center; font-family: Arial, Helvetica, sans-serif; font-size: 13px; }
  .firma .linea { border-top: 1px solid #334155; margin-top: 58px; padding-top: 6px; }
  .pie {
    margin-top: 30px;
    padding-top: 10px;
    border-top: 1px solid #e2e8f0;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11px;
    color: #94a3b8;
    text-align: center;
  }
  @media print {
    body { background: #fff; padding: 0; }
    .hoja { box-shadow: none; padding: 0; max-width: none; }
  }
`;

function fechaISO(f) {
  const d = f || new Date();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

function horaTexto(f) {
  return (f || new Date()).toLocaleTimeString("es-VE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fechaLarga(f) {
  return (f || new Date()).toLocaleDateString("es-VE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function anioEscolar() {
  const f = new Date();
  const y = f.getFullYear();
  const inicio = f.getMonth() >= 7 ? y : y - 1;
  return inicio + "-" + (inicio + 1);
}

function nombreArchivo(base) {
  return (
    String(base || "documento")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "documento"
  );
}

function archivoPDF(nombre) {
  return (
    nombreArchivo(
      String(nombre || "documento")
        .replace(/\.pdf$/i, "")
        .replace(/\.html?$/i, ""),
    ) + ".pdf"
  );
}

function marcoDocumento(titulo, cuerpo) {
  return (
    "<!doctype html>\n<html lang=\"es\">\n<head>\n" +
    '<meta charset="utf-8" />\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1" />\n' +
    "<title>" +
    esc(titulo) +
    " - " +
    esc(NOMBRE_ESCUELA) +
    "</title>\n<style>" +
    ESTILO_DOCUMENTO +
    "</style>\n</head>\n<body>\n" +
    '<div class="hoja">\n' +
    '<div class="encabezado">' +
    '<p class="escuela">' +
    esc(NOMBRE_ESCUELA) +
    "</p>" +
    '<p class="lema">Sistema de Gestión Escolar · Año escolar ' +
    anioEscolar() +
    "</p>" +
    "</div>\n" +
    cuerpo +
    "\n</div>\n</body>\n</html>\n"
  );
}

function descargarPDF(nombre, contenido) {
  const archivo = archivoPDF(nombre);
  if (typeof html2pdf !== "undefined") {
    try {
      const iframe = document.createElement("iframe");
      iframe.style.cssText =
        "position:fixed;left:-10000px;top:0;width:794px;height:1123px;border:0;background:#fff;";
      document.body.appendChild(iframe);
      const d = iframe.contentDocument;
      d.open();
      d.write(contenido);
      d.close();
      if (d.body) {
        d.body.style.margin = "0";
        d.body.style.padding = "0";
        d.body.style.background = "#ffffff";
      }
      if (d.querySelector) {
        const hoja = d.querySelector(".hoja");
        if (hoja) {
          hoja.style.boxShadow = "none";
          hoja.style.maxWidth = "none";
          hoja.style.margin = "0";
        }
      }
      const limpiar = function () {
        try {
          iframe.remove();
        } catch (e) {}
      };
      const promesa = html2pdf()
        .set({
          margin: 0,
          filename: archivo,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(d.body)
        .save();
      if (promesa && typeof promesa.then === "function") {
        promesa.then(limpiar, function (e) {
          console.warn("No se pudo generar el PDF", e);
          limpiar();
        });
      } else {
        setTimeout(limpiar, 4000);
      }
      return "pdf";
    } catch (e) {
      console.warn("html2pdf no respondió, se usa impresión", e);
    }
  }
  return imprimirHTML(contenido) ? "impresion" : "error";
}

function textoDescarga(res) {
  if (res === "pdf") return "Se descargó el archivo PDF.";
  if (res === "impresion")
    return 'No se pudo generar el PDF automáticamente: se abrió el diálogo de impresión, elige "Guardar como PDF".';
  return "No se pudo generar el documento.";
}

function imprimirHTML(contenido) {
  const w = window.open("", "_blank");
  if (!w) {
    alert("Permite las ventanas emergentes para poder imprimir el documento.");
    return false;
  }
  w.document.write(contenido);
  w.document.close();
  setTimeout(function () {
    try {
      w.focus();
      w.print();
    } catch (e) {}
  }, 350);
  return true;
}

/* ---------- Contenido de las constancias ---------- */

function datosAlumnoDocumento(alumno) {
  return (
    '<div class="datos">' +
    '<div class="fila"><span class="et">Estudiante</span><span class="val">' +
    esc(alumno.nombre) +
    "</span></div>" +
    '<div class="fila"><span class="et">Cédula de identidad</span><span class="val">' +
    esc(alumno.cedulaEscolar) +
    "</span></div>" +
    '<div class="fila"><span class="et">Grado</span><span class="val">' +
    esc(alumno.grado) +
    "</span></div>" +
    '<div class="fila"><span class="et">Representante</span><span class="val">' +
    esc(alumno.representante || "-") +
    "</span></div>" +
    '<div class="fila"><span class="et">Año escolar</span><span class="val">' +
    anioEscolar() +
    "</span></div>" +
    "</div>"
  );
}

function textoDestino(destino) {
  const d = String(destino || "").trim();
  if (!d) return "";
  return (
    "<p>La presente se expide a solicitud de la parte interesada para los fines de: <strong>" +
    esc(d) +
    "</strong>.</p>"
  );
}

function firmaDocumento() {
  return (
    '<div class="firmas">' +
    '<div class="firma"><div class="linea">Representante legal</div></div>' +
    '<div class="firma"><div class="linea">Secretaría / Administración</div></div>' +
    "</div>"
  );
}

function pieDocumento(opciones) {
  const op = opciones || {};
  return (
    '<p class="pie">Documento generado por el Sistema de Gestión Escolar · ' +
    esc(NOMBRE_ESCUELA) +
    " · " +
    fechaLarga() +
    " " +
    horaTexto() +
    (op.folio ? " · Folio " + esc(op.folio) : "") +
    "</p>"
  );
}

function crearConstanciaHTML(tipo, alumno, opciones) {
  const op = opciones || {};
  const esPagos = tipo === "pagos";
  const titulo = esPagos ? "Constancia de Pagos" : "Constancia de Estudios";
  let cuerpo = '<p class="titulo">' + titulo + "</p>" + datosAlumnoDocumento(alumno);

  if (esPagos) {
    const solvente = String(alumno.pago) === "Solvente";
    cuerpo +=
      "<p>Se certifica que el (la) estudiante antes identificado(a), inscrito(a) en el " +
      esc(alumno.grado) +
      " de la Educación Primaria de nuestra institución, registra a la fecha el siguiente estatus de pago:</p>" +
      '<p class="estatus ' +
      (solvente ? "ok" : "malo") +
      '">' +
      (solvente ? "PAGOS SOLVENTES (AL DÍA)" : "PAGOS PENDIENTES") +
      "</p>" +
      (solvente
        ? "<p>Sus obligaciones con la institución se encuentran solventes al momento de la emisión de la presente constancia.</p>"
        : "<p>Se informa que mantiene pagos pendientes con la institución; se solicita al (a la) representante ponerse al día con la administración.</p>");
  } else {
    cuerpo +=
      "<p>Se hace constar que el (la) ciudadano(a) antes identificado(a), se encuentra regularmente inscrito(a) en el " +
      esc(alumno.grado) +
      " de la Educación Primaria de la " +
      esc(NOMBRE_ESCUELA) +
      ", durante el año escolar " +
      anioEscolar() +
      ", con asistencia y participación regulares en las actividades académicas de la institución.</p>";
  }

  cuerpo +=
    textoDestino(op.destino) +
    "<p>Se expide la presente constancia a solicitud de la parte interesada, para que pueda usarse en los lugares y para los fines donde sea requerida.</p>" +
    '<p style="text-align:center">Lugar y fecha: ' +
    esc(fechaLarga(op.fecha ? new Date(op.fecha + "T00:00:00") : null)) +
    "</p>" +
    firmaDocumento() +
    pieDocumento({ folio: op.folio });

  return marcoDocumento(titulo, cuerpo);
}

/* ---------- Boleta de notas por lapso ---------- */

function boletaDatos(alumnoId) {
  const acts = actividadesDeAlumno(alumnoId);
  const mapaLapsos = {};
  const mapaMaterias = {};
  acts.forEach((e) => {
    mapaLapsos[e.lapso] = true;
    mapaMaterias[e.materia] = true;
  });
  const orden = (m) => {
    const i = MATERIAS_PRIMARIA.indexOf(m);
    return i < 0 ? 999 : i;
  };
  const lapsos = Object.keys(mapaLapsos).sort((a, b) =>
    String(a).localeCompare(String(b)),
  );
  const materias = Object.keys(mapaMaterias).sort(
    (a, b) => orden(a) - orden(b) || String(a).localeCompare(String(b)),
  );

  const promedioDe = (evs) => {
    let suma = 0;
    let n = 0;
    evs.forEach((e) => {
      const nota = getNota(e.id, alumnoId);
      if (nota === null) return;
      suma += porcentaje(e, nota);
      n++;
    });
    return n ? Math.round((suma / n) * 10) / 10 : null;
  };

  const filas = materias.map((m) => {
    const celdas = {};
    lapsos.forEach((l) => {
      celdas[l] = promedioDe(
        acts.filter((e) => e.materia === m && e.lapso === l),
      );
    });
    return {
      materia: m,
      celdas: celdas,
      promedio: promedioDe(acts.filter((e) => e.materia === m)),
    };
  });

  const resumenLapso = {};
  lapsos.forEach((l) => {
    resumenLapso[l] = promedioDe(acts.filter((e) => e.lapso === l));
  });

  const r = resumenAlumno(alumnoId);
  return {
    lapsos: lapsos,
    filas: filas,
    resumenLapso: resumenLapso,
    promedioGeneral: r.promedio,
    resumen: r,
    totalActividades: acts.length,
  };
}

function celdaPromedio(v) {
  return v === null || v === undefined ? "-" : Number(v).toFixed(1) + "%";
}

function tablaBoletaHTML(d, enDocumento) {
  if (!d.filas.length) {
    return enDocumento
      ? '<p class="sin-datos">Aún no hay actividades calificadas para este estudiante.</p>'
      : '<p class="text-sm text-slate-400 text-center py-6">Aún no hay actividades calificadas.</p>';
  }
  const izq = enDocumento ? "izq" : "text-left";
  const cen = enDocumento ? "" : "text-center";
  const th = (t, cls) =>
    '<th class="' + (enDocumento ? cls : "th " + cls) + '">' + t + "</th>";
  const td = (t, cls) =>
    '<td class="' + (enDocumento ? cls : "td " + cls) + '">' + t + "</td>";
  let h =
    (enDocumento
      ? "<table>"
      : '<table class="w-full border-collapse text-sm">') +
    "<thead><tr>" +
    th("Materia", izq);
  d.lapsos.forEach((l) => {
    h += th("Lapso " + esc(String(l)), cen);
  });
  h += th("Promedio", cen) + "</tr></thead><tbody>";
  d.filas.forEach((f) => {
    h += "<tr>" + td(esc(f.materia), izq);
    d.lapsos.forEach((l) => {
      h += td(esc(celdaPromedio(f.celdas[l])), cen);
    });
    h += td("<strong>" + esc(celdaPromedio(f.promedio)) + "</strong>", cen);
    h += "</tr>";
  });
  h += "</tbody><tfoot><tr>" + td("Promedio por lapso", izq);
  d.lapsos.forEach((l) => {
    h += td(esc(celdaPromedio(d.resumenLapso[l])), cen);
  });
  h += td("<strong>" + esc(celdaPromedio(d.promedioGeneral)) + "</strong>", cen);
  h += "</tr></tfoot></table>";
  return h;
}

function desempenoTexto(prom) {
  if (prom === null || prom === undefined) return "SIN EVALUACIONES";
  return prom >= NOTA_APROBACION ? "APROBADO" : "EN RIESGO";
}

function crearBoletaHTML(alumno) {
  const d = boletaDatos(alumno.cedulaEscolar);
  let cuerpo =
    '<p class="titulo">Boleta de Notas</p>' +
    datosAlumnoDocumento(alumno) +
    tablaBoletaHTML(d, true) +
    '<p class="estatus ' +
    (d.promedioGeneral !== null && d.promedioGeneral >= NOTA_APROBACION
      ? "ok"
      : "malo") +
    '">PROMEDIO GENERAL: ' +
    esc(celdaPromedio(d.promedioGeneral)) +
    " · " +
    desempenoTexto(d.promedioGeneral) +
    "</p>";

  if (d.resumen.calificadas < d.resumen.actividades) {
    cuerpo +=
      "<p style=\"text-align:center;font-size:13px;color:#64748b\">Promedio calculado sobre " +
      d.resumen.calificadas +
      " de " +
      d.resumen.actividades +
      " actividades calificadas.</p>";
  }

  cuerpo +=
    "<p>Boleta con los lapsos evaluativos del año escolar " +
    anioEscolar() +
    ". Las notas se expresan como porcentaje del total posible, donde " +
    NOTA_APROBACION +
    "% o más se considera aprobado.</p>" +
    firmaDocumento() +
    pieDocumento({});

  return marcoDocumento("Boleta de Notas", cuerpo);
}
