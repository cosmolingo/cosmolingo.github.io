// Minimal PWA service worker to enable installation.
// Does not cache or modify anything.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  // No special behavior needed
});

self.addEventListener("fetch", () => {
  // Empty fetch handler required for some browsers
});