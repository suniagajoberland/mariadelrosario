# Vinculación con Google Sheets

El sistema guarda los datos (alumnos, profesores, notas, evaluaciones) en una hoja de
Google Sheets mediante un Web App de Apps Script. No necesitas servidor ni base de datos.

## 1. Crear la hoja

1. Ve a <https://sheets.new> y nombra la hoja, por ejemplo **Gestion Escolar**.
2. Anota la URL: `https://docs.google.com/spreadsheets/d/ID_DE_TU_HOJA/edit`

## 2. Pegar el código

1. Desde la hoja: **Extensiones → Apps Script**.
2. Borra el contenido de `Code.gs` y pega todo el código de `apps-script/Code.gs`.
3. Guarda con Ctrl+S.

## 3. Publicar como Web App

1. En Apps Script: **Implementar → Nueva implementación**.
2. Tipo: **Aplicación web**.
3. **Ejecutar como**: Yo.
4. **Quién tiene acceso**: **Cualquiera**.
5. Clic en **Implementar** y autoriza el acceso.
6. Copia la **URL de la aplicación web**. Termina en `/exec`.

> Importante: el paso 4 es el que más se olvida. Si el despliegue queda en *Solo yo* o
> *Cualquiera con cuenta de Google*, la URL responde **403 Acceso denegado** y el sistema no
> puede leer ni escribir en la hoja.

> Importante: usa siempre la URL `/exec`. La URL `/dev` solo funciona con tu cuenta de Google
> abierta y es más lenta.

## 4. Conectar el sistema

La URL de este proyecto ya viene escrita en el sistema, así que en principio no hay que hacer
nada más. Para cambiar de hoja o de implementación:

1. Abre `index.html` en el navegador.
2. Entra como **Administrador** (usuario `admin`, clave `admin`).
3. Ve a **Configuración → Google Sheets**.
4. Pega la URL `/exec` y pulsa **Conectar y probar**.
5. Si aparece *Conectado*, la aplicación ya lee y escribe en la hoja.

## 5. Decidir qué se sube

La primera vez que conectas, si la hoja está vacía, la aplicación sube automáticamente los
datos de ejemplo que trae el sistema. A partir de ahí la hoja es la fuente de datos y cada
cambio se guarda automáticamente.

- **Subir datos actuales**: manda todos los registros que tengas en el navegador
  (incluye las contraseñas de los profesores) a la hoja, reemplazando lo que había.
- **Vaciar la hoja**: borra todos los datos del servidor. Úsalo solo para empezar de cero.

## Hojas creadas

| Hoja          | Columnas                                                                                              |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| Alumnos       | cedulaEscolar, nombre, grado, representante, repCedula, telefono, pago, profesorId                     |
| Profesores    | id, cedula, nombre, clave, telefono, grado, activo                                                    |
| Evaluaciones  | id, profesorId, grado, titulo, materia, tipo, lapso, fecha, ponderacion, notaMax                      |
| Notas         | evaluacionId, estudianteId, nota                                                                      |
| Usuarios      | id, usuario, clave, rol, nombre                                                                       |

La columna `clave` guarda las contraseñas en texto plano para que puedas recuperarlas y
comunicárselas a cada profesor. Como la aplicación es local y la API es pública, cualquier
persona con la URL puede leerlas: no la compartas fuera de la escuela.

## Cómo entra cada rol

| Rol            | Usuario         | Clave                                | Dónde se define          |
| -------------- | --------------- | ------------------------------------ | ------------------------ |
| Administrador  | `admin`         | la que tú pongas                     | Configuración            |
| Profesor(a)    | su cédula       | la que tú le asignes                 | Profesores y Claves      |
| Representante  | su cédula       | su propia cédula (no se guarda)     | Cédula del Representante en la matrícula del alumno |

El representante no tiene contraseña propia: el sistema busca la cédula que registraste al
inscribir a su hijo. Si un mismo representante tiene varios hijos, al entrar ve las notas de
todos ellos. El mismo formato de cédula se acepta con o sin guiones (`V-12.345.678` y
`v12345678` son la misma persona).

Para desactivar el acceso de un profesor sin borrarlo, desmarca **Activo** al editarlo.

## Comportamiento sin conexión

El ingreso nunca espera a la red: si Google Sheets responde lento o no responde, el
administrador, los profesores y los representantes pueden entrar igual con los datos guardados
en el navegador (`localStorage`) y la sincronización continúa en segundo plano. El panel de
Configuración muestra *Sin conexión* o *Error de conexión* mientras tanto.

## Problemas frecuentes

- **"No se pudo conectar" con HTTP 403**: el Web App no es público. En Apps Script ve a
  **Implementar → Nueva implementación**, tipo *Aplicación web*, y pon **Quién tiene acceso:
  Cualquiera**. Después pega la URL nueva en Configuración.
- **Sigue dando 403 después de cambiarlo**: a veces Google tarda unos minutos en aplicar el
  cambio. Espera y recarga la página.
- **La URL termina en `/dev`**: cámbiala por la `/exec`, que es la pública y más rápida.
- **La hoja quedó vacía**: usa *Vaciar la hoja* y luego *Subir datos actuales*.
- **No aparecen cambios del profesor**: ambos deben apuntar a la misma URL y recargar la
  página. Los cambios se guardan solos, pero la lista se actualiza al recargar o al cambiar de
  pestaña.
- **Quiero empezar de cero**: *Vaciar la hoja* y luego *Subir datos actuales* con los datos que
  tengas en el navegador.