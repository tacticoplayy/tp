document.addEventListener('DOMContentLoaded', () => {
    
    // TU LINK DEL EXCEL (CSV)
    const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQgImg92liKoPf_-2pBy02CdWMFnZMbh0pYXlrgPJYJUAljI5A8ANnvSJd5SzV2mmm8eegOorZuKwJV/pub?output=csv";

    const container = document.getElementById('contenedor-noticias');
    if (!container) return;

    fetch(SHEET_URL)
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split('\n').slice(1); 
            container.innerHTML = '';

            rows.forEach(row => {
                // Usamos un truco para leer mejor el CSV por si usas comas en el texto
                // Esto separa por comas SOLO si no estan entre comillas
                const columns = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

                if (columns && columns.length >= 2) {
                    // Limpiamos comillas que agrega el CSV
                    const clean = (text) => text ? text.replace(/^"|"$/g, '').trim() : '';

                    const titulo = clean(columns[0]);
                    const imagen = clean(columns[1]);
                    const categoria = clean(columns[2]) || 'TP';
                    const autor = clean(columns[3]) || 'Redacción TP';
                    const contenido = clean(columns[4]) || 'Sin contenido disponible.';

                    if (titulo) {
                        const card = document.createElement('article');
                        card.className = 'news-card';
                        
                        // En el botón "Leer más" ponemos un evento ONCLICK
                        // que llama a la función abrirNoticia con los datos
                        card.innerHTML = `
                            <img src="${imagen}" alt="${titulo}" class="news-img" onerror="this.src='https://via.placeholder.com/400x300'">
                            <div class="news-content">
                                <span style="color:#2ecc71; font-size:0.7rem; font-weight:800; text-transform:uppercase;">${categoria}</span>
                                <h4 style="margin:5px 0 10px 0;">${titulo}</h4>
                                <button class="btn-read-more" style="background:none; border:none; cursor:pointer; padding:0;" 
                                    onclick="abrirNoticia('${titulo}', '${imagen}', '${categoria}', '${autor}', \`${contenido}\`)">
                                    LEER NOTA COMPLETA
                                </button>
                            </div>
                        `;
                        container.prepend(card);
                    }
                }
            });
        })
        .catch(error => console.error('Error:', error));
});

// --- FUNCIONES PARA ABRIR Y CERRAR LA VENTANA ---

function abrirNoticia(titulo, imagen, categoria, autor, contenido) {
    document.getElementById('modal-img').src = imagen;
    document.getElementById('modal-tag').textContent = categoria;
    document.getElementById('modal-titulo').textContent = titulo;
    document.getElementById('modal-autor').textContent = "Por " + autor;
    
    // Convierte los <br> del Excel en saltos de línea reales
    document.getElementById('modal-texto').innerHTML = contenido.replace(/<br>/g, '<br>'); 
    
    document.getElementById('modal-noticia').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Evita que se mueva la pagina de fondo
}

function cerrarNoticia() {
    document.getElementById('modal-noticia').style.display = 'none';
    document.body.style.overflow = 'auto'; // Reactiva el scroll
}

// Cerrar si tocan fuera de la tarjeta
window.onclick = function(event) {
    const modal = document.getElementById('modal-noticia');
    if (event.target == modal) {
        cerrarNoticia();
    }
}
