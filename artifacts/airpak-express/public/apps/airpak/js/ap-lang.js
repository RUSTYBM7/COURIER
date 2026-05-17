/* Airpak Express — Lingva-powered language switcher
 * Replaces Google Translate. Pure JS, no deps. Caches translations.
 */
(function () {
  "use strict";

  var LANGS = [
    { code: "en", name: "English",    flag: "\uD83C\uDDEC\uD83C\uDDE7" },
    { code: "zh", name: "中文",        flag: "\uD83C\uDDE8\uD83C\uDDF3" },
    { code: "ms", name: "Bahasa Melayu", flag: "\uD83C\uDDF2\uD83C\uDDFE" },
    { code: "id", name: "Bahasa Indonesia", flag: "\uD83C\uDDEE\uD83C\uDDE9" },
    { code: "ta", name: "தமிழ்",       flag: "\uD83C\uDDEE\uD83C\uDDF3" },
    { code: "th", name: "ไทย",         flag: "\uD83C\uDDF9\uD83C\uDDED" },
    { code: "ja", name: "日本語",       flag: "\uD83C\uDDEF\uD83C\uDDF5" },
    { code: "ko", name: "한국어",       flag: "\uD83C\uDDF0\uD83C\uDDF7" },
    { code: "vi", name: "Tiếng Việt",  flag: "\uD83C\uDDFB\uD83C\uDDF3" }
  ];

  // Public Lingva instances (try in order on failure)
  var ENDPOINTS = [
    "https://lingva.lunar.icu/api/v1",
    "https://lingva.garudalinux.org/api/v1",
    "https://translate.plausibility.cloud/api/v1",
    "https://lingva.ml/api/v1"
  ];

  var LS_LANG = "ap_lang";
  var CACHE_PREFIX = "ap_tx_";
  var SRC = "en";

  // ---- helpers ----------------------------------------------------------
  function $(sel, root) { return (root || document).querySelector(sel); }

  function getLang() {
    try { return localStorage.getItem(LS_LANG) || "en"; } catch (e) { return "en"; }
  }
  function setLang(l) {
    try { localStorage.setItem(LS_LANG, l); } catch (e) {}
  }

  function cacheKey(target, text) {
    // simple non-crypto hash
    var h = 0, i, c;
    for (i = 0; i < text.length; i++) { c = text.charCodeAt(i); h = ((h << 5) - h) + c; h |= 0; }
    return CACHE_PREFIX + target + "_" + h;
  }
  function cacheGet(target, text) {
    try { return localStorage.getItem(cacheKey(target, text)); } catch (e) { return null; }
  }
  function cacheSet(target, text, tx) {
    try { localStorage.setItem(cacheKey(target, text), tx); } catch (e) {}
  }

  // Fetch a translation from Lingva, trying endpoints in order
  function translateOne(target, text) {
    var cached = cacheGet(target, text);
    if (cached !== null) return Promise.resolve(cached);

    var idx = 0;
    function attempt() {
      if (idx >= ENDPOINTS.length) return Promise.resolve(text); // give up, return original
      var url = ENDPOINTS[idx++] + "/" + SRC + "/" + target + "/" + encodeURIComponent(text);
      return fetch(url, { method: "GET" })
        .then(function (r) { if (!r.ok) throw new Error("status " + r.status); return r.json(); })
        .then(function (j) {
          var tx = (j && j.translation) ? j.translation : text;
          cacheSet(target, text, tx);
          return tx;
        })
        .catch(function () { return attempt(); });
    }
    return attempt();
  }

  // Collect translatable text nodes (skip script/style/code/pre and our own UI)
  function collectTextNodes() {
    var SKIP = { SCRIPT:1, STYLE:1, NOSCRIPT:1, CODE:1, PRE:1, TEXTAREA:1, IFRAME:1, SVG:1, CANVAS:1 };
    var nodes = [];
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (SKIP[p.nodeName]) return NodeFilter.FILTER_REJECT;
        // skip inside our own widget
        var cur = p;
        while (cur && cur !== document.body) {
          if (cur.id === "ap-lang-switcher") return NodeFilter.FILTER_REJECT;
          cur = cur.parentNode;
        }
        var t = n.nodeValue;
        if (!t || !t.trim()) return NodeFilter.FILTER_REJECT;
        // skip pure punctuation/numbers
        if (!/[a-zA-Z\u00C0-\u024F]/.test(t)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) nodes.push(n);
    return nodes;
  }

  // Store originals once
  function snapshotOriginals(nodes) {
    nodes.forEach(function (n) {
      if (n.__ap_orig === undefined) n.__ap_orig = n.nodeValue;
    });
  }

  // Apply translations
  function applyLang(target, btn) {
    setLang(target);
    updateButton(btn, target);

    var nodes = collectTextNodes();
    snapshotOriginals(nodes);

    if (target === "en" || target === SRC) {
      nodes.forEach(function (n) { if (n.__ap_orig !== undefined) n.nodeValue = n.__ap_orig; });
      return;
    }

    // Batch with a small concurrency limit so we don't hammer the endpoint
    var CONCURRENT = 6;
    var queue = nodes.slice();
    var active = 0;

    function next() {
      while (active < CONCURRENT && queue.length) {
        var node = queue.shift();
        active++;
        translateOne(target, node.__ap_orig).then(function (tx) {
          if (node && tx) node.nodeValue = tx;
        }).catch(function(){}).then(function () {
          active--;
          next();
        });
      }
    }
    next();
  }

  // ---- UI ---------------------------------------------------------------
  function langByCode(c) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === c) return LANGS[i];
    return LANGS[0];
  }

  var SWIFT_TRANSLATE_ICON =
    '<svg class="ap-lang-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M3 5h10M8 3v2M11.5 12.5C9.5 11 7.5 8 7 5M4 13c2-1 5-3 6-8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M13 21l5-11 5 11M14.5 17h7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';
  var CARET_ICON =
    '<svg class="ap-lang-caret" viewBox="0 0 10 10" fill="none" aria-hidden="true">' +
      '<path d="M2 3.5l3 3 3-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';

  function updateButton(btn, code) {
    var l = langByCode(code);
    btn.innerHTML =
      SWIFT_TRANSLATE_ICON +
      '<span class="ap-lang-flag">' + l.flag + '</span>' +
      '<span class="ap-lang-code">' + l.code.toUpperCase() + '</span>' +
      CARET_ICON;
    btn.setAttribute("aria-label", "Language: " + l.name);
  }

  function buildWidget() {
    if (document.getElementById("ap-lang-switcher")) return;

    var wrap = document.createElement("div");
    wrap.id = "ap-lang-switcher";
    wrap.className = "ap-lang-switcher";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ap-lang-btn";
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");

    var menu = document.createElement("div");
    menu.className = "ap-lang-menu";
    menu.setAttribute("role", "menu");
    var head = document.createElement("div");
    head.className = "ap-lang-menu-head";
    head.textContent = "Select language";
    menu.appendChild(head);
    var currentCode = getLang();
    LANGS.forEach(function (l) {
      var item = document.createElement("button");
      item.type = "button";
      item.className = "ap-lang-item" + (l.code === currentCode ? " active" : "");
      item.setAttribute("role", "menuitem");
      item.setAttribute("data-lang", l.code);
      item.innerHTML = '<span class="ap-lang-flag">' + l.flag + '</span>' +
                       '<span class="ap-lang-name">' + l.name + '</span>';
      item.addEventListener("click", function () {
        menu.querySelectorAll(".ap-lang-item").forEach(function(x){ x.classList.remove("active"); });
        item.classList.add("active");
        applyLang(l.code, btn);
        close();
      });
      menu.appendChild(item);
    });

    wrap.appendChild(btn);
    wrap.appendChild(menu);

    function open()  { wrap.classList.add("open");  btn.setAttribute("aria-expanded", "true"); }
    function close() { wrap.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      wrap.classList.contains("open") ? close() : open();
    });
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });

    updateButton(btn, getLang());

    // Pinned to the top-right of the viewport — guaranteed right-side placement
    // regardless of header markup variations across scraped pages.
    wrap.classList.add("ap-lang-floating");
    document.body.appendChild(wrap);

    // Apply saved lang on load
    var saved = getLang();
    if (saved && saved !== "en") {
      // wait a tick so DOM is fully painted
      setTimeout(function(){ applyLang(saved, btn); }, 200);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildWidget);
  } else {
    buildWidget();
  }
})();
