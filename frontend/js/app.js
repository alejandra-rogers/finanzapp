// =====================================================
// FinanzApp — Frontend (JavaScript vanilla)
// Versión demo: los datos se guardan en el navegador
// (localStorage). Más adelante cada función de "datos"
// se reemplaza por un fetch() a la API Express.
// =====================================================

const CATEGORIAS_GASTO = ["Alimentación", "Transporte", "Servicios", "Salud", "Ocio", "Ropa", "Otros"];
const CATEGORIAS_INGRESO = ["Sueldo", "Honorarios", "Otros ingresos"];

// ---------- Datos (localStorage) ----------
function claveUsuario(nombre) {
  const email = localStorage.getItem("finanzapp_usuario");
  return `finanzapp_${email}_${nombre}`;
}

function leer(nombre) {
  try {
    return JSON.parse(localStorage.getItem(claveUsuario(nombre))) || [];
  } catch {
    return [];
  }
}

function guardar(nombre, datos) {
  localStorage.setItem(claveUsuario(nombre), JSON.stringify(datos));
}

function nuevoId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// Carga datos de ejemplo la primera vez, para que la demo no arranque vacía
function cargarDatosDeEjemplo() {
  if (localStorage.getItem(claveUsuario("iniciado"))) return;

  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = (d) => `${hoy.getFullYear()}-${mes}-${String(d).padStart(2, "0")}`;

  guardar("movimientos", [
    { id: 1, tipo: "ingreso", descripcion: "Sueldo", categoria: "Sueldo", monto: 950000, fecha: dia(1) },
    { id: 2, tipo: "gasto", descripcion: "Supermercado", categoria: "Alimentación", monto: 185000, fecha: dia(3) },
    { id: 3, tipo: "gasto", descripcion: "Luz y gas", categoria: "Servicios", monto: 62000, fecha: dia(5) },
    { id: 4, tipo: "gasto", descripcion: "Carga SUBE", categoria: "Transporte", monto: 25000, fecha: dia(6) },
    { id: 5, tipo: "gasto", descripcion: "Cine", categoria: "Ocio", monto: 38000, fecha: dia(8) },
    { id: 6, tipo: "gasto", descripcion: "Verdulería", categoria: "Alimentación", monto: 42000, fecha: dia(10) },
  ]);
  guardar("presupuestos", [
    { categoria: "Alimentación", limite: 250000 },
    { categoria: "Ocio", limite: 40000 },
    { categoria: "Transporte", limite: 60000 },
  ]);
  guardar("compras", [
    { id: 7, producto: "Zapatillas", categoria: "Ropa", precio: 120000 },
    { id: 8, producto: "Auriculares", categoria: "Ocio", precio: 45000 },
  ]);
  localStorage.setItem(claveUsuario("iniciado"), "1");
}

// ---------- Utilidades ----------
const $ = (id) => document.getElementById(id);

function pesos(n) {
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

// Fecha de hoy en formato AAAA-MM-DD (hora local, no UTC)
function hoyISO() {
  const h = new Date();
  return `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, "0")}-${String(h.getDate()).padStart(2, "0")}`;
}

function fechaCorta(iso) {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

function esDelMesActual(iso) {
  const hoy = new Date();
  const [a, m] = iso.split("-").map(Number);
  return a === hoy.getFullYear() && m === hoy.getMonth() + 1;
}

function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function aviso(mensaje) {
  const el = $("aviso");
  el.textContent = mensaje;
  el.classList.add("visible");
  clearTimeout(aviso.timer);
  aviso.timer = setTimeout(() => el.classList.remove("visible"), 2500);
}

function llenarSelect(select, opciones) {
  select.innerHTML = opciones.map((o) => `<option>${o}</option>`).join("");
}

// Total gastado en una categoría durante el mes actual
function gastadoEn(categoria) {
  return leer("movimientos")
    .filter((m) => m.tipo === "gasto" && m.categoria === categoria && esDelMesActual(m.fecha))
    .reduce((suma, m) => suma + m.monto, 0);
}

// ---------- Login ----------
$("form-login").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = $("login-email").value.trim();
  const pass = $("login-pass").value;

  if (pass.length < 4) {
    $("login-error").textContent = "La contraseña debe tener al menos 4 caracteres.";
    return;
  }
  localStorage.setItem("finanzapp_usuario", email);
  entrar();
});

$("btn-salir").addEventListener("click", () => {
  localStorage.removeItem("finanzapp_usuario");
  $("pantalla-app").classList.add("oculto");
  $("pantalla-login").classList.remove("oculto");
  $("form-login").reset();
});

