let lista = [];
let acumulador = 0;
let ver = JSON.parse(localStorage.getItem('CARRITO'));
let acumula = JSON.parse(localStorage.getItem('TOTAL'));
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
        <a href="#" data-bs-toggle="modal" data-bs-target="#abrir_${itera.id}"><img src="./assets/images/${itera.imagen}" class="card-img-top" alt="./assets/images/${itera.imagen}"></a>
        <div class="card-body">
        <div class="card-texto">
          <h4 class="card-title nombre">${itera.nombre}</h4>
          <h5  class="card-title">$<p id="precio">${itera.precio}<p></h5>
          <p class="card-text">${itera.descripcion}</p>
        </div> 
            <button class="button cargar" data-id="${itera.id}" data-nombre="${itera.nombre}" data-precio="${itera.precio}">Agregar <i class="fa-solid fa-plus"></i> </button>
        </div>
        </div> 
        
        <div class="modal fade" tabindex="-1" id="abrir_${itera.id}">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 id="nombre" class="modal-title">${itera.nombre}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
            <div id="carouselExampleIndicators_${itera.id}" class="carousel slide" data-bs-ride="true">
                <div class="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators_${itera.id}" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators_${itera.id}" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators_${itera.id}" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div class="carousel-inner">
                    <div class="carousel-item active">
                    <img src="./assets/images/${itera.imagen}" class="d-block w-100" alt="...">
                    </div>
                    <div class="carousel-item">
                    <img src="./assets/images/${itera.imagen01}" class="d-block w-100" alt="...">
                    </div>
                    <div class="carousel-item">
                    <img src="./assets/images/${itera.imagen02}" class="d-block w-100" alt="...">
                    </div>
                </div>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-dark"  data-bs-slide="next" data-bs-target="#carouselExampleIndicators_${itera.id}">Siguiente</button>
              <button type="button" class="btn btn-dark" data-bs-target="#carouselExampleIndicators_${itera.id}" data-bs-slide="prev">Volver</button>
            </div>
          </div>
        </div>
      </div>`;
}

/*------------------------------------------------------------------------------------*/

//Carga temporal del localStorage
const cargarTemp = async () => {
  seleccionar = document.querySelectorAll(".cargar");
  for (let i = 0; i < seleccionar.length; i++) {
    seleccionar[i].addEventListener("click", () => {
      objetoProducto(i);
      document.querySelector("#total").innerHTML = `TOTAL : $${acumulador}</p>`;
      alertify.notify('Producto agregado al carrito','success',10);
      lista.push(productos);
      mostrarBotones();
      almacenar();
      OcultarMensaje();
      CarritoContenido();
    })
  }
}

//Lista de producto temporal
const objetoProducto = async (i) =>{
  productos = {
    id: JSON.parse(seleccionar[i].dataset.id),
    nombre: seleccionar[i].dataset.nombre,
    precio: JSON.parse(seleccionar[i].dataset.precio),
    cantidad: 1,
  };
  document.querySelector("#carrito").innerHTML += `<p>${productos.id}.${productos.nombre} $${productos.precio}</p>`; 
  acumulador = acumulador + productos.precio;
}

//Carga productos al localstorage
const almacenar = async () =>{
  localStorage.setItem("CARRITO", JSON.stringify(lista));
  localStorage.setItem("TOTAL", JSON.stringify(acumulador));
}


//Calcula el total
const total = async () => {
  for (let i of ver) {
    acumulador = acumulador + i.precio;
    document.querySelector("#total").innerHTML = `TOTAL : $${acumulador}</p>`;
  }
}

//Levanta localStorage
const levantarGurdado = async () => {
  ver.forEach(x => {
    document.querySelector("#carrito").innerHTML += `<p>  ${x.id}. ${x.nombre} $${x.precio}</p>`;
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
const mostrarMensaje = async () =>{
  document.querySelector("#mensaje").innerHTML = `El carrito está vacio,agregue un producto`;
}

//En caso que el carrito quede con productos
const CarritoContenido = async () =>{
  document.querySelector(".fa-cart-shopping").style.color="red";
} 

//Mostrar Carrito con localStorage
const mostrar = async () => {
  if (localStorage.length > 0) {
    CarritoContenido();
    levantarGurdado();
    total();
    OcultarMensaje();
  }else{
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

//Si el usuario elimina
document.querySelector("#eliminar").addEventListener("click", () => {
  localStorage.clear();
  lista = [];
  acumulador = 0;
  alertify.notify('carrito eliminado', 'success', 5);
  document.querySelector(".fa-cart-shopping").style.color="black";
  OcultarContenido();
  mostrarMensaje();
  mostrar();
});

//Ocultar botones
const OcultarContenido = async () => {
  document.querySelector("#carrito").innerHTML = ``;
  document.querySelector("#total").innerHTML = ``;
}

/*-------------------------------------------------------------------------*/
//Checkout
/*-------------------------------------------------------------------------*/
const mostrarModal = async () => {
  ver.forEach(a => {
    document.querySelector("#VerProductos").innerHTML += `<p>  ${a.id}. ${a.nombre} $${a.precio}</p>`;
  });
}

document.querySelector("#confirmar").addEventListener("click", () => {
    document.querySelector("#confirmar").innerHTML = `
    <div class="modal fade" id="checkout" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Resumen</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="VerProductos">
          <div class="container" id="VerProductos">
              ${mostrarModal()}
          </div>    
            </div>
            <h3 class="container">TOTAL : $${acumula} </h3>
          <div class="modal-footer">
            <button type="button" class="btn btn-dark" id="pagar">Pagar</button>
            ${pago()}
          </div> 
        </div> 
    </div> 
    </div> `;
});

const pago = async () => {
  document.querySelector("#pagar").addEventListener("click", () => {
    ver.forEach(x => {
      location.href = `https://api.whatsapp.com/send?phone=5492346338767&text=Hola,este%20es%20mi%20pedido%20${x.id}.${x.nombre}%20${x.precio}`;
    });
  });
}
