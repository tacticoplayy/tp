document.addEventListener('DOMContentLoaded', () => {
    
    // TU LINK DEL EXCEL
    const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQgImg92liKoPf_-2pBy02CdWMFnZMbh0pYXlrgPJYJUAljI5A8ANnvSJd5SzV2mmm8eegOorZuKwJV/pub?output=csv";

    const container = document.getElementById('contenedor-noticias');
    if (!container) return;

    fetch(SHEET_URL)
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split('\n').slice(1); 
            container.innerHTML = ''; // Limpiamos (chau cuadro rojo)

            rows.forEach(row => {
                // Truco para leer columnas respetando comillas
                const columns = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

                if (columns && columns.length >= 2) {
                    const clean = (text) => text ? text.replace(/^"|"$/g, '').trim() : '';

                    const titulo = clean(columns[0]);
                    const imagen = clean(columns[1]);
                    const categoria = clean(columns[2]) || 'TP';
                    // Si no hay autor en la col 4, pone "Redacción"
                    const autor = columns[3] ? clean(columns[3]) : 'Redacción TP';
                    // Si no hay contenido en la col 5, pone el título repetido
                    const contenido = columns[4] ? clean(columns[4]) : '...';

                    if (titulo && titulo.length > 2) {
                        const card = document.createElement('article');
                        card.className = 'news-card';
                        
                        // Al hacer click, llama a abrirNoticia()
                        card.innerHTML = `
                            <img src="${imagen}" alt="${titulo}" class="news-img" onerror="this.src='https://via.placeholder.com/400x300'">
                            <div class="news-content">
                                <span style="color:#2ecc71; font-size:0.7rem; font-weight:800; text-transform:uppercase;">${categoria}</span>
                                <h4 title="${titulo}">${titulo}</h4>
                                <button class="btn-read-more" style="background:none; border:none; cursor:pointer; padding:0; text-align:left;" 
                                    onclick="abrirNoticia('${titulo.replace(/'/g, "\\'")}', '${imagen}', '${categoria}', '${autor}', \`${contenido.replace(/`/g, "\\`")}\`)">
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

// --- FUNCIONES DEL POP-UP ---
function abrirNoticia(titulo, imagen, categoria, autor, contenido) {
    const modal = document.getElementById('modal-noticia');
    if(!modal) return; // Si no pusiste el HTML del modal, no hace nada

    document.getElementById('modal-img').src = imagen;
    document.getElementById('modal-tag').textContent = categoria;
    document.getElementById('modal-titulo').textContent = titulo;
    document.getElementById('modal-autor').textContent = "Por " + autor;
    // Convierte los <br> del Excel en saltos de línea
    document.getElementById('modal-texto').innerHTML = contenido.replace(/<br>/g, '<br>'); 
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
}

function cerrarNoticia() {
    document.getElementById('modal-noticia').style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
    const modal = document.getElementById('modal-noticia');
    if (event.target == modal) cerrarNoticia();
}
