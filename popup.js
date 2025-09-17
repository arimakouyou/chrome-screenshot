/**
 * @fileoverview Popup UI controller for Screenshot Extension
 * Handles user interaction and screenshot mode selection
 */

document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements for screenshot mode buttons
  const captureVisibleBtn = document.getElementById('captureVisible');
  const captureFullPageBtn = document.getElementById('captureFullPage');
  const captureAreaBtn = document.getElementById('captureArea');

  // Visible area capture - current viewport only
  captureVisibleBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'captureVisible' });
  });

  // Full page capture - scroll and stitch entire page
  captureFullPageBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'captureFullPage' });
  });

  // Area selection capture - user-defined rectangular region
  captureAreaBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'captureArea' });
  });
});
