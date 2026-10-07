/* =========================================================
   LOGIN (páginas de acceso independientes)
========================================================= */
function mostrarErrorLogin(msg) {
  document.getElementById("login-error-msg").innerText = msg;
  document.getElementById("login-error").classList.remove("hidden");
}

async function iniciarSesion() {
  const rol = document.getElementById("login-rol").value;
  document.getElementById("login-error").classList.add("hidden");

  // El ingreso nunca espera a la red: se valida contra la copia local y, si hay
// URL configurada, la sincronización sigue en segundo plano. Asi el profesor o
// el representante pueden entrar aunque la hoja este lenta o no responda.
if (urlHoja && estadoSync !== "conectado") {
    sincronizar().then((ok) => {
      if (ok && currentRole && typeof render === "function") render();
    });
  }

  if (rol === "admin") {
    const usuario = document.getElementById("admin-user").value.trim();
    const clave = document.getElementById("admin-pass").value;
    const u = db.usuarios.find(
      (x) =>
        x.rol === "admin" &&
        x.usuario === usuario &&
        String(x.clave) === clave,
    );
    if (!u) {
      mostrarErrorLogin("Usuario o contraseña incorrectos.");
      return;
    }
    currentRole = "admin";
    currentUser = {
      nombre: u.nombre || "Administrador",
      usuario: u.usuario,
      rol: "admin",
    };
    guardarSesion("dashboard");
    abrirApp("dashboard");
    return;
  }

  if (rol === "profesor") {
    const ci = document.getElementById("prof-login-ci").value.trim();
    const clave = document.getElementById("prof-login-clave").value;
    if (!ci || !clave) {
      mostrarErrorLogin("Ingresa tu cédula y tu clave.");
      return;
    }
    const p = db.profesores.find((x) => norm(x.cedula) === norm(ci));
    if (!p) {
      mostrarErrorLogin(
        "No hay ningún profesor registrado con esa cédula.",
      );
      return;
    }
    if (p.activo === false || p.activo === "false") {
      mostrarErrorLogin(
        "Tu cuenta está inactiva. Contacta a la administración.",
      );
      return;
    }
    if (String(p.clave) !== clave) {
      mostrarErrorLogin("Clave incorrecta.");
      return;
    }
    currentRole = "profesor";
    currentUser = Object.assign({}, p, { rol: "profesor" });
    document.getElementById("prof-login-clave").value = "";
    guardarSesion("notas");
    abrirApp("notas");
    return;
  }

  if (rol === "representante") {
    const ci = document.getElementById("rep-login-ci").value.trim();
    if (!ci) {
      mostrarErrorLogin("Ingresa tu cédula.");
      return;
    }
    const hijos = alumnosPorRepresentante(ci);
    if (hijos.length === 0) {
      mostrarErrorLogin(
        "No encontramos alumnos representados con esa cédula. Verifica el número o pide a la administración que lo registre.",
      );
      return;
    }
    currentRole = "representante";
    currentUser = {
      nombre: hijos[0].representante,
      cedula: hijos[0].repCedula,
      rol: "representante",
      hijos: hijos.map((h) => h.cedulaEscolar),
    };
    document.getElementById("rep-login-ci").value = "";
    guardarSesion("notas");
    abrirApp("notas");
  }
}
