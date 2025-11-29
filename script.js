document.addEventListener('DOMContentLoaded', () => {
    
    // TU LINK DE GOOGLE SHEETS (Ya configurado)
    const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQgImg92liKoPf_-2pBy02CdWMFnZMbh0pYXlrgPJYJUAljI5A8ANnvSJd5SzV2mmm8eegOorZuKwJV/pub?output=csv";

    const container = document.getElementById('contenedor-noticias');

    // Si no encuentra el contenedor (por si acaso), paramos.
    if (!container) return;

    fetch(SHEET_URL)
        .then(response => response.text())
        .then(csvText => {
            // Convertimos el texto del CSV a filas
            const rows = csvText.split('\n').slice(1); // Borramos la fila 1 (títulos)
            
            // Limpiamos el contenedor por si había algo viejo
            container.innerHTML = '';

            rows.forEach(row => {
                // Separamos las columnas (Titulo, Imagen, Categoria, Link)
                const columns = row.split(','); 

                // A veces el CSV deja comillas o espacios, limpiamos un poco:
                // Columna A (0): Titulo
                // Columna B (1): Imagen
                // Columna C (2): Categoria (Opcional)
                // Columna D (3): Link
                
                if (columns.length >= 2) { // Verificamos que tenga al menos titulo e imagen
                    const titulo = columns[0].replace(/"/g, ''); // Sacar comillas extra
                    const imagen = columns[1].replace(/"/g, '');
                    const categoria = columns[2] ? columns[2].replace(/"/g, '') : 'TP';
                    const link = columns[3] ? columns[3].replace(/"/g, '') : '#';

                    // Solo creamos la tarjeta si hay datos reales
                    if (titulo.length > 2) {
                        const card = document.createElement('article');
                        card.className = 'news-card';
                        
                        // HTML de la tarjeta
                        card.innerHTML = `
                            <img src="${imagen}" alt="${titulo}" class="news-img">
                            <div class="news-content">
                                <span style="color:#2ecc71; font-size:0.7rem; font-weight:800; letter-spacing:1px; text-transform:uppercase;">${categoria}</span>
                                <h4 style="margin-top:5px; margin-bottom:10px;">${titulo}</h4>
                                <a href="${link}" target="_blank" class="btn-read-more">Leer más</a>
                            </div>
                        `;
                        
                        // Agregamos la tarjeta al principio (para que la más nueva quede arriba)
                        container.prepend(card);
                    }
                }
            });
        })
        .catch(error => console.error('Error cargando noticias:', error));
});
