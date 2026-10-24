# Foodgram

Recetas con su secreto. Web estática sin dependencias ni paso de compilación: abre `index.html` o publica la carpeta (GitHub Pages, Netlify…).

## Qué tiene
- **Feed tipo Instagram**: historias con anillo de color (una en directo), publicaciones con carrusel de 3 diapositivas (plato, comanda de ingredientes y el secreto), doble toque para dar me gusta, comentarios con reacciones rápidas, compartir, guardar y etiquetas.
- **Explorar** en mosaico con buscador por plato, #etiqueta, cocinero o ingrediente.
- **Perfiles** con seguidores, destacadas, cuadrícula y pestaña de guardadas; seguir y dejar de seguir.
- **Receta completa**: raciones que recalculan cantidades, ingredientes que se tachan y **modo cocina** paso a paso con temporizadores.
- **¿Qué hay en la nevera?**: marca lo que tienes y ordena las recetas por lo que te falta.
- **Publicar** con foto o ilustración, etiquetas y temporizadores automáticos («(10 min)» al final de un paso).
- **Personas**: chefs verificados y comunidad, buscador, filtros, seguidores en común, sugerencias dentro del feed y feed «Siguiendo».
- **Lo he cocinado**: al terminar el modo cocina suma a la receta y a tu racha de días cocinando.
- Paleta «Harina» (claro) y «Brasa» (oscuro) según el estudio de color en `docs/estudio-color.html`.
- Raíl lateral en escritorio, dock en móvil, modo claro y oscuro.

## Fotos
Cada receta tiene una ilustración propia. Para usar fotos, añade la URL o la ruta local en `DATA.fotos` al final de `js/data.js` (`"steak-mantequilla": "img/steak.jpg"`). Si una foto falla, se ve la ilustración.

## Estructura
- `index.html`: esqueleto de la página.
- `css/app.css`: estilos.
- `js/data.js`: chefs y recetas de ejemplo.
- `js/plates.js`: generador de ilustraciones de platos.
- `js/app.js`: rutas, vistas, estado (en `localStorage`) y modo cocina.
- `tools/bundle.py`: junta todo en un único HTML (`python3 tools/bundle.py`, sale en `dist/`).

## Pendiente
- Backend y cuentas: hoy todo vive en el navegador de cada persona.
- Service Worker para uso sin conexión y pruebas automáticas.
