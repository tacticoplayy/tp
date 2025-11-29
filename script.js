document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. LÓGICA DEL MENÚ MÓVIL (CORREGIDO)
    // ==========================================
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            const isHidden = window.getComputedStyle(nav).display === 'none';
            if (isHidden) {
                // Estilos para abrir el menú en celular
                nav.style.display = 'block';
                nav.style.position = 'absolute';
                nav.style.top = '60px';
                nav.style.left = '0';
                nav.style.width = '100%';
                nav.style.background = '#0D1A12';
                nav.style.padding = '20px';
                nav.style.borderBottom = '1px solid #2ecc71';
                nav.style.zIndex = '1001';
                nav.style.boxShadow = '0 10px 20px rgba(0,0,0,0.5)';
                
                const ul = nav.querySelector('ul');
                ul.style.flexDirection = 'column';
                ul.style.gap = '20px';
                ul.style.textAlign = 'center';
            } else {
                nav.style.display = ''; // Reset al CSS original
                nav.removeAttribute('style'); 
            }
        });
    }

    // ==========================================
    // 2. LÓGICA DE EXCEL (CARGA DE NOTICIAS)
    // ==========================================
    const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQgImg92liKoPf_-2pBy02CdWMFnZMbh0pYXlrgPJYJUAljI5A8ANnvSJd5SzV2mmm8eegOorZuKwJV/pub?output=csv";
    const container = document.getElementById('contenedor-noticias');

    if (container) {
        fetch(SHEET_URL)
            .then(response => response.text())
            .then(csvText => {
                const rows = csvText.split('\n').slice(1); 
                container.innerHTML = ''; // Borra el spinner de carga

                rows.forEach(row => {
                    // Regex mejorado para leer CSV respetando comillas
                    const columns = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

                    if (columns && columns.length >= 2) {
                        // Función de limpieza de texto
                        const clean = (text) => text ? text.replace(/^"|"$/g, '').trim() : '';

                        const titulo = clean(columns[0]);
                        const imagen = clean(columns[1]);
                        const categoria = clean(columns[2]) || 'TP';
                        const autor = columns[3] ? clean(columns[3]) : 'Redacción';
                        const contenido = columns[4] ? clean(columns[4]) : '...';

                        if (titulo && titulo.length > 2) {
                            const card = document.createElement('article');
                            card.className = 'news-card';
                            
                            // Creamos un objeto seguro con los datos para no usar strings en el onclick
                            // Esto evita que las comillas " o ' rompan el sitio.
                            const newsData = JSON.stringify({ titulo, imagen, categoria, autor, contenido })
                                .replace(/"/g, '&quot;'); 

                            card.innerHTML = `
                                <img src="${imagen}" alt="${titulo}" class="news-img" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=Sin+Imagen'">
                                <div class="news-content">
                                    <span style="color:#2ecc71; font-size:0.7rem; font-weight:800; text-transform:uppercase;">${categoria}</span>
                                    <h4 title="${titulo}">${titulo}</h4>
                                    
                                    <button class="btn-read-more" 
                                        data-news="${newsData}"
                                        onclick="abrirNoticiaSegura(this)"
                                        style="background:none; border:none; cursor:pointer; padding:0; color:#2ecc71; font-weight:bold; font-size:0.8rem; text-transform:uppercase;">
                                        LEER NOTA COMPLETA
                                    </button>
                                </div>
                            `;
                            container.prepend(card);
                        }
                    }
                });
            })
            .catch(error => {
                console.error('Error:', error);
                container.innerHTML = '<p style="text-align:center; color:#e74c3c;">Error cargando noticias.</p>';
            });
    }
});

// ==========================================
// 3. LÓGICA DEL POP-UP (NUEVA VERSIÓN SEGURA)
// ==========================================
function abrirNoticiaSegura(btn) {
    // Leemos los datos del atributo data-news (mucho más seguro)
    const data = JSON.parse(btn.getAttribute('data-news').replace(/&quot;/g, '"'));
    
    const modal = document.getElementById('modal-noticia');
    if(modal) {
        document.getElementById('modal-img').src = data.imagen;
        document.getElementById('modal-tag').textContent = data.categoria;
        document.getElementById('modal-titulo').textContent = data.titulo;
        document.getElementById('modal-autor').textContent = "Por " + data.autor;
        
        // Convertimos saltos de linea en HTML y limpiamos scripts maliciosos básicos
        const contenidoSeguro = data.contenido
            .replace(/<script>/gi, "") // Evitar scripts
            .replace(/<br>/g, '<br>'); // Permitir saltos de línea
            
        document.getElementById('modal-texto').innerHTML = contenidoSeguro;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; 
    }
}

function cerrarNoticia() {
    const modal = document.getElementById('modal-noticia');
    if(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; 
    }
}

// Cerrar si clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('modal-noticia');
    if (event.target == modal) cerrarNoticia();
}
