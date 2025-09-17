document.addEventListener('DOMContentLoaded', () => {
  const captureVisibleBtn = document.getElementById('captureVisible');
  const captureFullPageBtn = document.getElementById('captureFullPage');
  const captureAreaBtn = document.getElementById('captureArea');

  captureVisibleBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'captureVisible' });
  });

  captureFullPageBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'captureFullPage' });
  });

  captureAreaBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'captureArea' });
  });
});
