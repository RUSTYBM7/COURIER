/* Airpak Express — Lingva-powered language switcher
 * One-time language picker on first visit. After the user chooses,
 * the choice is remembered and the picker never auto-shows again.
 * No persistent header/floating pill — the picker is opt-in only.
 */
(function () {
  "use strict";

  var LANGS = [
    { code: "en", name: "English",                                                flag: "\uD83C\uDDEC\uD83C\uDDE7" },
    { code: "zh", name: "\u4e2d\u6587",                                           flag: "\uD83C\uDDE8\uD83C\uDDF3" },
    { code: "ms", name: "Bahasa Melayu",                                          flag: "\uD83C\uDDF2\uD83C\uDDFE" },
    { code: "id", name: "Bahasa Indonesia",                                       flag: "\uD83C\uDDEE\uD83C\uDDE9" },
    { code: "ta", name: "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd",                         flag: "\uD83C\uDDEE\uD83C\uDDF3" },
    { code: "th", name: "\u0e44\u0e17\u0e22",                                     flag: "\uD83C\uDDF9\uD83C\uDDED" },
    { code: "ja", name: "\u65e5\u672c\u8a9e",                                     flag: "\uD83C\uDDEF\uD83C\uDDF5" },
    { code: "ko", name: "\ud55c\uad6d\uc5b4",                                     flag: "\uD83C\uDDF0\uD83C\uDDF7" },
    { code: "vi", name: "Ti\u1ebfng Vi\u1ec7t",                                   flag: "\uD83C\uDDFB\uD83C\uDDF3" }
  ];

  var ENDPOINTS = [
    "https://lingva.lunar.icu/api/v1",
    "https://lingva.garudalinux.org/api/v1",
    "https://translate.plausibility.cloud/api/v1",
    "https://lingva.ml/api/v1"
  ];

  var LS_LANG = "ap_lang";           // chosen language code
  var LS_SEEN = "ap_lang_seen_v2";   // bumped so popup re-shows after re-enable
  var CACHE_PREFIX = "ap_tx_";
  var SRC = "en";

  function getLang() {
    try { return localStorage.getItem(LS_LANG) || "en"; } catch (e) { return "en"; }
  }
  function setLang(l) {
    try { localStorage.setItem(LS_LANG, l); } catch (e) {}
  }
  function hasSeen() {
    try { return localStorage.getItem(LS_SEEN) === "1"; } catch (e) { return false; }
  }
  function markSeen() {
    try { localStorage.setItem(LS_SEEN, "1"); } catch (e) {}
  }

  function cacheKey(target, text) {
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

  function translateOne(target, text) {
    var cached = cacheGet(target, text);
    if (cached !== null) return Promise.resolve(cached);
    var idx = 0;
    function attempt() {
      if (idx >= ENDPOINTS.length) return Promise.resolve(text);
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

  function collectTextNodes() {
    var SKIP = { SCRIPT:1, STYLE:1, NOSCRIPT:1, CODE:1, PRE:1, TEXTAREA:1, IFRAME:1, SVG:1, CANVAS:1 };
    var nodes = [];
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p || SKIP[p.nodeName]) return NodeFilter.FILTER_REJECT;
        var cur = p;
        while (cur && cur !== document.body) {
          if (cur.id === "ap-lang-modal") return NodeFilter.FILTER_REJECT;
          cur = cur.parentNode;
        }
        var t = n.nodeValue;
        if (!t || !t.trim()) return NodeFilter.FILTER_REJECT;
        if (!/[a-zA-Z\u00C0-\u024F]/.test(t)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) nodes.push(n);
    return nodes;
  }

  function snapshotOriginals(nodes) {
    nodes.forEach(function (n) {
      if (n.__ap_orig === undefined) n.__ap_orig = n.nodeValue;
    });
  }

  function applyLang(target) {
    setLang(target);
    var nodes = collectTextNodes();
    snapshotOriginals(nodes);
    if (target === "en" || target === SRC) {
      nodes.forEach(function (n) { if (n.__ap_orig !== undefined) n.nodeValue = n.__ap_orig; });
      return;
    }
    var CONCURRENT = 6;
    var queue = nodes.slice();
    var active = 0;
    function next() {
      while (active < CONCURRENT && queue.length) {
        var node = queue.shift();
        active++;
        translateOne(target, node.__ap_orig).then(function (tx) {
          if (node && tx) node.nodeValue = tx;
        }).catch(function(){}).then(function () { active--; next(); });
      }
    }
    next();
  }

  // ---- One-time popup modal --------------------------------------------
  function buildModal() {
    if (document.getElementById("ap-lang-modal")) return;

    var overlay = document.createElement("div");
    overlay.id = "ap-lang-modal";
    overlay.className = "ap-lang-modal-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "ap-lang-modal-title");

    var card = document.createElement("div");
    card.className = "ap-lang-modal-card";

    var globe =
      '<svg class="ap-lang-modal-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/>' +
        '<path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
      '</svg>';

    // Visible close button (top-right) — fixes the "can't exit" complaint
    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "ap-lang-modal-close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>';
    closeBtn.addEventListener("click", function () {
      markSeen();
      setLang("en");
      close();
    });
    card.appendChild(closeBtn);

    var head = document.createElement("div");
    head.className = "ap-lang-modal-head";
    head.innerHTML =
      globe +
      '<h2 id="ap-lang-modal-title" class="ap-lang-modal-title">Choose your language</h2>' +
      '<p class="ap-lang-modal-sub">Pick the language you\u2019re most comfortable with. You can change it later from Settings.</p>';

    var grid = document.createElement("div");
    grid.className = "ap-lang-modal-grid";

    LANGS.forEach(function (l) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ap-lang-modal-option";
      btn.setAttribute("data-lang", l.code);
      btn.innerHTML =
        '<span class="ap-lang-modal-flag">' + l.flag + '</span>' +
        '<span class="ap-lang-modal-name">' + l.name + '</span>';
      btn.addEventListener("click", function () {
        markSeen();
        close();
        applyLang(l.code);
      });
      grid.appendChild(btn);
    });

    var foot = document.createElement("div");
    foot.className = "ap-lang-modal-foot";
    var skip = document.createElement("button");
    skip.type = "button";
    skip.className = "ap-lang-modal-skip";
    skip.textContent = "Skip \u2014 Continue in English";
    skip.addEventListener("click", function () {
      markSeen();
      setLang("en");
      close();
    });
    foot.appendChild(skip);

    card.appendChild(head);
    card.appendChild(grid);
    card.appendChild(foot);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    // Trap basic interactions
    overlay.addEventListener("click", function (e) {
      // backdrop click = dismiss as English
      if (e.target === overlay) {
        markSeen();
        setLang("en");
        close();
      }
    });
    document.addEventListener("keydown", onKey);

    function onKey(e) {
      if (e.key === "Escape") { markSeen(); setLang("en"); close(); }
    }
    function close() {
      document.removeEventListener("keydown", onKey);
      overlay.classList.add("ap-lang-modal-closing");
      setTimeout(function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 220);
    }

    // Mount animation
    requestAnimationFrame(function () { overlay.classList.add("ap-lang-modal-open"); });
  }

  function init() {
    // Always apply a previously saved non-English choice silently.
    var saved = getLang();
    if (saved && saved !== "en") {
      setTimeout(function () { applyLang(saved); }, 250);
    }
    // Show the language picker on first visit (per browser).
    // After the user picks or dismisses, hasSeen() returns true and it
    // never auto-shows again — they can reopen it from the burger menu.
    if (!hasSeen()) {
      // Fire on next paint so the page is visible behind the modal
      requestAnimationFrame(function () { buildModal(); });
    }
    // Build the floating menu (burger) on every page.
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", buildMenu);
    } else {
      buildMenu();
    }
  }

  /* =========================================================
   * Floating site menu — restores the navigation the user
   * couldn't find. Lives bottom-right, opens a side drawer.
   * ========================================================= */
  function buildMenu() {
    if (document.getElementById("ap-menu-fab")) return;

    var NAV = [
      { group: "Main",     links: [
        { label: "Home",            href: "/" },
        { label: "About Us",        href: "/aboutus.html" },
        { label: "Careers",         href: "/careers.html" },
        { label: "Contact Us",      href: "/contact.html" },
        { label: "FAQ",             href: "/faq.html" }
      ]},
      { group: "Services", links: [
        { label: "Domestic & Worldwide", href: "/service-domestic-worldwide-deliveries.html" },
        { label: "International / Cross-Border", href: "/service-international-crossborder.html" },
        { label: "Worldwide Forwarding", href: "/service-worldwideforwarding.html" },
        { label: "Warehousing",          href: "/service-warehousing.html" },
        { label: "Logistic Partner UK",  href: "/logistic-partner-singapore.html" }
      ]},
      { group: "Track & Ship", links: [
        { label: "Track Shipment",  href: "/tracking.html" },
        { label: "Ship Now",        href: "/shipnow.html" },
        { label: "Coverage",        href: "/international-shipping.html" }
      ]},
      { group: "Account",  links: [
        { label: "Sign In",         href: "/signin.html" },
        { label: "Sign Up",         href: "/signup.html" },
        { label: "Dashboard",       href: "/dashboard.html" },
        { label: "Settings",        href: "/settings.html" }
      ]},
      { group: "Legal",    links: [
        { label: "Privacy Policy",  href: "/privacypolicy.html" },
        { label: "Terms of Service", href: "/termsofservice.html" },
        { label: "Standard Conditions of Carriage", href: "/standardconditionsofcarriage.html" }
      ]}
    ];

    // FAB
    var fab = document.createElement("button");
    fab.id = "ap-menu-fab";
    fab.type = "button";
    fab.setAttribute("aria-label", "Open menu");
    fab.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>' +
      '</svg>';
    document.body.appendChild(fab);

    // Drawer
    var drawer = document.createElement("aside");
    drawer.id = "ap-menu-drawer";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-label", "Site menu");
    drawer.setAttribute("aria-hidden", "true");

    var html = '' +
      '<div class="ap-menu-head">' +
        '<span class="ap-menu-title">Airpak Express</span>' +
        '<button class="ap-menu-close" type="button" aria-label="Close menu">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<div class="ap-menu-body">';

    NAV.forEach(function (g) {
      html += '<div class="ap-menu-group"><div class="ap-menu-grp-label">' + g.group + '</div><ul>';
      g.links.forEach(function (l) {
        html += '<li><a href="' + l.href + '">' + l.label + '</a></li>';
      });
      html += '</ul></div>';
    });

    html += '' +
      '<div class="ap-menu-group">' +
        '<div class="ap-menu-grp-label">Language</div>' +
        '<button class="ap-menu-lang" type="button">Choose your language</button>' +
      '</div>' +
      '</div>';

    drawer.innerHTML = html;
    document.body.appendChild(drawer);

    var scrim = document.createElement("div");
    scrim.id = "ap-menu-scrim";
    document.body.appendChild(scrim);

    function open() {
      drawer.classList.add("open");
      scrim.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function closeMenu() {
      drawer.classList.remove("open");
      scrim.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
    fab.addEventListener("click", open);
    scrim.addEventListener("click", closeMenu);
    drawer.querySelector(".ap-menu-close").addEventListener("click", closeMenu);
    drawer.querySelector(".ap-menu-lang").addEventListener("click", function () {
      closeMenu();
      buildModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("open")) closeMenu();
    });
  }

  // Expose a manual trigger so a Settings link or dev tool can reopen the picker
  window.AirpakLang = {
    open: function () { buildModal(); },
    reset: function () {
      try {
        localStorage.removeItem(LS_LANG);
        localStorage.removeItem(LS_SEEN);
      } catch (e) {}
    },
    current: getLang,
    apply: applyLang
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
