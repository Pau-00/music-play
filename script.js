// 1. Datos de las canciones (Limpios de la propiedad "corazones" para que sean fijos de CSS)
const canciones = [
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

let indiceActual = 0;
let estaReproduciendo = false;

// 2. Cargar el efecto de sonido de los botones
const sonidoBoton = new Audio("assets/click.mp3");

// Elementos del HTML
const tarjetaReproductor = document.getElementById("playerCard");
const tituloCancion = document.getElementById("songTitle");
const imagenCaratula = document.getElementById("albumArt");
const reproductorAudio = document.getElementById("audioPlayer");
const iconoSlider = document.getElementById("sliderIcon");

const btnPlay = document.getElementById("btnPlay");
const playIcon = document.getElementById("playIcon"); // Imagen SVG interna del botón Play
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("cmdNext");

// Nuevos elementos para el menú desplegable trasero
const btnMenu = document.getElementById("btnMenu");
const menuSlider = document.getElementById("menuSlider");

// Función para reproducir el efecto de sonido de interacción
function reproducirEfectoBoton() {
    sonidoBoton.currentTime = 0; // Reinicia el sonido por si se pulsa muy rápido
    sonidoBoton.play().catch(error => console.log("Efecto de sonido bloqueado temporalmente por el navegador."));
}

// Función para cambiar el contenido de la canción y la estética de la tarjeta
function cargarCancion(index) {
    const cancion = canciones[index];
    
    tituloCancion.textContent = cancion.titulo;
    imagenCaratula.src = cancion.imagen;
    reproductorAudio.src = cancion.archivo;
    tarjetaReproductor.className = "player-container " + cancion.temaCss;
    
    // Cambia el icono del slider (hoja, cigarro...), los corazones se quedan fijos por CSS
    if (iconoSlider) iconoSlider.textContent = cancion.iconoSlider; 
}

// Control de Play / Pausa cambiando las imágenes SVG
function controlarPlay() {
    reproducirEfectoBoton();

    if (estaReproduciendo) {
        reproductorAudio.pause();
        if (playIcon) playIcon.src = "assets/play.svg"; // Cambia al SVG de Play
        estaReproduciendo = false;
    } else {
        reproductorAudio.play()
            .then(() => {
                if (playIcon) playIcon.src = "assets/pause.svg"; // Cambia al SVG de Pausa
                estaReproduciendo = true;
            })
            .catch(() => console.log("Interactúa con la página para poder reproducir audio."));
    }
}

// Navegación: Canción Siguiente
function siguienteCancion() {
    reproducirEfectoBoton();
    
    indiceActual = (indiceActual + 1) % canciones.length; 
    cargarCancion(indiceActual);
    
    reproductorAudio.play()
        .then(() => { 
            if (playIcon) playIcon.src = "assets/pause.svg"; 
            estaReproduciendo = true; 
        })
        .catch(() => {});
}

// Navegación: Canción Anterior
function anteriorCancion() {
    reproducirEfectoBoton();
    
    indiceActual = (indiceActual - 1 + canciones.length) % canciones.length;
    cargarCancion(indiceActual);
    
    reproductorAudio.play()
        .then(() => { 
            if (playIcon) playIcon.src = "assets/pause.svg"; 
            estaReproduciendo = true; 
        })
        .catch(() => {});
}

// Eventos de los botones de la interfaz
btnPlay.addEventListener("click", controlarPlay);
btnNext.addEventListener("click", siguienteCancion);
btnPrev.addEventListener("click", anteriorCancion);

// Evento para abrir/cerrar el menú trasero al pulsar en el texto SVG
if (btnMenu && menuSlider) {
    btnMenu.addEventListener("click", (e) => {
        e.preventDefault(); // Evita el comportamiento de salto del enlace <a>
        reproducirEfectoBoton(); // Mantiene tu feedback de audio
        
        // Añade o quita la clase que activa la animación CSS
        menuSlider.classList.toggle("active");
    });
}

// Inicializar el reproductor con la primera canción de la lista al cargar la página
cargarCancion(indiceActual);