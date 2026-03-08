// ==UserScript==
// @name         Freecash Duck Loader
// @namespace    freecash-duck-loader
// @version      1.1
// @description  Replaces Freecash loader with a cute duck loading screen
// @author       DuckyQuack
// @match        https://freecash.com/*
// @match        https://www.freecash.com/*
// @run-at       document-start
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  console.log('🦆 Duck Loader installed - waiting to replace loader...');

  // Add styles for the duck loader immediately
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
      font-size: 100px !important;
      animation: duckWaddle 1s ease-in-out infinite !important;
      margin-bottom: 20px !important;
      filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3)) !important;
      line-height: 1 !important;
    }

    @keyframes duckWaddle {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-15px) rotate(-8deg); }
      75% { transform: translateY(-8px) rotate(8deg); }
    }

    .duck-loader-text {
      font-size: 28px !important;
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
      width: 320px !important;
      height: 10px !important;
      background: rgba(255,255,255,0.1) !important;
      border-radius: 10px !important;
      overflow: hidden !important;
      margin: 20px 0 !important;
      border: 1px solid rgba(16,185,129,0.3) !important;
      box-shadow: 0 0 20px rgba(16,185,129,0.2) !important;
    }

    .duck-progress-fill {
      height: 100% !important;
      width: 30% !important;
      background: linear-gradient(90deg, #10b981, #34d399) !important;
      border-radius: 10px !important;
      animation: loadingProgress 1.5s ease-in-out infinite !important;
    }

    @keyframes loadingProgress {
      0% { width: 0%; margin-left: 0%; }
      50% { width: 100%; margin-left: 0%; }
      100% { width: 0%; margin-left: 100%; }
    }

    .duck-tip {
      color: #9ca3af !important;
      font-size: 16px !important;
      max-width: 450px !important;
      text-align: center !important;
      margin-top: 25px !important;
      padding: 0 25px !important;
      line-height: 1.6 !important;
    }

    .duck-tip strong {
      color: #10b981 !important;
      font-size: 18px !important;
    }

    .duck-water {
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 150px !important;
      background: linear-gradient(transparent, rgba(16,185,129,0.15)) !important;
      pointer-events: none !important;
    }

    /* Force hide the original loader - MORE AGGRESSIVE */
    .container:has(video[src*="fullscreen-loader"]),
    div.container:has(video),
    .row:has(video),
    .col:has(video),
    video[src*="fullscreen-loader"],
    video[src*="loader"],
    video[width="100"][height="100"],
    video[autoplay][loop][muted] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
      position: absolute !important;
      z-index: -9999 !important;
    }

    /* Hide any parent that might contain the loader */
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
    "🦆 Making things duck-tastic...",
    "🦆 Duck incoming!",
    "🦆 Preparing ducky surprises..."
  ];

  // Array of duck tips
  const duckTips = [
    "Ducks have three eyelids!",
    "A group of ducks is called a paddling",
    "Ducks can sleep with one eye open",
    "Duck feathers are waterproof",
    "Ducks are omnivores",
    "A duck's quack does echo (myth busted!)",
    "There's a settings menu with a duck! 🦆",
    "Enable Duck Dance in settings for celebrations",
    "Ducks have been around for 30 million years",
    "A duck can't walk without waddling"
  ];

  // Array of duck emojis for variation
  const duckEmojis = ["🦆", "🦆✨", "🦆💫", "🦆🌟", "🦆⚡", "🦆💨", "🦆💦", "🐥", "🐤", "🦆🌈"];

  // Create duck loader element
  function createDuckLoader() {
    // Check if loader already exists
    if (document.getElementById('duck-loader-container')) {
      return null;
    }

    const loaderContainer = document.createElement('div');
    loaderContainer.id = 'duck-loader-container';
    loaderContainer.className = 'duck-loader-container';

    // Random selections
    const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    const randomTip = duckTips[Math.floor(Math.random() * duckTips.length)];
    const randomDuck = duckEmojis[Math.floor(Math.random() * duckEmojis.length)];

    loaderContainer.innerHTML = `
      <div class="duck-loader">${randomDuck}</div>
      <div class="duck-loader-text">${randomMessage}</div>
      <div class="duck-progress-bar">
        <div class="duck-progress-fill"></div>
      </div>
      <div class="duck-tip">
        <strong>Did you know?</strong><br>
        🦆 ${randomTip}
      </div>
      <div class="duck-water"></div>
    `;

    return loaderContainer;
  }

  // Function to aggressively remove original loader
  function removeOriginalLoader() {
    // Try multiple selector strategies
    const selectors = [
      'video[src*="fullscreen-loader"]',
      'video[src*="loader"]',
      'video[width="100"][height="100"]',
      'video[autoplay][loop][muted]',
      '.container video',
      '.row video',
      '.col video'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        console.log('🦆 Found and hiding loader element:', el);
        el.remove(); // Remove completely instead of just hiding
      });
    });

    // Also try to find and remove the container
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => {
      if (container.innerHTML.includes('fullscreen-loader') || 
          container.innerHTML.includes('loader.mp4')) {
        console.log('🦆 Found and removing loader container');
        container.remove();
      }
    });
  }

  // Function to show duck loader
  function showDuckLoader() {
    // Remove any existing duck loader first
    const existingLoader = document.getElementById('duck-loader-container');
    if (existingLoader) {
      existingLoader.remove();
    }

    // Create and show new duck loader
    const duckLoader = createDuckLoader();
    if (duckLoader) {
      // Remove original loader immediately
      removeOriginalLoader();
      
      // Add duck loader to page
      document.documentElement.appendChild(duckLoader); // Append to html instead of body for earlier loading
      console.log('🦆 Duck loader activated!');
      
      return duckLoader;
    }
    return null;
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

  // Initial aggressive removal
  removeOriginalLoader();
  
  // Show duck loader immediately
  const loader = showDuckLoader();

  // Watch for any new loader elements being added
  const observer = new MutationObserver((mutations) => {
    let needsReplacement = false;
    
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) { // Element node
            const html = node.outerHTML || '';
            if (html.includes('fullscreen-loader') || 
                html.includes('loader.mp4') ||
                (node.querySelector && node.querySelector('video[src*="loader"]'))) {
              needsReplacement = true;
              break;
            }
          }
        }
      }
    }
    
    if (needsReplacement) {
      console.log('🦆 Loader detected, replacing...');
      removeOriginalLoader();
      
      // Ensure duck loader is still there
      if (!document.getElementById('duck-loader-container')) {
        showDuckLoader();
      }
    }
  });

  // Start observing as soon as possible
  if (document.documentElement) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  // Multiple ways to detect when page is loaded
  function onPageLoaded() {
    // Wait a bit to ensure page is really ready
    setTimeout(() => {
      removeDuckLoader();
    }, 1500);
  }

  if (document.readyState === 'complete') {
    onPageLoaded();
  } else {
    window.addEventListener('load', onPageLoaded);
    document.addEventListener('DOMContentLoaded', onPageLoaded);
  }

  // Also check periodically if we need to remove the loader
  let checkCount = 0;
  const interval = setInterval(() => {
    checkCount++;
    
    // Check if page seems loaded (presence of main content)
    const hasContent = document.querySelector('main, .app, #root, .content') || 
                      document.body.children.length > 5;
    
    if (hasContent && checkCount > 10) {
      removeDuckLoader();
      clearInterval(interval);
    }
    
    // Safety: remove after 10 seconds max
    if (checkCount > 50) { // 5 seconds (50 * 100ms)
      removeDuckLoader();
      clearInterval(interval);
    }
  }, 100);

  // Manual override functions
  window.showDuckLoader = showDuckLoader;
  window.hideDuckLoader = removeDuckLoader;

  console.log('🦆 Duck Loader is active and watching for the original loader...');
})();
