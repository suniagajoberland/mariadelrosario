function cerrarSesion() {
  borrarSesion();
  currentRole = null;
  currentUser = null;
  currentTab = "dashboard";
  evalSeleccionada = null;
  alumnoEnDetalle = null;
  clavesVisibles = {};
  const app = document.getElementById("app-container");
  app.classList.add("hidden");
  app.classList.remove("flex");
  const login = document.getElementById("pantalla-login");
  if (login) login.style.display = "";
  const form = document.getElementById("form-login");
  if (form) form.reset();
  const err = document.getElementById("login-error");
  if (err) err.classList.add("hidden");
}

function abrirApp(tabsInicial) {
  inyectarShell();
  const login = document.getElementById("pantalla-login");
  if (login) login.style.display = "none";
  const app = document.getElementById("app-container");
  app.classList.remove("hidden");
  app.classList.add("flex");

  document.getElementById("current-date").innerText =
    new Date().toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const etiquetas = {
    admin: "Administrador",
    profesor: "Profesor(a)",
    representante: "Representante",
  };
  document.getElementById("rol-label").innerText = etiquetas[currentRole];
  document.getElementById("user-info").innerText = currentUser.nombre;

  if (currentRole === "admin") {
    document.getElementById("header-nombre").innerText =
      "Coordinación Académica";
    document.getElementById("header-rol").innerText = "Administrador";
    document.getElementById("avatar-ini").innerText = "AD";
  } else if (currentRole === "profesor") {
    document.getElementById("header-nombre").innerText = currentUser.nombre;
    document.getElementById("header-rol").innerText =
      currentUser.grado || "Sin grado";
    document.getElementById("avatar-ini").innerText = iniciales(
      currentUser.nombre,
    );
  } else {
    document.getElementById("header-nombre").innerText = currentUser.nombre;
    document.getElementById("header-rol").innerText =
      currentUser.hijos.length + " hijo(s) representado(s)";
    document.getElementById("avatar-ini").innerText = iniciales(
      currentUser.nombre,
    );
  }

  marcarSync(estadoSync);
  construirMenu();
  cambiarTab(tabsInicial);
}

function alternarSidebar() {
  const sb = document.getElementById("sidebar");
  sb.classList.toggle("hidden");
  sb.classList.toggle("md:flex");
  const fondo = document.getElementById("sidebar-backdrop");
  if (fondo) fondo.classList.toggle("hidden", sb.classList.contains("hidden"));
}

function cerrarSidebarMovil() {
  const sb = document.getElementById("sidebar");
  if (sb && window.innerWidth < 768 && !sb.classList.contains("hidden"))
    alternarSidebar();
}

function arrancarApp() {
  iniciarDatos();
  const campoRol = document.getElementById("login-rol");
  const rolPagina = campoRol ? campoRol.value : "";
  const sesion = leerSesion();
  if (!sesion || sesion.rol !== rolPagina) return;
  currentRole = sesion.rol;
  currentUser = sesion.user;
  currentTab = sesion.tab || (sesion.rol === "admin" ? "dashboard" : "notas");
  abrirApp(currentTab);
}

window.onload = arrancarApp;
