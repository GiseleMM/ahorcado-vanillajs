console.log("Ahorcado");
//creo teclado
//pido palabra 
// enmazcaro palabra
//creo imagen
const LETRAS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
    'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];//27
const divTeclado = document.getElementById("teclado");
const divPalabra = document.getElementById("palabra");
const img = document.getElementById("imagen");
const buttonNuevaPalabra = document.getElementById("nuevaPalabra");
const h3intentos=document.getElementById("intentos");
const mascara = "🍀​";
let intentos = 0;
let indicePalabra = 0;
function cambiarIntentos(value)
{
    h3intentos.innerHTML=value;
}

buttonNuevaPalabra.addEventListener("click", (evento) => {
    nuevaPalabra();
    desbloquearTeclas();
    enmascarar(palabra);//ya se cambio en nueva palabra
    intentos=0;
    cambiarIntentos(`intentos ${5-intentos}`)
    cambiarImagen(intentos);
})
divTeclado.addEventListener("click", (evento) => {
    let target = evento.target;
    if (target && target.matches("button")) {


        console.log(target.dataset.letra);
        let letra = target.dataset.letra;
        if (desenmascarar(letra)) {

            if (seDescubrioPalabra()) {
                console.log("SE DESCUBRIO");
            }

        } else {
            intentos++;
            cambiarIntentos(`Intentos: ${5-intentos}`);
            cambiarImagen(intentos);
            if (intentos == 5) {
                bloquearTeclas();
            }

        }


    }
});
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

function cambiarImagen(indice) {
    if (indice == 0) {
        img.setAttribute("src", `asset/ahorcado.gif`);

    } else {
        img.setAttribute("src", `asset/ahorcado${indice}.png`);

    }
}
function seDescubrioPalabra() {
    console.log("palabra", palabra);
    let retorno = true;

    const coleccionButtons = divPalabra.querySelectorAll(`button[data-indice]`);
    console.log(coleccionButtons);
    for (let index = 0; index < coleccionButtons.length; index++) {
        const element = coleccionButtons[index];
        console.log(element);
        if (element.textContent == mascara) {
            retorno = false;
            break;
        }

    }
    return retorno;
}
function desenmascarar(letra) {
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
crearTeclado(LETRAS);
let palabras = [];
let palabra = "";
let indice = 0;

solicitarPalabrasApi();//asincrona

function crearTeclado(array) {
    const fragmentoButtons = document.createDocumentFragment();
    for (let index = 0; index < array.length; index++) {
        const buton = document.createElement("BUTTON");
        const element = array[index];
        buton.innerHTML = element;
        buton.dataset.letra = element;
        console.log(buton.dataset.letra);
        buton.classList.add("btn", "btn-outline-secondary");
        fragmentoButtons.append(buton);

    }
    divTeclado.append(fragmentoButtons)

}
function solicitarPalabrasApi() {
    let url = "https://clientes.api.greenborn.com.ar/public-random-word?c=99";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            palabras = data.map(normalizar);//quito acento

            palabra = palabras[0];// siempre q se solicita se comienza con la primera
            enmascarar(palabra);

        });

}
function enmascarar(palabra) {

    const frag = document.createDocumentFragment();
    for (let index = 0; index < palabra.length; index++) {
        const button = document.createElement("BUTTON");
        button.classList.add("btn", "btn-outline-secondary")
        button.innerHTML = mascara;
        button.dataset.indice = index;
        frag.append(button);
    }
    
vaciarContenedor(divPalabra);
    divPalabra.append(frag);

}
function vaciarContenedor(padre)
{while (padre.firstChild){
    padre.removeChild(padre.firstChild);
  };
}
function normalizar(palabra) {
    return palabra.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}
function nuevaPalabra() {

    if (indice < 99)// traigo de 99 palabras
    {

        palabra = palabras[indicePalabra + 1];
        indicePalabra++;
        console.log(palabra, indicePalabra);
    } else {
        //indice de palabra lo reseteo al traer 99 masde la api
        console.log("SOLICITANDO API...")
        solicitarPalabrasApi();
    }
}

