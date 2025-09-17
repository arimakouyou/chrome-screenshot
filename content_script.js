(() => {
  // Prevent multiple injections
  if (document.getElementById('screenshot-overlay')) {
    return;
  }

  const overlay = document.createElement('div');
  overlay.id = 'screenshot-overlay';
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: '9999999',
    cursor: 'crosshair'
  });
  document.body.appendChild(overlay);

  let startX, startY, isDrawing = false;
  const selectionBox = document.createElement('div');
  selectionBox.id = 'screenshot-selection-box';
  Object.assign(selectionBox.style, {
    position: 'absolute',
    border: '2px dashed #fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    display: 'none'
  });
  overlay.appendChild(selectionBox);

  overlay.addEventListener('mousedown', (e) => {
    isDrawing = true;
    startX = e.clientX;
    startY = e.clientY;
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
    selectionBox.style.display = 'block';
  });

  overlay.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    const width = currentX - startX;
    const height = currentY - startY;

    selectionBox.style.width = `${Math.abs(width)}px`;
    selectionBox.style.height = `${Math.abs(height)}px`;
    selectionBox.style.left = `${width > 0 ? startX : currentX}px`;
    selectionBox.style.top = `${height > 0 ? startY : currentY}px`;
  });

  overlay.addEventListener('mouseup', (e) => {
    if (!isDrawing) return;
    isDrawing = false;

    const rect = {
        x: parseInt(selectionBox.style.left),
        y: parseInt(selectionBox.style.top),
        width: parseInt(selectionBox.style.width),
        height: parseInt(selectionBox.style.height),
        devicePixelRatio: window.devicePixelRatio || 1
    };

    // Hide the overlay immediately to prevent it from being in the screenshot
    overlay.style.display = 'none';

    // Wait a moment for the browser to re-render before taking the screenshot
    setTimeout(() => {
      // Send coordinates to background script
      chrome.runtime.sendMessage({ action: 'captureSelectedArea', area: rect });

      // Clean up the overlay from the DOM
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    }, 100);
  });
})();
