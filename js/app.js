(function () {
  "use strict";

  var DATA = window.FOODGRAM_DATA, P = window.Plates;
  var main = document.getElementById("contenido");
  var dock = document.getElementById("dock");
  var cookEl = document.getElementById("cook");
  var toastEl = document.getElementById("toast");
  var KEY = "foodgram.v2";

  // ---------- Estado ----------
  var store = { likes: {}, saved: {}, mias: [], checks: {}, revealed: {}, nevera: [], theme: "" }, canStore = true;
  try {
    var raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    Object.keys(store).forEach(function (k) { if (raw[k] != null) store[k] = raw[k]; });
  } catch (e) { canStore = false; /* sin almacenamiento: todo funciona en memoria */ }
  // Devuelve false solo si el almacenamiento existe pero está lleno (p. ej. por fotos grandes).
  function save() {
    if (!canStore) return true;
    try { localStorage.setItem(KEY, JSON.stringify(store)); return true; }
    catch (e) { toast("No queda espacio en este navegador. Prueba sin foto."); return false; }
  }
  var ui = { q: "", cat: "", serv: {}, view: "", arg: "", stack: [] };

  // ---------- Utilidades ----------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function unique(a) { return a.filter(function (x, i) { return x && a.indexOf(x) === i; }); }
  function toast(msg) {
    toastEl.textContent = msg; toastEl.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(function () { toastEl.hidden = true; }, 2400);
  }
  var ICONS = {
    home: '<path d="M4 11.5 12 4l8 7.5V20h-5v-5H9v5H4Z"/>',
    fridge: '<rect x="6" y="3" width="12" height="18" rx="2.5"/><path d="M6 10h12M9 6.5v1.5M9 13v3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    bookmark: '<path d="M7 4h10v16l-5-3.5L7 20Z"/>',
    person: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c.6-3.6 3.6-5.5 7.5-5.5s6.9 1.9 7.5 5.5"/>',
    heart: '<path d="M12 20s-7.5-4.8-7.5-10.4A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.6C19.5 15.2 12 20 12 20Z"/>',
    share: '<path d="M12 4v11M7.5 8.5 12 4l4.5 4.5M5 14v6h14v-6"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    moon: '<path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5Z"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    play: '<path d="M8 5.5v13l10-6.5Z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    flame: '<path d="M12 21c-4 0-6.5-2.7-6.5-6.2 0-3.8 3.4-5.6 3.9-9.8 2.4 1.6 3.6 3.6 3.6 5.6 1-.6 1.7-1.8 1.8-3 2 1.6 3.7 4.2 3.7 7.2 0 3.5-2.5 6.2-6.5 6.2Z"/>'
  };
  function icon(name) { return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + ICONS[name] + "</svg>"; }
  function fmtTime(min) {
    if (min < 60) return min + " min";
    var h = Math.floor(min / 60), m = min % 60;
    return h + " h" + (m ? " " + m : "");
  }
  var FRAC = { 0.25: "¼", 0.5: "½", 0.75: "¾" };
  function fmtQty(q, u) {
    if (!q) return u ? u : "al gusto";
    if (u === "g" && q >= 1000) { q = q / 1000; u = "kg"; }
    if (u === "ml" && q >= 1000) { q = q / 1000; u = "l"; }
    var s;
    if ((u === "g" || u === "ml") && q >= 20) s = String(Math.round(q / 5) * 5);
    else if (q >= 10) s = String(Math.round(q));
    else {
      var r = Math.round(q * 4) / 4, whole = Math.floor(r), frac = r - whole;
      if (r === 0) r = 0.25, whole = 0, frac = 0.25;
      s = (whole ? whole : "") + (frac ? (whole ? " " : "") + FRAC[frac] : "");
    }
    var unit = u;
    if (u === "ud") unit = "";
    return (s + (unit ? " " + unit : "")).trim();
  }
  function allRecipes() { return store.mias.concat(DATA.recetas); }
  function findRecipe(id) { return allRecipes().filter(function (r) { return r.id === id; })[0]; }
  var ME = { id: "yo", nombre: "Tú", titulo: "Cocina de casa", color: "#9fd8ff", bio: "Tus recetas viven en este navegador." };
  function chefById(id) { return id === "yo" ? ME : DATA.chefs.filter(function (c) { return c.id === id; })[0]; }
  function av(c, size) { return '<span class="av' + (size ? " " + size : "") + '" style="--c:' + c.color + '" aria-hidden="true">' + esc(c.nombre.charAt(0)) + "</span>"; }
  function level(d) { return { "Fácil": 1, "Media": 2, "Difícil": 3 }[d] || 2; }
  function dots(d) { var l = level(d), h = ""; for (var i = 1; i <= 3; i++) h += '<i class="' + (i <= l ? "on" : "") + '"></i>'; return '<span class="dots" aria-label="Dificultad ' + esc(d) + '">' + h + "</span>"; }
  function link(path, cls, inner, extra) { return '<a href="#/' + path + '" data-go="' + path + '"' + (cls ? ' class="' + cls + '"' : "") + (extra || "") + ">" + inner + "</a>"; }
  function mantel(r) { return 'style="--h:' + (r.mh == null ? 200 : r.mh) + '"'; }

  // ---------- Piezas ----------
  function seal(r) {
    var open = !!store.revealed[r.id];
    return '<button class="seal" type="button" data-reveal="' + esc(r.id) + '" aria-expanded="' + open + '">' +
      '<span class="mono">El secreto</span><span class="seal-text">' + esc(r.secreto) + '</span><span class="seal-cta">Toca para revelar</span></button>';
  }
  function actions(r) {
    var liked = !!store.likes[r.id], saved = !!store.saved[r.id];
    return '<div class="actions" data-actions="' + esc(r.id) + '">' +
      '<button class="act" type="button" data-like="' + esc(r.id) + '" aria-pressed="' + liked + '">' + icon("heart") + "<span>" + (liked ? "Te gusta" : "Me gusta") + "</span></button>" +
      '<button class="act" type="button" data-save="' + esc(r.id) + '" aria-pressed="' + saved + '">' + icon("bookmark") + "<span>" + (saved ? "Guardada" : "Guardar") + "</span></button>" +
      '<span class="spacer"></span><button class="act" type="button" data-share="' + esc(r.id) + '" aria-label="Copiar enlace de ' + esc(r.titulo) + '">' + icon("share") + "</button></div>";
  }
  function ficha(r) {
    var c = chefById(r.chef) || ME;
    return '<article class="ficha">' +
      link("receta/" + r.id, "ficha-plate mantel", '<span class="tag-time mono">' + icon("clock") + fmtTime(r.tiempo) + "</span>" + P.draw(r), ' ' + mantel(r) + ' aria-label="Abrir ' + esc(r.titulo) + '"') +
      '<div class="ficha-body"><p class="mono eyebrow">' + esc(r.categoria) + "</p><h3>" + link("receta/" + r.id, "", esc(r.titulo)) + "</h3>" +
      link("chef/" + c.id, "by", av(c, "sm") + "<span><b>" + esc(c.nombre) + "</b> · " + esc(c.titulo) + "</span>") +
      seal(r) + actions(r) + "</div></article>";
  }
  function mini(r, right) {
    return link("receta/" + r.id, "mini", '<span class="mantel" ' + mantel(r) + ">" + P.draw(r) + "</span>" +
      "<span><h3>" + esc(r.titulo) + "</h3><p>" + esc((chefById(r.chef) || ME).nombre) + " · " + fmtTime(r.tiempo) + "</p></span>" + (right || ""));
  }
  function emptyState(text, cta) {
    var demo = { id: "vacio", plato: "soup", mh: 200 };
    return '<div class="empty"><span class="plate-e">' + P.draw({ id: "vacio-plato", plato: "cookie" }) + "</span><p>" + text + "</p>" + (cta || "") + "</div>";
  }

  // ---------- Vistas ----------
  function filtered() {
    return allRecipes().filter(function (r) {
      var c = chefById(r.chef) || ME;
      var hay = norm([r.titulo, r.secreto, c.nombre, r.categoria].concat((r.ingredientes || []).map(function (i) { return i[2]; })).join(" "));
      return (!ui.q || hay.indexOf(norm(ui.q)) >= 0) && (!ui.cat || r.categoria === ui.cat || (r.dieta || []).indexOf(ui.cat) >= 0);
    });
  }
  function gridHtml() {
    var list = filtered();
    if (!list.length) return emptyState("Nada en la mesa con esa búsqueda.", '<button class="btn" type="button" data-clear>Quitar filtros</button>');
    return list.map(ficha).join("");
  }
  function viewHome() {
    var rs = allRecipes(), day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
    var hoy = DATA.recetas[day % DATA.recetas.length], c = chefById(hoy.chef);
    var fecha = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
    var words = hoy.titulo.split(" "), last = words.pop();
    var cats = unique(rs.map(function (r) { return r.categoria; })).concat(["vegano", "vegetariano", "sin gluten"]);
    return '<section class="hero" aria-labelledby="hoy-t"><div class="hero-txt">' +
      '<p class="mono eyebrow"><b>La receta de hoy</b> · ' + esc(fecha) + "</p>" +
      '<h2 id="hoy-t">' + esc(words.join(" ")) + " <em>" + esc(last) + "</em></h2>" +
      '<p class="hero-quote">“' + esc(hoy.secreto) + "”</p>" +
      link("chef/" + c.id, "by", av(c, "sm") + "<span><b>" + esc(c.nombre) + "</b> · " + esc(c.titulo) + "</span>") +
      '<div class="btns">' + link("receta/" + hoy.id, "btn", "Abrir receta") +
      '<button class="btn ghost" type="button" data-cook="' + hoy.id + '">' + icon("flame") + "Cocinar ahora</button></div></div>" +
      '<div class="hero-plate mantel" ' + mantel(hoy) + '><div class="spin" data-spin>' + P.draw(hoy, { label: "Ilustración de " + hoy.titulo }) + "</div></div></section>" +
      '<div class="section-h"><h2>Quién cocina</h2><span class="mono count">' + DATA.chefs.length + " chefs</span></div>" +
      '<div class="chefs">' + DATA.chefs.map(function (ch) { return link("chef/" + ch.id, "chef-chip", av(ch) + "<small>" + esc(ch.nombre) + "</small>"); }).join("") + "</div>" +
      '<div class="section-h"><h2>Muro de secretos</h2><span class="mono count" id="count">' + filtered().length + " recetas</span></div>" +
      '<div class="tools"><div class="search">' + icon("search") + '<label class="sr-only" for="q">Buscar recetas</label>' +
      '<input id="q" type="search" placeholder="Busca un plato, un chef o un ingrediente" value="' + esc(ui.q) + '" autocomplete="off"></div>' +
      '<div class="chips" role="group" aria-label="Filtrar por tipo">' + cats.map(function (k) {
        return '<button class="chip" type="button" data-cat="' + esc(k) + '" aria-pressed="' + (ui.cat === k) + '">' + esc(k) + "</button>";
      }).join("") + "</div></div>" +
      '<div class="grid" id="grid">' + gridHtml() + "</div>";
  }

  function viewRecipe(id) {
    var r = findRecipe(id);
    if (!r) return notFound();
    var c = chefById(r.chef) || ME, serv = ui.serv[r.id] || r.raciones, k = serv / r.raciones, checks = store.checks[r.id] || {};
    return backBtn() + '<div class="rec"><div class="rec-plate mantel" ' + mantel(r) + '><div class="spin" data-spin>' + P.draw(r, { label: "Ilustración de " + r.titulo }) + '</div><p class="hint mono">Gira el plato</p></div>' +
      '<div class="rec-info"><p class="mono eyebrow"><b>' + esc(r.categoria) + "</b></p><h1>" + esc(r.titulo) + "</h1>" +
      link("chef/" + c.id, "by", av(c, "sm") + "<span><b>" + esc(c.nombre) + "</b> · " + esc(c.titulo) + "</span>") +
      '<div class="facts"><div class="fact"><span class="mono">Tiempo</span><b>' + fmtTime(r.tiempo) + '</b></div><div class="fact"><span class="mono">Dificultad</span><b>' + dots(r.dificultad) + '</b></div><div class="fact"><span class="mono">Raciones</span><b>' + serv + "</b></div></div>" +
      ((r.dieta || []).length ? '<div class="tags">' + r.dieta.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" : "") +
      seal(r) + actions(r) +
      '<button class="btn block" type="button" data-cook="' + esc(r.id) + '">' + icon("flame") + "Modo cocina, paso a paso</button>" +
      '<section class="box"><div class="box-h"><h2>Ingredientes</h2><div class="stepper" role="group" aria-label="Raciones">' +
      '<button type="button" data-serv="-1" aria-label="Menos raciones">−</button><output aria-live="polite">' + serv + (serv === 1 ? " ración" : " raciones") + '</output><button type="button" data-serv="1" aria-label="Más raciones">+</button></div></div>' +
      '<ul class="ings">' + (r.ingredientes || []).map(function (ing, i) {
        return '<li><label><input type="checkbox" id="ing-' + esc(r.id) + "-" + i + '" data-check="' + esc(r.id) + '" data-i="' + i + '"' + (checks[i] ? " checked" : "") +
          '><span class="q">' + esc(fmtQty(ing[0] * k, ing[1])) + "</span><span>" + esc(ing[2]) + "</span></label></li>";
      }).join("") + "</ul></section>" +
      '<section class="box"><div class="box-h"><h2>Preparación</h2></div><ol class="steps">' + (r.pasos || []).map(function (p, i) {
        return "<li><div>" + esc(p.t) + (p.min ? '<br><button class="tmr" type="button" data-cook="' + esc(r.id) + '" data-step="' + i + '">' + icon("clock") + "Temporizador " + p.min + " min</button>" : "") + "</div></li>";
      }).join("") + "</ol></section></div></div>";
  }

  function viewChef(id) {
    var c = chefById(id);
    if (!c) return notFound();
    var rs = allRecipes().filter(function (r) { return r.chef === c.id; });
    return backBtn() + '<div class="profile">' + av(c, "lg") + '<div><p class="mono eyebrow">' + esc(c.titulo) + "</p><h1>" + esc(c.nombre) + "</h1><p>" + esc(c.bio || "") + "</p></div></div>" +
      (rs.length ? '<div class="grid">' + rs.map(ficha).join("") + "</div>" : emptyState("Todavía no hay recetas aquí."));
  }

  function fridgeItems() {
    var m = {};
    allRecipes().forEach(function (r) { (r.ingredientes || []).forEach(function (i) { if (i[3] && !i[4]) m[i[3]] = 1; }); });
    return Object.keys(m).sort(function (a, b) { return a.localeCompare(b, "es"); });
  }
  function fridgeResults() {
    var have = store.nevera;
    return allRecipes().map(function (r) {
      var need = unique((r.ingredientes || []).filter(function (i) { return i[3] && !i[4]; }).map(function (i) { return i[3]; }));
      var got = need.filter(function (k) { return have.indexOf(k) >= 0; });
      return { r: r, need: need, got: got, miss: need.filter(function (k) { return have.indexOf(k) < 0; }), ratio: need.length ? got.length / need.length : 0 };
    }).filter(function (x) { return x.got.length; }).sort(function (a, b) { return b.ratio - a.ratio || a.miss.length - b.miss.length; });
  }
  function fridgeResultsHtml() {
    if (!store.nevera.length) return emptyState("Marca arriba lo que tienes y te diremos qué puedes cocinar.");
    var res = fridgeResults();
    if (!res.length) return emptyState("Con eso todavía no sale nada. Añade algún ingrediente más.");
    return res.map(function (x) {
      return link("receta/" + x.r.id, "match", '<span class="mantel" ' + mantel(x.r) + ">" + P.draw(x.r) + "</span>" +
        "<span><h3>" + esc(x.r.titulo) + '</h3><span class="meter" aria-hidden="true"><i style="width:' + Math.round(x.ratio * 100) + '%"></i></span>' +
        "<p><b>Tienes " + x.got.length + " de " + x.need.length + "</b>" + (x.miss.length ? " · Te falta: " + esc(x.miss.join(", ")) : " · ¡Lo tienes todo!") + "</p></span>");
    }).join("");
  }
  function viewFridge() {
    return '<header class="page-h"><p class="mono eyebrow"><b>Nevera</b></p><h1>¿Qué hay en la nevera?</h1>' +
      '<p class="fridge-intro">Toca lo que tienes en casa. Sal, aceite, agua y especias se dan por hechos.</p></header>' +
      '<div class="pantry" role="group" aria-label="Ingredientes que tienes">' + fridgeItems().map(function (k) {
        return '<button class="chip" type="button" data-fridge="' + esc(k) + '" aria-pressed="' + (store.nevera.indexOf(k) >= 0) + '">' + esc(k) + "</button>";
      }).join("") + "</div>" +
      '<div class="section-h"><h2>Puedes cocinar</h2>' + (store.nevera.length ? '<button class="chip" type="button" data-fridge-clear>Vaciar nevera</button>' : "") + "</div>" +
      '<div id="matches">' + fridgeResultsHtml() + "</div>";
  }

  function viewSaved() {
    var rs = allRecipes().filter(function (r) { return store.saved[r.id]; });
    return '<header class="page-h"><p class="mono eyebrow"><b>Guardadas</b></p><h1>Tu recetario</h1><p>Lo que guardas se queda en este navegador.</p></header>' +
      (rs.length ? '<div class="grid">' + rs.map(ficha).join("") + "</div>" : emptyState("Todavía no has guardado ninguna receta.", link("", "btn", "Ver el muro")));
  }

  function viewProfile() {
    var mias = store.mias;
    return '<div class="profile">' + av(ME, "lg") + '<div><p class="mono eyebrow">Tu cocina</p><h1>Tu perfil</h1><p>' + esc(ME.bio) + "</p></div></div>" +
      '<div class="stats"><div class="stat"><b>' + mias.length + '</b><span>Publicadas</span></div><div class="stat"><b>' + Object.keys(store.saved).length +
      '</b><span>Guardadas</span></div><div class="stat"><b>' + Object.keys(store.likes).length + "</b><span>Me gusta</span></div></div>" +
      (mias.length ? mias.map(function (r) { return mini(r); }).join("") : emptyState("Aún no has publicado nada. ¿Cuál es tu secreto?", link("nueva", "btn", "Publicar receta"))) +
      '<div class="btns" style="margin-top:28px">' + (mias.length ? link("nueva", "btn", "Publicar otra") : "") +
      '<button class="btn ghost" type="button" id="reset">Borrar mis datos</button></div>';
  }

  function viewNew() {
    var cats = unique(allRecipes().map(function (r) { return r.categoria; }));
    return '<header class="page-h"><p class="mono eyebrow"><b>Publicar</b></p><h1>Comparte tu secreto</h1><p>Elige un plato o sube una foto, escribe el truco y los pasos. Se publica en tu muro al momento.</p></header>' +
      '<form class="new" id="form" novalidate>' +
      '<div class="field"><label for="f-titulo">Nombre del plato</label><input id="f-titulo" name="titulo" maxlength="70" placeholder="Lentejas de mi abuela"></div>' +
      '<div class="field"><label for="f-secreto">El secreto</label><textarea id="f-secreto" name="secreto" maxlength="280" placeholder="Un chorrito de vinagre al final despierta todo el guiso."></textarea><span class="hint">Una o dos frases. Es lo que se verá sellado en el muro.</span></div>' +
      '<fieldset class="field"><legend>Ilustración</legend><div class="platepick">' + P.types.map(function (t, i) {
        return '<input type="radio" name="plato" id="pp-' + t + '" value="' + t + '"' + (i === 0 ? " checked" : "") + '><label for="pp-' + t + '">' + P.draw({ id: "muestra-" + t, plato: t }) + P.names[t] + "</label>";
      }).join("") + '</div></fieldset>' +
      '<div class="field"><label for="f-foto">O sube tu foto</label><input id="f-foto" name="foto" type="file" accept="image/*"><span class="hint" id="foto-hint">Opcional. Se recorta en círculo dentro del plato.</span></div>' +
      '<div class="row"><div class="field"><label for="f-cat">Categoría</label><input id="f-cat" name="categoria" list="cats" value="Guisos"><datalist id="cats">' + cats.map(function (c) { return "<option>" + esc(c) + "</option>"; }).join("") + '</datalist></div>' +
      '<div class="field"><label for="f-dif">Dificultad</label><select id="f-dif" name="dificultad"><option>Fácil</option><option selected>Media</option><option>Difícil</option></select></div>' +
      '<div class="field"><label for="f-t">Minutos</label><input id="f-t" name="tiempo" type="number" inputmode="numeric" min="1" max="2880" value="40"></div>' +
      '<div class="field"><label for="f-r">Raciones</label><input id="f-r" name="raciones" type="number" inputmode="numeric" min="1" max="50" value="4"></div></div>' +
      '<div class="field"><label for="f-ing">Ingredientes</label><textarea id="f-ing" name="ingredientes" placeholder="300 g de lentejas&#10;1 cebolla&#10;2 dientes de ajo"></textarea><span class="hint">Uno por línea. Si empiezas con cantidad y unidad, se recalculan al cambiar las raciones.</span></div>' +
      '<div class="field"><label for="f-pasos">Pasos</label><textarea id="f-pasos" name="pasos" placeholder="Sofríe la verdura (10 min)&#10;Añade las lentejas y el agua (40 min)"></textarea><span class="hint">Uno por línea. Pon los minutos entre paréntesis y tendrás temporizador.</span></div>' +
      '<p class="form-error" id="form-error" role="alert" hidden></p>' +
      '<button class="btn block" type="submit">Publicar receta</button></form>';
  }

  function notFound() { return emptyState("Ese plato no está en la carta.", link("", "btn", "Volver al muro")); }
  function backBtn() { return '<button class="back" type="button" data-back>' + icon("back") + "Volver</button>"; }

  // ---------- Router ----------
  var NAV = [["", "Mesa", "home"], ["nevera", "Nevera", "fridge"], ["nueva", "Publicar", "plus", "add"], ["guardadas", "Guardadas", "bookmark"], ["perfil", "Perfil", "person"]];
  function parse(path) { var p = String(path || "").replace(/^#?\/?/, "").split("/"); return { v: p[0] || "", arg: decodeURIComponent(p[1] || "") }; }
  function render(keepScroll) {
    var v = ui.view, a = ui.arg, html;
    if (v === "") html = viewHome();
    else if (v === "nevera") html = viewFridge();
    else if (v === "nueva") html = viewNew();
    else if (v === "guardadas") html = viewSaved();
    else if (v === "perfil") html = viewProfile();
    else if (v === "receta") html = viewRecipe(a);
    else if (v === "chef") html = viewChef(a);
    else html = notFound();
    main.innerHTML = '<div class="view">' + html + "</div>";
    var r = v === "receta" && findRecipe(a);
    document.title = r ? r.titulo + " · Foodgram" : "Foodgram";
    var active = v === "receta" || v === "chef" ? "" : v;
    dock.innerHTML = NAV.map(function (n) {
      return '<a href="#/' + n[0] + '" data-go="' + n[0] + '"' + (n[3] ? ' class="' + n[3] + '"' : "") + (n[0] === active && v !== "receta" && v !== "chef" ? ' aria-current="page"' : "") +
        (n[3] ? ' aria-label="' + n[1] + '"' : "") + ">" + icon(n[2]) + (n[3] ? "" : "<span>" + n[1] + "</span>") + "</a>";
    }).join("");
    if (!keepScroll) { window.scrollTo(0, 0); if (v) main.focus({ preventScroll: true }); }
  }
  function go(path, replace) {
    var p = parse(path);
    if (!replace) ui.stack.push(ui.view + (ui.arg ? "/" + ui.arg : ""));
    ui.view = p.v; ui.arg = p.arg;
    try { history[replace ? "replaceState" : "pushState"](null, "", "#/" + path); } catch (e) { /* visor sin historial */ }
    render();
  }
  window.addEventListener("popstate", function () {
    var p = parse(location.hash); ui.view = p.v; ui.arg = p.arg; ui.stack.pop(); render();
  });

  // ---------- Acciones ----------
  function refreshActions(id) {
    var r = findRecipe(id); if (!r) return;
    Array.prototype.forEach.call(document.querySelectorAll('[data-actions="' + id + '"]'), function (el) {
      var t = document.createElement("div"); t.innerHTML = actions(r); el.replaceWith(t.firstChild);
    });
  }
  function copyLink(r, btn) {
    var url = location.href.split("#")[0] + "#/receta/" + r.id;
    function fallback() { toast("Enlace: " + url); }
    try { navigator.clipboard.writeText(url).then(function () { toast("Enlace copiado"); }, fallback); } catch (e) { fallback(); }
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-go]");
    if (a) { e.preventDefault(); go(a.getAttribute("data-go")); return; }
    var t = e.target.closest("button");
    if (!t) return;
    var d = t.dataset;
    if (d.like) {
      store.likes[d.like] ? delete store.likes[d.like] : (store.likes[d.like] = 1); save(); refreshActions(d.like);
      var b = document.querySelector('[data-like="' + d.like + '"]'); if (b && store.likes[d.like]) b.classList.add("pop");
    } else if (d.save) {
      var was = !!store.saved[d.save]; was ? delete store.saved[d.save] : (store.saved[d.save] = 1); save();
      toast(was ? "Quitada de tu recetario" : "Guardada en tu recetario");
      if (ui.view === "guardadas") render(true); else refreshActions(d.save);
    } else if (d.share) { copyLink(findRecipe(d.share), t); }
    else if (d.reveal) {
      var open = t.getAttribute("aria-expanded") === "true";
      t.setAttribute("aria-expanded", String(!open));
      open ? delete store.revealed[d.reveal] : (store.revealed[d.reveal] = 1); save();
    } else if (d.cat != null && t.hasAttribute("data-cat")) {
      ui.cat = ui.cat === d.cat ? "" : d.cat;
      Array.prototype.forEach.call(document.querySelectorAll("[data-cat]"), function (c) { c.setAttribute("aria-pressed", String(c.dataset.cat === ui.cat)); });
      updateGrid();
    } else if (t.hasAttribute("data-clear")) {
      ui.q = ""; ui.cat = ""; render(true);
    } else if (d.serv) {
      var r = findRecipe(ui.arg); if (!r) return;
      ui.serv[r.id] = Math.min(60, Math.max(1, (ui.serv[r.id] || r.raciones) + (+d.serv))); render(true);
    } else if (d.fridge) {
      var i = store.nevera.indexOf(d.fridge); i >= 0 ? store.nevera.splice(i, 1) : store.nevera.push(d.fridge); save();
      t.setAttribute("aria-pressed", String(i < 0));
      document.getElementById("matches").innerHTML = fridgeResultsHtml();
      var h = document.querySelector(".section-h"); if (h && (store.nevera.length <= 1)) render(true);
    } else if (t.hasAttribute("data-fridge-clear")) {
      store.nevera = []; save(); render(true);
    } else if (d.cook) { openCook(d.cook, +(d.step || 0), d.step != null); }
    else if (t.hasAttribute("data-back")) {
      var prev = ui.stack.pop(); var p = parse(prev || ""); ui.view = p.v; ui.arg = p.arg;
      try { history.replaceState(null, "", "#/" + (prev || "")); } catch (er) { /* sin historial */ }
      render();
    } else if (t.id === "reset") {
      if (!t.dataset.sure) { t.dataset.sure = "1"; t.textContent = "Pulsa otra vez para borrarlo todo"; return; }
      store.likes = {}; store.saved = {}; store.mias = []; store.checks = {}; store.revealed = {}; store.nevera = []; save(); render(true); toast("Datos borrados");
    } else if (t.id === "theme") {
      var cur = document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
      store.theme = cur === "dark" ? "light" : "dark"; applyTheme(); save();
    }
  });
  function updateGrid() {
    var g = document.getElementById("grid"); if (!g) return;
    g.innerHTML = gridHtml();
    document.getElementById("count").textContent = filtered().length + " recetas";
  }
  main.addEventListener("input", function (e) { if (e.target.id === "q") { ui.q = e.target.value; updateGrid(); } });
  main.addEventListener("change", function (e) {
    var t = e.target;
    if (t.dataset.check) {
      var c = store.checks[t.dataset.check] || (store.checks[t.dataset.check] = {});
      t.checked ? (c[t.dataset.i] = 1) : delete c[t.dataset.i]; save();
    } else if (t.id === "f-foto" && t.files[0]) {
      shrink(t.files[0], function (data) { t.dataset.data = data; document.getElementById("foto-hint").textContent = "Foto lista: se verá dentro del plato."; });
    }
  });

  // Publicar
  var UNITS = "g|kg|ml|l|cl|cucharadas?|cucharaditas?|dientes?|uds?|ramas?|pizcas?|tazas?|latas?";
  function parseIng(line) {
    var m = line.match(new RegExp("^(\\d+/\\d+|\\d+(?:[.,]\\d+)?)\\s*(" + UNITS + ")?\\b\\s*(.*)$", "i"));
    var name = line, q = 0, u = "";
    if (m) {
      q = m[1].indexOf("/") > 0 ? m[1].split("/")[0] / m[1].split("/")[1] : parseFloat(m[1].replace(",", "."));
      u = (m[2] || "ud").toLowerCase(); name = m[3] || line;
    }
    var key = norm(name.replace(/^de\s+/i, "")).split(/\s+/)[0];
    return [q, u, name, key];
  }
  function parseStep(line) {
    var m = line.match(/\((\d+)\s*min\)\s*$/i);
    return m ? { t: line.replace(m[0], "").trim(), min: +m[1] } : { t: line };
  }
  main.addEventListener("submit", function (e) {
    if (e.target.id !== "form") return;
    e.preventDefault();
    var f = e.target, err = document.getElementById("form-error");
    function lines(s) { return s.split("\n").map(function (x) { return x.trim(); }).filter(Boolean); }
    var titulo = f.titulo.value.trim(), secreto = f.secreto.value.trim(), ing = lines(f.ingredientes.value), pasos = lines(f.pasos.value);
    var msg = !titulo ? "Ponle nombre al plato." : !secreto ? "Falta el secreto: es lo que hace especial la receta." : !ing.length ? "Añade al menos un ingrediente." : !pasos.length ? "Añade al menos un paso." : "";
    if (msg) { err.textContent = msg; err.hidden = false; err.scrollIntoView({ block: "center" }); return; }
    var r = {
      id: "mia-" + Date.now().toString(36), chef: "yo", titulo: titulo, categoria: f.categoria.value.trim() || "Mis recetas",
      plato: (f.querySelector("input[name=plato]:checked") || {}).value || "pasta", mh: Math.floor(Math.random() * 360),
      dieta: [], tiempo: Math.max(1, +f.tiempo.value || 30), dificultad: f.dificultad.value, raciones: Math.max(1, +f.raciones.value || 2),
      foto: f.foto.dataset.data || "", secreto: secreto, ingredientes: ing.map(parseIng), pasos: pasos.map(parseStep)
    };
    store.mias.unshift(r); store.revealed[r.id] = 1;
    if (!save()) { store.mias.shift(); return; }
    toast("Publicada en el muro"); go("receta/" + r.id, true);
  });
  function shrink(file, cb) {
    var fr = new FileReader();
    fr.onload = function () {
      var img = new Image();
      img.onload = function () {
        var s = Math.min(1, 640 / Math.min(img.width, img.height)), c = document.createElement("canvas");
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); cb(c.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = function () { toast("Esa imagen no se puede leer. Prueba con JPG o PNG."); };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  }

  // Girar el plato con el dedo o el ratón
  var spin = null;
  document.addEventListener("pointerdown", function (e) {
    var el = e.target.closest("[data-spin]"); if (!el) return;
    var b = el.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2;
    spin = { el: el, cx: cx, cy: cy, a0: Math.atan2(e.clientY - cy, e.clientX - cx), base: +(el.dataset.rot || 0) };
    el.classList.add("dragging"); el.setPointerCapture && el.setPointerCapture(e.pointerId);
  });
  document.addEventListener("pointermove", function (e) {
    if (!spin) return;
    var a = Math.atan2(e.clientY - spin.cy, e.clientX - spin.cx), deg = spin.base + (a - spin.a0) * 180 / Math.PI;
    spin.el.dataset.rot = deg; spin.el.style.transform = "rotate(" + deg + "deg)";
  });
  ["pointerup", "pointercancel"].forEach(function (ev) { document.addEventListener(ev, function () { if (spin) { spin.el.classList.remove("dragging"); spin = null; } }); });

  // ---------- Modo cocina ----------
  var cook = null, tick = null, lock = null, audio = null;
  function openCook(id, step, startTimer) {
    var r = findRecipe(id); if (!r) return;
    cook = { r: r, i: step || 0, end: 0, left: 0, running: false, total: 0 };
    cookEl.hidden = false; document.body.style.overflow = "hidden";
    try { navigator.wakeLock && navigator.wakeLock.request("screen").then(function (l) { lock = l; }, function () {}); } catch (e) { /* sin bloqueo de pantalla */ }
    drawCook();
    if (startTimer) toggleTimer();
    var close = cookEl.querySelector("[data-cook-close]"); close && close.focus();
  }
  function closeCook() {
    clearInterval(tick); tick = null; cook = null; cookEl.hidden = true; cookEl.innerHTML = ""; document.body.style.overflow = "";
    if (lock) { try { lock.release(); } catch (e) { /* ya liberado */ } lock = null; }
  }
  function drawCook() {
    var r = cook.r, s = r.pasos[cook.i], n = r.pasos.length, last = cook.i === n - 1;
    clearInterval(tick); tick = null;
    cook.total = (s.min || 0) * 60; cook.left = cook.total; cook.running = false;
    cookEl.innerHTML = '<div class="cook-top"><span class="mono">' + esc(r.titulo) + '</span><button class="icon-btn" type="button" data-cook-close aria-label="Salir del modo cocina">' + icon("close") + "</button></div>" +
      '<div class="bars" aria-hidden="true">' + r.pasos.map(function (x, i) { return '<i class="' + (i <= cook.i ? "on" : "") + '"></i>'; }).join("") + "</div>" +
      '<div class="cook-body"><div class="cook-n" aria-hidden="true">' + (cook.i + 1) + '</div><p class="mono" style="color:#8ea5b7">Paso ' + (cook.i + 1) + " de " + n + '</p><p class="cook-step">' + esc(s.t) + "</p>" +
      (s.min ? '<div class="timer" id="timer"><svg class="ring" viewBox="0 0 120 120" aria-hidden="true"><circle class="bg" cx="60" cy="60" r="50"/><circle class="fg" cx="60" cy="60" r="50" stroke-dasharray="314.16" stroke-dashoffset="0"/><text x="60" y="60" id="t-txt">' + clock(cook.left) + '</text></svg>' +
        '<div class="btns"><button class="btn" type="button" data-timer id="t-btn">' + icon("play") + "Empezar " + s.min + ' min</button><button class="btn ghost" type="button" data-timer-reset>Reiniciar</button></div><p class="sr-only" aria-live="assertive" id="t-live"></p></div>' : "") +
      '</div><div class="cook-nav"><button class="btn ghost" type="button" data-cook-prev' + (cook.i === 0 ? " disabled" : "") + '>Anterior</button>' +
      '<button class="btn" type="button" data-cook-next>' + (last ? "¡Listo, a la mesa!" : "Siguiente") + "</button></div>";
  }
  function clock(sec) { sec = Math.max(0, Math.ceil(sec)); return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0"); }
  function paintTimer() {
    var t = document.getElementById("t-txt"); if (!t || !cook) return;
    t.textContent = clock(cook.left);
    document.querySelector(".ring .fg").setAttribute("stroke-dashoffset", String(314.16 * (1 - cook.left / cook.total)));
    document.getElementById("t-btn").innerHTML = cook.left <= 0 ? icon("play") + "Otra vez" : cook.running ? icon("pause") + "Pausar" : icon("play") + (cook.left < cook.total ? "Seguir" : "Empezar " + Math.round(cook.total / 60) + " min");
  }
  function toggleTimer() {
    if (!cook || !cook.total) return;
    try { if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audio = null; }
    if (cook.left <= 0) { cook.left = cook.total; document.getElementById("timer").classList.remove("done"); }
    cook.running = !cook.running;
    if (cook.running) {
      cook.end = Date.now() + cook.left * 1000;
      tick = setInterval(function () {
        cook.left = (cook.end - Date.now()) / 1000;
        if (cook.left <= 0) { cook.left = 0; cook.running = false; clearInterval(tick); tick = null; ring(); }
        paintTimer();
      }, 250);
    } else { clearInterval(tick); tick = null; }
    paintTimer();
  }
  function ring() {
    var tm = document.getElementById("timer"); tm && tm.classList.add("done");
    var live = document.getElementById("t-live"); live && (live.textContent = "Tiempo cumplido");
    try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (e) { /* sin vibración */ }
    if (!audio) return;
    [0, .35, .7].forEach(function (d) {
      var o = audio.createOscillator(), g = audio.createGain(), t0 = audio.currentTime + d;
      o.frequency.value = 880; o.connect(g); g.connect(audio.destination);
      g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(.3, t0 + .02); g.gain.exponentialRampToValueAtTime(.0001, t0 + .28);
      o.start(t0); o.stop(t0 + .3);
    });
  }
  cookEl.addEventListener("click", function (e) {
    var t = e.target.closest("button"); if (!t || !cook) return;
    if (t.hasAttribute("data-cook-close")) closeCook();
    else if (t.hasAttribute("data-cook-prev") && cook.i > 0) { cook.i--; drawCook(); }
    else if (t.hasAttribute("data-cook-next")) {
      if (cook.i < cook.r.pasos.length - 1) { cook.i++; drawCook(); } else { closeCook(); toast("¡Que aproveche!"); }
    } else if (t.hasAttribute("data-timer")) toggleTimer();
    else if (t.hasAttribute("data-timer-reset")) { clearInterval(tick); tick = null; cook.running = false; cook.left = cook.total; document.getElementById("timer").classList.remove("done"); paintTimer(); }
  });
  document.addEventListener("keydown", function (e) {
    if (!cook) return;
    if (e.key === "Escape") closeCook();
    else if (e.key === "ArrowRight") cookEl.querySelector("[data-cook-next]").click();
    else if (e.key === "ArrowLeft" && cook.i > 0) { cook.i--; drawCook(); }
  });

  // ---------- Tema ----------
  function applyTheme() { if (store.theme) document.documentElement.setAttribute("data-theme", store.theme); else document.documentElement.removeAttribute("data-theme"); }
  applyTheme();

  var start = parse(location.hash);
  ui.view = start.v; ui.arg = start.arg;
  render(true);
})();
