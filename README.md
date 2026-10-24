# Foodgram · Kitchen Secrets

Red social de secretos de cocina. Web estática sin dependencias ni paso de compilación: abre `index.html` o publica la carpeta (GitHub Pages, Netlify…).

## Qué hace
- Muro con recetas, búsqueda por plato, chef o ingrediente y filtros por categoría y dieta.
- Detalle de receta con ingredientes marcables y pasos.
- Me gusta, guardar y compartir (Web Share o copiar enlace).
- Publicar recetas propias con foto (se reduce a 900 px).
- Explorar por categorías y chefs, perfiles y lista de guardadas.
- Modo claro y oscuro, accesible con teclado, respeta «reducir movimiento».

## Estructura
- `index.html`: esqueleto de la página.
- `css/app.css`: estilos (sin Tailwind ni CDN).
- `js/data.js`: datos de ejemplo; sustituir por una API cuando haya backend.
- `js/app.js`: rutas por hash, vistas y estado (guardado en `localStorage`).

## Pendiente
- Alojar las imágenes de ejemplo en el repo: ahora apuntan a enlaces temporales de Google y, si fallan, se muestra un icono.
- Backend y cuentas de usuario; hoy todo vive en el navegador.
- Service Worker para uso sin conexión y pruebas automáticas.
