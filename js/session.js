const LS_SESION = "escuela_sesion_v1";

function guardarSesion(tab) {
  try {
    localStorage.setItem(
      LS_SESION,
      JSON.stringify({
        rol: currentRole,
        user: currentUser,
        tab: tab || currentTab,
      }),
    );
  } catch (e) {
    console.warn("No se pudo guardar la sesión", e);
  }
}

function leerSesion() {
  try {
    const s = JSON.parse(localStorage.getItem(LS_SESION) || "null");
    return s && s.rol && s.user ? s : null;
  } catch (e) {
    return null;
  }
}

function borrarSesion() {
  try {
    localStorage.removeItem(LS_SESION);
  } catch (e) {
    console.warn("No se pudo cerrar la sesión", e);
  }
}
