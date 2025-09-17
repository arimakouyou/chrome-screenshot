/**
 * @fileoverview Preview page controller for Screenshot Extension  
 * Handles screenshot display, download, and clipboard operations
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM elements for preview functionality
  const imageElement = document.getElementById('preview-image');
  const downloadButton = document.getElementById('download');
  const copyButton = document.getElementById('copy');
  let pageTitle = 'screenshot'; // Default title for file naming

  /**
   * Initialize preview page with screenshot data
   * @param {string} dataUrl - Base64 encoded image data
   * @param {string} title - Page title for filename generation
   */
  function initialize(dataUrl, title) {
    imageElement.src = dataUrl;
    pageTitle = title || 'screenshot';
  }

  // Listen for the message from the background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'displayScreenshot') {
      initialize(request.dataUrl, request.title);
    }
  });

  // Request the data from the background script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab) {
      chrome.runtime.sendMessage({ action: 'getScreenshotData', tabId: activeTab.id });
    }
  });

  // Download handler - creates timestamped filename
  downloadButton.addEventListener('click', () => {
    const now = new Date();
    const datetime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
    const filename = `screenshot-${pageTitle}-${datetime}.png`;

    const link = document.createElement('a');
    link.href = imageElement.src;
    link.download = filename;
    link.click();
  });

  // Clipboard handler - uses Clipboard API for image copy
  copyButton.addEventListener('click', async () => {
    if (!imageElement.src) return;
    try {
      const response = await fetch(imageElement.src);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      copyButton.textContent = 'Copied!';
      setTimeout(() => { copyButton.textContent = 'Copy to Clipboard'; }, 2000);
    } catch (err) {
      console.error('Failed to copy image:', err);
      copyButton.textContent = 'Failed to copy';
    }
  });
});
