// 1. Datos de las canciones (con iconos de slider y corazones personalizados)
const canciones = [
    {
        titulo: "Crazy Rap - Afroman",
        imagen: "assets/imagen1.jpg",
        temaCss: "theme-song1",
        archivo: "assets/cancion1.mp3",
        iconoSlider: "🚬",
        corazones: "<span>💚</span><span>💚</span><span>💚</span>"
    },
    {
        titulo: "Mis Amigos - Los rivera Destino",
        imagen: "assets/imagen2.jpg",
        temaCss: "theme-song2",
        archivo: "assets/cancion2.mp3",
        iconoSlider: "🚬", // Cambia la hoja por el cigarro
        corazones: "<span>💛</span><span>💛</span><span>💛</span>" // Corazones amarillos/rubios a juego
    },
    {
        titulo: "Dios me tiró un ducados rubio - Mala Gestión",
        imagen: "assets/imagen3.jpg",
        temaCss: "theme-song3",
        archivo: "assets/cancion3.mp3",
        iconoSlider: "🚬",
        corazones: "<span>🤍</span><span>🤍</span><span>🤍</span>"
    }
];

let indiceActual = 0;
let estaReproduciendo = false;

// 2. Cargar el efecto de sonido de los botones
// (Asegúrate de que el nombre coincida exactamente con tu archivo en assets)
const sonidoBoton = new Audio("assets/click.mp3");

// Elementos del HTML
const tarjetaReproductor = document.getElementById("playerCard");
const tituloCancion = document.getElementById("songTitle");
const imagenCaratula = document.getElementById("albumArt");
const reproductorAudio = document.getElementById("audioPlayer");
const iconoSlider = document.getElementById("sliderIcon");
const contenedorCorazones = document.getElementById("heartContainer");

const btnPlay = document.getElementById("btnPlay");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("cmdNext");

// Función para reproducir el efecto de sonido del botón
function reproducirEfectoBoton() {
    sonidoBoton.currentTime = 0; // Reinicia el sonido por si se pulsa muy rápido seguido
    sonidoBoton.play().catch(error => console.log("Efecto de sonido bloqueado temporalmente por el navegador."));
}

// Función mágica para cambiar todo el contenido y la estética
function cargarCancion(index) {
    const cancion = canciones[index];
    
    tituloCancion.textContent = cancion.titulo;
    imagenCaratula.src = cancion.imagen;
    reproductorAudio.src = cancion.archivo;
    tarjetaReproductor.className = "player-container " + cancion.temaCss;
    
    // Aquí cambiamos los iconos dinámicamente
    if (iconoSlider) iconoSlider.textContent = cancion.iconoSlider; 
    if (contenedorCorazones) contenedorCorazones.innerHTML = cancion.corazones;
}

// Control de Play / Pausa
function controlarPlay() {
    if (estaReproduciendo) {
        reproductorAudio.pause();
        btnPlay.textContent = "▶"; 
        estaReproduciendo = false;
    } else {
        reproductorAudio.play()
            .then(() => {
                btnPlay.textContent = "⏸";
                estaReproduciendo = true;
            })
            .catch(() => console.log("Interactúa con la página para reproducir."));
    }
}

// Botones de navegación
function siguienteCancion() {
    reproducirEfectoBoton(); // Sonido al pulsar
    
    indiceActual = (indiceActual + 1) % canciones.length; 
    cargarCancion(indiceActual);
    reproductorAudio.play().then(() => { btnPlay.textContent = "⏸"; estaReproduciendo = true; }).catch(() => {});
}

function anteriorCancion() {
    reproducirEfectoBoton(); // Sonido al pulsar
    
    indiceActual = (indiceActual - 1 + canciones.length) % canciones.length;
    cargarCancion(indiceActual);
    reproductorAudio.play().then(() => { btnPlay.textContent = "⏸"; estaReproduciendo = true; }).catch(() => {});
}

function cargarCancion(index) {
    const cancion = canciones[index];
    
    tituloCancion.textContent = cancion.titulo;
    imagenCaratula.src = cancion.imagen;
    reproductorAudio.src = cancion.archivo;
    tarjetaReproductor.className = "player-container " + cancion.temaCss;
    
    // Cambia el icono del slider (hoja, cigarro...), pero deja los corazones tranquilos
    if (iconoSlider) iconoSlider.textContent = cancion.iconoSlider; 
}


// Eventos de los botones
btnPlay.addEventListener("click", controlarPlay);
btnNext.addEventListener("click", siguienteCancion);
btnPrev.addEventListener("click", anteriorCancion);

// Arrancar el reproductor con la primera canción
cargarCancion(indiceActual);