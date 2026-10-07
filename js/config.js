/* =========================================================
   CONSTANTES
========================================================= */
const MATERIAS_PRIMARIA = [
  "Español",
  "Matemática",
  "Ciencias Naturales",
  "Ciencias Sociales",
  "Lengua y Literatura",
  "Inglés",
  "Formación Ciudadana",
  "Educación Física",
];
const GRADOS_LIST = [
  "1er Grado",
  "2do Grado",
  "3er Grado",
  "4to Grado",
  "5to Grado",
  "6to Grado",
];
const NOTA_APROBACION = 50;
const LS_DB = "escuela_db_v1";
const LS_URL = "escuela_sheet_url";
const URL_HOJA_POR_DEFECTO =
  "https://script.google.com/macros/s/AKfycbyXOQHfV1XpjDbxK25oPZurqfDc4GpQtCzHqpWN0n5XH3YeHky4fYlMWaRNW55xAjLfkw/exec";

const NOMBRE_ESCUELA = 'U.E. Primaria "María del Rosario"';
const MENSAJE_WA_DEFECTO =
  "Estimado(a) {representante}, reciba un cordial saludo de la " +
  NOMBRE_ESCUELA +
  ".";
const PLANTILLAS_WA = [
  {
    id: "pago",
    titulo: "Recordatorio de pago",
    ico: "fa-hand-holding-dollar",
    texto:
      "Estimado(a) {representante}, reciba un cordial saludo de la " +
      NOMBRE_ESCUELA +
      ". Le recordamos que su representado(a) {alumno} ({grado}) mantiene un pago PENDIENTE. Agradecemos su colaboración para ponerse al día con la administración. ¡Gracias!",
  },
  {
    id: "actividad",
    titulo: "Próxima actividad",
    ico: "fa-calendar-check",
    texto:
      "Estimado(a) {representante}, le informamos que su representado(a) {alumno} de {grado} tiene una actividad próxima. Ingrese al sistema con su cédula para consultar los detalles. " +
      NOMBRE_ESCUELA +
      ".",
  },
  {
    id: "notas",
    titulo: "Notas disponibles",
    ico: "fa-star",
    texto:
      "Estimado(a) {representante}, ya están disponibles las notas de {alumno} ({grado}). Ingrese al sistema con su cédula para consultarlas. " +
      NOMBRE_ESCUELA +
      ".",
  },
  {
    id: "reunion",
    titulo: "Reunión de representantes",
    ico: "fa-people-group",
    texto:
      "Estimado(a) {representante}, le invitamos a la reunión de representantes de {grado}. Su presencia es muy importante. " +
      NOMBRE_ESCUELA +
      ".",
  },
  {
    id: "inasistencia",
    titulo: "Inasistencia",
    ico: "fa-triangle-exclamation",
    texto:
      "Estimado(a) {representante}, le informamos que {alumno} ({grado}) ha presentado inasistencias. Le agradecemos comunicarse con la institución. " +
      NOMBRE_ESCUELA +
      ".",
  },
];
