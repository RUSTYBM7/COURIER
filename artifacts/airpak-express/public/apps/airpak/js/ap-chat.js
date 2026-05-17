(function () {
  if (window.__apChatLoaded) return;
  window.__apChatLoaded = true;

  var API = "/api/chat";
  var STORAGE_KEY = "ap_chat_history_v1";

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
      '  <div><div class="ap-chat-title">AirpakAI</div><div class="ap-chat-sub">Online · Replies instantly</div></div>' +
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
  }
  function addTyping() {
    var t = el("div", { class: "ap-chat-typing", id: "apTyping" });
    t.innerHTML = "<span></span><span></span><span></span>";
    body.appendChild(t); body.scrollTop = body.scrollHeight;
  }
  function removeTyping() { var t = document.getElementById("apTyping"); if (t) t.remove(); }

  var QUICK = [
    { label: "Track parcel", text: "How do I track my parcel?" },
    { label: "Pricing", text: "How can I get pricing for a shipment?" },
    { label: "Branches", text: "Where is my nearest Airpak branch?" },
    { label: "Sign up", text: "How do I open an account to ship online?" }
  ];
  function renderQuick() {
    quick.innerHTML = ""; if (history.length > 0) return;
    QUICK.forEach(function (q) {
      var b = el("button", { type: "button" }); b.textContent = q.label;
      b.addEventListener("click", function () { sendMessage(q.text); });
      quick.appendChild(b);
    });
  }
  function renderHistory() {
    body.innerHTML = "";
    if (history.length === 0) {
      addBubble("bot", "Hi! I'm AirpakAI, your Airpak Express assistant. Ask me about tracking, services, pricing, branches — anything Airpak.");
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
      })
      .catch(function (e) { removeTyping(); addBubble("err", e.message || "AI is unavailable right now."); })
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
