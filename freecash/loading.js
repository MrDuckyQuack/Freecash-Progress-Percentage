// ==UserScript==
// @name         Freecash Duck Loading
// @namespace    freecash-duck-Loading
// @version      1.7.1
// @description  Shows a cute duck loading screen on Freecash with animated floating ducks and balloons
// @author       DuckyQuack
// @match        https://freecash.com/*
    "READY TO EARN?",
    "LET'S GET THIS BREAD",
    "DUCK MODE: ACTIVATED",
    "LOADING DUCK MAGIC",
    "WADDLE YOU WAITING FOR?",
    "MONEH SEASON!",
    "FREE MONEH DUCK"
  ];

  const duckEmojis = ["🦆", "🦆✨", "🦆🌟", "🦆💫", "🦆⚡", "🦆🌈", "🦆🔥", "🦆💦", "🐥", "🦆🦆"];
  const balloonEmojis = ["🎈", "🎈🎈", "🎈✨", "🎈🌟", "🎈⭐"];

  GM_addStyle(`
    #duck-Loading-screen {
      position: fixed !important;
      inset: 0 !important;
      width: 100vw !important;
      pointer-events: all !important;
      overflow: hidden !important;
    }
    #duck-Loading-screen.duck-visible { opacity: 1 !important; }
    #duck-Loading-screen.duck-hiding { opacity: 0 !important; pointer-events: none !important; }

    .duck-float-container { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; pointer-events: none !important; z-index: 1 !important; }

  let isShowing = false;
  let hasShownInitial = false;

  // Function to check if duck Loading is enabled
  function isDuckLoadingEnabled() {
    // Check window.userConfig first
    if (window.userConfig && window.userConfig.showDuckLoading !== undefined) {
      return window.userConfig.showDuckLoading === true;
    }

    // Check localStorage directly as fallback
    try {
      const saved = localStorage.getItem('fc-ducky-config');
      if (saved) {
        const config = JSON.parse(saved);
        return config.showDuckLoading !== false; // Default to true if not set
      }
    } catch (e) {
      console.log('Error reading config:', e);
  }

  function showDuck() {
    // Check if duck Loading is enabled
    if (!isDuckLoadingEnabled()) {
      console.log('🦆 Duck Loading screen is disabled');
      return;
    }

    if (isShowing) return;
    if (activeTimer) clearTimeout(activeTimer);

    const existing = document.getElementById('duck-Loading-screen');
    if (existing) existing.remove();

    isShowing = true;
    const msg = duckMessages[Math.floor(Math.random() * duckMessages.length)];
    const emoji = duckEmojis[Math.floor(Math.random() * duckEmojis.length)];

    const el = document.createElement('div');
    el.id = 'duck-Loading-screen';

    const floatContainer = document.createElement('div');
    floatContainer.className = 'duck-float-container';
    activeTimer = setTimeout(() => {
      el.classList.add('duck-hiding');
      setTimeout(() => { el.remove(); isShowing = false; }, 500);
    }, 2000);
  }

  function triggerAfterDelay() {
    if (isShowing) return;
    // Check if enabled before triggering
    if (!isDuckLoadingEnabled()) {
      console.log('🦆 Duck Loading screen is disabled, not showing');
      return;
    }
    setTimeout(showDuck, 10);
  }

  // Listen for config changes
  window.addEventListener('duckConfigChanged', (e) => {
    console.log('🦆 Config changed in loading.js:', e.detail);
    // If disabled and currently showing, hide it
    if (e.detail.showDuckLoading === false && isShowing) {
      const el = document.getElementById('duck-Loading-screen');
      if (el) {
        el.classList.add('duck-hiding');
        setTimeout(() => { el.remove(); isShowing = false; }, 500);
  });

  // Check config immediately
  if (!isDuckLoadingEnabled()) {
    console.log('🦆 Duck Loading screen is disabled on startup');
  } else if (!hasShownInitial) {
    if (document.readyState === 'complete') {
      hasShownInitial = true;

  history.pushState = function (...args) { 
    _pushState(...args); 
    if (hasShownInitial && isDuckLoadingEnabled()) triggerAfterDelay(); 
  };

  history.replaceState = function (...args) { 
    _replaceState(...args); 
    if (hasShownInitial && isDuckLoadingEnabled()) triggerAfterDelay(); 
  };

  window.addEventListener('popstate', () => { 
    if (hasShownInitial && isDuckLoadingEnabled()) triggerAfterDelay(); 
  });

  // Also check config periodically for the first few seconds
  // (in case settings.js loads after loading.js)
  let checkCount = 0;
  const configCheck = setInterval(() => {
    checkCount++;
    if (isDuckLoadingEnabled()) {
      // If enabled and we haven't shown yet, show it
      if (!hasShownInitial && !isShowing) {
        hasShownInitial = true;
        showDuck();
      }
      clearInterval(configCheck);
    } else if (checkCount > 20) { // Stop after 2 seconds (20 * 100ms)
      clearInterval(configCheck);
    }
  }, 100);

})();
