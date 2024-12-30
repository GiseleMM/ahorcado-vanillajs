import { words } from "./auxpalabras.js";

console.log("Ahorcado");

const LETRAS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "ñ",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
]; //27
const divTeclado = document.getElementById("teclado");
const divPalabra = document.getElementById("palabra");
const img = document.getElementById("imagen");
const buttonNuevaPalabra = document.getElementById("nuevaPalabra");
const h3intentos = document.getElementById("intentos");
const MASCARA = "💀​​";
const mensaje = document.getElementById("mensaje"); //d-none
const MAX_INTENTOS = 5;
let intentos = 0;
let indicePalabra = 0;
let palabras = [];
let palabra = "";

crearTeclado(LETRAS);
solicitarPalabrasApi();
//evento nueva palabra
buttonNuevaPalabra.addEventListener("click", (evento) => {
  nextPalabra();
});


//evento cuando clickea una tecla
divTeclado.addEventListener("click", (evento) => {
  let target = evento.target;
  //TECLADO BUTTON
  if (target && target.matches("button")) {
    console.log(target.dataset.letra);

    let letra = target.dataset.letra;

    comprobandoTecla(letra);
  }
});

function comprobandoTecla(letra)
{
  if (desenmascarar(letra)) {
    //si la letra esta le quita la mascara

    if (seDescubrioPalabra()) {
      console.log("SE DESCUBRIO");
      feclicitar().then(() => nextPalabra());
    }
  } else {
    // si no esta la letra pierdo un intento

    cambiarIntentos(intentos + 1);
    cambiarImagen(intentos);
    if (intentos == MAX_INTENTOS) {
      bloquearTeclas();
    }
  }

}

// cambia numeros de intentos en pantalla
function cambiarIntentos(numeros) {
  intentos = numeros;
  cambiarIntentosMensaje(`Intentos ${MAX_INTENTOS - intentos}`);
}

function cambiarIntentosMensaje(value) {
  h3intentos.innerHTML = value;
}

// pide una palabra desbloque teclas  esmascara la palabra nueva resetea intento
function nextPalabra() {
  console.log("next palabra");
  nuevaPalabra();
  desbloquearTeclas();
  enmascarar(palabra); //ya se cambio en nueva palabra
  cambiarIntentos(0); //cambia el valor de intentos y la pantalla
  cambiarImagen(intentos);
}

//mostrar mensaje de exito y lo oculta despues de 3 segundos retornando promesa
function feclicitar() {
  mensaje.innerHTML = "<h5>Bravo 👏​👏​👍​ </h5>";
  mensaje.classList.remove("d-none");
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      ocultarFelicitacion();
      return resolve("ok");
    }, 3000);
  });
}
//ocultar mensaje de exito
function ocultarFelicitacion() {
  mensaje.innerHTML = "";
  mensaje.classList.add("d-none");
}

function bloquearTeclas() {
  const coleccionTeclas = divTeclado.querySelectorAll(`button[data-letra]`);
  for (let index = 0; index < coleccionTeclas.length; index++) {
    const element = coleccionTeclas[index];
    element.setAttribute("disabled", true);
  }
}
function desbloquearTeclas() {
  const coleccionTeclas = divTeclado.querySelectorAll(`button[data-letra]`);
  for (let index = 0; index < coleccionTeclas.length; index++) {
    const element = coleccionTeclas[index];
    element.removeAttribute("disabled");
  }
}
// cambia img  segun los intentos fallados
function cambiarImagen(indice) {
  if (indice == 0) {
    img.setAttribute("src", `asset/ahorcado.gif`);
  } else {
    img.setAttribute("src", `asset/ahorcado${indice}.png`);
  }
}

//verifica en un inetnto si se descubrio completa la palabra
function seDescubrioPalabra() {
  console.log("palabra", palabra);
  let retorno = true;

  const coleccionButtons = divPalabra.querySelectorAll(`button[data-indice]`);
  console.log(coleccionButtons);
  for (let index = 0; index < coleccionButtons.length; index++) {
    const element = coleccionButtons[index];
    console.log(element);
    if (element.textContent == MASCARA) {
      retorno = false;
      break;
    }
  }
  return retorno;
}

function desenmascarar(letra) {
  // si esta le quita mascara y retorna true si no esta retorna false
  let esta = false;
  if (palabra.includes(letra)) {
    esta = true;
    for (let index = 0; index < palabra.length; index++) {
      const element = palabra[index];
      if (element.trim().toLowerCase() == letra.trim().toLowerCase()) {
        let button = divPalabra.querySelector(`button[data-indice="${index}"]`);
        button.innerHTML = element;
      }
    }
  }
  return esta;
}

// crea botones con todas las teclas
function crearTeclado(array) {
  const fragmentoButtons = document.createDocumentFragment();
  for (let index = 0; index < array.length; index++) {
    const button = document.createElement("BUTTON");
    const element = array[index];
    button.innerHTML = element;
    button.dataset.letra = element;
    console.log(button.dataset.letra);
    button.classList.add("btn", "btn-outline-secondary");
    fragmentoButtons.append(button);
  }
  divTeclado.append(fragmentoButtons);
}
// solicita array de palabra y los asigna al array palabras si no funciona usa el archivo aux
function solicitarPalabrasApi() {
  let url = "https://clientes.api.greenborn.com.ar/public-random-word?c=99";
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      palabras = data.map(normalizar); //quito acento

      palabra = palabras[0]; // siempre q se solicita se comienza con la primera
      enmascarar(palabra);
    })
    .catch((error) => {
      console.log(error);
      palabras = words.map(normalizar);
      palabra = palabras[0];
      enmascarar(palabra);
    });
}
//la palabra del indice la oculta con una mascara y crea dataset con el indice de cada letra, limpia el contenderos y agrega ahi la palabra enmascarada
function enmascarar(palabra) {
  vaciarContenedor(divPalabra);
  const frag = document.createDocumentFragment();
  for (let index = 0; index < palabra.length; index++) {
    const button = document.createElement("BUTTON");
    button.classList.add("btn", "btn-outline-secondary");
    button.innerHTML = MASCARA;
    button.dataset.indice = index;
    frag.append(button);
  }

  divPalabra.append(frag);
}
//elimina todos los hijo de un contenedor
function vaciarContenedor(padre) {
  while (padre.firstChild) {
    padre.removeChild(padre.firstChild);
  }
}
//quita los acentos
function normalizar(palabra) {
  return palabra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
//pasa de palabra a la siguiente del array dependiendo de la variable indicePalabra, si no hay mas vuelve a solicitar a API
function nuevaPalabra() {
  if (indicePalabra < palabras.length) {
    // traigo de 99 palabras
    palabra = palabras[indicePalabra + 1];
    indicePalabra++;
    console.log(palabra, indicePalabra);
  } else {
    //indice de palabra lo reseteo al traer 99 masde la api
    console.log("SOLICITANDO API...");
    solicitarPalabrasApi();
  }
}
