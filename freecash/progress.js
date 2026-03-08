// ==UserScript==
// @name         Freecash Progress Display
// @namespace    freecash-progress-display
// @version      1.0
// @description  Progress percentage display logic for Freecash
// @author       DuckyQuack
// @match        https://freecash.com/*
// @match        https://www.freecash.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // Store previous percentages to detect REAL changes
  const previousPercentages = new Map();

  function getProgressColor(percent) {
    if (percent >= 100) return '#10b981'; // Emerald green for complete
    if (percent >= 75) return '#10b981'; // Green for high progress
    if (percent >= 50) return '#f59e0b'; // Orange for medium progress
    if (percent >= 25) return '#f97316'; // Dark orange for low-medium
    return '#ef4444'; // Red for low progress
  }

  function getProgressEmoji(percent, showEmojis) {
    if (!showEmojis) return '';
    
    if (percent >= 100) return '🏆';
    if (percent >= 90) return '🚀';
    if (percent >= 75) return '⚡';
    if (percent >= 50) return '📈';
    if (percent >= 25) return '⏳';
    if (percent >= 10) return '🐢';
    return '🥚';
  }

  function createNumberRollAnimation(element, oldValue, newValue, config) {
    if (!config.numberRollEnabled || !config.animationsEnabled) {
      // Just update the number directly
      const numberSpan = element.querySelector('.rolling-number');
      if (numberSpan) {
        numberSpan.textContent = `${newValue.toFixed(config.decimalPrecision)}%`;
      }
      return;
    }
    
    const duration = 2500; // 2.5 seconds for the roll
    const startTime = performance.now();
    const difference = newValue - oldValue;

    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smoother easing for relaxed feel
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const currentValue = oldValue + (difference * easeOutQuart);
      const currentStr = currentValue.toFixed(config.decimalPrecision);
      const newStr = newValue.toFixed(config.decimalPrecision);

      // Split into parts
      const [intPart, decimalPart] = currentStr.split('.');
      const [targetInt, targetDecimal] = newStr.split('.');

      // During animation
      if (progress < 1) {
        const formattedInt = intPart.split('').map((digit, index) => {
          const isCorrect = digit === targetInt[index];
          return `<span style="
            display: inline-block;
            color: ${isCorrect ? '#10b981' : 'inherit'};
            font-weight: ${isCorrect ? 'bold' : 'normal'};
            transform: translateY(${Math.sin(progress * Math.PI * 2) * 1.5}px);
            transition: all 0.3s ease;
          ">${digit}</span>`;
        }).join('');

        // Decimal part stays small and green during the roll
        const formattedDecimal = decimalPart.split('').map((digit, index) => {
          const isCorrect = digit === targetDecimal[index];
          return `<span style="
            display: inline-block;
            color: #10b981; /* Force green during roll */
            font-weight: bold;
            font-size: 0.85em;
            opacity: 0.9;
            transform: translateY(${Math.cos(progress * Math.PI * 2) * 0.8}px);
            transition: all 0.3s ease;
          ">${digit}</span>`;
        }).join('');

        const numberSpan = element.querySelector('.rolling-number');
        if (numberSpan) {
          numberSpan.innerHTML = `
            <span style="display: inline-flex; align-items: baseline;">
              <span style="display: inline-flex;">${formattedInt}</span>
              <span style="opacity: 0.7;">.</span>
              <span style="display: inline-flex; font-size: 0.85em;">${formattedDecimal}</span>
              <span style="margin-left: 1px;">%</span>
            </span>
          `;
        }
      }

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        // Animation complete - start the decimal growth phase
        const numberSpan = element.querySelector('.rolling-number');
        if (numberSpan) {
          // Get the current emoji
          const emojiSpan = element.querySelector('.progress-emoji');
          const currentEmoji = emojiSpan ? emojiSpan.textContent : getProgressEmoji(newValue, config.showEmojis);

          // Show the final number with decimal small and GREEN
          const [finalInt, finalDecimal] = newStr.split('.');

          numberSpan.innerHTML = `
            <span style="display: inline-flex; align-items: baseline;">
              <span style="display: inline-flex;">${finalInt}</span>
              <span style="opacity: 0.7;">.</span>
              <span style="display: inline-flex; font-size: 0.85em; color: #10b981; font-weight: bold;" class="decimal-waiting">
                ${finalDecimal}
              </span>
              <span style="margin-left: 1px;">%</span>
            </span>
          `;

          // After 2 seconds, animate the decimal back to normal
          setTimeout(() => {
            if (element.isConnected) {
              const decimalSpan = element.querySelector('.decimal-waiting');
              if (decimalSpan) {
                // Add growth animation
                decimalSpan.style.transition = 'all 1s ease';
                decimalSpan.style.fontSize = '1em';
                decimalSpan.style.color = 'inherit';
                decimalSpan.style.fontWeight = 'normal';
                decimalSpan.style.opacity = '0.8';

                // Clean up after animation
                setTimeout(() => {
                  if (element.isConnected) {
                    // Restore to normal completely
                    const parentSpan = numberSpan.closest('span[style*="display: flex"]');
                    if (parentSpan) {
                      parentSpan.innerHTML = `
                        <span style="font-size: 1.1em;" class="progress-emoji">${currentEmoji}</span>
                        <span style="font-family: monospace; display: inline-flex; align-items: baseline; color: inherit;" class="rolling-number">
                          ${newValue.toFixed(config.decimalPrecision)}%
                        </span>
                      `;
                    }
                  }
                }, 1000); // Wait for growth animation to finish
              }
            }
          }, 2000); // Wait 2 seconds before starting growth
        }
      }
    }

    requestAnimationFrame(updateNumber);
  }

  function createDuckDance(element, config, duckFrames) {
    if (!config.duckDanceEnabled || !config.animationsEnabled) {
      // Just show a simple 100% indicator
      element.innerHTML = `
        <span style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        ">
          <span>🏆</span>
          <span style="font-family: monospace; font-weight: bold;">100%</span>
        </span>
      `;
      return;
    }
    
    let frame = 0;

    const danceInterval = setInterval(() => {
      if (!element.isConnected) {
        clearInterval(danceInterval);
        return;
      }

      element.innerHTML = `
        <span style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-size: 1.2em;
          animation: duckBounce 0.5s ease infinite;
        ">
          ${duckFrames[frame % duckFrames.length]}
        </span>
      `;

      frame++;
    }, 300);

    setTimeout(() => {
      clearInterval(danceInterval);
      if (element.isConnected) {
        element.innerHTML = `
          <span style="
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
          ">
            <span>🏆</span>
            <span style="font-family: monospace; font-weight: bold;">100%</span>
          </span>
        `;
      }
    }, 5000);
  }

  // Debounce function with configurable speed
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Get debounce time based on user config
  function getDebounceTime(config) {
    switch(config.updateSpeed) {
      case 'slow': return 300;
      case 'fast': return 50;
      case 'normal':
      default: return 150;
    }
  }

  // Main progress update function
  window.initProgressDisplay = function(userConfig, duckFrames) {
    console.log('📊 Progress display initialized');

    // Add progress-specific styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes duckBounce {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-5px) rotate(-10deg); }
        75% { transform: translateY(-5px) rotate(10deg); }
      }

      @keyframes borderPulse {
        0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.7), 0 0 10px currentColor; }
        70% { box-shadow: 0 0 0 10px rgba(255,255,255,0), 0 0 20px currentColor; }
        100% { box-shadow: 0 0 0 0 rgba(255,255,255,0), 0 0 10px currentColor; }
      }

      @keyframes containerPop {
        0% { transform: scale(1); }
        30% { transform: scale(1.08); }
        70% { transform: scale(0.98); }
        100% { transform: scale(1); }
      }

      @keyframes emojiPop {
        0% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.3) rotate(10deg); }
        100% { transform: scale(1) rotate(0deg); }
      }

      .fc-percent {
        vertical-align: middle;
        line-height: 1;
        overflow: hidden;
        transition: border-color 0.4s ease;
      }

      .fc-percent span {
        color: inherit;
      }

      /* Normal state */
      .fc-percent .rolling-number {
        color: inherit;
        font-family: monospace;
        display: inline-flex;
        align-items: baseline;
      }

      /* Decimal part normal state */
      .fc-percent .rolling-number span[style*="font-size: 0.85em"] {
        font-size: 0.85em !important;
        opacity: 0.8 !important;
        color: inherit !important;
      }

      /* Green decimal during hold phase */
      .decimal-waiting {
        color: #10b981 !important;
        font-weight: bold !important;
        transition: all 1s ease;
      }
    `;
    document.head.appendChild(style);

    const updatePercents = debounce(function() {
      document.querySelectorAll('[role="progressbar"][aria-valuenow]').forEach(bar => {
        const raw = parseFloat(bar.getAttribute('aria-valuenow'));
        if (!Number.isFinite(raw) || raw < 0 || raw > 100) return;

        const percentValue = raw;
        const pct = percentValue.toFixed(userConfig.decimalPrecision);

        const row =
          bar.closest('div[class*="onboarding-offer-task"]') ||
          bar.closest('div[class*="rounded"]');

        if (!row) return;

        const daysEl = Array.from(row.querySelectorAll('span, div'))
          .find(el => /^\d+D$/.test(el.textContent.trim()));

        if (!daysEl) return;

        let pctEl = row.querySelector('.fc-percent');
        const isNewElement = !pctEl;

        if (!pctEl) {
          pctEl = document.createElement('span');
          pctEl.className = 'fc-percent';
          daysEl.parentNode.insertBefore(pctEl, daysEl);
        }

        const elementId = pctEl.dataset.id || `progress-${Math.random().toString(36).substr(2, 9)}`;
        pctEl.dataset.id = elementId;

        const oldPercent = previousPercentages.get(elementId);
        const isRealChange = oldPercent !== undefined &&
                            Math.abs(oldPercent - percentValue) > 0.0001;

        if (pctEl.dataset.danceInterval) {
          clearInterval(parseInt(pctEl.dataset.danceInterval));
          delete pctEl.dataset.danceInterval;
        }

        const progressColor = getProgressColor(percentValue);
        const progressEmoji = getProgressEmoji(percentValue, userConfig.showEmojis);

        // Special handling for 100%
        if (percentValue >= 100) {
          if (!pctEl.classList.contains('duck-dancing')) {
            pctEl.classList.add('duck-dancing');

            let borderAnimation = '';
            if (userConfig.borderPulseEnabled && userConfig.animationsEnabled) {
              borderAnimation = 'animation: borderPulse 2s infinite;';
            }

            pctEl.style.cssText = `
              display: inline-flex;
              align-items: center;
              justify-content: center;
              position: relative;
              background: transparent;
              border: 3px solid ${progressColor};
              border-radius: 30px;
              padding: 4px 16px;
              margin-right: 8px;
              box-shadow: 0 0 15px ${progressColor}40;
              ${borderAnimation}
            `;

            createDuckDance(pctEl, userConfig, duckFrames);
          }

          previousPercentages.set(elementId, percentValue);
          return;
        }

        pctEl.classList.remove('duck-dancing');

        // Style with colored border and transparent background
        let borderAnimation = '';
        if (userConfig.borderPulseEnabled && userConfig.animationsEnabled) {
          borderAnimation = 'animation: borderPulse 2s infinite;';
        }

        pctEl.style.cssText = `
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: transparent;
          border: 3px solid ${progressColor};
          border-radius: 30px;
          padding: 4px 16px;
          margin-right: 8px;
          box-shadow: 0 0 10px ${progressColor}40;
          transition: all 0.3s ease;
          ${borderAnimation}
        `;

        // Create the inner content structure (normal, non-animated state)
        const normalContent = `
          <span style="
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            color: inherit;
            font-weight: 600;
            font-size: 0.95em;
            position: relative;
            z-index: 2;
          ">
            ${progressEmoji ? `<span style="font-size: 1.1em;" class="progress-emoji">${progressEmoji}</span>` : ''}
            <span style="font-family: monospace; display: inline-flex; align-items: baseline; color: inherit;" class="rolling-number">
              ${pct}%
            </span>
          </span>
        `;

        // Only set content if it's a new element or if we're not animating
        if (isNewElement) {
          pctEl.innerHTML = normalContent;
        } else {
          // Update emoji if needed
          const emojiSpan = pctEl.querySelector('.progress-emoji');
          if (userConfig.showEmojis) {
            if (emojiSpan && emojiSpan.textContent !== progressEmoji) {
              emojiSpan.textContent = progressEmoji;
              if (userConfig.animationsEnabled) {
                emojiSpan.style.animation = 'emojiPop 0.5s ease';
                setTimeout(() => {
                  emojiSpan.style.animation = '';
                }, 500);
              }
            } else if (!emojiSpan && progressEmoji) {
              // Add emoji if missing
              const container = pctEl.querySelector('span[style*="display: flex"]');
              if (container) {
                const emojiSpan = document.createElement('span');
                emojiSpan.className = 'progress-emoji';
                emojiSpan.style.fontSize = '1.1em';
                emojiSpan.textContent = progressEmoji;
                container.insertBefore(emojiSpan, container.firstChild);
              }
            }
          } else if (emojiSpan) {
            // Remove emoji if disabled
            emojiSpan.remove();
          }
        }

        // Animate number roll if it's a real change
        if (isRealChange && !isNewElement) {
          createNumberRollAnimation(pctEl, oldPercent, percentValue, userConfig);

          // Add container pop animation
          if (userConfig.animationsEnabled) {
            pctEl.style.animation = 'containerPop 0.8s ease';
            setTimeout(() => {
              pctEl.style.animation = '';
            }, 800);
          }
        }

        previousPercentages.set(elementId, percentValue);
      });
    }, getDebounceTime(userConfig));

    // Initial runs
    setTimeout(() => {
      updatePercents();
    }, 500);
    
    setTimeout(() => updatePercents(), 1500);
    setTimeout(() => updatePercents(), 3000);

    // Observer for dynamic content
    const observer = new MutationObserver(() => {
      updatePercents();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Attribute observer for progress values
    const attributeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.target.hasAttribute && mutation.target.hasAttribute('role') &&
            mutation.target.getAttribute('role') === 'progressbar' &&
            mutation.attributeName === 'aria-valuenow') {
          updatePercents();
          break;
        }
      }
    });

    attributeObserver.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-valuenow']
    });

    return updatePercents;
  };

})();
