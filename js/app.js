const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");
let cantidad = 0;
let precio = 0;

let articulosCarrito =
    JSON.parse(localStorage.getItem("articulosCarrito")) || [];

const card = document.querySelector("#cards");
console.log(card);

const pedirEntradas = async () => {
    const res = await fetch("./js/data.json");
    const data = await res.json();
    data.forEach((entrada) => {
        card.innerHTML += `
        
                <div class="card" style="width: 18rem">
                <img src="${entrada.img}" class="card-img-top" alt="..." />
                <div class="card-body">
                <h5 class="card-title">${entrada.nombre}</h5>
                <p class="card-text">Attitude en Niceto Club</p>
                <h6 class="precio" type="number">$<span type="number">${entrada.precio}</span></h6>
                </div>
                <a href="#" class="btn btn-primary agregar-carrito" id="${entrada.id}">Añadir al carrito</a>
                </div>            
                `;
        card.append();
    });
};

pedirEntradas();

cargarEventListeners();

function cargarEventListeners() {
    listaCursos.addEventListener("click", agregarCurso);
    carrito.addEventListener("click", eliminarCurso);
}

function agregarCurso(e) {
    e.preventDefault();

    if (e.target.classList.contains("agregar-carrito")) {
        const cursoSeleccionado = e.target.parentElement;
        leerDatosCurso(cursoSeleccionado);
        Toastify({
            text: "Añadido al carrito",
            duration: 2500,
            style: {
                background: "linear-gradient(to right, white, yellow)",
                color: "black",
            },
        }).showToast();
    }
}

function eliminarCurso(e) {
    e.preventDefault();
    localStorage.setItem("articulosCarrito", JSON.stringify(articulosCarrito));
    if (e.target.classList.contains("borrar-curso")) {
        const cursoID = e.target.getAttribute("id");
        articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoID);
        carritoHTML();
    }
}

function leerDatosCurso(curso) {
    const infoCurso = {
        imagen: curso.querySelector("img").src,
        titulo: curso.querySelector(".card-title").innerText,
        precio: curso.querySelector("span").innerText,
        id: curso.querySelector("a").getAttribute("id"),
        cantidad: 1,
    };

    const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);
    if (existe) {
        const cursos = articulosCarrito.map((curso) => {
            curso.id === infoCurso.id ? curso.cantidad++ : "";
            return curso;
        });
        articulosCarrito = [...cursos];
    } else {
        articulosCarrito = [...articulosCarrito, infoCurso];
    }
    carritoHTML();
}

function carritoHTML() {
    localStorage.setItem("articulosCarrito", JSON.stringify(articulosCarrito));
    limpiarHTML();
    articulosCarrito.forEach((curso) => {
        const row = document.createElement("tr");
        let subtotal = curso.precio * curso.cantidad;
        console.log(row);
        row.innerHTML = `<td>${curso.titulo}</td>
        <td>${curso.precio}</td>
        <td>${curso.cantidad}</td>
        <td>${subtotal}</td>
        <td> <a href="" class="borrar-curso" id="${curso.id}">X</a> </td>`;
        contenedorCarrito.appendChild(row);
    });
}

localStorage !== null ? carritoHTML() : row.innerHTML;

vaciarCarritoBtn.addEventListener("click", () => {
    swal({
        title: "Seguro que desea vaciar su carrito?",
        text: "Si continúa perderá la selección de entradas hasta el momento",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            articulosCarrito = [];
            limpiarHTML();
            swal("Su carrito está vacío", {
                icon: "success",
            });
        } else {
            swal("Puede continuar su compra");
        }
    });
});

function limpiarHTML() {
    contenedorCarrito.innerHTML = "";
}