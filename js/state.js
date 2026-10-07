/* =========================================================
   ESTADO
========================================================= */
let db = {
  alumnos: [],
  profesores: [],
  evaluaciones: [],
  notas: [],
  usuarios: [],
  solicitudes: [],
};
let urlHoja = "";
let estadoSync = "local";
let currentRole = null;
let currentUser = null;
let currentTab = "dashboard";
let filtroLapso = "todos";
let evalSeleccionada = null;
let alumnoEnDetalle = null;
let filtroGradoAdmin = "todos";
let clavesVisibles = {};
let colaSync = [];
let temporizadorCola = null;
let ultimoErrorSync = "";
let waMensaje = MENSAJE_WA_DEFECTO;
let waSeleccion = {};
let waResultado = [];
let constanciaSeleccion = null;
let boletaSeleccion = null;
