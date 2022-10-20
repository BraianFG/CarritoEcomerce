import { Productos } from "./productos2.js";

let total = 0;
let ver = JSON.parse(localStorage.getItem('CARRITO')) || [];
let productos = [];
/*-----------------------------------------------------------------------*/
//Petición get
/*-----------------------------------------------------------------------*/
const recibir = async () => {
  const url = "./assets/datos/productos.json";
  const respuesta = await fetch(url);
  const mostrar = await respuesta.json();

  console.log(productos)
  for (let itera1 of mostrar[0]) {
    productos.push(itera1)
    iterar(itera1);
  }
  cargarTemp();
}
recibir();

/*-----------------------------------------------------------------------*/
//Generación de card
/*-----------------------------------------------------------------------*/
const iterar = (itera) => {
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
const cargarTemp = () => {
  let seleccionar = document.querySelectorAll(".cargar");

  seleccionar.forEach(i => {
    i.addEventListener("click", () => {
      let target = i.dataset.id;
      let productosFiltrado = productos.find((cadaProductoDeLaBdd) => cadaProductoDeLaBdd.id == target)

      let repetido = ver.findIndex(cadaProductoDelLocalstorage => { return cadaProductoDelLocalstorage.id == productosFiltrado.id })
      if (repetido == -1) {
        let agregarProducto = new Productos(productosFiltrado.id, productosFiltrado.nombre, productosFiltrado.precio, productosFiltrado.cantidad, productosFiltrado.subtotal)
        ver.push(agregarProducto)
      } else {
        ver[repetido].cantidad++
      }
      localStorage.setItem('CARRITO', JSON.stringify(ver))
      JSON.parse(localStorage.getItem('CARRITO'));
      validarAlmacenamiento();
      alertify.notify('Producto agregado al carrito', 'success', 5);
    })

  });
}

//Levanta localStorage
const levantarGurdado = () => {

  document.querySelector("#carrito").innerHTML = ``;
  document.querySelector("#VerProductos").innerHTML = ``;

  let total = 0;

  for (let x of ver) {
    x.subtotal = parseInt(x.cantidad) * parseInt(x.precio);
    total = total + parseInt(x.subtotal);

    document.querySelector("#carrito").innerHTML += `<p>  ${x.id}. ${x.nombre} $${x.precio} x ${x.cantidad} $${x.subtotal}</p>`;
    document.querySelector("#total").innerHTML = `Total $${total}`;

    document.querySelector("#VerProductos").innerHTML += `<p>  ${x.id}. ${x.nombre} $${x.precio} x ${x.cantidad} $${x.subtotal}</p>`;
    document.querySelector("#totalResumen").innerHTML = `Total $${total}`;
  }
}
/*------------------------------------------------------------------------------------*/
//Ocultar botones
const OcultarBotones = () => {
  document.querySelector("#eliminar").style.display = "none";
  document.querySelector("#confirmar").style.display = "none";
}

//Muestra mensaje de carrito vacio
const mostrarMensaje = () => {
  document.querySelector("#mensaje").innerHTML = `El carrito está vacio,agregue un producto`;
}

//Ocultar botones
const OcultarContenido = () => {
  document.querySelector("#carrito").innerHTML = ``;
  document.querySelector("#total").innerHTML = ``;
}

//Instrucciones al eliminar
const eliminarCarrito = async () => {
  localStorage.clear();
  total = 0;
  ver = [];
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
/*-----------------------------------------------------------------------------------*/

//En caso que el carrito quede con productos
const CarritoContenido = () => {
  document.querySelector(".fa-cart-shopping").style.color = "red";
}

//Oculta mensaje de carrito vacio
const OcultarMensaje = () => {
  document.querySelector("#mensaje").innerHTML = ``;
}

//MostrarBotones
const mostrarBotones = async () => {
  document.querySelector("#eliminar").style.display = "block";
  document.querySelector("#confirmar").style.display = "block";
}


const validarAlmacenamiento = () => {
  if (ver.length > 0) {
    CarritoContenido();
    levantarGurdado();
    OcultarMensaje();
    mostrarBotones();
  } else {
    OcultarContenido();
    OcultarBotones();
    mostrarMensaje();
  }
}
validarAlmacenamiento();

/*-------------------------------------------------------------------------*/
//Checkout
/*-------------------------------------------------------------------------*/
document.querySelector("#finalizar").addEventListener("click", () => {
  alertify.notify('Gracias por la compra', 'success', 10)
  eliminarCarrito();
})


