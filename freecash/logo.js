// ==UserScript==
// @name         Freecash → Duckcash Logo
// @namespace    duckcash-logo
// @version      1.0.0
// @description  Replaces the FREECASH logo text with DUCKCASH
// @author       DuckyQuack
// @match        https://freecash.com/*
// @match        https://www.freecash.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  const DUCK_PATH = `
    M 0,0 L 0,17.5 L 8,17.5
      C 15,17.5 20,13.5 20,8.75
      C 20,4 15,0 8,0 Z
    M 4.2,3.8 L 7.5,3.8
      C 12,3.8 15.5,5.8 15.5,8.75
      C 15.5,11.7 12,13.7 7.5,13.7 L 4.2,13.7 Z

    M 23,0 L 23,11
      C 23,15 25.5,17.9 30.5,17.9
      C 35.5,17.9 38,15 38,11
      L 38,0 L 33.8,0 L 33.8,11
      C 33.8,12.8 32.8,14.1 30.5,14.1
      C 28.2,14.1 27.2,12.8 27.2,11
      L 27.2,0 Z

    M 41,8.75
      C 41,3.8 45,0 50.5,0
      C 53,0 55.2,0.8 56.8,2.1
      L 56.8,6.5
      C 55.5,5.1 53.2,4 50.5,4
      C 47.2,4 45.3,6 45.3,8.75
      C 45.3,11.5 47.2,13.5 50.5,13.5
      C 53.2,13.5 55.5,12.4 56.8,11
      L 56.8,15.4
      C 55.2,16.7 53,17.5 50.5,17.5
      C 45,17.5 41,13.7 41,8.75 Z

    M 60,0 L 60,17.5 L 64.2,17.5 L 64.2,10.5 L 71.5,17.5 L 77,17.5
      L 68.5,9.5 L 76.5,0 L 71.2,0 L 64.2,8.2 L 64.2,0 Z
  `;

  // Viewbox wide enough for DUCK (≈77px) + CASH (≈71px) + gap (≈5px) = 153px
  const NEW_VIEWBOX = '0 0 153 18';
  const NEW_WIDTH   = '142';
  const NEW_HEIGHT  = '16';

  // The white CASH path from the original, shifted right by (77-68)=9px
  // Original CASH starts at x≈68 in a 139-wide viewBox.
  // We shift the entire CASH group right by 9px so it sits after DUCK.
  // The original CASH path (verbatim from the source, second <path> in the wordmark SVG):
  const CASH_PATH_ORIGINAL = `M68.1369 9.19064C66.9495 15.3169 71.125 17.8885 75.8347 17.8885C77.6247 17.8895 79.3959 17.5225 81.0391 16.8102L81.8899 12.3997C80.7224 13.3549 79.0008 13.8951 77.2396 13.8951C74.5682 13.8951 72.154 12.5228 72.7872 9.19064C73.5194 5.46525 76.5074 3.97194 79.2185 3.97194C80.7818 3.97194 82.2463 4.48624 83.1368 5.36795L83.9677 1.08058C82.4856 0.347089 80.8511 -0.0225055 79.1988 0.00226663C74.5682 0.00226663 69.4033 2.72284 68.1369 9.19064ZM83.0179 17.5212H87.6683L89.1723 14.8264H96.2763L96.7314 17.5212H101.382L97.9782 0.369662H93.0904L83.0179 17.5212ZM91.2302 11.1506L93.961 6.202C94.2688 5.64607 94.5271 5.06395 94.7328 4.46243C94.7035 5.04496 94.7433 5.62893 94.8515 6.202L95.643 11.1506H91.2302ZM105.636 5.05022C104.449 11.1745 113.532 10.3424 113.037 12.8167C112.879 13.6746 112.068 13.9685 110.267 13.9685C108.308 13.9685 106.171 13.4304 104.41 12.0324L103.578 16.3197C105.201 17.3246 107.378 17.8885 109.851 17.8885C113.611 17.8885 116.936 16.7129 117.727 12.646C118.915 6.56937 109.871 7.25448 110.287 5.0244C110.425 4.38894 111.019 3.94612 112.681 3.92229C114.68 3.89846 116.5 4.4366 117.767 5.53872L118.558 1.37447C117.233 0.5166 115.214 0.00226663 113.077 0.00226663C109.555 0.00226663 106.309 1.61873 105.636 5.05022ZM139 0.369662H134.488L133.202 6.93675H126.85L128.116 0.369662H123.585L120.26 17.5212H124.792L126.058 10.9799H132.43L131.144 17.5212H135.676L139 0.369662Z`;

  function replaceLogo() {
    // Find the wordmark SVG — it has width="137" or width="139" or viewBox containing "139"
    const svgs = document.querySelectorAll('svg');
    let wordmarkSvg = null;

    for (const svg of svgs) {
      const vb = svg.getAttribute('viewBox') || '';
      // The wordmark viewBox is "0 0 139 18" (or similar narrow-tall ratio)
      if (vb.includes('139') || vb.includes('137')) {
        wordmarkSvg = svg;
        break;
      }
    }

    if (!wordmarkSvg) return false;

    // Update viewBox and dimensions
    wordmarkSvg.setAttribute('viewBox', NEW_VIEWBOX);
    wordmarkSvg.setAttribute('width',   NEW_WIDTH);
    wordmarkSvg.setAttribute('height',  NEW_HEIGHT);

    // Remove all existing paths inside this SVG
    wordmarkSvg.innerHTML = '';

    // Add DUCK path in green (#01D676 — same as original FREE)
    const duckPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    duckPath.setAttribute('fill-rule', 'evenodd');
    duckPath.setAttribute('clip-rule', 'evenodd');
    duckPath.setAttribute('d', DUCK_PATH.trim().replace(/\s+/g, ' '));
    duckPath.setAttribute('fill', '#01D676');
    wordmarkSvg.appendChild(duckPath);

    // Add CASH path in white — shift it right by translating via a <g>
    // CASH originally occupies x: 68–139. We want it at x: 82–153 (shift +14).
    const cashGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    cashGroup.setAttribute('transform', 'translate(14, 0)');

    const cashPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    cashPath.setAttribute('fill-rule', 'evenodd');
    cashPath.setAttribute('clip-rule', 'evenodd');
    cashPath.setAttribute('d', CASH_PATH_ORIGINAL);
    cashPath.setAttribute('fill', 'white');

    cashGroup.appendChild(cashPath);
    wordmarkSvg.appendChild(cashGroup);

    return true;
  }

  // Try immediately, then observe for dynamic rendering (React/Next.js hydration)
  if (!replaceLogo()) {
    const observer = new MutationObserver(() => {
      if (replaceLogo()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Hard timeout fallback — stop observing after 10s
    setTimeout(() => observer.disconnect(), 10000);
  }

  // Re-apply on client-side navigation (SPA route changes)
  let lastHref = location.href;
  setInterval(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
      setTimeout(replaceLogo, 300);
    }
  }, 500);

})();