function entrar() {
  cargarDatosDeEjemplo();
  $("usuario-email").textContent = localStorage.getItem("finanzapp_usuario");
  $("pantalla-login").classList.add("oculto");
  $("pantalla-app").classList.remove("oculto");
  $("login-error").textContent = "";
  mostrarSeccion("resumen");
}

// ---------- Navegación ----------
document.querySelectorAll(".menu-item").forEach((boton) => {
  boton.addEventListener("click", () => mostrarSeccion(boton.dataset.seccion));
});

function mostrarSeccion(nombre) {
  document.querySelectorAll(".seccion").forEach((s) => s.classList.add("oculto"));
  $(nombre).classList.remove("oculto");
  document.querySelectorAll(".menu-item").forEach((b) => {
    b.classList.toggle("activo", b.dataset.seccion === nombre);
  });
  refrescar();
}

function refrescar() {
  dibujarResumen();
  dibujarMovimientos();
  dibujarPresupuestos();
  dibujarCompras();
}

// ---------- Resumen ----------
function dibujarResumen() {
  const delMes = leer("movimientos").filter((m) => esDelMesActual(m.fecha));
  const ingresos = delMes.filter((m) => m.tipo === "ingreso").reduce((s, m) => s + m.monto, 0);
  const gastos = delMes.filter((m) => m.tipo === "gasto").reduce((s, m) => s + m.monto, 0);
  const saldo = ingresos - gastos;

  $("total-ingresos").textContent = pesos(ingresos);
  $("total-gastos").textContent = pesos(gastos);
  $("total-saldo").textContent = pesos(saldo);

  // Alertas: presupuestos al 80% o más
  const alertas = leer("presupuestos")
    .map((p) => ({ ...p, gastado: gastadoEn(p.categoria) }))
    .filter((p) => p.gastado >= p.limite * 0.8);

  $("lista-alertas").innerHTML = alertas.length
    ? alertas.map((p) => {
        const excedido = p.gastado > p.limite;
        const texto = excedido
          ? `Te pasaste del presupuesto de ${p.categoria}: gastaste ${pesos(p.gastado)} de ${pesos(p.limite)}.`
          : `${p.categoria} está cerca del límite: ${pesos(p.gastado)} de ${pesos(p.limite)}.`;
        return `<li class="${excedido ? "excedido" : ""}">${texto}</li>`;
      }).join("")
    : `<li class="ok">Todos los presupuestos están dentro del límite.</li>`;

  // Últimos 5 movimientos
  const ultimos = [...leer("movimientos")].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 5);
  $("tabla-ultimos").innerHTML = ultimos.length
    ? ultimos.map((m) => filaMovimiento(m)).join("")
    : `<tr><td colspan="4" class="vacio">Todavía no cargaste movimientos.</td></tr>`;
}

function filaMovimiento(m, conBorrar = false) {
  const signo = m.tipo === "ingreso" ? "+" : "−";
  const clase = m.tipo === "ingreso" ? "positivo" : "negativo";
  return `<tr>
    <td>${fechaCorta(m.fecha)}</td>
    <td>${escapar(m.descripcion)}</td>
    <td>${m.categoria}</td>
    <td class="der ${clase}">${signo} ${pesos(m.monto)}</td>
    ${conBorrar ? `<td class="der"><button class="btn btn-borrar" data-borrar="${m.id}" aria-label="Eliminar">×</button></td>` : ""}
  </tr>`;
}

// ---------- Movimientos ----------
$("mov-tipo").addEventListener("change", actualizarCategoriasMovimiento);
$("filtro-tipo").addEventListener("change", dibujarMovimientos);

function actualizarCategoriasMovimiento() {
  const tipo = $("mov-tipo").value;
  llenarSelect($("mov-categoria"), tipo === "ingreso" ? CATEGORIAS_INGRESO : CATEGORIAS_GASTO);
}

$("form-movimiento").addEventListener("submit", (e) => {
  e.preventDefault();
  const movimientos = leer("movimientos");
  movimientos.push({
    id: nuevoId(),
    tipo: $("mov-tipo").value,
    descripcion: $("mov-descripcion").value.trim(),
    categoria: $("mov-categoria").value,
    monto: Number($("mov-monto").value),
    fecha: $("mov-fecha").value,
  });
  guardar("movimientos", movimientos);
  e.target.reset();
  $("mov-fecha").value = hoyISO();
  actualizarCategoriasMovimiento();
  aviso("Movimiento guardado");
  refrescar();
});

