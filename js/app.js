(function () {
  "use strict";

  var DATA = window.FOODGRAM_DATA, P = window.Plates;
  var main = document.getElementById("contenido");
  var dock = document.getElementById("dock");
  var cookEl = document.getElementById("cook");
  var storyEl = document.getElementById("story");
  var sheetEl = document.getElementById("sheet");
  var toastEl = document.getElementById("toast");
  var KEY = "foodgram.v3";

  // ---------- Estado ----------
  var store = { likes: {}, saved: {}, mias: [], checks: {}, nevera: [], theme: "", follow: { lucia: 1, marco: 1 }, comments: {}, seen: {} }, canStore = true;
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
  var ui = { q: "", cat: "", serv: {}, view: "", arg: "", tab: "grid", stack: [] };

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
    explore: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    fridge: '<rect x="6" y="3" width="12" height="18" rx="2.5"/><path d="M6 10h12M9 6.5v1.5M9 13v3"/>',
    plus: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M12 8v8M8 12h8"/>',
    person: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c.6-3.6 3.6-5.5 7.5-5.5s6.9 1.9 7.5 5.5"/>',
    heart: '<path d="M12 20s-7.5-4.8-7.5-10.4A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.6C19.5 15.2 12 20 12 20Z"/>',
    comment: '<path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.5Z"/>',
    send: '<path d="M21 3 10 14M21 3l-7 18-4-7-7-4Z"/>',
    bookmark: '<path d="M7 4h10v16l-5-3.5L7 20Z"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    moon: '<path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5Z"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    play: '<path d="M8 5.5v13l10-6.5Z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    flame: '<path d="M12 21c-4 0-6.5-2.7-6.5-6.2 0-3.8 3.4-5.6 3.9-9.8 2.4 1.6 3.6 3.6 3.6 5.6 1-.6 1.7-1.8 1.8-3 2 1.6 3.7 4.2 3.7 7.2 0 3.5-2.5 6.2-6.5 6.2Z"/>',
    grid: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9.3 4v16M14.7 4v16M4 9.3h16M4 14.7h16"/>',
    more: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
    chevron: '<path d="m9 6 6 6-6 6"/>',
    knife: '<path d="M4 20 15.5 8.5M14 4l6 6-5 1-2-2Z"/>'
  };
  function icon(name) { return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + ICONS[name] + "</svg>"; }
  function fmtTime(min) {
    if (min < 60) return min + " min";
    var h = Math.floor(min / 60), m = min % 60;
    return h + " h" + (m ? " " + m : "");
  }
  function fmtNum(n) { return n >= 10000 ? (Math.round(n / 100) / 10).toLocaleString("es-ES") + " mil" : n.toLocaleString("es-ES"); }
  function ago(h) { return !h ? "Ahora" : h < 24 ? "Hace " + h + (h === 1 ? " hora" : " horas") : "Hace " + Math.round(h / 24) + (Math.round(h / 24) === 1 ? " día" : " días"); }
  var FRAC = { 0.25: "¼", 0.5: "½", 0.75: "¾" };
  function fmtQty(q, u) {
    if (!q) return u ? u : "al gusto";
    if (u === "g" && q >= 1000) { q = q / 1000; u = "kg"; }
    if (u === "ml" && q >= 1000) { q = q / 1000; u = "l"; }
    var s;
    if ((u === "g" || u === "ml") && q >= 20) s = String(Math.round(q / 5) * 5);
    else if (q >= 10) s = String(Math.round(q));
    else {
      var r = Math.round(q * 4) / 4, whole, frac;
      if (r === 0) r = 0.25;
      whole = Math.floor(r); frac = r - whole;
      s = (whole ? whole : "") + (frac ? (whole ? " " : "") + FRAC[frac] : "");
    }
    return (s + (u && u !== "ud" ? " " + u : "")).trim();
  }
  function allRecipes() { return store.mias.concat(DATA.recetas); }
  function findRecipe(id) { return allRecipes().filter(function (r) { return r.id === id; })[0]; }
  var ME = { id: "yo", nombre: "Tú", handle: "tu.cocina", titulo: "Cocina de casa", color: "#9fd8ff", bio: "Tus recetas viven en este navegador.", lugar: "Tu cocina", seguidores: 0, seguidos: 0, destacadas: [] };
  function chefById(id) { return id === "yo" ? ME : DATA.chefs.filter(function (c) { return c.id === id; })[0]; }
  function chefOf(r) { return chefById(r.chef) || ME; }
  function level(d) { return { "Fácil": 1, "Media": 2, "Difícil": 3 }[d] || 2; }
  function dots(d) { var l = level(d), h = ""; for (var i = 1; i <= 3; i++) h += '<i class="' + (i <= l ? "on" : "") + '"></i>'; return '<span class="dots" role="img" aria-label="Dificultad ' + esc(d) + '">' + h + "</span>"; }
  function link(path, cls, inner, extra) { return '<a href="#/' + path + '" data-go="' + path + '"' + (cls ? ' class="' + cls + '"' : "") + (extra || "") + ">" + inner + "</a>"; }
  function mantel(r) { return 'style="--h:' + (r.mh == null ? 200 : r.mh) + '"'; }
  function photoOf(r) { return r.foto || (DATA.fotos || {})[r.id] || ""; }
  // Foto si existe; si falta o falla, queda la ilustración debajo.
  function media(r, big) {
    var f = photoOf(r);
    return P.draw(r, big ? { label: "Ilustración de " + r.titulo } : null) +
      (f ? '<img class="photo" src="' + esc(f) + '" alt="' + esc(r.titulo) + '" loading="lazy" decoding="async" onerror="this.remove()">' : "");
  }
  function av(c, size, ring) {
    var seen = c.id !== "yo" && store.seen[c.id];
    var inner = '<span class="av" style="--c:' + c.color + '" aria-hidden="true">' + esc(c.nombre.charAt(0)) + "</span>";
    return '<span class="avw' + (size ? " " + size : "") + (ring ? (seen ? " ring seen" : " ring") : "") + '">' + inner + "</span>";
  }
  function likesOf(r) { return (r.likes || 0) + (store.likes[r.id] ? 1 : 0); }
  function commentsOf(r) {
    return (r.comentarios || []).map(function (c) { return { u: chefById(c[0]) || ME, t: c[1] }; })
      .concat((store.comments[r.id] || []).map(function (t) { return { u: ME, t: t }; }));
  }
  function emptyState(text, cta) {
    return '<div class="empty"><span class="plate-e">' + P.draw({ id: "vacio-plato", plato: "cookie" }) + "</span><p>" + text + "</p>" + (cta || "") + "</div>";
  }
  function followBtn(c, small) {
    if (c.id === "yo") return "";
    var on = !!store.follow[c.id];
    return '<button class="follow' + (small ? " sm" : "") + (on ? " on" : "") + '" type="button" data-follow="' + c.id + '" aria-pressed="' + on + '">' + (on ? "Siguiendo" : "Seguir") + "</button>";
  }

  // ---------- Publicación tipo feed ----------
  function post(r, opts) {
    opts = opts || {};
    var c = chefOf(r), liked = !!store.likes[r.id], saved = !!store.saved[r.id], com = commentsOf(r), serv = r.raciones;
    var ings = (r.ingredientes || []).slice(0, 7);
    return '<article class="post" data-post="' + esc(r.id) + '">' +
      '<header class="post-h">' + link("chef/" + c.id, "post-av", av(c, "sm", true), ' aria-label="Perfil de ' + esc(c.nombre) + '"') +
      '<div class="post-who">' + link("chef/" + c.id, "handle", esc(c.handle)) + (c.id !== "yo" && !store.follow[c.id] ? ' · ' + followBtn(c, true) : "") +
      "<small>" + esc(c.lugar || "") + "</small></div>" +
      '<button class="icon-btn ghosty" type="button" data-share="' + esc(r.id) + '" aria-label="Copiar enlace">' + icon("more") + "</button></header>" +
      '<div class="media" data-dbl="' + esc(r.id) + '">' +
      '<div class="slides" data-slides tabindex="0" aria-label="Diapositivas de ' + esc(r.titulo) + '">' +
      '<div class="slide mantel" ' + mantel(r) + ">" + media(r, true) +
      '<span class="sticker mono">' + icon("clock") + fmtTime(r.tiempo) + " · " + esc(r.dificultad) + "</span></div>" +
      '<div class="slide ticket-wrap" ' + mantel(r) + '><div class="ticket"><p class="mono t-h">Comanda · ' + serv + " raciones</p><h4>" + esc(r.titulo) + "</h4><ul>" +
      ings.map(function (i) { return '<li><span>' + esc(i[2]) + '</span><b>' + esc(fmtQty(i[0], i[1])) + "</b></li>"; }).join("") +
      ((r.ingredientes || []).length > ings.length ? '<li class="more">y ' + ((r.ingredientes || []).length - ings.length) + " más…</li>" : "") +
      '</ul><p class="mono t-f">' + (r.pasos || []).length + " pasos · " + fmtTime(r.tiempo) + "</p></div></div>" +
      '<div class="slide secret"><p class="mono">El secreto de ' + esc(c.nombre.split(" ")[0]) + '</p><blockquote>“' + esc(r.secreto) + '”</blockquote><span class="knife">' + icon("knife") + "</span></div>" +
      "</div>" +
      '<span class="pill mono" data-pill>1/3</span><span class="burst" aria-hidden="true">' + icon("heart") + "</span>" +
      link("receta/" + r.id, "recipe-tag", icon("flame") + "<span>Ver receta y cocinar</span>" + icon("chevron")) +
      "</div>" +
      '<div class="post-bar"><div class="post-actions">' +
      '<button class="act" type="button" data-like="' + esc(r.id) + '" aria-pressed="' + liked + '" aria-label="Me gusta">' + icon("heart") + "</button>" +
      '<button class="act" type="button" data-comments="' + esc(r.id) + '" aria-label="Comentarios">' + icon("comment") + "</button>" +
      '<button class="act" type="button" data-share="' + esc(r.id) + '" aria-label="Compartir">' + icon("send") + "</button>" +
      '<span class="dots-c" data-dots><i class="on"></i><i></i><i></i></span>' +
      '<button class="act" type="button" data-save="' + esc(r.id) + '" aria-pressed="' + saved + '" aria-label="Guardar">' + icon("bookmark") + "</button></div>" +
      '<p class="likes"><b data-likes="' + esc(r.id) + '">' + likesOf(r).toLocaleString("es-ES") + " Me gusta</b></p>" +
      '<p class="cap"><b>' + esc(c.handle) + "</b> <strong>" + esc(r.titulo) + ".</strong> " + esc(r.secreto) + "</p>" +
      ((r.tags || []).length ? '<p class="tags">' + r.tags.map(function (t) { return '<button type="button" data-tag="' + esc(t) + '">#' + esc(t) + "</button>"; }).join(" ") + "</p>" : "") +
      (com.length ? '<button class="see-com" type="button" data-comments="' + esc(r.id) + '">Ver ' + (com.length === 1 ? "el comentario" : "los " + com.length + " comentarios") + "</button>" : "") +
      (com.length ? '<p class="last-com"><b>' + esc(com[com.length - 1].u.handle) + "</b> " + esc(com[com.length - 1].t) + "</p>" : "") +
      '<p class="when mono">' + ago(r.horas) + "</p></div></article>";
  }

  // ---------- Vistas ----------
  function storiesRow() {
    var chefs = DATA.chefs.slice().sort(function (a, b) { return (store.seen[a.id] ? 1 : 0) - (store.seen[b.id] ? 1 : 0); });
    return '<div class="stories" role="list" aria-label="Historias">' +
      link("nueva", "story-chip", '<span class="avw ring add-ring">' + '<span class="av me" style="--c:' + ME.color + '">' + icon("plus") + "</span></span><small>Tu historia</small>", ' role="listitem"') +
      chefs.map(function (c) {
        return '<button class="story-chip" type="button" role="listitem" data-story="' + c.id + '">' + av(c, "md", true) + (c.directo ? '<span class="live mono">En directo</span>' : "") + "<small>" + esc(c.handle) + "</small></button>";
      }).join("") + "</div>";
  }
  function sidebar() {
    var sug = DATA.chefs.filter(function (c) { return !store.follow[c.id]; });
    var top = allRecipes().slice().sort(function (a, b) { return likesOf(b) - likesOf(a); }).slice(0, 3);
    return '<aside class="side">' +
      '<div class="me-row">' + link("perfil", "", av(ME, "md")) + '<div><b>' + ME.handle + "</b><small>Cocina de casa</small></div></div>" +
      (sug.length ? '<p class="side-h mono">Cocineros para ti</p>' + sug.map(function (c) {
        return '<div class="sug">' + link("chef/" + c.id, "", av(c, "sm", true)) + '<div>' + link("chef/" + c.id, "handle", esc(c.handle)) + "<small>" + esc(c.titulo) + "</small></div>" + followBtn(c, true) + "</div>";
      }).join("") : "") +
      '<p class="side-h mono">Lo más guardado</p>' + top.map(function (r) {
        return link("receta/" + r.id, "side-rec", '<span class="mantel" ' + mantel(r) + ">" + media(r) + "</span><span><b>" + esc(r.titulo) + "</b><small>" + likesOf(r).toLocaleString("es-ES") + " Me gusta</small></span>");
      }).join("") +
      link("nevera", "fridge-card", icon("fridge") + "<span><b>¿Qué hay en tu nevera?</b><small>Marca lo que tienes y te decimos qué cocinar.</small></span>" + icon("chevron")) +
      "</aside>";
  }
  function viewHome() {
    var feed = allRecipes().slice().sort(function (a, b) { return (a.horas || 0) - (b.horas || 0); });
    return '<div class="home"><div class="feed-col">' + storiesRow() + '<div class="feed">' + feed.map(function (r) { return post(r); }).join("") +
      '<div class="end"><span class="check">✓</span><p><b>Estás al día</b></p><p>Has visto todas las publicaciones recientes.</p></div></div></div>' + sidebar() + "</div>";
  }

  function filtered() {
    return allRecipes().filter(function (r) {
      var c = chefOf(r);
      var hay = norm([r.titulo, r.secreto, c.nombre, c.handle, r.categoria].concat(r.tags || []).concat((r.ingredientes || []).map(function (i) { return i[2]; })).join(" "));
      var q = norm(ui.q.replace(/^#/, ""));
      return (!q || hay.indexOf(q) >= 0) && (!ui.cat || r.categoria === ui.cat || (r.dieta || []).indexOf(ui.cat) >= 0);
    });
  }
  function tile(r, i) {
    return link("receta/" + r.id, "tile mantel" + (i % 7 === 0 ? " big" : ""), media(r) +
      '<span class="tile-ov"><span>' + icon("heart") + fmtNum(likesOf(r)) + "</span><span>" + icon("comment") + commentsOf(r).length + "</span></span>", " " + mantel(r) + ' aria-label="' + esc(r.titulo) + '"');
  }
  function mosaicHtml() {
    var list = filtered();
    if (!list.length) return emptyState("Nada con esa búsqueda.", '<button class="btn" type="button" data-clear>Quitar filtros</button>');
    return list.map(tile).join("");
  }
  function viewExplore() {
    var cats = unique(allRecipes().map(function (r) { return r.categoria; })).concat(["vegano", "vegetariano", "sin gluten"]);
    return '<div class="narrow"><div class="search">' + icon("explore") + '<label class="sr-only" for="q">Buscar</label><input id="q" type="search" placeholder="Busca platos, #etiquetas, cocineros o ingredientes" value="' + esc(ui.q) + '" autocomplete="off"></div>' +
      '<div class="chips" role="group" aria-label="Filtrar">' + cats.map(function (k) { return '<button class="chip" type="button" data-cat="' + esc(k) + '" aria-pressed="' + (ui.cat === k) + '">' + esc(k) + "</button>"; }).join("") + "</div>" +
      '<div class="mosaic" id="mosaic">' + mosaicHtml() + "</div></div>";
  }

  function viewRecipe(id) {
    var r = findRecipe(id);
    if (!r) return notFound();
    var serv = ui.serv[r.id] || r.raciones, k = serv / r.raciones, checks = store.checks[r.id] || {};
    return '<div class="narrow">' + backBtn() + post(r) +
      '<section class="box recipe"><div class="facts"><div class="fact"><span class="mono">Tiempo</span><b>' + fmtTime(r.tiempo) + '</b></div><div class="fact"><span class="mono">Dificultad</span><b>' + dots(r.dificultad) + '</b></div><div class="fact"><span class="mono">Pasos</span><b>' + (r.pasos || []).length + "</b></div></div>" +
      ((r.dieta || []).length ? '<div class="tags-row">' + r.dieta.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" : "") +
      '<button class="btn block" type="button" data-cook="' + esc(r.id) + '">' + icon("flame") + "Modo cocina, paso a paso</button></section>" +
      '<section class="box"><div class="box-h"><h2>Ingredientes</h2><div class="stepper" role="group" aria-label="Raciones">' +
      '<button type="button" data-serv="-1" aria-label="Menos raciones">−</button><output aria-live="polite">' + serv + (serv === 1 ? " ración" : " raciones") + '</output><button type="button" data-serv="1" aria-label="Más raciones">+</button></div></div>' +
      '<ul class="ings">' + (r.ingredientes || []).map(function (ing, i) {
        return '<li><label><input type="checkbox" id="ing-' + esc(r.id) + "-" + i + '" data-check="' + esc(r.id) + '" data-i="' + i + '"' + (checks[i] ? " checked" : "") +
          '><span class="q">' + esc(fmtQty(ing[0] * k, ing[1])) + "</span><span>" + esc(ing[2]) + "</span></label></li>";
      }).join("") + "</ul></section>" +
      '<section class="box"><div class="box-h"><h2>Preparación</h2></div><ol class="steps">' + (r.pasos || []).map(function (p, i) {
        return "<li><div>" + esc(p.t) + (p.min ? '<br><button class="tmr" type="button" data-cook="' + esc(r.id) + '" data-step="' + i + '">' + icon("clock") + "Temporizador " + p.min + " min</button>" : "") + "</div></li>";
      }).join("") + "</ol></section></div>";
  }

  function profileView(c, isMe) {
    var rs = allRecipes().filter(function (r) { return r.chef === c.id; });
    var saved = allRecipes().filter(function (r) { return store.saved[r.id]; });
    var foll = (c.seguidores || 0) + (store.follow[c.id] ? 1 : 0);
    var seguidos = isMe ? Object.keys(store.follow).length : c.seguidos;
    var list = isMe && ui.tab === "saved" ? saved : rs;
    var cats = isMe ? unique(rs.map(function (r) { return r.categoria; })) : (c.destacadas || []);
    return '<div class="narrow">' + (isMe ? "" : backBtn()) +
      '<header class="prof"><div class="prof-av">' + (isMe ? av(c, "xl") : '<button type="button" class="bare" data-story="' + c.id + '" aria-label="Ver historia">' + av(c, "xl", true) + "</button>") + "</div>" +
      '<div class="prof-main"><div class="prof-name"><h1>' + esc(c.handle) + "</h1>" + (isMe ? link("nueva", "btn sm ghost", "Publicar") : followBtn(c) + '<button class="btn sm ghost" type="button" data-msg>Mensaje</button>') + "</div>" +
      '<ul class="counts"><li><b>' + rs.length + "</b> publicaciones</li><li><b>" + fmtNum(foll) + "</b> seguidores</li><li><b>" + seguidos + "</b> seguidos</li></ul>" +
      '<p class="bio"><b>' + esc(c.nombre) + "</b><span>" + esc(c.titulo) + "</span>" + esc(c.bio || "") + (c.lugar ? '<span class="loc">📍 ' + esc(c.lugar) + "</span>" : "") + "</p></div></header>" +
      (cats.length ? '<div class="highlights">' + cats.map(function (h, i) {
        var r = rs[i % Math.max(1, rs.length)] || { id: "hl-" + h, plato: P.types[i % P.types.length], mh: 200 };
        return '<button type="button" class="hl" data-tagcat="' + esc(h) + '"><span class="hl-c mantel" ' + mantel(r) + ">" + media(r) + "</span><small>" + esc(h) + "</small></button>";
      }).join("") + "</div>" : "") +
      '<div class="ptabs" role="tablist">' +
      '<button type="button" role="tab" data-tab="grid" aria-selected="' + (ui.tab !== "saved" || !isMe) + '">' + icon("grid") + "Publicaciones</button>" +
      (isMe ? '<button type="button" role="tab" data-tab="saved" aria-selected="' + (ui.tab === "saved") + '">' + icon("bookmark") + "Guardadas</button>" : "") + "</div>" +
      (list.length ? '<div class="pgrid">' + list.map(function (r) { return link("receta/" + r.id, "tile mantel", media(r) + '<span class="tile-ov"><span>' + icon("heart") + fmtNum(likesOf(r)) + "</span></span>", " " + mantel(r) + ' aria-label="' + esc(r.titulo) + '"'); }).join("") + "</div>"
        : emptyState(isMe && ui.tab === "saved" ? "Guarda recetas con el marcador y aparecerán aquí." : isMe ? "Aún no has publicado nada. ¿Cuál es tu secreto?" : "Sin publicaciones todavía.", isMe && ui.tab !== "saved" ? link("nueva", "btn", "Publicar receta") : "")) +
      (isMe ? '<div class="btns center"><button class="btn ghost sm" type="button" id="reset">Borrar mis datos</button></div>' : "") + "</div>";
  }
  function viewChef(id) { var c = chefById(id); return c ? profileView(c, id === "yo") : notFound(); }

  function viewActivity() {
    var items = [];
    DATA.recetas.forEach(function (r) { (r.comentarios || []).forEach(function (c) { items.push({ c: chefById(c[0]), r: r, t: "comentó: " + c[1], h: r.horas + 1 }); }); });
    items.sort(function (a, b) { return a.h - b.h; });
    return '<div class="narrow"><header class="page-h"><h1>Actividad</h1><p>Lo que se cuece en tu muro.</p></header><div class="acts">' +
      items.slice(0, 14).map(function (it) {
        return '<div class="act-row">' + link("chef/" + it.c.id, "", av(it.c, "sm")) + "<p><b>" + esc(it.c.handle) + "</b> " + esc(it.t) + ' <span class="mono">' + ago(it.h) + "</span></p>" + link("receta/" + it.r.id, "act-th mantel", media(it.r), " " + mantel(it.r) + ' aria-label="' + esc(it.r.titulo) + '"') + "</div>";
      }).join("") + "</div></div>";
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
      return link("receta/" + x.r.id, "match", '<span class="mantel" ' + mantel(x.r) + ">" + media(x.r) + "</span>" +
        "<span><h3>" + esc(x.r.titulo) + '</h3><span class="meter" aria-hidden="true"><i style="width:' + Math.round(x.ratio * 100) + '%"></i></span>' +
        "<p><b>Tienes " + x.got.length + " de " + x.need.length + "</b>" + (x.miss.length ? " · Te falta: " + esc(x.miss.join(", ")) : " · ¡Lo tienes todo!") + "</p></span>");
    }).join("");
  }
  function viewFridge() {
    return '<div class="narrow"><header class="page-h"><h1>¿Qué hay en la nevera?</h1>' +
      "<p>Toca lo que tienes en casa. Sal, aceite, agua y especias se dan por hechos.</p></header>" +
      '<div class="pantry" role="group" aria-label="Ingredientes que tienes">' + fridgeItems().map(function (k) {
        return '<button class="chip" type="button" data-fridge="' + esc(k) + '" aria-pressed="' + (store.nevera.indexOf(k) >= 0) + '">' + esc(k) + "</button>";
      }).join("") + "</div>" +
      '<div class="box-h" style="margin-top:28px"><h2>Puedes cocinar</h2><button class="chip" type="button" data-fridge-clear' + (store.nevera.length ? "" : " hidden") + ">Vaciar nevera</button></div>" +
      '<div id="matches">' + fridgeResultsHtml() + "</div></div>";
  }

  function viewNew() {
    var cats = unique(allRecipes().map(function (r) { return r.categoria; }));
    return '<div class="narrow"><header class="page-h"><h1>Nueva publicación</h1><p>Sube una foto o elige una ilustración, cuenta tu secreto y los pasos.</p></header>' +
      '<form class="new" id="form" novalidate>' +
      '<div class="field"><label for="f-foto">Foto del plato</label><input id="f-foto" name="foto" type="file" accept="image/*"><span class="hint" id="foto-hint">Recomendado. Se recorta en cuadrado.</span></div>' +
      '<fieldset class="field"><legend>Si no tienes foto, elige una ilustración</legend><div class="platepick">' + P.types.map(function (t, i) {
        return '<input type="radio" name="plato" id="pp-' + t + '" value="' + t + '"' + (i === 0 ? " checked" : "") + '><label for="pp-' + t + '">' + P.draw({ id: "muestra-" + t, plato: t }) + P.names[t] + "</label>";
      }).join("") + "</div></fieldset>" +
      '<div class="field"><label for="f-titulo">Nombre del plato</label><input id="f-titulo" name="titulo" maxlength="70" placeholder="Lentejas de mi abuela"></div>' +
      '<div class="field"><label for="f-secreto">El secreto</label><textarea id="f-secreto" name="secreto" maxlength="280" placeholder="Un chorrito de vinagre al final despierta todo el guiso."></textarea></div>' +
      '<div class="row"><div class="field"><label for="f-cat">Categoría</label><input id="f-cat" name="categoria" list="cats" value="Guisos"><datalist id="cats">' + cats.map(function (c) { return "<option>" + esc(c) + "</option>"; }).join("") + "</datalist></div>" +
      '<div class="field"><label for="f-dif">Dificultad</label><select id="f-dif" name="dificultad"><option>Fácil</option><option selected>Media</option><option>Difícil</option></select></div>' +
      '<div class="field"><label for="f-t">Minutos</label><input id="f-t" name="tiempo" type="number" inputmode="numeric" min="1" max="2880" value="40"></div>' +
      '<div class="field"><label for="f-r">Raciones</label><input id="f-r" name="raciones" type="number" inputmode="numeric" min="1" max="50" value="4"></div></div>' +
      '<div class="field"><label for="f-ing">Ingredientes</label><textarea id="f-ing" name="ingredientes" placeholder="300 g de lentejas&#10;1 cebolla&#10;2 dientes de ajo"></textarea><span class="hint">Uno por línea. Empieza por cantidad y unidad para que se recalculen al cambiar raciones.</span></div>' +
      '<div class="field"><label for="f-pasos">Pasos</label><textarea id="f-pasos" name="pasos" placeholder="Sofríe la verdura (10 min)&#10;Añade las lentejas y el agua (40 min)"></textarea><span class="hint">Uno por línea. Minutos entre paréntesis = temporizador.</span></div>' +
      '<div class="field"><label for="f-tags">Etiquetas</label><input id="f-tags" name="tags" placeholder="#legumbres #cuchara"></div>' +
      '<p class="form-error" id="form-error" role="alert" hidden></p>' +
      '<button class="btn block" type="submit">Compartir</button></form></div>';
  }

  function notFound() { return '<div class="narrow">' + emptyState("Ese plato no está en la carta.", link("", "btn", "Volver al inicio")) + "</div>"; }
  function backBtn() { return '<button class="back" type="button" data-back>' + icon("back") + "Volver</button>"; }

  // ---------- Router ----------
  var NAV = [["", "Inicio", "home"], ["explorar", "Explorar", "explore"], ["nueva", "Publicar", "plus"], ["nevera", "Nevera", "fridge"], ["perfil", "Perfil", "person"]];
  function parse(path) { var p = String(path || "").replace(/^#?\/?/, "").split("/"); return { v: p[0] || "", arg: decodeURIComponent(p[1] || "") }; }
  function render(keepScroll) {
    var v = ui.view, a = ui.arg, html;
    if (v === "") html = viewHome();
    else if (v === "explorar") html = viewExplore();
    else if (v === "nevera") html = viewFridge();
    else if (v === "nueva") html = viewNew();
    else if (v === "perfil") html = profileView(ME, true);
    else if (v === "actividad") html = viewActivity();
    else if (v === "receta") html = viewRecipe(a);
    else if (v === "chef") html = viewChef(a);
    else html = notFound();
    main.innerHTML = '<div class="view">' + html + "</div>";
    var r = v === "receta" && findRecipe(a);
    document.title = r ? r.titulo + " · Foodgram" : "Foodgram";
    dock.innerHTML = '<a class="rail-logo wordmark" href="#/" data-go="">f<span class="o" aria-hidden="true"></span>odgram</a>' + NAV.map(function (n) {
      return '<a href="#/' + n[0] + '" data-go="' + n[0] + '"' + (n[0] === v ? ' aria-current="page"' : "") + ">" + icon(n[2]) + "<span>" + n[1] + "</span></a>";
    }).join("") + '<a class="rail-only" href="#/actividad" data-go="actividad"' + (v === "actividad" ? ' aria-current="page"' : "") + ">" + icon("heart") + "<span>Actividad</span></a>";
    if (!keepScroll) { window.scrollTo(0, 0); if (v) main.focus({ preventScroll: true }); }
  }
  function go(path, replace) {
    var p = parse(path);
    if (!replace) ui.stack.push(ui.view + (ui.arg ? "/" + ui.arg : ""));
    if (p.v !== ui.view) ui.tab = "grid";
    ui.view = p.v; ui.arg = p.arg;
    try { history[replace ? "replaceState" : "pushState"](null, "", "#/" + path); } catch (e) { /* visor sin historial */ }
    render();
  }
  window.addEventListener("popstate", function () { var p = parse(location.hash); ui.view = p.v; ui.arg = p.arg; ui.stack.pop(); render(); });

  // ---------- Interacción ----------
  function setLike(id, on) {
    var r = findRecipe(id); if (!r) return;
    on ? (store.likes[id] = 1) : delete store.likes[id]; save();
    Array.prototype.forEach.call(document.querySelectorAll('[data-like="' + id + '"]'), function (b) {
      b.setAttribute("aria-pressed", String(on)); if (on) { b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); }
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-likes="' + id + '"]'), function (el) { el.textContent = likesOf(r).toLocaleString("es-ES") + " Me gusta"; });
  }
  function burst(mediaEl) {
    var b = mediaEl.querySelector(".burst"); if (!b) return;
    b.classList.remove("go"); void b.offsetWidth; b.classList.add("go");
  }
  function copyLink(r) {
    var url = location.href.split("#")[0] + "#/receta/" + r.id;
    function fallback() { toast("Enlace: " + url); }
    try { navigator.clipboard.writeText(url).then(function () { toast("Enlace copiado"); }, fallback); } catch (e) { fallback(); }
  }

  var lastTap = { id: "", t: 0 };
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-go]");
    if (a) { e.preventDefault(); go(a.getAttribute("data-go")); return; }
    var m = e.target.closest("[data-dbl]");
    if (m && !e.target.closest("button")) {
      var now = Date.now(), id0 = m.dataset.dbl;
      if (lastTap.id === id0 && now - lastTap.t < 320) { setLike(id0, true); burst(m); lastTap.t = 0; } else lastTap = { id: id0, t: now };
      return;
    }
    var t = e.target.closest("button");
    if (!t) return;
    var d = t.dataset;
    if (d.like) setLike(d.like, !store.likes[d.like]);
    else if (d.save) {
      var was = !!store.saved[d.save]; was ? delete store.saved[d.save] : (store.saved[d.save] = 1); save();
      Array.prototype.forEach.call(document.querySelectorAll('[data-save="' + d.save + '"]'), function (b) { b.setAttribute("aria-pressed", String(!was)); });
      toast(was ? "Quitada de guardadas" : "Guardada en tu perfil");
    } else if (d.share) copyLink(findRecipe(d.share));
    else if (d.comments) openSheet(d.comments);
    else if (d.follow) {
      var on = !store.follow[d.follow]; on ? (store.follow[d.follow] = 1) : delete store.follow[d.follow]; save();
      toast(on ? "Ahora sigues a " + chefById(d.follow).handle : "Has dejado de seguir a " + chefById(d.follow).handle);
      render(true);
    } else if (d.story) openStory(d.story);
    else if (d.tag) { ui.q = "#" + d.tag; ui.cat = ""; go("explorar"); }
    else if (d.tagcat) { ui.q = d.tagcat; ui.cat = ""; go("explorar"); }
    else if (t.hasAttribute("data-cat")) {
      ui.cat = ui.cat === d.cat ? "" : d.cat;
      Array.prototype.forEach.call(document.querySelectorAll("[data-cat]"), function (c) { c.setAttribute("aria-pressed", String(c.dataset.cat === ui.cat)); });
      updateMosaic();
    } else if (t.hasAttribute("data-clear")) { ui.q = ""; ui.cat = ""; render(true); }
    else if (d.serv) {
      var r = findRecipe(ui.arg); if (!r) return;
      ui.serv[r.id] = Math.min(60, Math.max(1, (ui.serv[r.id] || r.raciones) + (+d.serv))); render(true);
    } else if (d.fridge) {
      var i = store.nevera.indexOf(d.fridge); i >= 0 ? store.nevera.splice(i, 1) : store.nevera.push(d.fridge); save();
      t.setAttribute("aria-pressed", String(i < 0));
      document.getElementById("matches").innerHTML = fridgeResultsHtml();
      document.querySelector("[data-fridge-clear]").hidden = !store.nevera.length;
    } else if (t.hasAttribute("data-fridge-clear")) { store.nevera = []; save(); render(true); }
    else if (d.cook) openCook(d.cook, +(d.step || 0), d.step != null);
    else if (d.tab) { ui.tab = d.tab; render(true); }
    else if (t.hasAttribute("data-msg")) toast("Los mensajes llegarán con las cuentas de usuario.");
    else if (t.hasAttribute("data-back")) {
      var prev = ui.stack.pop(); var p = parse(prev || ""); ui.view = p.v; ui.arg = p.arg;
      try { history.replaceState(null, "", "#/" + (prev || "")); } catch (er) { /* sin historial */ }
      render();
    } else if (t.id === "reset") {
      if (!t.dataset.sure) { t.dataset.sure = "1"; t.textContent = "Pulsa otra vez para borrarlo todo"; return; }
      store.likes = {}; store.saved = {}; store.mias = []; store.checks = {}; store.nevera = []; store.comments = {}; store.seen = {}; save(); render(true); toast("Datos borrados");
    } else if (t.id === "theme") {
      var cur = document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      store.theme = cur === "dark" ? "light" : "dark"; applyTheme(); save();
    }
  });
  // Diapositivas: puntos y contador
  document.addEventListener("scroll", function (e) {
    var s = e.target; if (!s.matches || !s.matches("[data-slides]")) return;
    var i = Math.round(s.scrollLeft / s.clientWidth), postEl = s.closest(".post");
    postEl.querySelector("[data-pill]").textContent = (i + 1) + "/3";
    Array.prototype.forEach.call(postEl.querySelectorAll("[data-dots] i"), function (dt, k) { dt.className = k === i ? "on" : ""; });
  }, true);
  document.addEventListener("keydown", function (e) {
    var s = e.target.matches && e.target.matches("[data-slides]") ? e.target : null;
    if (s && (e.key === "ArrowRight" || e.key === "ArrowLeft")) { e.preventDefault(); s.scrollBy({ left: (e.key === "ArrowRight" ? 1 : -1) * s.clientWidth, behavior: "smooth" }); }
  });
  function updateMosaic() { var g = document.getElementById("mosaic"); if (g) g.innerHTML = mosaicHtml(); }
  main.addEventListener("input", function (e) { if (e.target.id === "q") { ui.q = e.target.value; updateMosaic(); } });
  main.addEventListener("change", function (e) {
    var t = e.target;
    if (t.dataset.check) {
      var c = store.checks[t.dataset.check] || (store.checks[t.dataset.check] = {});
      t.checked ? (c[t.dataset.i] = 1) : delete c[t.dataset.i]; save();
    } else if (t.id === "f-foto" && t.files[0]) {
      shrink(t.files[0], function (data) { t.dataset.data = data; document.getElementById("foto-hint").textContent = "Foto lista ✓"; });
    }
  });

  // ---------- Comentarios ----------
  var sheetId = null;
  function openSheet(id) {
    var r = findRecipe(id); if (!r) return;
    sheetId = id; sheetEl.hidden = false; document.body.style.overflow = "hidden";
    drawSheet(); var inp = document.getElementById("c-in"); inp && inp.focus();
  }
  function drawSheet() {
    var r = findRecipe(sheetId), c = chefOf(r), com = commentsOf(r);
    sheetEl.innerHTML = '<div class="sheet-bg" data-sheet-close></div><div class="sheet-card" role="dialog" aria-modal="true" aria-label="Comentarios"><div class="sheet-h"><span class="grab"></span><h2>Comentarios</h2><button class="icon-btn ghosty" type="button" data-sheet-close aria-label="Cerrar">' + icon("close") + "</button></div>" +
      '<div class="sheet-list"><div class="com op">' + av(c, "sm") + "<p><b>" + esc(c.handle) + "</b> " + esc(r.secreto) + "</p></div>" +
      com.map(function (x) { return '<div class="com">' + av(x.u, "sm") + "<p><b>" + esc(x.u.handle) + "</b> " + esc(x.t) + "</p></div>"; }).join("") + "</div>" +
      '<div class="quick">' + ["🔥", "😍", "👏", "🤤", "🙌", "👨‍🍳"].map(function (em) { return '<button type="button" data-emoji="' + em + '">' + em + "</button>"; }).join("") + "</div>" +
      '<form class="sheet-f" id="c-form">' + av(ME, "sm") + '<label class="sr-only" for="c-in">Añade un comentario</label><input id="c-in" maxlength="200" placeholder="Añade un comentario…" autocomplete="off"><button type="submit" class="link-btn">Publicar</button></form></div>';
    var list = sheetEl.querySelector(".sheet-list"); list.scrollTop = list.scrollHeight;
  }
  function closeSheet() { sheetEl.hidden = true; sheetEl.innerHTML = ""; sheetId = null; document.body.style.overflow = ""; }
  sheetEl.addEventListener("click", function (e) {
    if (e.target.closest("[data-sheet-close]")) closeSheet();
    var em = e.target.closest("[data-emoji]"); if (em) { var i = document.getElementById("c-in"); i.value += em.dataset.emoji; i.focus(); }
  });
  sheetEl.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = document.getElementById("c-in").value.trim(); if (!v) return;
    (store.comments[sheetId] || (store.comments[sheetId] = [])).push(v); save();
    var id = sheetId; drawSheet(); document.getElementById("c-in").focus();
    if (ui.view === "" || ui.view === "receta") render(true);
    sheetId = id;
  });

  // ---------- Historias ----------
  var st = null, raf = 0, STORY_MS = 6000;
  function storyChefs() { return DATA.chefs.slice().sort(function (a, b) { return (store.seen[a.id] ? 1 : 0) - (store.seen[b.id] ? 1 : 0); }); }
  function openStory(chefId) {
    var list = storyChefs(), ci = list.map(function (c) { return c.id; }).indexOf(chefId);
    if (ci < 0) return;
    st = { list: list, ci: ci, si: 0, t0: 0, elapsed: 0, paused: false };
    storyEl.hidden = false; document.body.style.overflow = "hidden"; drawStory();
  }
  function storySlides(c) { return allRecipes().filter(function (r) { return r.chef === c.id; }); }
  function drawStory() {
    var c = st.list[st.ci], slides = storySlides(c), r = slides[st.si];
    store.seen[c.id] = 1; save();
    storyEl.innerHTML = '<div class="st-frame mantel" ' + mantel(r) + '>' +
      '<div class="st-bars">' + slides.map(function (x, i) { return '<i><b style="width:' + (i < st.si ? 100 : 0) + '%"' + (i === st.si ? " data-bar" : "") + "></b></i>"; }).join("") + "</div>" +
      '<div class="st-h">' + av(c, "sm") + "<b>" + esc(c.handle) + '</b><span class="mono">' + ago(r.horas) + "</span>" + (c.directo ? '<span class="live mono">En directo</span>' : "") +
      '<button class="icon-btn ghosty" type="button" data-st-close aria-label="Cerrar historia">' + icon("close") + "</button></div>" +
      '<div class="st-plate">' + media(r, true) + "</div>" +
      '<p class="st-sticker">' + esc(r.secreto) + "</p>" +
      '<span class="st-time mono">' + icon("clock") + fmtTime(r.tiempo) + "</span>" +
      '<button class="st-zone prev" type="button" data-st-prev aria-label="Anterior"></button><button class="st-zone next" type="button" data-st-next aria-label="Siguiente"></button>' +
      '<button class="st-cta" type="button" data-st-open="' + esc(r.id) + '">' + icon("flame") + "Ver receta</button></div>";
    st.elapsed = 0; st.t0 = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(stepStory);
  }
  function stepStory(now) {
    if (!st) return;
    if (!st.paused) {
      st.elapsed += now - st.t0;
      var bar = storyEl.querySelector("[data-bar]"); if (bar) bar.style.width = Math.min(100, st.elapsed / STORY_MS * 100) + "%";
      if (st.elapsed >= STORY_MS) { nextStory(); return; }
    }
    st.t0 = now; raf = requestAnimationFrame(stepStory);
  }
  function nextStory() {
    var n = storySlides(st.list[st.ci]).length;
    if (st.si < n - 1) st.si++; else if (st.ci < st.list.length - 1) { st.ci++; st.si = 0; } else { closeStory(); return; }
    drawStory();
  }
  function prevStory() {
    if (st.si > 0) st.si--; else if (st.ci > 0) { st.ci--; st.si = 0; }
    drawStory();
  }
  function closeStory() { cancelAnimationFrame(raf); st = null; storyEl.hidden = true; storyEl.innerHTML = ""; document.body.style.overflow = ""; if (ui.view === "") render(true); }
  storyEl.addEventListener("click", function (e) {
    var t = e.target.closest("button"); if (!t || !st) return;
    if (t.hasAttribute("data-st-close")) closeStory();
    else if (t.hasAttribute("data-st-next")) nextStory();
    else if (t.hasAttribute("data-st-prev")) prevStory();
    else if (t.dataset.stOpen) { var id = t.dataset.stOpen; closeStory(); go("receta/" + id); }
  });
  storyEl.addEventListener("pointerdown", function (e) { if (st && e.target.closest(".st-zone")) { st.holdT = setTimeout(function () { st && (st.paused = true); }, 180); } });
  ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) { storyEl.addEventListener(ev, function () { if (st) { clearTimeout(st.holdT); st.paused = false; } }); });
  document.addEventListener("keydown", function (e) {
    if (st) { if (e.key === "Escape") closeStory(); else if (e.key === "ArrowRight") nextStory(); else if (e.key === "ArrowLeft") prevStory(); }
    else if (sheetId && e.key === "Escape") closeSheet();
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
      foto: f.foto.dataset.data || "", secreto: secreto, ingredientes: ing.map(parseIng), pasos: pasos.map(parseStep),
      likes: 0, horas: 0, comentarios: [], tags: unique((f.tags.value.match(/[\wáéíóúñü]+/gi) || []).map(function (x) { return x.toLowerCase(); }))
    };
    store.mias.unshift(r);
    if (!save()) { store.mias.shift(); return; }
    toast("Publicado"); go("receta/" + r.id, true);
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
    cookEl.querySelector(".ring .fg").setAttribute("stroke-dashoffset", String(314.16 * (1 - cook.left / cook.total)));
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
