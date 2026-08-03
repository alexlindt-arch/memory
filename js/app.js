/* =========================================================================
   Memory — game logic
   Two players take turns flipping two cards. A match scores a point and the
   player goes again; a miss passes the turn. When every pair is found the
   winner (or a draw) is shown. Four themes, three board sizes.
   ========================================================================= */
(function () {
  "use strict";

  /* Flip to true once all 72 real Figma motifs are exported to
     assets/<theme>/front-<n>.png — the img fronts then replace the emoji. */
  var USE_IMAGE_FRONTS = false;

  var MONITOR_SVG =
    '<svg viewBox="0 0 60 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<rect x="6" y="4" width="48" height="32" rx="3" stroke="currentColor" stroke-width="3"></rect>' +
    '<path d="M24 15L19 20L24 25M36 15L41 20L36 25" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>' +
    '<path d="M14 43H46" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path></svg>';

  var THEMES = {
    codevibes: {
      label: "Code vibes theme",
      backIcon: true,
      emojis: ["💻","🖥️","⌨️","🖱️","🐙","🐍","☕","🔧","🎨","🧩","🔌","💾","📦","🛠️","🐛","🚀","⚙️","🌐"]
    },
    gaming: {
      label: "Gaming theme",
      backIcon: false,
      emojis: ["🎮","🕹️","👾","🎯","🎲","♟️","🃏","🏆","🎰","🎳","🥇","🎴","🪁","🧸","🛸","👽","🤖","💣"]
    },
    daprojects: {
      label: "DA Projects theme",
      backIcon: true,
      emojis: ["🚀","📱","💡","📊","🗂️","🧠","🔗","🖼️","📝","🎯","🏗️","🧬","🛰️","📡","🧮","🕸️","🧭","🪐"]
    },
    foods: {
      label: "Foods theme",
      backIcon: true,
      emojis: ["🍜","🍟","🍕","🍔","🌮","🍣","🍩","🍦","🍎","🍓","🥑","🥐","🧁","🍪","🍇","🍑","🌭","🥨"]
    }
  };

  var COLS = { 16: 4, 24: 6, 36: 6 };
  var PLAYER = { 0: { name: "Blue", color: "var(--blue)" }, 1: { name: "Orange", color: "var(--orange)" } };

  var app = document.getElementById("app");

  var config = { theme: null, player: null, size: null };
  var game = null; // { deck, current, scores, flipped, lock, matchedPairs, totalPairs, startPlayer }

  /* ---------------- Screen router ---------------- */
  function show(name) {
    document.querySelectorAll(".screen").forEach(function (s) { s.classList.remove("is-active"); });
    document.getElementById("screen-" + name).classList.add("is-active");
    app.classList.toggle("end-active", name === "end");
    closeDialog();
  }

  /* ---------------- Settings ---------------- */
  function setupSettings() {
    bindOptList("opt-theme", "theme", function (v) {
      app.setAttribute("data-theme", v);
      refreshPreview();
    });
    bindOptList("opt-player", "player", null);
    bindOptList("opt-size", "size", null);

    document.getElementById("btn-play").addEventListener("click", function () {
      show("settings");
      updateStartState();
    });
    document.getElementById("btn-start").addEventListener("click", function () {
      if (isReady()) startGame();
    });
    refreshPreview();
  }

  function bindOptList(listId, key, extra) {
    var list = document.getElementById(listId);
    list.querySelectorAll(".opt").forEach(function (opt) {
      opt.addEventListener("click", function () {
        list.querySelectorAll(".opt").forEach(function (o) { o.classList.remove("is-selected"); });
        opt.classList.add("is-selected");
        var raw = opt.getAttribute("data-value");
        config[key] = (key === "theme") ? raw : parseInt(raw, 10);
        if (extra) extra(raw);
        updateSummary();
        updateStartState();
      });
    });
  }

  function isReady() { return config.theme !== null && config.player !== null && config.size !== null; }

  function updateStartState() {
    var btn = document.getElementById("btn-start");
    var ready = isReady();
    btn.classList.toggle("is-disabled", !ready);
    btn.disabled = !ready;
  }

  function updateSummary() {
    setSum("theme", config.theme !== null ? THEMES[config.theme].label.replace(" theme", "") : "Game theme");
    setSum("player", config.player !== null ? PLAYER[config.player].name : "Player");
    setSum("size", config.size !== null ? config.size + " cards" : "Board size");
  }
  function setSum(slot, text) {
    var el = document.querySelector('.sum[data-slot="' + slot + '"]');
    el.textContent = text;
    el.classList.toggle("is-set", text !== "Game theme" && text !== "Player" && text !== "Board size");
  }

  function refreshPreview() {
    var theme = app.getAttribute("data-theme");
    var front = document.getElementById("preview-front");
    front.dataset.emoji = THEMES[theme].emojis[0];
    var back = document.getElementById("preview-back");
    back.innerHTML = THEMES[theme].backIcon
      ? '<span style="color:var(--card-back-icon);width:46%">' + MONITOR_SVG + "</span>"
      : "";
  }

  /* ---------------- Game setup ---------------- */
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function startGame() {
    var pairs = config.size / 2;
    var themeData = THEMES[config.theme];
    var deck = [];
    for (var p = 0; p < pairs; p++) {
      for (var c = 0; c < 2; c++) {
        deck.push({ pair: p, emoji: themeData.emojis[p], img: "assets/" + config.theme + "/front-" + (p + 1) + ".png" });
      }
    }
    shuffle(deck);

    game = {
      deck: deck,
      current: config.player,
      startPlayer: config.player,
      scores: { 0: 0, 1: 0 },
      flipped: [],
      lock: false,
      matchedPairs: 0,
      totalPairs: pairs
    };

    renderBoard();
    updateHud();
    show("game");
  }

  function renderBoard() {
    var board = document.getElementById("board");
    var cols = COLS[config.size];
    board.style.setProperty("--cols", cols);
    board.style.setProperty("--board-max", (cols * 132) + "px");
    board.innerHTML = "";

    var backInner = THEMES[config.theme].backIcon ? MONITOR_SVG : "";

    game.deck.forEach(function (card, index) {
      var btn = document.createElement("button");
      btn.className = "card";
      btn.type = "button";
      btn.setAttribute("aria-label", "Hidden card");
      var frontContent = USE_IMAGE_FRONTS
        ? '<img src="' + card.img + '" alt="" draggable="false">'
        : '<span>' + card.emoji + "</span>";
      btn.innerHTML =
        '<div class="card__inner">' +
          '<div class="card__face card__back">' + backInner + "</div>" +
          '<div class="card__face card__front">' + frontContent + "</div>" +
        "</div>";
      btn.addEventListener("click", function () { onCardClick(index, btn); });
      board.appendChild(btn);
    });
  }

  /* ---------------- Flip / match logic ---------------- */
  function onCardClick(index, btn) {
    if (game.lock) return;
    var card = game.deck[index];
    if (card.matched || game.flipped.indexOf(index) !== -1) return;
    if (game.flipped.length >= 2) return;

    btn.classList.add("is-flipped");
    btn.setAttribute("aria-label", "Card showing " + card.emoji);
    game.flipped.push(index);

    if (game.flipped.length === 2) evaluatePair();
  }

  function evaluatePair() {
    game.lock = true;
    var a = game.deck[game.flipped[0]];
    var b = game.deck[game.flipped[1]];
    var cards = document.querySelectorAll(".card");

    if (a.pair === b.pair) {
      // Match: mark, score, same player continues.
      a.matched = b.matched = true;
      game.scores[game.current]++;
      game.matchedPairs++;
      var col = game.current === 0 ? "var(--blue)" : "var(--orange)";
      game.flipped.forEach(function (i) {
        cards[i].classList.add("is-matched");
        cards[i].style.setProperty("--match-color", col);
      });
      game.flipped = [];
      game.lock = false;
      updateHud();
      if (game.matchedPairs === game.totalPairs) setTimeout(endGame, 650);
    } else {
      // Miss: flip back after a beat, pass the turn.
      setTimeout(function () {
        game.flipped.forEach(function (i) {
          cards[i].classList.remove("is-flipped");
          cards[i].setAttribute("aria-label", "Hidden card");
        });
        game.flipped = [];
        game.current = game.current === 0 ? 1 : 0;
        game.lock = false;
        updateHud();
      }, 900);
    }
  }

  function updateHud() {
    document.querySelector("#score-blue b").textContent = game.scores[0];
    document.querySelector("#score-orange b").textContent = game.scores[1];
    document.getElementById("hud-token").style.background = game.current === 0 ? "var(--blue)" : "var(--orange)";
    document.getElementById("score-blue").classList.toggle("is-current", game.current === 0);
    document.getElementById("score-orange").classList.toggle("is-current", game.current === 1);
  }

  /* ---------------- End screens ---------------- */
  function endGame() {
    var blue = game.scores[0], orange = game.scores[1];
    var inner = document.getElementById("end-inner");
    var scoreCard =
      '<div class="end__score-card">' +
        '<span class="score score--orange"><b>' + orange + "</b></span>" +
        '<span class="score score--blue"><b>' + blue + "</b></span>" +
      "</div>";

    if (blue === orange) {
      inner.className = "end end--draw";
      inner.innerHTML =
        '<p class="end__kicker">It\'s a</p>' +
        '<p class="end__big">DRAW</p>' +
        '<div class="end__trophy">🤝</div>' +
        '<div class="end__score"><span class="end__score-label">Final score</span>' + scoreCard + "</div>" +
        '<button class="end__home" type="button">Home</button>';
    } else {
      var winner = blue > orange ? 0 : 1;
      inner.className = "end end--winner";
      inner.innerHTML =
        '<p class="end__kicker">The winner is</p>' +
        '<h2 class="end__headline" style="color:' + PLAYER[winner].color + '">' + PLAYER[winner].name + " Player</h2>" +
        '<div class="end__trophy">🏆</div>' +
        '<div class="end__score"><span class="end__score-label">Final score</span>' + scoreCard + "</div>" +
        '<button class="end__home" type="button">Home</button>';
      launchConfetti();
    }
    inner.querySelector(".end__home").addEventListener("click", goHome);
    show("end");
  }

  /* ---------------- Quit dialog ---------------- */
  function openDialog() { document.getElementById("overlay").hidden = false; }
  function closeDialog() { document.getElementById("overlay").hidden = true; }

  function goHome() {
    clearConfetti();
    game = null;
    show("home");
  }

  function setupGlobal() {
    document.getElementById("btn-exit").addEventListener("click", openDialog);
    document.getElementById("btn-stay").addEventListener("click", closeDialog);
    document.getElementById("btn-quit").addEventListener("click", goHome);
    document.getElementById("overlay").addEventListener("click", function (e) {
      if (e.target === this) closeDialog();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !document.getElementById("overlay").hidden) closeDialog();
    });
  }

  /* ---------------- Confetti ---------------- */
  function launchConfetti() {
    var host = document.getElementById("confetti");
    clearConfetti();
    var colors = ["#F0EA6E", "#097FC5", "#EA6900", "#4DD5BC", "#ED1B76", "#FFFFFF"];
    for (var i = 0; i < 90; i++) {
      var s = document.createElement("span");
      s.style.left = Math.random() * 100 + "%";
      s.style.background = colors[Math.floor(Math.random() * colors.length)];
      s.style.animationDuration = (2.5 + Math.random() * 2.5) + "s";
      s.style.animationDelay = (Math.random() * 0.8) + "s";
      s.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      if (Math.random() > 0.6) s.style.borderRadius = "50%";
      host.appendChild(s);
    }
  }
  function clearConfetti() { document.getElementById("confetti").innerHTML = ""; }

  /* ---------------- Boot ---------------- */
  setupSettings();
  setupGlobal();
  show("home");
})();
