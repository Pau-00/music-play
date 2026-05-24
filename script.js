// 1. Definición de las dos Listas de Música Independientes
const listaPorrito = [
    {
        titulo: "Crazy Rap - Afroman",
        imagen: "assets/imagen1.jpg",
        temaCss: "theme-song1",
        archivo: "assets/cancion1.mp3",
        iconoSlider: "🚬"
    },
    {
        titulo: "Mis Amigos - Los rivera Destino",
        imagen: "assets/imagen2.jpg",
        temaCss: "theme-song2",
        archivo: "assets/cancion2.mp3",
        iconoSlider: "🚬"
    },
    {
        titulo: "Dios me tiró un ducados rubio - Mala Gestión",
        imagen: "assets/imagen3.jpg",
        temaCss: "theme-song3",
        archivo: "assets/cancion3.mp3",
        iconoSlider: "🚬"
    }
];

const listaRave = [
    {
        titulo: "Sprint - Mr. Polska",
        imagen: "assets/animacion-rave1.gif", 
        temaCss: "theme-rave1",
        archivo: "assets/rave1.mp3",
        iconoSlider: "⚡"
    },
    {
        titulo: "Слэм бит - Hotzzen",
        imagen: "assets/animacion-rave2.gif",
        temaCss: "theme-rave2",
        archivo: "assets/rave2.mp3",
        iconoSlider: "⚡"
    },
    {
        titulo: "It's Crazy It's Party - Käärijä",
        imagen: "assets/animacion-rave3.gif",
        temaCss: "theme-rave3",
        archivo: "assets/rave3.mp3",
        iconoSlider: "⚡"
    }
];

// Estado del reproductor apuntando por defecto a la lista chill
let cancionesActivas = listaPorrito;
let indiceActual = 0;
let estaReproduciendo = false;
const tiempoObjetivo = 30; // Tiempo en segundos para que la barra llegue al 100%

// 2. Efecto de sonido del sistema
const sonidoBoton = new Audio("assets/click.mp3");

// Selectores del DOM
const tarjetaReproductor = document.getElementById("playerCard");
const tituloCancion = document.getElementById("songTitle");
const imagenCaratula = document.getElementById("albumArt");
const reproductorAudio = document.getElementById("audioPlayer");
const iconoSlider = document.getElementById("sliderIcon");
const progressFill = document.getElementById("progressFill"); // Nuevo: Relleno verde de la barra

const btnPlay = document.getElementById("btnPlay");
const playIcon = document.getElementById("playIcon");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("cmdNext");

const btnMenu = document.getElementById("btnMenu");
const menuSlider = document.getElementById("menuSlider");
const opcionesLista = document.querySelectorAll(".playlist-option");

function reproducirEfectoBoton() {
    sonidoBoton.currentTime = 0;
    sonidoBoton.play().catch(() => {});
}

// Resetea la barra de progreso visualmente a 0%
function resetearBarraProgreso() {
    if (progressFill) progressFill.style.width = "0%";
    if (iconoSlider) iconoSlider.style.left = "0%";
}

// Carga la canción basada en la lista activa global
function cargarCancion(index) {
    const cancion = cancionesActivas[index];
    
    tituloCancion.textContent = cancion.titulo;
    imagenCaratula.src = cancion.imagen;
    reproductorAudio.src = cancion.archivo;
    tarjetaReproductor.className = "player-container " + cancion.temaCss;
    
    if (iconoSlider) iconoSlider.textContent = cancion.iconoSlider; 
    
    // Cada vez que cambia la canción, vaciamos la barra
    resetearBarraProgreso();
}

function controlarPlay() {
    reproducirEfectoBoton();

    if (estaReproduciendo) {
        reproductorAudio.pause();
        if (playIcon) playIcon.src = "assets/play.svg";
        estaReproduciendo = false;
    } else {
        reproductorAudio.play()
            .then(() => {
                if (playIcon) playIcon.src = "assets/pause.svg";
                estaReproduciendo = true;
            })
            .catch(() => console.log("Interacción requerida para reproducir audio."));
    }
}

function siguienteCancion() {
    reproducirEfectoBoton();
    indiceActual = (indiceActual + 1) % cancionesActivas.length; 
    cargarCancion(indiceActual);
    ejecutarAutoPlaySiProceda();
}

function anteriorCancion() {
    reproducirEfectoBoton();
    indiceActual = (indiceActual - 1 + cancionesActivas.length) % cancionesActivas.length;
    cargarCancion(indiceActual);
    ejecutarAutoPlaySiProceda();
}

function ejecutarAutoPlaySiProceda() {
    if (estaReproduciendo) {
        reproductorAudio.play()
            .then(() => { if (playIcon) playIcon.src = "assets/pause.svg"; })
            .catch(() => {});
    }
}

// Evento para actualizar la barra en un bucle infinito cada 30 segundos
reproductorAudio.addEventListener("timeupdate", () => {
    const tiempoActual = reproductorAudio.currentTime;
    
    /* El truco del bucle: Usamos el operador de módulo (%) para que al llegar 
       a 30, el "tiempoReiniciado" vuelva a empezar desde 0 automáticamente.
       (Ej: 31 segundos pasará a ser 1 segundo, 62 segundos serán 2, etc.)
    */
    const tiempoReiniciado = tiempoActual % tiempoObjetivo;
    
    // Calculamos el porcentaje en base a ese tiempo reiniciado
    const porcentaje = (tiempoReiniciado / tiempoObjetivo) * 100;
    
    // Movemos el relleno verde y el emoji al mismo tiempo
    if (progressFill) progressFill.style.width = `${porcentaje}%`;
    if (iconoSlider) iconoSlider.style.left = `${porcentaje}%`;
});

// Controladores de eventos de navegación
btnPlay.addEventListener("click", controlarPlay);
btnNext.addEventListener("click", siguienteCancion);
btnPrev.addEventListener("click", anteriorCancion);

// Despliegue del menú lateral
if (btnMenu && menuSlider) {
    btnMenu.addEventListener("click", (e) => {
        e.preventDefault();
        reproducirEfectoBoton();
        menuSlider.classList.toggle("active");
    });
}

// Lógica de cambio dinámico de listas de reproducción
opcionesLista.forEach(opcion => {
    opcion.addEventListener("click", (e) => {
        reproducirEfectoBoton();
        
        // Evita recargar si pulsamos la que ya está activa
        if (opcion.classList.contains("active")) return;

        // Cambiar la clase activa visual en el menú lateral
        document.querySelector(".playlist-option.active").classList.remove("active");
        opcion.classList.add("active");

        // Cambiar el puntero del array de canciones según el atributo 'data-list'
        const tipoLista = opcion.getAttribute("data-list");
        if (tipoLista === "rave") {
            cancionesActivas = listaRave;
        } else {
            cancionesActivas = listaPorrito;
        }

        // Resetear el reproductor al primer tema de la nueva lista cargada
        indiceActual = 0;
        cargarCancion(indiceActual);

        // Si estaba sonando música, arranca automáticamente el nuevo tema de la lista
        if (estaReproduciendo) {
            reproductorAudio.play().catch(() => {});
        }
    });
});

// Inicialización de la app
cargarCancion(indiceActual);