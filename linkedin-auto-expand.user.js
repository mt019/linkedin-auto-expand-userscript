// ==UserScript==
// @name         LinkedIn Auto Expand
// @namespace    https://github.com/mt019/linkedin-auto-expand-userscript
// @version      1.1.0
// @description  Automatically expands LinkedIn posts, comments, profiles, job descriptions, and other collapsed text across UI languages.
// @author       mt019
// @license      MIT
// @match        https://www.linkedin.com/*
// @match        https://linkedin.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const EXPAND_TEXT_PATTERNS = [
    /^see more$/i,
    /^show more$/i,
    /^read more$/i,
    /^view more$/i,
    /^load more$/i,
    /^show all$/i,
    /^show translation$/i,
    /^(?:\.\.\.|…|⋯)+\s*see more$/i,
    /^顯示更多$/,
    /^查看更多$/,
    /^展开全文$/,
    /^展開全文$/,
    /^展开$/,
    /^展開$/,
    /^(?:\.\.\.|…|⋯)+\s*展开$/,
    /^(?:\.\.\.|…|⋯)+\s*展開$/,
    /^显示更多$/,
    /^顯示全部$/,
    /^显示全部$/,
    /^閱讀更多$/,
    /^阅读更多$/,
  ];

  const COLLAPSE_TEXT_PATTERNS = [
    /^see less$/i,
    /^show less$/i,
    /^less$/i,
    /^顯示較少$/,
    /^显示较少$/,
    /^收起$/,
  ];

  const CLICKABLE_SELECTOR = [
    ".feed-shared-update-v2 button",
    ".feed-shared-update-v2 a",
    '.feed-shared-update-v2 [role="button"]',
    ".occludable-update button",
    ".occludable-update a",
    '.occludable-update [role="button"]',
    '[data-urn*="activity"] button',
    '[data-urn*="activity"] a',
    '[data-urn*="activity"] [role="button"]',
    ".update-components-text button",
    ".update-components-text a",
    '.update-components-text [role="button"]',
    ".comments-comment-item button",
    ".comments-comment-item a",
    '.comments-comment-item [role="button"]',
    ".jobs-description button",
    ".jobs-description a",
    '.jobs-description [role="button"]',
    ".pvs-list button",
    ".pvs-list a",
    '.pvs-list [role="button"]',
    ".feed-shared-inline-show-more-text__see-more-less-toggle",
    ".inline-show-more-text__button",
    ".lt-line-clamp__more",
    ".comments-comment-item__inline-show-more-text",
  ].join(",");

  const LINKEDIN_EXPANDER_SELECTOR = [
    ".feed-shared-inline-show-more-text__see-more-less-toggle",
    ".inline-show-more-text__button",
    ".lt-line-clamp__more",
    ".comments-comment-item__inline-show-more-text",
    ".see-more-less-toggle",
    ".see-more-less-toggle__button",
    '[data-test-inline-show-more-text="see-more-less-toggle"]',
  ].join(",");

  const CLICKED_MARK = "data-linkedin-auto-expand-clicked";
  const CONTENT_ANCESTOR_SELECTOR = [
    ".feed-shared-update-v2",
    ".occludable-update",
    '[data-urn*="activity"]',
    ".update-components-text",
    ".comments-comment-item",
    ".jobs-description",
    ".pvs-list",
    ".scaffold-finite-scroll__content",
  ].join(",");
  const EXCLUDED_ANCESTOR_SELECTOR = [
    "header",
    "footer",
    "nav",
    '[role="navigation"]',
    '[role="dialog"]',
    ".global-footer",
    ".artdeco-global-alert",
  ].join(",");
  const SCAN_INTERVAL_MS = 1200;
  const MUTATION_DEBOUNCE_MS = 250;
  const MAX_TEXT_LENGTH = 80;

  let scanTimer = null;
  let observerTimer = null;

  function normalizeText(text) {
    return text
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isVisible(element) {
    const style = window.getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
      return false;
    }

    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function looksLikeExpander(element) {
    const text = normalizeText(element.innerText || element.textContent || element.getAttribute("aria-label") || "");
    const ariaLabel = normalizeText(element.getAttribute("aria-label") || "");
    const title = normalizeText(element.getAttribute("title") || "");
    const combined = [text, ariaLabel, title].filter(Boolean);

    if (combined.some((value) => value.length > MAX_TEXT_LENGTH)) {
      return false;
    }

    if (combined.some((value) => COLLAPSE_TEXT_PATTERNS.some((pattern) => pattern.test(value)))) {
      return false;
    }

    return combined.some((value) => EXPAND_TEXT_PATTERNS.some((pattern) => pattern.test(value)));
  }

  function isExcluded(element) {
    return Boolean(element.closest(EXCLUDED_ANCESTOR_SELECTOR));
  }

  function isInsideContent(element) {
    return Boolean(element.closest(CONTENT_ANCESTOR_SELECTOR));
  }

  function isCollapsedLinkedInExpander(element) {
    if (!element.matches(LINKEDIN_EXPANDER_SELECTOR)) {
      return false;
    }

    const expanded = element.getAttribute("aria-expanded");
    if (expanded === "true") {
      return false;
    }

    return isInsideContent(element);
  }

  function clickExpander(element) {
    if (element.hasAttribute(CLICKED_MARK) || isExcluded(element) || !isVisible(element)) {
      return false;
    }

    if (!isCollapsedLinkedInExpander(element) && !looksLikeExpander(element)) {
      return false;
    }

    element.setAttribute(CLICKED_MARK, "true");
    element.click();
    return true;
  }

  function scan(root = document) {
    const candidates = root.querySelectorAll(CLICKABLE_SELECTOR);

    for (const candidate of candidates) {
      clickExpander(candidate);
    }
  }

  function scheduleScan() {
    window.clearTimeout(observerTimer);
    observerTimer = window.setTimeout(() => scan(), MUTATION_DEBOUNCE_MS);
  }

  function start() {
    scan();
    scanTimer = window.setInterval(scan, SCAN_INTERVAL_MS);

    const observer = new MutationObserver(scheduleScan);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener("beforeunload", () => {
      window.clearInterval(scanTimer);
      observer.disconnect();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
