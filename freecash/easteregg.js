// ==UserScript==
// @name         Freecash Easter Egg Gem
// @namespace    freecash-easter-egg
// @version      1.1.0
// @description  Shows a gem with a duck (mirrored) and a goat facing each other when Konami code is entered
// @author       DuckyQuack
// @match        https://freecash.com/*
// @match        https://www.freecash.com/*
// @run-at       document-end
// @grant        GM_addStyle
// ==/UserScript==

(function() {
  'use strict';

  const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a','Enter'];
  let codeIndex = 0;

  GM_addStyle(`
    #easteregg-overlay {
      position: fixed !important;
      inset: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: rgba(0,0,0,0.75) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 2147483647 !important;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif !important;
      opacity: 0 !important;
      transition: opacity 0.5s ease !important;
    }

    #easteregg-overlay.show { opacity: 1 !important; }

    #gem-container {
      position: relative !important;
      width: 400px !important;
      height: 400px !important;
    }

    #gem {
      position: absolute !important;
      width: 100% !important;
      height: 100% !important;
      background: linear-gradient(135deg, #ff5f6d, #ffc371) !important;
      clip-path: polygon(
        50% 0%, 65% 15%, 80% 40%, 70% 70%, 50% 100%, 30% 70%, 20% 40%, 35% 15%
      ) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 80px !important;
      color: white !important;
    }

    #gem-content {
      position: absolute !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 100px !important;
      gap: 40px !important;
    }

    #gem-content span {
      display: inline-block !important;
      transform: translateY(0);
      animation: bounce 1.5s infinite alternate ease-in-out;
    }

    #gem-content span:nth-child(1) { animation-delay: 0s; transform: scaleX(-1); } /* Mirrored duck */
    #gem-content span:nth-child(2) { animation-delay: 0.3s; }

    @keyframes bounce {
      0% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(-10deg); }
      100% { transform: translateY(0) rotate(0deg); }
    }
  `);

  function showEasterEgg() {
    if (document.getElementById('easteregg-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'easteregg-overlay';

    const gemContainer = document.createElement('div');
    gemContainer.id = 'gem-container';

    const gem = document.createElement('div');
    gem.id = 'gem';

    const gemContent = document.createElement('div');
    gemContent.id = 'gem-content';

    const duck = document.createElement('span');
    duck.textContent = '🦆'; // mirrored via scaleX(-1)

    const goat = document.createElement('span');
    goat.textContent = '🐐';

    gemContent.appendChild(duck);
    gemContent.appendChild(goat);
    gemContainer.appendChild(gem);
    gemContainer.appendChild(gemContent);
    overlay.appendChild(gemContainer);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => overlay.classList.add('show'));

    overlay.addEventListener('click', () => {
      overlay.classList.remove('show');
      setTimeout(() => overlay.remove(), 500);
    });
  }

  window.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key === konamiCode[codeIndex]) {
      codeIndex++;
      if (codeIndex === konamiCode.length) {
        showEasterEgg();
        codeIndex = 0;
      }
    } else {
      codeIndex = 0;
    }
  });

})();
