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

  function buildButton() {
    var btn = el("button", { type: "button", class: "ap-chat-btn", "aria-label": "Chat with Airpak AI" });
    btn.innerHTML = '<i class="fa fa-comments" aria-hidden="true"></i><span class="ap-chat-btn-label">Chat with Us</span>';
    btn.addEventListener("click", function () { togglePanel(true); });
    return btn;
  }

  function buildPanel() {
    var panel = el("div", { class: "ap-chat-panel", role: "dialog", "aria-label": "Airpak AI Assistant" });
    panel.innerHTML =
      '<div class="ap-chat-head">' +
      '  <div class="ap-chat-avatar"><i class="fa fa-comments"></i></div>' +
      '  <div><div class="ap-chat-title">AirpakAI Assistant</div><div class="ap-chat-sub">Online • Replies instantly</div></div>' +
      '  <button class="ap-chat-close" type="button" aria-label="Close">&times;</button>' +
      '</div>' +
      '<div class="ap-chat-body" id="apChatBody"></div>' +
      '<div class="ap-chat-quick" id="apChatQuick"></div>' +
      '<form class="ap-chat-input" id="apChatForm">' +
      '  <textarea id="apChatInput" rows="1" placeholder="Ask about tracking, services, branches…" required></textarea>' +
      '  <button type="submit" aria-label="Send"><i class="fa fa-paper-plane"></i></button>' +
      '</form>';
    panel.querySelector(".ap-chat-close").addEventListener("click", function () { togglePanel(false); });
    return panel;
  }

  var panel, body, quick, form, input;
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
    body.appendChild(t);
    body.scrollTop = body.scrollHeight;
  }
  function removeTyping() {
    var t = document.getElementById("apTyping");
    if (t) t.remove();
  }

  var QUICK = [
    { label: "Track my parcel", text: "How do I track my parcel?" },
    { label: "Pricing", text: "How can I get pricing for a shipment?" },
    { label: "Branches", text: "Where is my nearest Airpak branch?" },
    { label: "Sign up", text: "How do I open an account to ship online?" }
  ];

  function renderQuick() {
    quick.innerHTML = "";
    if (history.length > 0) return;
    QUICK.forEach(function (q) {
      var b = el("button", { type: "button" });
      b.textContent = q.label;
      b.addEventListener("click", function () { sendMessage(q.text); });
      quick.appendChild(b);
    });
  }

  function renderHistory() {
    body.innerHTML = "";
    if (history.length === 0) {
      addBubble("bot", "Hello! I'm AirpakAI, your Airpak Express virtual assistant. Ask me about tracking, services, branches, pricing, or anything about Airpak Express.");
    } else {
      history.forEach(function (m) { addBubble(m.role, m.content); });
    }
    renderQuick();
  }

  function togglePanel(open) {
    if (open) {
      panel.classList.add("open");
      setTimeout(function () { input && input.focus(); }, 60);
    } else {
      panel.classList.remove("open");
    }
  }

  function sendMessage(text) {
    text = (text || "").trim();
    if (!text || sending) return;
    sending = true;
    addBubble("user", text);
    history.push({ role: "user", content: text });
    saveHistory(history);
    quick.innerHTML = "";
    addTyping();
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history })
    })
      .then(function (r) { return r.ok ? r.json() : r.json().then(function (e) { throw new Error(e.error || "Server error"); }); })
      .then(function (data) {
        removeTyping();
        var reply = (data && data.reply) || "Sorry, I couldn't generate a response. Try again or visit /contact.html.";
        addBubble("bot", reply);
        history.push({ role: "assistant", content: reply });
        saveHistory(history);
      })
      .catch(function (e) {
        removeTyping();
        addBubble("err", e.message || "AI is unavailable right now. Please try again shortly.");
      })
      .finally(function () { sending = false; input.value = ""; input.focus(); });
  }

  function mountButton() {
    // Prefer placing next to the language switcher / burger / main menu
    var anchor =
      document.querySelector(".ap-lang-wrap") ||
      document.querySelector(".burger-icon") ||
      document.querySelector(".main-menu .nav") ||
      document.querySelector("nav .navbar-nav") ||
      document.querySelector(".navbar .ml-auto") ||
      document.querySelector("header nav") ||
      document.querySelector("header");
    var btn = buildButton();
    btn.style.marginLeft = "8px";
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(btn, anchor.nextSibling);
    } else {
      btn.style.position = "fixed";
      btn.style.right = "18px";
      btn.style.bottom = "82px";
      btn.style.zIndex = "2147483645";
      document.body.appendChild(btn);
    }
  }

  function init() {
    mountButton();
    panel = buildPanel();
    document.body.appendChild(panel);
    body = panel.querySelector("#apChatBody");
    quick = panel.querySelector("#apChatQuick");
    form = panel.querySelector("#apChatForm");
    input = panel.querySelector("#apChatInput");
    form.addEventListener("submit", function (e) { e.preventDefault(); sendMessage(input.value); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input.value); }
    });
    renderHistory();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
