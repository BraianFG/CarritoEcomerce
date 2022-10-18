let lista = [];
let acumulador = 0;
let ver = JSON.parse(localStorage.getItem('CARRITO'));
let acumula = JSON.parse(localStorage.getItem('TOTAL'));
let productos = {};
let productosCantidad = {};
let cantidad = 1;
let unicos,conjunto;
let subtotal = 1;
/*-----------------------------------------------------------------------*/
//Petición get
/*-----------------------------------------------------------------------*/
const recibir = async () => {
  const url = "./assets/datos/productos.json";
  const respuesta = await fetch(url);
  const mostrar = await respuesta.json();
  for (let itera of mostrar[0]) {
    iterar(itera);
  }
  cargarTemp();
}
recibir();

/*-----------------------------------------------------------------------*/
//Generación de card
/*-----------------------------------------------------------------------*/
const iterar = async (itera) => {
  document.querySelector("#articulos").innerHTML +=
    `<div class="card" id="${itera.id}" >
        <img src="./assets/images/${itera.imagen}" class="card-img-top" alt="./assets/images/${itera.imagen}">
        <div class="card-body">
        <div class="card-texto">
          <h4 class="card-title nombre">${itera.nombre}</h4>
          <h5  class="card-title">$<p id="precio">${itera.precio}<p></h5>
          <p class="card-text">${itera.descripcion}</p>
        </div> 
            <button class="button cargar" data-id="${itera.id}" data-nombre="${itera.nombre}" data-precio="${itera.precio}">Agregar <i class="fa-solid fa-plus"></i> </button>
        </div>
        </div> 
      </div>`;
}

/*-----------------------------------------------------------------------*/
//Lógica del carrito
/*-----------------------------------------------------------------------*/
//Carga temporal del localStorage
const cargarTemp = async () => {
  seleccionar = document.querySelectorAll(".cargar");
  for (let i = 0; i < seleccionar.length; i++) {
    seleccionar[i].addEventListener("click", () => {
      objetoProducto(i);
      totalTemp();
      sumarCantidad();
      almacenar();
      document.querySelector("#total").innerHTML = `TOTAL : $${acumulador}</p>`;
      alertify.notify('Producto agregado al carrito', 'success', 10);
      mostrarBotones();
      OcultarMensaje();
      CarritoContenido();
    })
  }
}

//Lista de producto temporal
const objetoProducto = async (i) => {
  productos = {
    id: JSON.parse(seleccionar[i].dataset.id),
    nombre: seleccionar[i].dataset.nombre,
    precio: JSON.parse(seleccionar[i].dataset.precio),
    cantidad: 1,
    subtotal:subtotal,
  };
  cargarProductos(productos);
}

//Genera el array de objeto
const cargarProductos = async (productos) => {
  lista.push(productos);
}

//Suma cantidad por artículo
const sumarCantidad= async () => {
  if (productosCantidad.hasOwnProperty(productos.nombre)) {
    productos.cantidad = productosCantidad[productos.nombre].cantidad + 1;
  }
  productosCantidad[productos.nombre] = productos;
}

//Carga productos al localstorage
const almacenar = async () => {
  for (let z of lista) {
    z.subtotal = z.cantidad * z.precio;
    document.querySelector("#carrito").innerHTML += `<p>${z.id}.${z.nombre} $${z.precio} x ${z.cantidad} $${z.subtotal}</p>`
    localStorage.setItem("CARRITO", JSON.stringify(lista));
  }
}

//Calcula el total temporal
const totalTemp = async () => {
  for (let n of lista) {
    acumulador = acumulador + n.precio;
    document.querySelector("#total").innerHTML = `TOTAL : $${acumulador}</p>`;
    localStorage.setItem("TOTAL", JSON.stringify(acumulador));
  }

}

//Calcula el total
const total = async () => {
  for (let m of ver) {
    acumulador = acumulador + m.precio;
    document.querySelector("#total").innerHTML = `TOTAL : $${acumulador}</p>`;
  }
}

