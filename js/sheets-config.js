/* =========================================================
   CONFIGURACIÓN: GOOGLE SHEETS
========================================================= */
async function probarConexion() {
  const inp = document.getElementById("input-url-hoja");
  const url = (inp && inp.value.trim()) || "";
  if (!url) {
    alert("Pega la URL del Web App de Apps Script.");
    return;
  }
  if (!/\/exec(\?|$)/.test(url)) {
    if (
      !confirm(
        "Esa URL no termina en /exec. ¿Continuar igual?\n\nLa URL /dev solo funciona con tu cuenta de Google abierta.",
      )
    )
      return;
  }
  urlHoja = url;
  try {
    localStorage.setItem(LS_URL, urlHoja);
  } catch (e) {}
  marcarSync("sincronizando", "Conectando...");
  const exito = await sincronizar();
  if (!exito) {
    marcarSync("error");
    alert("No se pudo conectar.\n\n" + explicarError(ultimoErrorSync));
    return;
  }
  render();
  alert(
    estadoSync === "conectado"
      ? "Conexión correcta. Datos cargados desde Google Sheets."
      : "Conexión correcta."
  );
}

function explicarError(msg) {
  const m = String(msg || "Error desconocido");
  if (/403|401|no es público/.test(m)) {
    return (
      "El Web App de Apps Script no está publicado para todo el público.\n\n" +
      "Solución:\n" +
      "1. Abre Apps Script > Implementar > Nueva implementación\n" +
      "2. Tipo: Aplicación web\n" +
      "3. Ejecutar como: Yo\n" +
      "4. Quién tiene acceso: Cualquiera\n" +
      "5. Copia la nueva URL /exec en Configuración"
    );
  }
  return m;
}

async function subirTodo() {
  if (!urlHoja) return alert("Primero conecta la URL de Google Sheets.");
  const total =
    db.alumnos.length +
    db.profesores.length +
    db.evaluaciones.length +
    db.notas.length;
  if (
    !confirm(
      "Se enviarán " +
        total +
        " registros a la hoja, incluyendo las claves de los profesores. ¿Continuar?",
    )
  )
    return;
  marcarSync("sincronizando", "Subiendo datos...");
  try {
    await llamarHoja({
      op: "sembrar",
      data: {
        alumnos: db.alumnos,
        profesores: db.profesores,
        evaluaciones: db.evaluaciones,
        notas: db.notas,
        usuarios: db.usuarios,
      },
    });
    marcarSync("conectado");
    alert("Datos enviados a Google Sheets.");
  } catch (e) {
    ultimoErrorSync = e.message || String(e);
    marcarSync("error");
    alert("No se pudo subir: " + explicarError(e.message));
  }
}

async function vaciarHoja() {
  if (!urlHoja) return alert("Primero conecta la URL de Google Sheets.");
  if (!confirm("Se BORRARÁN todos los datos de la hoja. ¿Continuar?"))
    return;
  marcarSync("sincronizando", "Vaciando...");
  try {
    await llamarHoja({
      op: "sembrar",
      data: {
        alumnos: [],
        profesores: [],
        evaluaciones: [],
        notas: [],
        usuarios: [],
      },
    });
    marcarSync("conectado");
    alert("Hoja vaciada. Tu navegador conserva sus datos locales.");
  } catch (e) {
    marcarSync("error");
    alert("No se pudo vaciar: " + e.message);
  }
}
