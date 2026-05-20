(function () {
  if (window.__apChatLoaded) return;
  window.__apChatLoaded = true;

  var API = "/api/chat";
  var CALLBACK_API = "/api/support/callback";
  var STORAGE_KEY = "ap_chat_history_v1";

  // Public contact channels (update centrally here if numbers change)
  var CONTACT = {
    phone:     "+44 29 2010 0100",
    phoneHref: "tel:+442920100100",
    whatsapp:  "https://wa.me/442920100100",
    email:     "support@airpak-express.com",
    emailHref: "mailto:support@airpak-express.com",
    contactPage: "/contact.html"
  };

  // Keywords that trigger the human-handoff card client-side too
  var HANDOFF_RE = /\b(human|agent|representative|real person|customer (care|service)|talk to (someone|a person|staff)|speak to (someone|a person|staff)|live chat|operator|call (me|someone))\b/i;

  function loadHistory() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch (e) { return []; }
  }
  function saveHistory(h) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(h.slice(-20))); } catch (e) {}
  }
  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s){ return String(s).replace(/[&<>"']/g,function(c){return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c];}); }

  var ICON_MSG = '<svg class="ap-icon-msg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M20 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-4.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="rgba(255,255,255,.12)"/>' +
    '</svg>';
  var ICON_CLOSE = '<svg class="ap-icon-close" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';

  function buildFab() {
    var btn = el("button", { type: "button", class: "ap-chat-fab", "aria-label": "Open Airpak chat" });
    btn.innerHTML = ICON_MSG + ICON_CLOSE + '<span class="ap-chat-dot" aria-hidden="true"></span>';
    return btn;
  }
  function buildTip() {
    var t = el("div", { class: "ap-chat-tip" });
    t.textContent = "Chat with us";
    return t;
  }
  function buildPanel() {
    var panel = el("div", { class: "ap-chat-panel", role: "dialog", "aria-label": "Airpak AI Assistant" });
    panel.innerHTML =
      '<div class="ap-chat-head">' +
      '  <div class="ap-chat-avatar"><i class="fa fa-comments"></i></div>' +
      '  <div class="ap-chat-headtxt"><div class="ap-chat-title">AirpakAI</div><div class="ap-chat-sub">Online \u00b7 Replies instantly</div></div>' +
      '  <button class="ap-chat-human" type="button" aria-label="Talk to a human" title="Talk to a representative"><i class="fa fa-user"></i><span>Human</span></button>' +
      '  <button class="ap-chat-close" type="button" aria-label="Close">&times;</button>' +
      '</div>' +
      '<div class="ap-chat-body" id="apChatBody"></div>' +
      '<div class="ap-chat-quick" id="apChatQuick"></div>' +
      '<form class="ap-chat-input" id="apChatForm">' +
      '  <textarea id="apChatInput" rows="1" placeholder="Type your message..." required></textarea>' +
      '  <button type="submit" aria-label="Send"><i class="fa fa-paper-plane"></i></button>' +
      '</form>';
    return panel;
  }

  var fab, panel, body, quick, form, input;
  var history = loadHistory();
  var sending = false;

  function addBubble(role, text) {
    var b = el("div", { class: "ap-chat-msg " + (role === "user" ? "user" : role === "err" ? "err" : "bot") });
    b.textContent = text;
    body.appendChild(b);
    body.scrollTop = body.scrollHeight;
    return b;
  }
  function addTyping() {
    var t = el("div", { class: "ap-chat-typing", id: "apTyping" });
    t.innerHTML = "<span></span><span></span><span></span>";
    body.appendChild(t); body.scrollTop = body.scrollHeight;
  }
  function removeTyping() { var t = document.getElementById("apTyping"); if (t) t.remove(); }

  /* ---------- Human handoff card ---------- */
  function buildHandoffCard() {
    var card = el("div", { class: "ap-chat-handoff" });
    card.innerHTML =
      '<div class="ap-handoff-head">' +
        '<div class="ap-handoff-pulse"></div>' +
        '<div>' +
          '<div class="ap-handoff-title">Connect with a representative</div>' +
          '<div class="ap-handoff-sub">Our customer care team is here to help \u00b7 Mon\u2013Sat 9:00\u201318:00 (UK)</div>' +
        '</div>' +
      '</div>' +
      '<div class="ap-handoff-row">' +
        '<a class="ap-handoff-opt phone"    href="' + esc(CONTACT.phoneHref) + '"><i class="fa fa-phone"></i><span><b>Call</b><em>' + esc(CONTACT.phone) + '</em></span></a>' +
        '<a class="ap-handoff-opt whatsapp" href="' + esc(CONTACT.whatsapp)  + '" target="_blank" rel="noopener"><i class="fa fa-whatsapp"></i><span><b>WhatsApp</b><em>Chat now</em></span></a>' +
        '<a class="ap-handoff-opt email"    href="' + esc(CONTACT.emailHref) + '"><i class="fa fa-envelope"></i><span><b>Email</b><em>' + esc(CONTACT.email) + '</em></span></a>' +
      '</div>' +
      '<div class="ap-handoff-or"><span>or request a callback</span></div>' +
      '<form class="ap-handoff-form" novalidate>' +
        '<input type="text"  name="name"  placeholder="Your name" required maxlength="120" />' +
        '<input type="tel"   name="phone" placeholder="Phone (with country code)" required maxlength="40" />' +
        '<input type="email" name="email" placeholder="Email (optional)" maxlength="200" />' +
        '<textarea name="message" placeholder="How can we help? (optional)" rows="2" maxlength="600"></textarea>' +
        '<button type="submit"><i class="fa fa-paper-plane"></i> Request a callback</button>' +
        '<div class="ap-handoff-status" role="status" aria-live="polite"></div>' +
      '</form>' +
      '<div class="ap-handoff-foot">Prefer the full form? <a href="' + esc(CONTACT.contactPage) + '">Open Contact page \u2192</a></div>';

    var f = card.querySelector("form");
    var statusEl = card.querySelector(".ap-handoff-status");
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {
        name:  f.name.value.trim(),
        phone: f.phone.value.trim(),
        email: f.email.value.trim(),
        message: f.message.value.trim(),
        preferredTime: ""
      };
      if (!data.name || (!data.phone && !data.email)) {
        statusEl.textContent = "Please add your name and at least a phone or email.";
        statusEl.className = "ap-handoff-status err"; return;
      }
      statusEl.textContent = "Sending\u2026";
      statusEl.className = "ap-handoff-status";
      var btn = f.querySelector("button[type=submit]"); btn.disabled = true;
      fetch(CALLBACK_API, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error((res.j && res.j.error) || "Could not submit. Please try again.");
          statusEl.textContent = res.j.message || "Thanks \u2014 we'll be in touch shortly.";
          statusEl.className = "ap-handoff-status ok";
          f.reset();
        })
        .catch(function (err) {
          statusEl.textContent = err.message || "Network error. Please try again.";
          statusEl.className = "ap-handoff-status err";
        })
        .finally(function () { btn.disabled = false; });
    });
    return card;
  }
  function showHandoff() {
    body.appendChild(buildHandoffCard());
    body.scrollTop = body.scrollHeight;
  }

  /* ---------- Quick replies ---------- */
  var QUICK = [
    { label: "Track parcel",       text: "How do I track my parcel?" },
    { label: "Pricing",            text: "How can I get pricing for a shipment?" },
    { label: "Sign up",            text: "How do I open an account to ship online?" },
    { label: "\uD83D\uDC64 Talk to a human", action: "handoff" }
  ];
  function renderQuick() {
    quick.innerHTML = ""; if (history.length > 0) return;
    QUICK.forEach(function (q) {
      var b = el("button", { type: "button" }); b.textContent = q.label;
      if (q.action === "handoff") b.className = "ap-quick-human";
      b.addEventListener("click", function () {
        if (q.action === "handoff") {
          addBubble("user", "I'd like to speak with a customer care representative.");
          history.push({ role: "user", content: "Connect me with a human representative." });
          saveHistory(history);
          quick.innerHTML = "";
          addBubble("bot", "Of course \u2014 I'm connecting you with our customer care team now.");
          showHandoff();
        } else {
          sendMessage(q.text);
        }
      });
      quick.appendChild(b);
    });
  }
  function renderHistory() {
    body.innerHTML = "";
    if (history.length === 0) {
      addBubble("bot", "Hi! I'm AirpakAI, your Airpak Express assistant. Ask me about tracking, services, pricing, branches — or tap \u201cTalk to a human\u201d to reach our customer care team.");
    } else {
      history.forEach(function (m) { addBubble(m.role, m.content); });
    }
    renderQuick();
  }

  function togglePanel(open) {
    if (open) {
      panel.classList.add("open"); fab.classList.add("open");
      fab.setAttribute("aria-label", "Close Airpak chat");
      setTimeout(function () { input && input.focus(); }, 80);
    } else {
      panel.classList.remove("open"); fab.classList.remove("open");
      fab.setAttribute("aria-label", "Open Airpak chat");
    }
  }

  function sendMessage(text) {
    text = (text || "").trim(); if (!text || sending) return;
    var clientHandoffWanted = HANDOFF_RE.test(text);
    sending = true;
    addBubble("user", text);
    history.push({ role: "user", content: text }); saveHistory(history);
    quick.innerHTML = ""; addTyping();
    fetch(API, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history })
    })
      .then(function (r) { return r.ok ? r.json() : r.json().then(function (e) { throw new Error(e.error || "Server error"); }); })
      .then(function (data) {
        removeTyping();
        var reply = (data && data.reply) || "Sorry, I couldn't generate a response. Try /contact.html.";
        addBubble("bot", reply);
        history.push({ role: "assistant", content: reply }); saveHistory(history);
        if ((data && data.handoff) || clientHandoffWanted) showHandoff();
      })
      .catch(function (e) { removeTyping(); addBubble("err", e.message || "AI is unavailable right now."); if (clientHandoffWanted) showHandoff(); })
      .finally(function () { sending = false; input.value = ""; input.focus(); });
  }

  function init() {
    fab = buildFab();
    var tip = buildTip();
    panel = buildPanel();
    document.body.appendChild(fab);
    document.body.appendChild(tip);
    document.body.appendChild(panel);
    body = panel.querySelector("#apChatBody");
    quick = panel.querySelector("#apChatQuick");
    form = panel.querySelector("#apChatForm");
    input = panel.querySelector("#apChatInput");

    fab.addEventListener("click", function () { togglePanel(!panel.classList.contains("open")); });
    panel.querySelector(".ap-chat-close").addEventListener("click", function () { togglePanel(false); });
    panel.querySelector(".ap-chat-human").addEventListener("click", function () {
      addBubble("user", "Connect me with a customer care representative.");
      history.push({ role: "user", content: "Connect me with a human representative." });
      saveHistory(history);
      quick.innerHTML = "";
      addBubble("bot", "Of course \u2014 here are the fastest ways to reach our team:");
      showHandoff();
    });
    form.addEventListener("submit", function (e) { e.preventDefault(); sendMessage(input.value); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input.value); }
    });
    renderHistory();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
