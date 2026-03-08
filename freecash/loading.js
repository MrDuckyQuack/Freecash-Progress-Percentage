// ==UserScript==
// @name         Freecash Duck Loader
// @namespace    freecash-duck-loader
// @version      1.0
// @description  Replaces Freecash loader with a cute duck loading screen
// @author       DuckyQuack
// @match        https://freecash.com/*
// @match        https://www.freecash.com/*
// @run-at       document-start
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  console.log('🦆 Duck Loader installed');

  // Add styles for the duck loader
  GM_addStyle(`
    /* Duck Loader Styles */
    .duck-loader-container {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: linear-gradient(135deg, #1a1a2e, #16213e) !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 9999999 !important;
      transition: opacity 0.5s ease !important;
      font-family: 'Segoe UI', system-ui, sans-serif !important;
    }

    .duck-loader-container.fade-out {
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .duck-loader {
      font-size: 80px !important;
      animation: duckWaddle 1s ease-in-out infinite !important;
      margin-bottom: 20px !important;
      filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3)) !important;
    }

    @keyframes duckWaddle {
      0%, 100% { 
        transform: translateY(0) rotate(0deg); 
      }
      25% { 
        transform: translateY(-10px) rotate(-5deg); 
      }
      75% { 
        transform: translateY(-5px) rotate(5deg); 
      }
    }

    .duck-loader-text {
      font-size: 24px !important;
      font-weight: bold !important;
      background: linear-gradient(90deg, #10b981, #34d399, #10b981) !important;
      background-size: 200% auto !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      animation: textShine 2s linear infinite !important;
      margin-bottom: 30px !important;
      letter-spacing: 2px !important;
    }

    @keyframes textShine {
      0% { background-position: 0% center; }
      100% { background-position: 200% center; }
    }

    .duck-progress-bar {
      width: 300px !important;
      height: 8px !important;
      background: rgba(255,255,255,0.1) !important;
      border-radius: 10px !important;
      overflow: hidden !important;
      margin: 20px 0 !important;
      border: 1px solid rgba(16,185,129,0.3) !important;
    }

    .duck-progress-fill {
      height: 100% !important;
      width: 0% !important;
      background: linear-gradient(90deg, #10b981, #34d399) !important;
      border-radius: 10px !important;
      animation: loadingProgress 2s ease-in-out infinite !important;
    }

    @keyframes loadingProgress {
      0% { width: 0%; margin-left: 0%; }
      50% { width: 100%; margin-left: 0%; }
      100% { width: 0%; margin-left: 100%; }
    }

    .duck-tip {
      color: #9ca3af !important;
      font-size: 14px !important;
      max-width: 400px !important;
      text-align: center !important;
      margin-top: 20px !important;
      padding: 0 20px !important;
      line-height: 1.6 !important;
    }

    .duck-tip strong {
      color: #10b981 !important;
    }

    .duck-water {
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100px !important;
      background: linear-gradient(transparent, rgba(16,185,129,0.1)) !important;
      pointer-events: none !important;
    }

    .duck-bubble {
      position: absolute !important;
      background: rgba(255,255,255,0.1) !important;
      border-radius: 50% !important;
      pointer-events: none !important;
      animation: bubbleFloat 3s ease-in-out infinite !important;
    }

    @keyframes bubbleFloat {
      0% { 
        transform: translateY(0) scale(1); 
        opacity: 0.5; 
      }
      100% { 
        transform: translateY(-100px) scale(1.5); 
        opacity: 0; 
      }
    }

    /* Random duck facts/tips */
    .duck-fact {
      color: #6b7280 !important;
      font-size: 13px !important;
      margin-top: 10px !important;
      font-style: italic !important;
    }

    /* Hide original loader */
    .container:has(video[src*="fullscreen-loader"]),
    div:has(> video[src*="fullscreen-loader"]),
    video[src*="fullscreen-loader"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    /* Force hide any parent containers */
    .container:has(video),
    .row:has(video),
    .col:has(video) {
      display: none !important;
    }
  `);

  // Array of duck-themed loading messages
  const loadingMessages = [
    "🦆 Waddling through the interwebs...",
    "🦆 Quack-tivating your experience...",
    "🦆 Duck mode: ACTIVE",
    "🦆 Spreading ducky magic...",
    "🦆 Loading ducky goodness...",
    "🦆 Flapping wings of progress...",
    "🦆 DuckyQuack was here...",
    "🦆 Ducks are better than humans",
    "🦆 Quack quack motherducker...",
    "🦆 Making things duck-tastic..."
  ];

  // Array of duck tips
  const duckTips = [
    "💡 Tip: Ducks have three eyelids!",
    "💡 Tip: A group of ducks is called a paddling",
    "💡 Tip: Ducks can sleep with one eye open",
    "💡 Tip: Duck feathers are waterproof",
    "💡 Tip: Ducks are omnivores",
    "💡 Tip: A duck's quack doesn't echo (myth buster!)",
    "💡 Tip: There's a settings menu with a duck! 🦆",
    "💡 Tip: Enable Duck Dance in settings for celebrations"
  ];

  // Array of duck emojis for variation
  const duckEmojis = ["🦆", "🦆✨", "🦆💫", "🦆🌟", "🦆⚡", "🦆💨", "🦆💦", "🐥", "🐤"];

  // Create duck loader element
  function createDuckLoader() {
    // Check if loader already exists
    if (document.getElementById('duck-loader-container')) {
      return;
    }

    const loaderContainer = document.createElement('div');
    loaderContainer.id = 'duck-loader-container';
    loaderContainer.className = 'duck-loader-container';

    // Random selections
    const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    const randomTip = duckTips[Math.floor(Math.random() * duckTips.length)];
    const randomDuck = duckEmojis[Math.floor(Math.random() * duckEmojis.length)];

    // Create bubbles
    const bubbles = [];
    for (let i = 0; i < 10; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'duck-bubble';
      bubble.style.width = Math.random() * 30 + 10 + 'px';
      bubble.style.height = bubble.style.width;
      bubble.style.left = Math.random() * 100 + '%';
      bubble.style.bottom = '20px';
      bubble.style.animationDelay = Math.random() * 2 + 's';
      bubble.style.animationDuration = Math.random() * 3 + 2 + 's';
      bubbles.push(bubble);
    }

    loaderContainer.innerHTML = `
      <div class="duck-loader">${randomDuck}</div>
      <div class="duck-loader-text">${randomMessage}</div>
      <div class="duck-progress-bar">
        <div class="duck-progress-fill"></div>
      </div>
      <div class="duck-tip">
        <strong>Did you know?</strong><br>
        ${randomTip}
      </div>
      <div class="duck-fact">Making the web ducky since 2024</div>
      <div class="duck-water"></div>
      ${bubbles.map(b => b.outerHTML).join('')}
    `;

    return loaderContainer;
  }

  // Function to hide original loader and show duck loader
  function replaceLoader() {
    // Find the original loader video
    const originalLoader = document.querySelector('video[src*="fullscreen-loader"]');
    
    if (originalLoader) {
      // Hide the original loader's container
      const container = originalLoader.closest('.container');
      if (container) {
        container.style.display = 'none';
      }

      // Create and show duck loader if not already present
      if (!document.getElementById('duck-loader-container')) {
        const duckLoader = createDuckLoader();
        if (duckLoader) {
          document.body.appendChild(duckLoader);
          console.log('🦆 Duck loader activated!');
        }
      }
    }
  }

  // Function to remove duck loader when page is loaded
  function removeDuckLoader() {
    const duckLoader = document.getElementById('duck-loader-container');
    if (duckLoader) {
      duckLoader.classList.add('fade-out');
      setTimeout(() => {
        if (duckLoader.parentNode) {
          duckLoader.parentNode.removeChild(duckLoader);
          console.log('🦆 Duck loader removed, welcome to Freecash!');
        }
      }, 500);
    }
  }

  // Watch for DOM changes to catch the loader when it appears
  function watchForLoader() {
    // Initial check
    replaceLoader();

    // Set up mutation observer to watch for the loader being added
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          // Check if the added node or its children contain the loader
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) { // Element node
              if (node.querySelector && node.querySelector('video[src*="fullscreen-loader"]')) {
                replaceLoader();
                break;
              }
              if (node.matches && node.matches('video[src*="fullscreen-loader"]')) {
                replaceLoader();
                break;
              }
            }
          }
        }
      }
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Remove duck loader when page is fully loaded
    window.addEventListener('load', () => {
      setTimeout(removeDuckLoader, 1000); // Small delay to ensure smooth transition
    });

    // Also check if page is already loaded
    if (document.readyState === 'complete') {
      setTimeout(removeDuckLoader, 1000);
    }
  }

  // Initialize when DOM is ready
  if (document.body) {
    watchForLoader();
  } else {
    document.addEventListener('DOMContentLoaded', watchForLoader);
  }

  // Add a manual override function (can be called from console if needed)
  window.showDuckLoader = function() {
    if (!document.getElementById('duck-loader-container')) {
      const duckLoader = createDuckLoader();
      if (duckLoader) {
        document.body.appendChild(duckLoader);
      }
    }
  };

  window.hideDuckLoader = function() {
    removeDuckLoader();
  };

})();