//Levanta localStorage
const levantarGurdado = async () => {
  ver.forEach(x => {
    x.subtotal = x.cantidad * x.precio;
    document.querySelector("#carrito").innerHTML += `<p>  ${x.id}. ${x.nombre} $${x.precio} x ${x.cantidad} $${x.subtotal}</p>`;
  });
}

//Ocultar botones
const OcultarBotones = async () => {
  document.querySelector("#eliminar").style.display = "none";
  document.querySelector("#confirmar").style.display = "none";
}

//Oculta mensaje de carrito vacio
const OcultarMensaje = async () => {
  document.querySelector("#mensaje").innerHTML = ``;
}
//Muestra mensaje de carrito vacio
const mostrarMensaje = async () => {
  document.querySelector("#mensaje").innerHTML = `El carrito está vacio,agregue un producto`;
}

//En caso que el carrito quede con productos
const CarritoContenido = async () => {
  document.querySelector(".fa-cart-shopping").style.color = "red";
}

//Mostrar Carrito con localStorage
const mostrar = async () => {
  if (localStorage.length > 0) {
    CarritoContenido();
    levantarGurdado();
    total();
    OcultarMensaje();
  } else {
    OcultarBotones();
    mostrarMensaje();
  }
}
mostrar();

//MostrarBotones
const mostrarBotones = async () => {
  document.querySelector("#eliminar").style.display = "block";
  document.querySelector("#confirmar").style.display = "block";
}

/*------------------------------------------------------------------------------------*/
//Instrucciones al eliminar
const eliminarCarrito = async () => {
  localStorage.clear();
  lista = [];
  acumulador = 0;
  document.querySelector(".fa-cart-shopping").style.color = "black";
  OcultarBotones();
  OcultarContenido();
  mostrarMensaje();
}

//Si el usuario elimina
document.querySelector("#eliminar").addEventListener("click", () => {
  alertify.notify('carrito eliminado', 'success', 5);
  eliminarCarrito();
});

//Ocultar botones
const OcultarContenido = async () => {
  document.querySelector("#carrito").innerHTML = ``;
  document.querySelector("#total").innerHTML = ``;
}

/*-------------------------------------------------------------------------*/
//Checkout
/*-------------------------------------------------------------------------*/

//Vista de resumen de compra
const mostrarModal = async () => {
  ver.forEach(a => {
    a.subtotal = a.cantidad * a.precio;
    document.querySelector("#VerProductos").innerHTML += `<p>  ${a.id}. ${a.nombre} $${a.precio} x ${a.cantidad} $${a.subtotal}</p>`;
  });
  document.querySelector("#totalResumenTemp").innerHTML = `TOTAL : $${acumulador}</p>`;
}

//Vista de resumen temporal de compra
const mostrarModalTemp = async () => {
  for (let y of lista) {
    y.subtotal = y.cantidad * y.precio;
    document.querySelector("#VerProductosTemp").innerHTML += `<p>  ${y.id}. ${y.nombre} $${y.precio} x ${y.cantidad} $${y.subtotal}</p>`;
  }
  document.querySelector("#totalResumenTemp").innerHTML = `TOTAL : $${acumulador}</p>`;
}

document.querySelector("#confirmar").addEventListener("click", () => {
  document.querySelector("#confirmar").innerHTML = `
    <div class="modal fade" id="checkout" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Resumen</h1>
          <button type="button" class="fa-solid fa-xmark" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
        <div class="container" id="VerProductosTemp">
        </div>  
          <div class="container" id="VerProductos">
          </div>    
            </div>
            <h3 class="container" id="totalResumenTemp"></h3>
            <h3 class="container" id="totalResumen"></h3>
          <div class="modal-footer">
            <button type="button" class="btn btn-dark" id="finalizar"  data-bs-dismiss="modal" >Pagar</button>
          </div> 
        </div> 
    </div> 
    </div> `;

  document.querySelector("#finalizar").addEventListener("click", () => {
    alertify.notify('Gracias por la compra', 'success', 10)
    eliminarCarrito();
  })

  mostrarModalTemp();
  mostrarModal();
});

