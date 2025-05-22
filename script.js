// Constructor de Producto
function Producto(id, nombre, precio, imagen, categoria) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.imagen = imagen;
    this.categoria = categoria;
  }
  
  const productos = [
    new Producto(1, "Líquido de lavandería 1L", 7990, "images/liquido-lavanderia-1l.png", "detergente"),
    new Producto(2, "Líquido de lavandería 2L", 13990, "images/liquido-lavanderia-2l.png", "detergente"),
    new Producto(3, "Mix 1 LincoFer", 20990, "images/mix1-lincofer.png", "mix"),
    new Producto(4, "Mix 2 LincoFer", 30990, "images/mix2-lincofer.png", "mix"),
    new Producto(5, "Multi Limpiador", 5990, "images/multi-limpiador.png", "multi"),
    new Producto(6, "Suavizante de ropa 3L", 13990, "images/suavizante-ropa-3l.png", "suavizante"),
    new Producto(7, "Suavizante de ropa 1L", 7990, "images/suavizante-ropa-1l.png", "suavizante")
  ];
  
  let carrito = [];
  let total = 0;
  
  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("total", total.toString());
  }
  
  function cargarCarrito() {
    const carritoGuardado = localStorage.getItem("carrito");
    const totalGuardado = localStorage.getItem("total");
  
    if (carritoGuardado) {
      carrito = JSON.parse(carritoGuardado);
      total = parseFloat(totalGuardado) || 0;
      actualizarCarrito();
    }
  }
  
  function actualizarCarrito() {
    const carritoContenido = document.getElementById("carrito-contenido");
    const totalTexto = document.getElementById("total");
    const contador = document.getElementById("contador");
  
    if (!carritoContenido || !totalTexto) return;
  
    carritoContenido.innerHTML = "";
  
    if (carrito.length === 0) {
      carritoContenido.innerHTML = "<p>Carrito vacío</p>";
    } else {
      carrito.forEach(producto => {
        const item = document.createElement("p");
        item.textContent = `${producto.nombre} - $${producto.precio}`;
        carritoContenido.appendChild(item);
      });
    }
  
    totalTexto.textContent = total;
    if (contador) contador.textContent = carrito.length;
  
    guardarCarrito();
  }
  
  function vaciarCarrito() {
    carrito = [];
    total = 0;
    actualizarCarrito();
  }
  
  function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
  
    carrito.push(producto);
    total += producto.precio;
    actualizarCarrito();
  }
  
  function renderizarProductos(lista = productos) {
    const contenedor = document.getElementById("contenedor-productos");
    contenedor.innerHTML = "";
  
    lista.forEach(p => {
      const div = document.createElement("div");
      div.classList.add("producto");
      div.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p>$${p.precio}</p>
        <button class="btn-comprar" data-id="${p.id}">Agregar al carrito</button>
      `;
      contenedor.appendChild(div);
    });
  
    document.querySelectorAll(".btn-comprar").forEach(boton => {
      boton.addEventListener("click", e => {
        const id = parseInt(e.target.dataset.id);
        agregarAlCarrito(id);
      });
    });
  }
  
  function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }
  
  function renderizarCategorias() {
    const listaCategorias = document.getElementById("lista-categorias");
    const categoriasUnicas = [...new Set(productos.map(p => p.categoria))];
    listaCategorias.innerHTML = '';
  
    const categoriasConContador = [
      { nombre: "todos", cantidad: productos.length },
      ...categoriasUnicas.map(cat => ({
        nombre: cat,
        cantidad: productos.filter(p => p.categoria === cat).length
      }))
    ];
  
    categoriasConContador.forEach(cat => {
      const li = document.createElement('li');
      li.className = 'categoria';
      li.dataset.categoria = cat.nombre;
      li.textContent = `${cat.nombre === "todos" ? '● Todos los productos' : `○ ${capitalizar(cat.nombre)}`} (${cat.cantidad})`;
      listaCategorias.appendChild(li);
    });
  
    document.querySelectorAll('.categoria').forEach(btn => {
      btn.addEventListener('click', e => {
        document.querySelectorAll('.categoria').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        const categoriaSeleccionada = e.target.dataset.categoria;
        const filtrados = categoriaSeleccionada === "todos"
          ? productos
          : productos.filter(p => p.categoria === categoriaSeleccionada);
        renderizarProductos(filtrados);
      });
    });
  }
  
  function finalizarCompra() {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
  
    if (confirm("¿Estás seguro de finalizar tu compra?")) {
      alert(`¡Gracias por tu compra! Total: $${total}`);
      vaciarCarrito();
    } else {
      alert("Puedes seguir comprando.");
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("vaciar-carrito")?.addEventListener("click", vaciarCarrito);
    document.getElementById("finalizar-compra")?.addEventListener("click", finalizarCompra);
    cargarCarrito();
    renderizarProductos();
    renderizarCategorias();
  });
  