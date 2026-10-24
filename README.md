# Foodgram

Recetas con su secreto. Web estática sin dependencias ni paso de compilación: abre `index.html` o publica la carpeta (GitHub Pages, Netlify…).

## Qué tiene
- **Platos ilustrados**: cada receta se dibuja en SVG vista desde arriba, sobre un mantel de cuadros con su propio color. Se puede girar el plato con el dedo.
- **El secreto sellado**: cada ficha guarda el truco borroso hasta que lo tocas.
- **Raciones que recalculan** las cantidades (½, ¼, g → kg…).
- **Modo cocina**: pantalla completa paso a paso, temporizadores con aviso sonoro y vibración, mantiene la pantalla encendida y funciona con las flechas del teclado.
- **¿Qué hay en la nevera?**: marca lo que tienes y ordena las recetas por lo que te falta.
- Me gusta, recetario guardado, publicar recetas propias (con ilustración o foto, y temporizador si pones «(10 min)» en un paso), perfiles de chef, modo claro y oscuro.

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