function dibujarMovimientos() {
  const filtro = $("filtro-tipo").value;
  const lista = leer("movimientos")
    .filter((m) => filtro === "todos" || m.tipo === filtro)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  $("tabla-movimientos").innerHTML = lista.length
    ? lista.map((m) => filaMovimiento(m, true)).join("")
    : `<tr><td colspan="5" class="vacio">No hay movimientos para mostrar.</td></tr>`;
}

$("tabla-movimientos").addEventListener("click", (e) => {
  const id = Number(e.target.dataset.borrar);
  if (!id) return;
  if (!confirm("¿Eliminar este movimiento?")) return;
  guardar("movimientos", leer("movimientos").filter((m) => m.id !== id));
  aviso("Movimiento eliminado");
  refrescar();
});

// ---------- Presupuestos ----------
$("form-presupuesto").addEventListener("submit", (e) => {
  e.preventDefault();
  const categoria = $("pre-categoria").value;
  const limite = Number($("pre-limite").value);
  const presupuestos = leer("presupuestos").filter((p) => p.categoria !== categoria);
  presupuestos.push({ categoria, limite });
  guardar("presupuestos", presupuestos);
  e.target.reset();
  aviso(`Presupuesto de ${categoria} guardado`);
  refrescar();
});

function dibujarPresupuestos() {
  const presupuestos = leer("presupuestos");
  $("lista-presupuestos").innerHTML = presupuestos.length
    ? presupuestos.map((p) => {
        const gastado = gastadoEn(p.categoria);
        const porcentaje = Math.round((gastado / p.limite) * 100);
        let estado = "";
        if (porcentaje > 100) estado = "excedido";
        else if (porcentaje >= 80) estado = "cerca";
        return `<div class="presupuesto-fila">
          <div class="presupuesto-info">
            <strong>${p.categoria}</strong>
            <span>${pesos(gastado)} de ${pesos(p.limite)} (${porcentaje}%)</span>
          </div>
          <div class="barra-progreso">
            <div class="barra-relleno ${estado}" style="width:${Math.min(porcentaje, 100)}%"></div>
          </div>
        </div>`;
      }).join("")
    : `<p class="vacio">Definí un presupuesto para empezar a controlar tus gastos.</p>`;
}

// ---------- Compras planificadas ----------
$("form-compra").addEventListener("submit", (e) => {
  e.preventDefault();
  const compras = leer("compras");
  compras.push({
    id: nuevoId(),
    producto: $("com-producto").value.trim(),
    categoria: $("com-categoria").value,
    precio: Number($("com-precio").value),
  });
  guardar("compras", compras);
  e.target.reset();
  aviso("Compra agregada a la lista");
  refrescar();
});

function dibujarCompras() {
  const compras = leer("compras");
  const total = compras.reduce((s, c) => s + c.precio, 0);
  $("total-compras").textContent = pesos(total);

  $("lista-compras").innerHTML = compras.length
    ? compras.map((c) => `<li>
        <span>${escapar(c.producto)}<small>${c.categoria}</small></span>
        <strong>${pesos(c.precio)}</strong>
        <button class="btn btn-confirmar" data-confirmar="${c.id}">Confirmar compra</button>
        <button class="btn btn-borrar" data-quitar="${c.id}" aria-label="Quitar">×</button>
      </li>`).join("")
    : `<li class="vacio">No tenés compras planificadas.</li>`;
}

$("lista-compras").addEventListener("click", (e) => {
  const idConfirmar = Number(e.target.dataset.confirmar);
  const idQuitar = Number(e.target.dataset.quitar);
  const compras = leer("compras");

  if (idConfirmar) {
    // La compra confirmada pasa a ser un gasto
    const compra = compras.find((c) => c.id === idConfirmar);
    const movimientos = leer("movimientos");
    movimientos.push({
      id: nuevoId(),
      tipo: "gasto",
      descripcion: compra.producto,
      categoria: compra.categoria,
      monto: compra.precio,
      fecha: hoyISO(),
    });
    guardar("movimientos", movimientos);
    guardar("compras", compras.filter((c) => c.id !== idConfirmar));
    aviso(`Compra confirmada: ${compra.producto} se registró como gasto`);
    refrescar();
  }

  if (idQuitar) {
    guardar("compras", compras.filter((c) => c.id !== idQuitar));
    aviso("Compra quitada de la lista");
    refrescar();
  }
});

// ---------- Inicio ----------
llenarSelect($("pre-categoria"), CATEGORIAS_GASTO);
llenarSelect($("com-categoria"), CATEGORIAS_GASTO);
actualizarCategoriasMovimiento();
$("mov-fecha").value = hoyISO();

if (localStorage.getItem("finanzapp_usuario")) entrar();
