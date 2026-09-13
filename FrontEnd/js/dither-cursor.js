/**
 * Dither Cursor effect disabled per user request.
 */
(function() {
  const existing = document.getElementById('dither-cursor-canvas');
  if (existing) {
    existing.remove();
  }
})();
