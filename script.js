console.log("--- INICIANDO SISTEMA TÁCTICO PLAY ---");

document.addEventListener('DOMContentLoaded', () => {
    
    const container = document.getElementById('contenedor-noticias');
    
    // VERIFICACIÓN 1: ¿Existe el contenedor?
    if (!container) {
        console.error("ERROR CRÍTICO: No encuentro el div con id='contenedor-noticias' en el HTML.");
        return;
    } else {
        console.log("OK: Contenedor encontrado.");
    }

    // VERIFICACIÓN 2: Crear una tarjeta de prueba MANUAL (para ver si el JS funciona)
    const testCard = document.createElement('article');
    testCard.className = 'news-card';
    testCard.innerHTML = `
        <div style="background: red; height: 150px; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold;">
            PRUEBA DE CONEXIÓN
        </div>
        <div class="news-content">
            <h4>Si ves esto, el Script funciona</h4>
            <p>Ahora falta que lea el Excel.</p>
        </div>
    `;
    container.appendChild(testCard);

    // INTENTO DE LEER EL EXCEL
    const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQgImg92liKoPf_-2pBy02CdWMFnZMbh0pYXlrgPJYJUAljI5A8ANnvSJd5SzV2mmm8eegOorZuKwJV/pub?output=csv";

    fetch(SHEET_URL)
        .then(response => {
            console.log("Conectando a Google Sheets...", response.status);
            return response.text();
        })
        .then(csvText => {
            console.log("Datos recibidos (primeros 50 caracteres):", csvText.substring(0, 50));
            const rows = csvText.split('\n').slice(1); // Borrar encabezado
            
            rows.forEach(row => {
                const columns = row.split(',');
                // Solo mostrar si tiene título (columna 0) y algo más
                if (columns.length > 1 && columns[0].trim() !== '') {
                    
                    const titulo = columns[0].replace(/"/g, '');
                    const imagen = columns[1].replace(/"/g, ''); // Link imagen
                    const link = columns[3] ? columns[3].replace(/"/g, '') : '#';

                    const card = document.createElement('article');
                    card.className = 'news-card';
                    card.innerHTML = `
                        <img src="${imagen}" alt="${titulo}" class="news-img" onerror="this.src='https://via.placeholder.com/400x300?text=Error+Imagen'">
                        <div class="news-content">
                            <h4>${titulo}</h4>
                            <a href="${link}" target="_blank" class="btn-read-more">Leer más</a>
                        </div>
                    `;
                    container.prepend(card); // Poner al principio
                }
            });
        })
        .catch(error => console.error('Error leyendo Excel:', error));
});
