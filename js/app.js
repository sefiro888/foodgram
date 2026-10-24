(function () {
  "use strict";

  var DATA = window.FOODGRAM_DATA;
  var main = document.getElementById("contenido");
  var toastEl = document.getElementById("toast");
  var KEY = "foodgram.v1";

  // ---------- Estado persistente (localStorage con respaldo en memoria) ----------
  var state = { likes: {}, saved: {}, mias: [], checks: {}, filtro: { q: "", cat: "", dieta: "" } };
  var persisted = { likes: {}, saved: {}, mias: [], checks: {}, theme: "" };
  try {
    var raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    Object.keys(persisted).forEach(function (k) { if (raw[k] != null) persisted[k] = raw[k]; });
  } catch (e) { /* sin almacenamiento: la app sigue funcionando en memoria */ }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(persisted)); return true; }
    catch (e) { toast("No se pudo guardar en este navegador"); return false; }
  }

  // ---------- Utilidades ----------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function toast(msg) {
    toastEl.textContent = msg; toastEl.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(function () { toastEl.hidden = true; }, 2200);
  }
  function icon(name, filled) {
    var p = {
      home: '<path d="M3 11 12 3l9 8v10h-6v-6H9v6H3Z"/>',
      explore: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/>',
      add: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
      bookmark: '<path d="M6 3h12v18l-6-4-6 4Z"/>',
      person: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',
      heart: '<path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11Z"/>',
      share: '<path d="M12 3v12M7 8l5-5 5 5M5 14v6h14v-6"/>',
      search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
      back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
      users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-5 7-5s7 1.5 7 5M17 4.5a3.5 3.5 0 0 1 0 7M22 20c0-2.5-1.5-4-4-4.7"/>',
      chef: '<path d="M7 14a4 4 0 1 1 1-7.9A4.5 4.5 0 0 1 16 6a4 4 0 1 1 1 8v5H7Z"/>'
    }[name];
    return '<svg class="icon' + (filled ? " filled" : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + p + "</svg>";
  }
  function fmtTime(min) {
    if (min < 60) return min + " min";
    var h = Math.floor(min / 60), m = min % 60;
    return h + " h" + (m ? " " + m + " min" : "");
  }
  function allRecipes() { return persisted.mias.concat(DATA.recetas); }
  function findRecipe(id) { return allRecipes().filter(function (r) { return r.id === id; })[0]; }
  function chefOf(r) {
    if (r.chef === "yo") return { id: "yo", nombre: "Tú", titulo: "Cocinero casero", color: "yellow", avatar: "" };
    return DATA.chefs.filter(function (c) { return c.id === r.chef; })[0] ||
      { id: "?", nombre: "Anónimo", titulo: "", color: "orange", avatar: "" };
  }
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }

  function avatar(c) {
    return c.avatar
      ? '<img class="avatar ' + c.color + '" src="' + esc(c.avatar) + '" alt="Retrato de ' + esc(c.nombre) + '" width="48" height="48" loading="lazy" referrerpolicy="no-referrer">'
      : '<span class="avatar ' + c.color + '" aria-hidden="true">' + esc(c.nombre.charAt(0)) + "</span>";
  }
  function photo(r, eager) {
    return '<img src="' + esc(r.foto) + '" alt="' + esc(r.fotoAlt || r.titulo) + '" width="800" height="1000" ' +
      (eager ? "" : 'loading="lazy" ') + 'decoding="async" referrerpolicy="no-referrer" onerror="this.remove()">' +
      '<span class="fallback" aria-hidden="true">🍽️</span>';
  }
  function actions(r) {
    var liked = !!persisted.likes[r.id], saved = !!persisted.saved[r.id];
    return '<div class="actions">' +
      '<button class="act" data-like="' + esc(r.id) + '" aria-pressed="' + liked + '">' + icon("heart") + "<span>" + (liked ? "Te gusta" : "Me gusta") + "</span></button>" +
      '<button class="act" data-save="' + esc(r.id) + '" aria-pressed="' + saved + '">' + icon("bookmark") + "<span>" + (saved ? "Guardada" : "Guardar") + "</span></button>" +
      '<span class="spacer"></span>' +
      '<button class="act" data-share="' + esc(r.id) + '" aria-label="Compartir ' + esc(r.titulo) + '">' + icon("share") + "</button></div>";
  }
  function card(r, first) {
    var c = chefOf(r);
    return '<article class="card"><a class="post-head" href="#/chef/' + esc(c.id) + '">' + avatar(c) +
      "<div><h3>" + esc(c.nombre) + "</h3><p>" + esc(c.titulo) + "</p></div></a>" +
      '<div class="media">' + photo(r, first) +
      '<div class="overlay"><div class="glass"><h4>' + esc(r.titulo) + "</h4>" +
      '<p class="meta"><span>' + icon("clock") + fmtTime(r.tiempo) + "</span><span>" + icon("chef") + esc(r.dificultad) +
      "</span><span>" + icon("users") + r.raciones + " raciones</span></p>" +
      "<p>“" + esc(r.secreto) + "”</p>" +
      '<a class="btn block" href="#/receta/' + esc(r.id) + '">Descubrir más ' + icon("arrow") + "</a></div></div></div>" +
      actions(r) + "</article>";
  }
  function mini(r) {
    return '<a class="mini" href="#/receta/' + esc(r.id) + '">' +
      (r.foto ? '<img src="' + esc(r.foto) + '" alt="" width="72" height="72" loading="lazy" referrerpolicy="no-referrer" onerror="this.outerHTML=\'<span class=ph>🍽️</span>\'">' : '<span class="ph">🍽️</span>') +
      "<div><h4>" + esc(r.titulo) + "</h4><p>" + esc(chefOf(r).nombre) + " · " + fmtTime(r.tiempo) + "</p></div></a>";
  }

  // ---------- Vistas ----------
  function filtered() {
    var f = state.filtro;
    return allRecipes().filter(function (r) {
      var hay = norm([r.titulo, r.secreto, chefOf(r).nombre, r.categoria].concat(r.ingredientes || []).join(" "));
      return (!f.q || hay.indexOf(norm(f.q)) >= 0) && (!f.cat || r.categoria === f.cat) && (!f.dieta || (r.dieta || []).indexOf(f.dieta) >= 0);
    });
  }
  function viewFeed() {
    var f = state.filtro;
    var cats = unique(allRecipes().map(function (r) { return r.categoria; }));
    var dietas = unique(allRecipes().reduce(function (a, r) { return a.concat(r.dieta || []); }, []));
    var list = filtered();
    var chip = function (kind, v) {
      return '<button class="chip" data-chip="' + kind + '" data-v="' + esc(v) + '" aria-pressed="' + (f[kind] === v) + '">' + esc(v) + "</button>";
    };
    return '<h2 class="page-title">Muro de Secretos</h2><p class="page-sub">Susurros de cocina y maravillas culinarias</p>' +
      '<div class="tools"><div class="search">' + icon("search") + '<label class="sr-only" for="q">Buscar recetas</label>' +
      '<input id="q" type="search" placeholder="Buscar por plato, chef o ingrediente" value="' + esc(f.q) + '" autocomplete="off"></div>' +
      '<div class="chips" role="group" aria-label="Filtros">' + cats.map(function (c) { return chip("cat", c); }).join("") +
      dietas.map(function (d) { return chip("dieta", d); }).join("") + "</div></div>" +
      '<div class="feed" id="feed">' + feedHtml(list) + "</div>";
  }
  function feedHtml(list) {
    if (!list.length) return '<div class="empty"><p>No hay recetas con esos filtros.</p><button class="btn" data-clear>Quitar filtros</button></div>';
    return list.map(function (r, i) { return card(r, i === 0); }).join("");
  }
  function unique(a) { return a.filter(function (x, i) { return x && a.indexOf(x) === i; }); }

  function viewRecipe(id) {
    var r = findRecipe(id);
    if (!r) return notFound();
    var c = chefOf(r), checks = persisted.checks[r.id] || {};
    return '<div class="detail"><a class="back" href="#/">' + icon("back") + " Volver</a>" +
      '<div class="media">' + photo(r, true) + "</div>" +
      "<h2>" + esc(r.titulo) + "</h2>" +
      '<a class="post-head" href="#/chef/' + esc(c.id) + '">' + avatar(c) + "<div><h3>" + esc(c.nombre) + "</h3><p>" + esc(c.titulo) + "</p></div></a>" +
      '<p class="meta" style="color:var(--muted)"><span>' + icon("clock") + fmtTime(r.tiempo) + "</span><span>" + icon("chef") + esc(r.dificultad) + "</span><span>" + icon("users") + r.raciones + " raciones</span></p>" +
      '<div class="tags">' + [r.categoria].concat(r.dieta || []).filter(Boolean).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" +
      actions(r) +
      '<p class="quote">“' + esc(r.secreto) + "”</p>" +
      "<h3>Ingredientes</h3><ul class=\"chk\">" + (r.ingredientes || []).map(function (ing, i) {
        return '<li><label><input type="checkbox" data-check="' + esc(r.id) + '" data-i="' + i + '"' + (checks[i] ? " checked" : "") + "><span>" + esc(ing) + "</span></label></li>";
      }).join("") + "</ul>" +
      "<h3>Preparación</h3><ol>" + (r.pasos || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ol></div>";
  }

  function viewExplore() {
    var cats = unique(allRecipes().map(function (r) { return r.categoria; }));
    return '<h2 class="page-title">Explorar</h2><p class="page-sub">Categorías y chefs</p><div class="cats">' +
      cats.map(function (c) {
        var n = allRecipes().filter(function (r) { return r.categoria === c; }).length;
        return '<button class="cat" data-go-cat="' + esc(c) + '"><strong>' + esc(c) + "</strong><small>" + n + (n === 1 ? " receta" : " recetas") + "</small></button>";
      }).join("") + '</div><h3 class="section-title">Chefs destacados</h3>' +
      DATA.chefs.map(function (c) {
        return '<a class="mini" href="#/chef/' + esc(c.id) + '">' + avatar(c) + "<div><h4>" + esc(c.nombre) + "</h4><p>" + esc(c.titulo) + "</p></div></a>";
      }).join("");
  }

  function viewChef(id) {
    var c = id === "yo" ? chefOf({ chef: "yo" }) : DATA.chefs.filter(function (x) { return x.id === id; })[0];
    if (!c) return notFound();
    var rs = allRecipes().filter(function (r) { return r.chef === c.id; });
    return '<div class="profile"><a class="back" href="#/">' + icon("back") + " Volver</a>" + avatar(c) +
      "<h2 class=\"page-title\" style=\"font-size:1.8rem\">" + esc(c.nombre) + '</h2><p class="page-sub" style="margin-bottom:8px">' + esc(c.titulo) + "</p>" +
      (c.bio ? '<p style="color:var(--muted)">' + esc(c.bio) + "</p>" : "") +
      '<div class="stats"><div><b>' + rs.length + "</b><span>Recetas</span></div></div>" +
      (rs.length ? rs.map(mini).join("") : '<p class="empty">Aún no hay recetas.</p>') + "</div>";
  }

  function viewSaved() {
    var rs = allRecipes().filter(function (r) { return persisted.saved[r.id]; });
    return '<h2 class="page-title">Guardadas</h2><p class="page-sub">Tu recetario personal</p>' +
      (rs.length ? rs.map(mini).join("") : '<div class="empty"><p>Todavía no has guardado ninguna receta.</p><a class="btn" href="#/">Ver el muro</a></div>');
  }

  function viewProfile() {
    var mias = persisted.mias, likes = Object.keys(persisted.likes).length, guardadas = Object.keys(persisted.saved).length;
    return '<div class="profile">' + avatar(chefOf({ chef: "yo" })) + '<h2 class="page-title" style="font-size:1.8rem">Tu perfil</h2>' +
      '<p class="page-sub">Cocinero casero</p><div class="stats"><div><b>' + mias.length + "</b><span>Publicadas</span></div><div><b>" + guardadas +
      "</b><span>Guardadas</span></div><div><b>" + likes + "</b><span>Me gusta</span></div></div>" +
      (mias.length ? mias.map(mini).join("") : '<div class="empty"><p>Aún no has publicado nada.</p></div>') +
      '<p><a class="btn" href="#/nueva">Publicar receta</a></p>' +
      '<p><button class="btn ghost" id="reset" type="button">Borrar mis datos</button></p></div>';
  }

  function viewNew() {
    var cats = unique(allRecipes().map(function (r) { return r.categoria; }).concat(["Postres", "Sopas", "Pastas"]));
    return '<h2 class="page-title">Nueva receta</h2><p class="page-sub">Comparte tu secreto</p>' +
      '<form class="new" id="form" novalidate>' +
      '<div class="field"><label for="f-titulo">Título</label><input id="f-titulo" name="titulo" required maxlength="80"></div>' +
      '<div class="field"><label for="f-foto">Foto (opcional)</label><input id="f-foto" name="foto" type="file" accept="image/*"><img class="preview" id="preview" alt="" hidden></div>' +
      '<div class="field"><label for="f-secreto">Tu secreto</label><textarea id="f-secreto" name="secreto" required maxlength="300"></textarea><span class="hint">Una frase con el truco que lo cambia todo.</span></div>' +
      '<div class="row"><div class="field"><label for="f-cat">Categoría</label><select id="f-cat" name="categoria">' + cats.map(function (c) { return "<option>" + esc(c) + "</option>"; }).join("") + "</select></div>" +
      '<div class="field"><label for="f-dif">Dificultad</label><select id="f-dif" name="dificultad"><option>Fácil</option><option>Media</option><option>Difícil</option></select></div></div>' +
      '<div class="row"><div class="field"><label for="f-t">Tiempo (min)</label><input id="f-t" name="tiempo" type="number" min="1" max="2880" value="30" required></div>' +
      '<div class="field"><label for="f-r">Raciones</label><input id="f-r" name="raciones" type="number" min="1" max="50" value="2" required></div></div>' +
      '<div class="field"><label for="f-ing">Ingredientes</label><textarea id="f-ing" name="ingredientes" required></textarea><span class="hint">Uno por línea.</span></div>' +
      '<div class="field"><label for="f-pasos">Preparación</label><textarea id="f-pasos" name="pasos" required></textarea><span class="hint">Un paso por línea.</span></div>' +
      '<p id="form-error" role="alert" style="color:var(--yellow);margin:0" hidden></p>' +
      '<button class="btn block" type="submit">Publicar</button></form>';
  }

  function notFound() {
    return '<div class="empty"><p>No hemos encontrado esa página.</p><a class="btn" href="#/">Volver al muro</a></div>';
  }

  // ---------- Router ----------
  var NAV = [["#/", "Inicio", "home"], ["#/explorar", "Explorar", "explore"], ["#/nueva", "Añadir", "add"], ["#/guardadas", "Guardadas", "bookmark"], ["#/perfil", "Perfil", "person"]];
  function route() {
    var h = location.hash || "#/", parts = h.slice(2).split("/"), v = parts[0] || "", arg = decodeURIComponent(parts[1] || "");
    var html, navKey = h;
    if (v === "") html = viewFeed();
    else if (v === "explorar") html = viewExplore();
    else if (v === "nueva") html = viewNew();
    else if (v === "guardadas") html = viewSaved();
    else if (v === "perfil") html = viewProfile();
    else if (v === "receta") { html = viewRecipe(arg); navKey = "#/"; }
    else if (v === "chef") { html = viewChef(arg); navKey = "#/explorar"; }
    else html = notFound();
    main.innerHTML = html;
    document.title = (v === "receta" && findRecipe(arg) ? findRecipe(arg).titulo + " · " : "") + "Foodgram · Muro de Secretos";
    renderNav(navKey);
    window.scrollTo(0, 0);
    if (v) main.focus({ preventScroll: true });
  }
  function renderNav(active) {
    document.querySelector(".bottom").innerHTML = NAV.map(function (n) {
      return '<a href="' + n[0] + '"' + (n[0] === active ? ' aria-current="page"' : "") + ">" + icon(n[2]) + "<span>" + n[1] + "</span></a>";
    }).join("");
  }
  window.addEventListener("hashchange", route);

  // ---------- Eventos ----------
  function refreshActions(id) {
    var r = findRecipe(id); if (!r) return;
    var tmp = document.createElement("div"); tmp.innerHTML = actions(r);
    Array.prototype.forEach.call(main.querySelectorAll('[data-like="' + id + '"]'), function (b) {
      b.parentNode.replaceWith(tmp.firstChild.cloneNode(true));
    });
  }
  main.addEventListener("click", function (e) {
    var t = e.target.closest("button"); if (!t) return;
    if (t.dataset.like) {
      var id = t.dataset.like; persisted.likes[id] ? delete persisted.likes[id] : (persisted.likes[id] = 1);
      save(); refreshActions(id);
    } else if (t.dataset.save) {
      var sid = t.dataset.save, was = !!persisted.saved[sid];
      was ? delete persisted.saved[sid] : (persisted.saved[sid] = 1);
      save(); refreshActions(sid); toast(was ? "Quitada de guardadas" : "Receta guardada");
      if (location.hash === "#/guardadas") route();
    } else if (t.dataset.share) {
      var r = findRecipe(t.dataset.share), url = location.href.split("#")[0] + "#/receta/" + r.id;
      if (navigator.share) navigator.share({ title: r.titulo, text: r.secreto, url: url }).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { toast("Enlace copiado"); }, function () { toast(url); });
      else toast(url);
    } else if (t.dataset.chip) {
      var k = t.dataset.chip; state.filtro[k] = state.filtro[k] === t.dataset.v ? "" : t.dataset.v; route();
    } else if (t.dataset.goCat != null && t.hasAttribute("data-go-cat")) {
      state.filtro = { q: "", cat: t.dataset.goCat, dieta: "" }; location.hash = "#/";
    } else if (t.hasAttribute("data-clear")) {
      state.filtro = { q: "", cat: "", dieta: "" }; route();
    } else if (t.id === "reset") {
      if (confirm("¿Borrar tus recetas, guardadas y me gusta de este navegador?")) {
        persisted.likes = {}; persisted.saved = {}; persisted.mias = []; persisted.checks = {}; save(); route(); toast("Datos borrados");
      }
    }
  });
  main.addEventListener("input", function (e) {
    if (e.target.id !== "q") return;
    state.filtro.q = e.target.value;
    document.getElementById("feed").innerHTML = feedHtml(filtered());
  });
  main.addEventListener("change", function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.check) {
      var c = persisted.checks[t.dataset.check] || (persisted.checks[t.dataset.check] = {});
      t.checked ? (c[t.dataset.i] = 1) : delete c[t.dataset.i]; save();
    } else if (t.id === "f-foto" && t.files[0]) {
      shrink(t.files[0], function (data) {
        var p = document.getElementById("preview"); p.src = data; p.hidden = false; p.dataset.data = data;
      });
    }
  });
  main.addEventListener("submit", function (e) {
    if (e.target.id !== "form") return;
    e.preventDefault();
    var f = e.target, err = document.getElementById("form-error");
    var lines = function (s) { return s.split("\n").map(function (x) { return x.trim(); }).filter(Boolean); };
    var titulo = f.titulo.value.trim(), secreto = f.secreto.value.trim(), ing = lines(f.ingredientes.value), pasos = lines(f.pasos.value);
    var msg = !titulo ? "Pon un título a tu receta." : !secreto ? "Cuéntanos tu secreto." : !ing.length ? "Añade al menos un ingrediente." : !pasos.length ? "Añade al menos un paso." : "";
    if (msg) { err.textContent = msg; err.hidden = false; return; }
    var p = document.getElementById("preview");
    var r = {
      id: "mia-" + Date.now().toString(36), chef: "yo", titulo: titulo, categoria: f.categoria.value, dieta: [],
      tiempo: Math.max(1, +f.tiempo.value || 30), dificultad: f.dificultad.value, raciones: Math.max(1, +f.raciones.value || 2),
      foto: p.dataset.data || "", fotoAlt: titulo, secreto: secreto, ingredientes: ing, pasos: pasos
    };
    persisted.mias.unshift(r);
    if (!save()) { persisted.mias.shift(); return; }
    toast("Receta publicada"); location.hash = "#/receta/" + r.id;
  });

  // Reduce la foto subida para no agotar el almacenamiento local.
  function shrink(file, cb) {
    var fr = new FileReader();
    fr.onload = function () {
      var img = new Image();
      img.onload = function () {
        var s = Math.min(1, 900 / Math.max(img.width, img.height)), c = document.createElement("canvas");
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        cb(c.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = function () { toast("No se pudo leer la imagen"); };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  }

  // ---------- Tema ----------
  function applyTheme(t) { if (t) document.documentElement.setAttribute("data-theme", t); else document.documentElement.removeAttribute("data-theme"); }
  applyTheme(persisted.theme);
  document.getElementById("theme").addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    persisted.theme = cur === "dark" ? "light" : "dark"; applyTheme(persisted.theme); save();
  });

  route();
})();
