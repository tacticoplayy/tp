document.addEventListener('DOMContentLoaded', () => {
    
    // Referencias
    const btnLive = document.querySelector('.btn-live');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');

    // 1. Simulación de Botón "En Vivo"
    btnLive.addEventListener('click', () => {
        alert('Abriendo reproductor de streaming FM Alta Voz 98.7...');
        // Aquí iría la lógica real para abrir un popup o reproductor
    });

    // 2. Menú Responsive (Toggle básico)
    menuBtn.addEventListener('click', () => {
        const isHidden = window.getComputedStyle(nav).display === 'none';
        
        if (isHidden) {
            nav.style.display = 'block';
            nav.style.position = 'absolute';
            nav.style.top = '60px';
            nav.style.left = '0';
            nav.style.width = '100%';
            nav.style.background = '#0D1A12';
            nav.style.padding = '20px';
            nav.style.borderBottom = '1px solid #2ecc71';
            
            // Re-estilar lista para vertical
            const ul = nav.querySelector('ul');
            ul.style.flexDirection = 'column';
            ul.style.gap = '15px';
            ul.style.textAlign = 'center';
        } else {
            nav.style.display = ''; // Reset al CSS original
            nav.removeAttribute('style'); // Limpiar estilos inline
        }
    });

    // 3. Efecto simple en tarjetas de noticias (Log en consola)
    const cards = document.querySelectorAll('.news-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            console.log('Navegando al artículo...');
        });
    });

    console.log('Táctico Play - Sistema cargado correctamente');
});