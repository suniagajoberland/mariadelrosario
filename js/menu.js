/* =========================================================
   MENÚ
========================================================= */
const MENUS = {
  admin: [
    { grupo: "Principal" },
    { id: "dashboard", txt: "Resumen General", ico: "fa-chart-pie" },
    { id: "alumnos", txt: "Matrícula Alumnos", ico: "fa-children" },
    { grupo: "Profesores" },
    {
      id: "profesores",
      txt: "Profesores y Claves",
      ico: "fa-chalkboard-user",
    },
    { grupo: "Notas" },
    { id: "notas", txt: "Notas y Actividades", ico: "fa-star" },
    { grupo: "Comunicación" },
    {
      id: "whatsapp",
      txt: "Recordatorios WhatsApp",
      ico: "fa-comment-dots",
    },
    { grupo: "Sistema" },
    { id: "config", txt: "Configuración", ico: "fa-gear" },
  ],
  profesor: [
    { grupo: "Mi Aula" },
    { id: "notas", txt: "Notas y Actividades", ico: "fa-star" },
    { id: "estudiantes", txt: "Mis Estudiantes", ico: "fa-children" },
    { id: "evaluaciones", txt: "Actividades", ico: "fa-clipboard-list" },
  ],
  representante: [
    { grupo: "Seguimiento Escolar" },
    { id: "notas", txt: "Notas y Actividades", ico: "fa-star" },
    { grupo: "Trámites" },
    { id: "constancias", txt: "Solicitar Constancias", ico: "fa-file-signature" },
    { id: "boleta", txt: "Boleta de Notas", ico: "fa-file-lines" },
  ],
};

const TITULOS = {
  dashboard: "Resumen General",
  alumnos: "Matrícula de Alumnos",
  profesores: "Profesores y Claves",
  notas: "Notas y Actividades",
  estudiantes: "Mis Estudiantes",
  evaluaciones: "Actividades",
  whatsapp: "Recordatorios por WhatsApp",
  config: "Configuración",
  constancias: "Solicitar Constancias",
  boleta: "Boleta de Notas",
};

function construirMenu() {
  const nav = document.getElementById("sidebar-nav");
  nav.innerHTML = MENUS[currentRole]
    .map((m) => {
      if (m.grupo) {
        return (
          '<p class="px-3 pt-4 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">' +
          esc(m.grupo) +
          "</p>"
        );
      }
      return (
        '<a href="#" data-accion="tab" data-arg="' +
        m.id +
        '" data-tab="' +
        m.id +
        '" id="nav-' +
        m.id +
        '" class="nav-item' +
        (currentTab === m.id ? " activo" : "") +
        '"><i class="fa-solid ' +
        m.ico +
        ' ico"></i>' +
        esc(m.txt) +
        "</a>"
      );
    })
    .join("");
}

function cambiarTab(t) {
  currentTab = t;
  alumnoEnDetalle = null;
  waResultado = [];
  if (typeof cerrarSidebarMovil === "function") cerrarSidebarMovil();
  document.querySelectorAll("#sidebar-nav [data-tab]").forEach((a) => {
    a.classList.toggle("activo", a.dataset.tab === t);
  });
  document.getElementById("page-title").innerText = TITULOS[t] || "Panel";
  if (currentRole) guardarSesion();
  render();
}

function render() {
  const mc = document.getElementById("main-content");
  let html = "";
  if (currentRole === "admin") html = vistaAdmin(currentTab);
  else if (currentRole === "profesor") html = vistaProfesor(currentTab);
  else if (currentRole === "representante")
    html = vistaRepresentante(currentTab);
  mc.innerHTML = html;
  if (currentRole === "admin" && currentTab === "config")
    restaurarInputUrl();
}
