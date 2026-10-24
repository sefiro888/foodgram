// Ilustraciones de platos vistas desde arriba, generadas en SVG.
// Cada receta tiene una semilla, así que su plato siempre se dibuja igual.
(function () {
  "use strict";
  var uid = 0;

  function seedOf(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) {
    var a = seed >>> 0;
    return function () { a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function n(v) { return Math.round(v * 10) / 10; }
  function pick(R, a) { return a[Math.floor(R() * a.length)]; }
  function polar(r, a) { return [100 + r * Math.cos(a), 100 + r * Math.sin(a)]; }
  // Punto al azar dentro de un disco de radio máximo `max`.
  function inDisc(R, max, min) { var r = (min || 0) + Math.sqrt(R()) * (max - (min || 0)), a = R() * Math.PI * 2; return polar(r, a); }
  function sector(r, a1, a2, dx, dy) {
    var p1 = polar(r, a1), p2 = polar(r, a2); dx = dx || 0; dy = dy || 0;
    return "M" + n(100 + dx) + " " + n(100 + dy) + "L" + n(p1[0] + dx) + " " + n(p1[1] + dy) + "A" + r + " " + r + " 0 0 1 " + n(p2[0] + dx) + " " + n(p2[1] + dy) + "Z";
  }

  function plateBase(id, ceramic, well) {
    return '<ellipse cx="104" cy="110" rx="90" ry="88" fill="#000" opacity=".32" filter="url(#' + id + 'b)"/>' +
      '<circle cx="100" cy="100" r="92" fill="' + ceramic + '"/>' +
      '<circle cx="100" cy="100" r="91" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.4"/>' +
      '<circle cx="100" cy="100" r="74" fill="' + well + '"/>' +
      '<circle cx="100" cy="100" r="74" fill="none" stroke="#000" stroke-opacity=".09" stroke-width="2.5"/>' +
      '<path d="M40 52A74 74 0 0 1 120 28" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/>';
  }
  function defs(id) {
    return '<filter id="' + id + 'b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>';
  }

  var FOOD = {
    steak: function (R, id) {
      var s = '<radialGradient id="' + id + 'm" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#b0603a"/><stop offset=".6" stop-color="#7d3b22"/><stop offset="1" stop-color="#4a2113"/></radialGradient>';
      var g = plateBase(id, "#f4f1ea", "#ebe6dc");
      g += '<g transform="rotate(' + n(-25 + R() * 14) + ' 100 100)">' +
        '<path d="M50 98C48 74 78 62 104 64C138 66 154 82 152 104C150 130 120 142 92 140C64 138 52 122 50 98Z" fill="url(#' + id + 'm)" stroke="#3a190c" stroke-width="3"/>' +
        '<path d="M60 80C76 66 110 62 136 72" fill="none" stroke="#f1d4a8" stroke-opacity=".75" stroke-width="5" stroke-linecap="round"/>';
      for (var i = 0; i < 4; i++) g += '<path d="M' + (62 + i * 18) + ' 76L' + (88 + i * 18) + ' 132" stroke="#24100a" stroke-opacity=".55" stroke-width="3.2" stroke-linecap="round"/>';
      g += '</g>';
      g += '<ellipse cx="108" cy="102" rx="20" ry="13" fill="#ffd66b" opacity=".45"/>' +
        '<rect x="96" y="90" width="22" height="18" rx="4" fill="#ffd66b" transform="rotate(14 107 99)"/>' +
        '<rect x="99" y="92" width="9" height="4" rx="2" fill="#fff" opacity=".7" transform="rotate(14 107 99)"/>';
      for (var t = 0; t < 4; t++) {
        var p = inDisc(R, 66, 46), a = R() * Math.PI, len = 22;
        var q = [p[0] + Math.cos(a) * len, p[1] + Math.sin(a) * len];
        g += '<path d="M' + n(p[0]) + ' ' + n(p[1]) + 'L' + n(q[0]) + ' ' + n(q[1]) + '" stroke="#5d7a3a" stroke-width="1.2"/>';
        for (var k = 1; k < 7; k++) g += '<circle cx="' + n(p[0] + (q[0] - p[0]) * k / 7 + (k % 2 ? 2.4 : -2.4)) + '" cy="' + n(p[1] + (q[1] - p[1]) * k / 7) + '" r="1.9" fill="' + pick(R, ["#6f9446", "#86ab55", "#58783a"]) + '"/>';
      }
      for (var c = 0; c < 3; c++) { var gp = inDisc(R, 66, 50); g += '<ellipse cx="' + n(gp[0]) + '" cy="' + n(gp[1]) + '" rx="6" ry="4" fill="#f6ecd6" stroke="#d8c8a4" transform="rotate(' + n(R() * 180) + ' ' + n(gp[0]) + ' ' + n(gp[1]) + ')"/>'; }
      for (var f = 0; f < 18; f++) { var fp = inDisc(R, 46); g += '<rect x="' + n(fp[0]) + '" y="' + n(fp[1]) + '" width="2" height="1.6" fill="#fff" opacity=".85"/>'; }
      return [s, g];
    },
    salad: function (R, id) {
      var g = plateBase(id, "#5fa8b5", "#e9efdb"), i, p;
      for (i = 0; i < 30; i++) { p = inDisc(R, 62); g += '<ellipse cx="' + n(p[0]) + '" cy="' + n(p[1]) + '" rx="' + n(10 + R() * 7) + '" ry="' + n(5 + R() * 3) + '" fill="' + pick(R, ["#4fae5d", "#7cc668", "#3b8f4c", "#a5d77c"]) + '" transform="rotate(' + n(R() * 180) + ' ' + n(p[0]) + ' ' + n(p[1]) + ')"/>'; }
      for (i = 0; i < 4; i++) { p = inDisc(R, 50); g += '<circle cx="' + n(p[0]) + '" cy="' + n(p[1]) + '" r="10" fill="none" stroke="#b8458f" stroke-width="2.2" opacity=".9"/>'; }
      for (i = 0; i < 6; i++) { p = inDisc(R, 54); g += '<circle cx="' + n(p[0]) + '" cy="' + n(p[1]) + '" r="7" fill="#d4ebb0" stroke="#5f9b40" stroke-width="1.6"/><circle cx="' + n(p[0]) + '" cy="' + n(p[1]) + '" r="3.6" fill="none" stroke="#a9cf86" stroke-width="1"/>'; }
      for (i = 0; i < 6; i++) { p = inDisc(R, 52); var a = n(R() * 90); g += '<rect x="' + n(p[0] - 4.5) + '" y="' + n(p[1] - 4.5) + '" width="9" height="9" rx="1.5" fill="#fffaf0" stroke="#e1d5ba" transform="rotate(' + a + ' ' + n(p[0]) + ' ' + n(p[1]) + ')"/>'; }
      for (i = 0; i < 7; i++) { p = inDisc(R, 54, 10); g += '<circle cx="' + n(p[0]) + '" cy="' + n(p[1]) + '" r="8" fill="#e5432d"/><path d="M' + n(p[0] - 5) + ' ' + n(p[1]) + 'H' + n(p[0] + 5) + 'M' + n(p[0]) + ' ' + n(p[1] - 5) + 'V' + n(p[1] + 5) + '" stroke="#f7a07f" stroke-width="1"/><circle cx="' + n(p[0] - 2.6) + '" cy="' + n(p[1] - 2.8) + '" r="2" fill="#fff" opacity=".5"/>'; }
      for (i = 0; i < 5; i++) { p = inDisc(R, 54); g += '<ellipse cx="' + n(p[0]) + '" cy="' + n(p[1]) + '" rx="5" ry="4" fill="#3a2b3f"/><circle cx="' + n(p[0]) + '" cy="' + n(p[1]) + '" r="1.4" fill="#cdbfd6"/>'; }
      return ["", g];
    },
    bread: function (R, id) {
      var s = '<radialGradient id="' + id + 'l" cx=".45" cy=".35" r=".75"><stop offset="0" stop-color="#e8b571"/><stop offset=".7" stop-color="#bf7a34"/><stop offset="1" stop-color="#8c5020"/></radialGradient>';
      var g = '<ellipse cx="104" cy="110" rx="90" ry="88" fill="#000" opacity=".32" filter="url(#' + id + 'b)"/><circle cx="100" cy="100" r="92" fill="#c79a67"/>';
      for (var r = 20; r < 92; r += 9) g += '<circle cx="' + n(97 + R() * 6) + '" cy="' + n(97 + R() * 6) + '" r="' + r + '" fill="none" stroke="#b1824f" stroke-width="1.2" opacity=".6"/>';
      g += '<circle cx="100" cy="100" r="91" fill="none" stroke="#e3c08f" stroke-width="1.5" opacity=".8"/>';
      g += '<g transform="rotate(' + n(-30 + R() * 16) + ' 100 100)"><ellipse cx="100" cy="100" rx="68" ry="46" fill="url(#' + id + 'l)" stroke="#7c4519" stroke-width="2.5"/>' +
        '<path d="M44 100C72 74 128 74 156 100" fill="none" stroke="#f6dfae" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M46 103C74 79 126 79 154 103" fill="none" stroke="#a96a2c" stroke-width="1.6" stroke-linecap="round"/></g>';
      for (var i = 0; i < 46; i++) { var p = inDisc(R, 52); g += '<circle cx="' + n(p[0]) + '" cy="' + n(p[1]) + '" r="' + n(.6 + R() * 1.4) + '" fill="#fff" opacity="' + n(.4 + R() * .45) + '"/>'; }
      return [s, g];
    },
    pasta: function (R, id) {
      var g = plateBase(id, "#f4f1ea", "#ebe6dc"), i;
      for (var k = 0; k < 3; k++) {
        var d = "", off = k * 2.1, pts = 70;
        for (i = 0; i <= pts; i++) { var t = i / pts, a = off + t * Math.PI * 6, r = 6 + t * 50 + (R() - .5) * 4; var p = polar(r, a); d += (i ? "L" : "M") + n(p[0]) + " " + n(p[1]); }
        g += '<path d="' + d + '" fill="none" stroke="' + ["#f1c95e", "#e8b84a", "#f6d77a"][k] + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>';
        g += '<path d="' + d + '" fill="none" stroke="#fff3c4" stroke-opacity=".55" stroke-width="1.3" stroke-linecap="round"/>';
      }
      for (i = 0; i < 10; i++) { var b = inDisc(R, 50); g += '<rect x="' + n(b[0] - 4) + '" y="' + n(b[1] - 3) + '" width="8" height="6" rx="1.5" fill="#d98c5f" stroke="#a5552f" transform="rotate(' + n(R() * 90) + ' ' + n(b[0]) + ' ' + n(b[1]) + ')"/>'; }
      for (i = 0; i < 6; i++) { var c = inDisc(R, 44); g += '<path d="M' + n(c[0]) + ' ' + n(c[1]) + 'q5 -3 10 0" fill="none" stroke="#fffbe8" stroke-width="2.4" stroke-linecap="round"/>'; }
      for (i = 0; i < 50; i++) { var q = inDisc(R, 56); g += '<circle cx="' + n(q[0]) + '" cy="' + n(q[1]) + '" r=".9" fill="#222"/>'; }
      return ["", g];
    },
    soup: function (R, id) {
      var s = '<radialGradient id="' + id + 's" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#f4743f"/><stop offset="1" stop-color="#bf3a1b"/></radialGradient>';
      var g = plateBase(id, "#2f5d7c", "#284f6a") + '<circle cx="100" cy="100" r="62" fill="url(#' + id + 's)"/>', i;
      var d = ""; for (i = 0; i <= 60; i++) { var t = i / 60, p = polar(2 + t * 34, t * Math.PI * 4.2); d += (i ? "L" : "M") + n(p[0]) + " " + n(p[1]); }
      g += '<path d="' + d + '" fill="none" stroke="#fff3df" stroke-width="4" stroke-linecap="round" opacity=".92"/>';
      for (i = 0; i < 14; i++) { var o = inDisc(R, 56); g += '<circle cx="' + n(o[0]) + '" cy="' + n(o[1]) + '" r="' + n(1.4 + R() * 2.2) + '" fill="#ffb36b" opacity=".7"/>'; }
      for (i = 0; i < 6; i++) { var c = inDisc(R, 52, 30); g += '<rect x="' + n(c[0] - 4) + '" y="' + n(c[1] - 4) + '" width="8" height="8" rx="1.2" fill="#e2b062" stroke="#b07a2b" transform="rotate(' + n(R() * 90) + ' ' + n(c[0]) + ' ' + n(c[1]) + ')"/>'; }
      for (i = 0; i < 3; i++) { var l = polar(18 + i * 4, -0.6 + i * .7); g += '<ellipse cx="' + n(l[0] + 24) + '" cy="' + n(l[1] - 18) + '" rx="9" ry="4.5" fill="#4f9e4f" transform="rotate(' + (i * 50 - 30) + ' ' + n(l[0] + 24) + ' ' + n(l[1] - 18) + ')"/>'; }
      return [s, g];
    },
    eggs: function (R, id) {
      var s = '<radialGradient id="' + id + 't" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#f8d777"/><stop offset="1" stop-color="#e2a634"/></radialGradient>';
      var g = plateBase(id, "#f4f1ea", "#ebe6dc"), i;
      var a1 = -1.15 + R() * .3, a2 = a1 + .75, mid = (a1 + a2) / 2, dx = Math.cos(mid) * 12, dy = Math.sin(mid) * 12;
      g += '<circle cx="100" cy="100" r="62" fill="url(#' + id + 't)" stroke="#c78322" stroke-width="5"/>';
      for (i = 0; i < 26; i++) { var p = inDisc(R, 54); g += '<ellipse cx="' + n(p[0]) + '" cy="' + n(p[1]) + '" rx="' + n(3 + R() * 5) + '" ry="' + n(2 + R() * 3) + '" fill="' + pick(R, ["#fbe39a", "#d99a2c"]) + '" opacity=".5"/>'; }
      g += '<path d="' + sector(65, a1, a2) + '" fill="#ebe6dc"/>';
      g += '<path d="' + sector(62, a1, a2, dx, dy) + '" fill="#fbe7a6" stroke="#c78322" stroke-width="2"/>';
      for (i = 0; i < 9; i++) { var r = 14 + R() * 40, a = a1 + .1 + R() * (a2 - a1 - .2), q = polar(r, a); g += '<circle cx="' + n(q[0] + dx) + '" cy="' + n(q[1] + dy) + '" r="' + n(1.5 + R() * 2) + '" fill="#f0cf70"/>'; }
      return [s, g];
    },
    rice: function (R, id) {
      var g = '<ellipse cx="104" cy="110" rx="96" ry="88" fill="#000" opacity=".32" filter="url(#' + id + 'b)"/>' +
        '<rect x="0" y="92" width="22" height="16" rx="7" fill="#2d2f33"/><rect x="178" y="92" width="22" height="16" rx="7" fill="#2d2f33"/>' +
        '<circle cx="100" cy="100" r="86" fill="#2d2f33"/><circle cx="100" cy="100" r="85" fill="none" stroke="#6b6e74" stroke-width="1.5"/>' +
        '<circle cx="100" cy="100" r="76" fill="#e5ad36"/><circle cx="100" cy="100" r="72" fill="none" stroke="#9c5f16" stroke-width="7" opacity=".55"/>', i, p;
      for (i = 0; i < 260; i++) { p = inDisc(R, 72); g += '<ellipse cx="' + n(p[0]) + '" cy="' + n(p[1]) + '" rx="2.8" ry="1.1" fill="' + pick(R, ["#f2cb59", "#e8b53c", "#f7dc86", "#d99a25"]) + '" transform="rotate(' + n(R() * 180) + ' ' + n(p[0]) + ' ' + n(p[1]) + ')"/>'; }
      for (i = 0; i < 8; i++) { p = inDisc(R, 58); g += '<rect x="' + n(p[0] - 9) + '" y="' + n(p[1] - 2) + '" width="18" height="4" rx="2" fill="#d6402a" transform="rotate(' + n(R() * 180) + ' ' + n(p[0]) + ' ' + n(p[1]) + ')"/>'; }
      for (i = 0; i < 16; i++) { p = inDisc(R, 62); g += '<circle cx="' + n(p[0]) + '" cy="' + n(p[1]) + '" r="2.5" fill="#7cc152" stroke="#58962f" stroke-width=".6"/>'; }
      for (i = 0; i < 5; i++) { p = polar(38, i * 1.2566 + R() * .3); g += '<path transform="translate(' + n(p[0] - 14) + ' ' + n(p[1] - 4) + ') rotate(' + n(i * 72) + ' 14 4)" d="M0 0C10 -14 28 -12 30 4C24 -4 10 -4 2 8Z" fill="#f08a5d" stroke="#bd512c" stroke-width="1.2"/>'; }
      for (i = 0; i < 3; i++) { var a = i * 2.09 + .5; p = polar(60, a); var deg = n(a * 180 / Math.PI + 90); g += '<g transform="translate(' + n(p[0]) + ' ' + n(p[1]) + ') rotate(' + deg + ')"><path d="M-12 0A12 12 0 0 1 12 0Z" fill="#ffe066" stroke="#e1a800" stroke-width="1.5"/><path d="M0 0L-7 -7M0 0V-10M0 0L7 -7" stroke="#fff4b3" stroke-width="1"/></g>'; }
      return ["", g];
    },
    cake: function (R, id) {
      var s = '<radialGradient id="' + id + 'k" cx=".5" cy=".5" r=".55"><stop offset="0" stop-color="#d79443"/><stop offset=".55" stop-color="#9c5021"/><stop offset="1" stop-color="#3f1d0c"/></radialGradient>';
      var g = plateBase(id, "#f4f1ea", "#ebe6dc"), i;
      var w = ""; for (i = 0; i <= 48; i++) { var p = polar(70 + (R() - .5) * 4, i / 48 * Math.PI * 2); w += (i ? "L" : "M") + n(p[0]) + " " + n(p[1]); }
      g += '<path d="' + w + 'Z" fill="#f2e9d6" stroke="#ddcfb2" stroke-width="1.5"/>';
      g += '<circle cx="100" cy="100" r="62" fill="url(#' + id + 'k)"/>';
      for (i = 0; i < 16; i++) { var b = inDisc(R, 52, 26); g += '<circle cx="' + n(b[0]) + '" cy="' + n(b[1]) + '" r="' + n(5 + R() * 9) + '" fill="#2b1306" opacity=".28"/>'; }
      for (i = 0; i < 6; i++) { var c = inDisc(R, 22); g += '<circle cx="' + n(c[0]) + '" cy="' + n(c[1]) + '" r="' + n(4 + R() * 6) + '" fill="#e8ac5a" opacity=".45"/>'; }
      var a1 = .2 + R() * .3, a2 = a1 + .7, mid = (a1 + a2) / 2, dx = Math.cos(mid) * 14, dy = Math.sin(mid) * 14;
      g += '<path d="' + sector(64, a1, a2) + '" fill="#f2e9d6"/>';
      g += '<path d="' + sector(62, a1, a2, dx, dy) + '" fill="#f7e6b8" stroke="#5d2c12" stroke-width="2"/>';
      var p1 = polar(62, a1), p2 = polar(62, a2);
      g += '<path d="M' + n(p1[0] + dx) + ' ' + n(p1[1] + dy) + 'A62 62 0 0 1 ' + n(p2[0] + dx) + ' ' + n(p2[1] + dy) + '" fill="none" stroke="#6a3416" stroke-width="6"/>';
      return [s, g];
    },
    cookie: function (R, id) {
      var s = '<radialGradient id="' + id + 'c" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#dba45c"/><stop offset="1" stop-color="#a5672b"/></radialGradient>';
      var g = plateBase(id, "#2e3a46", "#26313c"), spots = [[80, 90, 31], [122, 84, 29], [104, 124, 32]];
      spots.forEach(function (c) {
        g += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="url(#' + id + 'c)" stroke="#87501e" stroke-width="2"/>';
        for (var i = 0; i < 3; i++) { var a = R() * 6.28, r1 = R() * c[2] * .6; g += '<path d="M' + n(c[0] + Math.cos(a) * r1) + ' ' + n(c[1] + Math.sin(a) * r1) + 'l' + n((R() - .5) * 14) + ' ' + n((R() - .5) * 14) + '" stroke="#8d5523" stroke-width="1" opacity=".7"/>'; }
        for (var j = 0; j < 8; j++) {
          var ang = R() * 6.28, rr = Math.sqrt(R()) * (c[2] - 7), x = c[0] + Math.cos(ang) * rr, y = c[1] + Math.sin(ang) * rr, sz = 3 + R() * 3;
          g += '<path d="M' + n(x - sz) + ' ' + n(y - sz * .6) + 'L' + n(x + sz * .8) + ' ' + n(y - sz) + 'L' + n(x + sz) + ' ' + n(y + sz * .7) + 'L' + n(x - sz * .7) + ' ' + n(y + sz) + 'Z" fill="#3a1f14"/>';
        }
        for (var k = 0; k < 5; k++) { var sa = R() * 6.28, sr = R() * c[2] * .8; g += '<rect x="' + n(c[0] + Math.cos(sa) * sr) + '" y="' + n(c[1] + Math.sin(sa) * sr) + '" width="2.4" height="2" fill="#fff" opacity=".9"/>'; }
      });
      return [s, g];
    }
  };

  var NAMES = { steak: "Carne", salad: "Ensalada", bread: "Pan", pasta: "Pasta", soup: "Sopa", eggs: "Tortilla", rice: "Arroz", cake: "Tarta", cookie: "Galletas" };
  var cache = {};

  function plate(r, opts) {
    opts = opts || {};
    var key = r.id + (r.foto ? ":f" : "") + (opts.label ? ":l" : "");
    if (cache[key]) return cache[key];
    var id = "pl" + (uid++), R = rng(seedOf(r.id)), parts;
    if (r.foto) {
      parts = ['<clipPath id="' + id + 'c"><circle cx="100" cy="100" r="74"/></clipPath>',
        plateBase(id, "#f4f1ea", "#ebe6dc") + '<image href="' + r.foto + '" x="26" y="26" width="148" height="148" preserveAspectRatio="xMidYMid slice" clip-path="url(#' + id + 'c)"/>'];
    } else {
      parts = (FOOD[r.plato] || FOOD.pasta)(R, id);
    }
    var label = opts.label ? ' role="img" aria-label="' + String(opts.label).replace(/"/g, "&quot;") + '"' : ' aria-hidden="true"';
    return (cache[key] = '<svg class="plate" viewBox="0 0 200 200"' + label + "><defs>" + defs(id) + parts[0] + "</defs>" + parts[1] + "</svg>");
  }

  window.Plates = { draw: plate, types: Object.keys(FOOD), names: NAMES };
})();
