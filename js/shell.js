/* =========================================================
   SHELL DE LA APLICACIÓN (sidebar, header y modales)
   Se inyecta en la propia página de login al iniciar sesión,
   por lo que no hace falta un HTML extra para la app.
========================================================= */
const SHELL_HTML = `
    <div id="app-container" class="hidden flex h-screen overflow-hidden">
      <aside id="sidebar" class="hidden md:flex md:flex-shrink-0">
        <div class="flex flex-col w-64 bg-white border-r border-slate-200">
          <div
            class="flex items-center justify-center h-20 px-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20"
              >
                <i class="fa-solid fa-school-flag text-lg"></i>
              </div>
              <div>
                <span
                  class="text-xs font-semibold text-brand-600 uppercase tracking-wider"
                  >U.E. Primaria</span
                >
                <h1 class="text-base font-bold text-slate-800 leading-tight">
                  María del Rosario
                </h1>
              </div>
            </div>
          </div>

          <nav
            id="sidebar-nav"
            class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar"
          ></nav>

          <div class="p-4 border-t border-slate-100 bg-slate-50/50">
            <div
              class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm"
            >
              <div class="flex items-center justify-between mb-2">
                <span
                  class="text-xs font-semibold text-slate-600 flex items-center gap-1.5"
                >
                  <span
                    id="sync-dot"
                    class="w-2 h-2 rounded-full bg-slate-300"
                  ></span>
                  <span id="rol-label">Administrador</span>
                </span>
                <button
                  onclick="cerrarSesion()"
                  class="text-rose-500 hover:text-rose-600 text-xs"
                  title="Cerrar Sesión"
                >
                  <i class="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
              <p
                id="user-info"
                class="text-[11px] text-slate-600 truncate font-medium"
              ></p>
              <p
                id="sheet-status-text"
                class="text-[11px] text-slate-500 truncate mt-1"
              >
                Modo local
              </p>
            </div>
          </div>
        </div>
      <div
        id="sidebar-backdrop"
        onclick="alternarSidebar()"
        class="hidden fixed inset-0 bg-slate-900/40 z-[60] md:hidden"
      ></div>
      </aside>

      <div class="flex flex-col flex-1 h-full overflow-hidden">
        <header
          class="flex items-center justify-between h-20 px-6 bg-white border-b border-slate-200 z-10"
        >
          <div class="flex items-center space-x-4">
            <button
              onclick="alternarSidebar()"
              class="md:hidden text-slate-500 hover:text-slate-700 focus:outline-none"
            >
              <i class="fa-solid fa-bars text-xl"></i>
            </button>
            <div>
              <h2
                id="page-title"
                class="text-xl font-bold font-heading text-slate-800"
              >
                Resumen General
              </h2>
              <p class="text-xs text-slate-400">
                Sistema automatizado de control escolar
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div
              class="hidden sm:flex items-center bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 text-sm"
            >
              <i class="fa-regular fa-calendar text-slate-400 mr-2"></i>
              <span
                id="current-date"
                class="font-medium text-slate-600 text-xs"
              ></span>
            </div>
            <div
              class="flex items-center space-x-3 pl-4 border-l border-slate-200"
            >
              <div
                class="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm"
                id="avatar-ini"
              >
                AD
              </div>
              <div class="hidden sm:block text-left">
                <p class="text-xs font-bold text-slate-700" id="header-nombre">
                  Usuario
                </p>
                <p
                  class="text-[10px] text-emerald-600 font-medium"
                  id="header-rol"
                >
                  En línea
                </p>
              </div>
            </div>
          </div>
        </header>

        <main
          class="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6 custom-scrollbar"
          id="main-content"
        ></main>
      </div>
    </div>

    <!-- ================= MODAL ALUMNO ================= -->
    <div
      id="modal-alumno"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm hidden items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <div
        class="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 fade-in max-h-[92vh] overflow-y-auto custom-scrollbar"
      >
        <div class="flex justify-between items-center mb-4">
          <h3
            class="text-lg font-bold text-slate-800 font-heading"
            id="modal-alumno-title"
          >
            Inscribir Nuevo Alumno
          </h3>
          <button
            onclick="cerrarModal('modal-alumno')"
            class="text-slate-400 hover:text-slate-600"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        <form
          id="form-alumno"
          onsubmit="guardarAlumno(event)"
          class="space-y-4 text-sm"
        >
          <input type="hidden" id="alumno-id-orig" />
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1"
                >Nombre y Apellido</label
              >
              <input type="text" id="alumno-nombre" required class="input" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1"
                >Cédula Escolar</label
              >
              <input
                type="text"
                id="alumno-cedula"
                required
                placeholder="V-35.123.456"
                class="input"
              />
            </div>
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1"
                >Grado</label
              >
              <select id="alumno-grado" class="input"></select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1"
                >Profesor(a) asignado</label
              >
              <select id="alumno-profesor" class="input"></select>
            </div>
          </div>
          <div class="border-t border-slate-100 pt-4">
            <p
              class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3"
            >
              <i class="fa-solid fa-user-group mr-1.5"></i>Datos del
              Representante
            </p>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1"
                  >Nombre</label
                >
                <input type="text" id="alumno-rep" required class="input" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">
                  Cédula del Representante
                  <span class="text-rose-500 font-normal normal-case"
                    >(su clave de acceso)</span
                  >
                </label>
                <input
                  type="text"
                  id="alumno-repci"
                  required
                  placeholder="V-30.111.001"
                  class="input"
                />
              </div>
            </div>
            <div class="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1"
                  >Teléfono WhatsApp</label
                >
                <input
                  type="text"
                  id="alumno-telefono"
                  required
                  placeholder="584242714023"
                  class="input"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1"
                  >Estatus de Pago</label
                >
                <select id="alumno-pago" class="input">
                  <option value="Solvente">Solvente</option>
                  <option value="Pendiente">Pendiente</option>
                </select>
              </div>
            </div>
          </div>
          <div class="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onclick="cerrarModal('modal-alumno')"
              class="btn-sec"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-pri">
              <i class="fa-solid fa-floppy-disk"></i> Guardar Alumno
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ================= MODAL PROFESOR ================= -->
    <div
      id="modal-profesor"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm hidden items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <div
        class="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 fade-in max-h-[92vh] overflow-y-auto custom-scrollbar"
      >
        <div class="flex justify-between items-center mb-4">
          <h3
            class="text-lg font-bold text-slate-800 font-heading"
            id="modal-profesor-title"
          >
            Agregar Profesor(a)
          </h3>
          <button
            onclick="cerrarModal('modal-profesor')"
            class="text-slate-400 hover:text-slate-600"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        <form
          id="form-profesor"
          onsubmit="guardarProfesor(event)"
          class="space-y-4 text-sm"
        >
          <input type="hidden" id="profesor-id-orig" />
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-slate-600 mb-1"
                >Nombre y Apellido</label
              >
              <input
                type="text"
                id="profesor-nombre"
                required
                placeholder="Prof. María Elena González"
                class="input"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1"
                >Cédula de Identidad</label
              >
              <input
                type="text"
                id="profesor-cedula"
                required
                placeholder="V-12.345.001"
                class="input"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1"
                >Teléfono</label
              >
              <input
                type="text"
                id="profesor-telefono"
                placeholder="04141234001"
                class="input"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1"
                >Grado asignado</label
              >
              <select id="profesor-grado" class="input"></select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1"
                >Clave de acceso</label
              >
              <input
                type="text"
                id="profesor-clave"
                placeholder="Se genera si la dejas vacía"
                class="input"
              />
            </div>
          </div>
          <label class="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              id="profesor-activo"
              checked
              class="w-4 h-4 rounded border-slate-300 text-brand-600"
            />
            <span class="text-sm text-slate-700"
              >Profesor(a) activo (puede iniciar sesión)</span
            >
          </label>
          <div
            class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[12px] text-slate-600"
          >
            <i class="fa-solid fa-key text-brand-500 mr-1.5"></i>
            El profesor inicia sesión con su <strong>cédula</strong> y esta
            <strong>clave</strong>. Comunícale ambos datos.
          </div>
          <div class="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onclick="cerrarModal('modal-profesor')"
              class="btn-sec"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-pri">
              <i class="fa-solid fa-floppy-disk"></i> Guardar Profesor
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ================= MODAL EVALUACION ================= -->
    <div
      id="modal-evaluacion"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm hidden items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <div
        class="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 fade-in max-h-[92vh] overflow-y-auto custom-scrollbar"
      >
        <div class="flex justify-between items-center mb-4">
          <h3
            class="text-lg font-bold text-slate-800 font-heading"
            id="modal-evaluacion-title"
          >
            Nueva Actividad
          </h3>
          <button
            onclick="cerrarModal('modal-evaluacion')"
            class="text-slate-400 hover:text-slate-600"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        <form
          id="form-evaluacion"
          onsubmit="guardarEvaluacion(event)"
          class="space-y-4 text-sm"
        >
          <input type="hidden" id="evaluacion-id-orig" />
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1"
              >Título de la Actividad</label
            >
            <input
              type="text"
              id="evaluacion-titulo"
              required
              placeholder="Ej. Examen de Matemática - Unidad 1"
              class="input"
            />
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1"
                >Materia</label
              >
              <select id="evaluacion-materia" required class="input"></select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1"
                >Tipo</label
              >
              <select id="evaluacion-tipo" class="input">
                <option value="Examen">Examen</option>
                <option value="Prueba">Prueba</option>
                <option value="Tarea">Tarea</option>
                <option value="Trabajo Práctico">Trabajo Práctico</option>
                <option value="Proyecto">Proyecto</option>
                <option value="Participación">Participación</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>
          <div class="grid sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1"
                >Lapso</label
              >
              <select id="evaluacion-lapso" class="input">
                <option value="I">Lapso I</option>
                <option value="II">Lapso II</option>
                <option value="III">Lapso III</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1"
                >Fecha</label
              >
              <input type="date" id="evaluacion-fecha" class="input" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1"
                >Ponderación (%)</label
              >
              <input
                type="number"
                id="evaluacion-ponderacion"
                min="0"
                max="100"
                step="1"
                value="100"
                class="input"
              />
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1"
              >Nota Máxima</label
            >
            <input
              type="number"
              id="evaluacion-notamax"
              min="1"
              step="1"
              value="20"
              class="input"
            />
          </div>
          <div class="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onclick="cerrarModal('modal-evaluacion')"
              class="btn-sec"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-pri">
              <i class="fa-solid fa-floppy-disk"></i> Guardar Actividad
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ================= MODAL CLAVE ADMIN ================= -->
    <div
      id="modal-clave-admin"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm hidden items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl fade-in">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-slate-800 font-heading">
            Cambiar contraseña del administrador
          </h3>
          <button
            onclick="cerrarModal('modal-clave-admin')"
            class="text-slate-400 hover:text-slate-600"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        <form
          id="form-clave-admin"
          onsubmit="guardarClaveAdmin(event)"
          class="space-y-4 text-sm"
        >
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1"
              >Nueva contraseña</label
            >
            <input
              type="text"
              id="admin-clave-nueva"
              required
              minlength="4"
              class="input"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1"
              >Repetir contraseña</label
            >
            <input
              type="text"
              id="admin-clave-repetir"
              required
              class="input"
            />
          </div>
          <div class="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onclick="cerrarModal('modal-clave-admin')"
              class="btn-sec"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-pri">Actualizar</button>
          </div>
        </form>
      </div>
    </div>
`;

let shellInyectado = false;
function inyectarShell() {
  if (shellInyectado) return;
  shellInyectado = true;
  document.body.insertAdjacentHTML("beforeend", SHELL_HTML);
}

inyectarShell();
