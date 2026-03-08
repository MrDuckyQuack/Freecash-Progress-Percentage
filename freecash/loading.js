// ==UserScript==
// @name         Freecash Duck Welcome
// @namespace    freecash-duck-welcome
// @version      1.3
// @description  Shows a cute duck loading screen on Freecash after page load
// @author       DuckyQuack
// @match        https://freecash.com/*
// @match        https://www.freecash.com/*
// @run-at       document-end
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  const duckMessages = [
    "WELCOME TO FREECASH!",
    "DUCKYQUACK WAS HERE",
    "QUACK QUACK!",
    "READY TO EARN?",
    "LET'S GET THIS BREAD",
    "DUCK MODE: ACTIVATED",
    "LOADING DUCKY MAGIC",
    "WADDLE YOU WAITING FOR?",
    "DUCK SEASON!",
    "FREE MONEY DUCK"
  ];

  const duckEmojis = ["🦆", "🦆✨", "🦆🌟", "🦆💫", "🦆⚡", "🦆🌈", "🦆🔥", "🦆💦", "🐥", "🦆🦆"];

  GM_addStyle(`
    #duck-welcome-screen {
      position: fixed !important;
      inset: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 2147483647 !important;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif !important;
      opacity: 0 !important;
      transition: opacity 0.4s ease !important;
      pointer-events: all !important;
    }

    #duck-welcome-screen.duck-visible {
      opacity: 1 !important;
    }

    #duck-welcome-screen.duck-hiding {
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .duck-emoji {
      font-size: 120px !important;
      line-height: 1 !important;
      margin-bottom: 24px !important;
      display: block !important;
      animation: duckWobble 1.8s ease-in-out infinite !important;
      filter: drop-shadow(0 10px 30px rgba(16,185,129,0.6)) !important;
    }

    @keyframes duckWobble {
      0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
      25%       { transform: translateY(-20px) rotate(-8deg) scale(1.08); }
      75%       { transform: translateY(-12px) rotate(8deg) scale(1.04); }
    }

    .duck-title {
      font-size: 42px !important;
      font-weight: 900 !important;
      letter-spacing: 3px !important;
      background: linear-gradient(90deg, #10b981, #34d399, #6ee7b7, #34d399, #10b981) !important;
      background-size: 300% auto !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      background-clip: text !important;
      animation: duckShimmer 2.5s linear infinite !important;
      margin: 0 0 12px 0 !important;
      text-align: center !important;
    }

    @keyframes duckShimmer {
      0%   { background-position: 0% center; }
      100% { background-position: 300% center; }
    }

    .duck-sub {
      color: #94a3b8 !important;
      font-size: 18px !important;
      letter-spacing: 2px !important;
      font-weight: 300 !important;
      margin: 0 0 36px 0 !important;
    }

    .duck-bar-wrap {
      width: 360px !important;
      height: 8px !important;
      background: rgba(255,255,255,0.08) !important;
      border-radius: 99px !important;
      overflow: hidden !important;
      border: 1px solid rgba(16,185,129,0.25) !important;
      box-shadow: 0 0 20px rgba(16,185,129,0.15) !important;
    }

    .duck-bar-fill {
      height: 100% !important;
      width: 0% !important;
      border-radius: 99px !important;
      background: linear-gradient(90deg, #10b981, #34d399, #10b981) !important;
      background-size: 200% auto !important;
      animation: duckBarGrow 3.5s cubic-bezier(0.4,0,0.2,1) forwards,
                 duckBarShine 1s linear infinite !important;
    }

    @keyframes duckBarGrow {
      0%   { width: 0%; }
      100% { width: 100%; }
    }

    @keyframes duckBarShine {
      0%   { background-position: 0% center; }
      100% { background-position: 200% center; }
    }

    .duck-footer {
      position: absolute !important;
      bottom: 32px !important;
      color: #334155 !important;
      font-size: 14px !important;
      letter-spacing: 1px !important;
    }
  `);

  function showDuck() {
    if (document.getElementById('duck-welcome-screen')) return;

    const msg   = duckMessages[Math.floor(Math.random() * duckMessages.length)];
    const emoji = duckEmojis[Math.floor(Math.random() * duckEmojis.length)];

    const el = document.createElement('div');
    el.id = 'duck-welcome-screen';
    el.innerHTML = `
      <span class="duck-emoji">${emoji}</span>
      <div class="duck-title">🦆 ${msg}</div>
      <div class="duck-sub">Making Freecash ducky since 2024</div>
      <div class="duck-bar-wrap">
        <div class="duck-bar-fill"></div>
      </div>
      <div class="duck-footer">🐤 Created by DuckyQuack</div>
    `;

    document.body.appendChild(el);

    // Fade in on next paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add('duck-visible');
      });
    });

    // Fade out after 4 seconds (progress bar matches at 3.5s)
    setTimeout(() => {
      el.classList.add('duck-hiding');
      setTimeout(() => el.remove(), 500);
    }, 4000);
  }

  // Wait 2 seconds after the page is fully loaded, then show
  window.addEventListener('load', () => {
    setTimeout(showDuck, 2000);
  });

  // Fallback: if load already fired (script ran late), just wait 2s from now
  if (document.readyState === 'complete') {
    setTimeout(showDuck, 2000);
  }

})();
