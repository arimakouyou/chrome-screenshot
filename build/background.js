/**
 * @fileoverview Background service worker for Screenshot Extension
 * Handles screenshot capture orchestration, tab management, and message routing
 */

/** Offscreen document path for Canvas operations */
const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';

/**
 * Check if offscreen document is already active
 * @returns {Promise<boolean>} True if offscreen document exists
 */
async function hasOffscreenDocument() {
    const matchedClients = await clients.matchAll();
    return matchedClients.some(c => c.url.endsWith(OFFSCREEN_DOCUMENT_PATH));
}

/**
 * Create offscreen document for Canvas-based image processing
 * Required for image cropping and stitching operations
 */
async function setupOffscreenDocument() {
    if (!(await hasOffscreenDocument())) {
        await chrome.offscreen.createDocument({
            url: OFFSCREEN_DOCUMENT_PATH,
            reasons: ['DOM_PARSER'],
            justification: 'Image cropping requires a DOM environment (canvas).'
        });
    }
}

/** 
 * In-memory storage for screenshot data indexed by tab ID
 * @type {Object<number, {dataUrl: string, title: string}>}
 */
let screenshotData = {};

chrome.runtime.onMessage.addListener(async (request, sender) => {
  console.log('Message received in background script:', request);

  if (request.action === 'getScreenshotData') {
    const data = screenshotData[request.tabId];
    if (data) {
      // Respond with the data and then clear it
      chrome.tabs.sendMessage(request.tabId, { 
        action: 'displayScreenshot', 
        dataUrl: data.dataUrl, 
        title: data.title 
      });
      delete screenshotData[request.tabId];
    }
    return;
  }

  if (request.action === 'cropComplete' || request.action === 'stitchComplete') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabTitle = tab ? tab.title : 'screenshot';
    
    const previewTab = await chrome.tabs.create({ url: 'preview.html' });
    
    // Store data in memory with the new tab's ID as the key
    screenshotData[previewTab.id] = { dataUrl: request.dataUrl, title: tabTitle };

    await chrome.offscreen.closeDocument();
    return;
  }

  if (request.action === 'captureVisible') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      return console.error('Could not get active tab.');
    }
    try {
      // First, get the actual viewport dimensions (excluding scrollbar)
      const [{ result: viewportDimensions }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => ({
          width: document.documentElement.clientWidth,
          height: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio
        })
      });

      const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
      
      // Now, send this to the offscreen document to be cropped to the correct size
      await setupOffscreenDocument();
      await chrome.runtime.sendMessage({
        action: 'cropImage',
        dataUrl: dataUrl,
        area: {
          x: 0,
          y: 0,
          ...viewportDimensions
        }
      });

    } catch (error) {
      console.error('Error capturing visible tab:', error.message);
    }
  } else if (request.action === 'captureArea') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content_script.js']
      });
    }
  } else if (request.action === 'captureSelectedArea') {
    try {
      const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
      await setupOffscreenDocument();
      await chrome.runtime.sendMessage({
        action: 'cropImage',
        dataUrl: dataUrl,
        area: request.area
      });
    } catch (error) {
      console.error('Error capturing selected area:', error.message);
    }
  } else if (request.action === 'captureFullPage') {
    await captureFullPage();
  }
});

/**
 * Capture full page by scrolling and stitching multiple screenshots
 * Handles fixed/sticky elements and scrollbar exclusion
 */
async function captureFullPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) {
    console.error('Could not get active tab.');
    return;
  }

  const HIDE_ELEMENTS_CSS = `[data-ss-hidden="true"] { visibility: hidden !important; }`;

  const hideFunc = () => {
    document.querySelectorAll('*').forEach(el => {
      const style = window.getComputedStyle(el);
      if (['fixed', 'sticky'].includes(style.position)) {
        el.dataset.ssHidden = 'true';
      }
    });
  };

  const showFunc = () => {
    document.querySelectorAll('[data-ss-hidden="true"]').forEach(el => {
      delete el.dataset.ssHidden;
    });
  };

  try {
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      css: HIDE_ELEMENTS_CSS
    });

    const [{ result: pageDimensions }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => ({
        pageHeight: Math.max(
          document.body.scrollHeight, document.documentElement.scrollHeight,
          document.body.offsetHeight, document.documentElement.offsetHeight,
          document.body.clientHeight, document.documentElement.clientHeight
        ),
        viewportHeight: window.innerHeight,
        scrollbarWidth: window.innerWidth - document.documentElement.clientWidth,
        devicePixelRatio: window.devicePixelRatio
      })
    });

    const { pageHeight, viewportHeight, scrollbarWidth, devicePixelRatio } = pageDimensions;
    console.log(`Page height: ${pageHeight}, Viewport height: ${viewportHeight}, Scrollbar width: ${scrollbarWidth}`);

    let captures = [];
    
    for (let y = 0; y < pageHeight; y += viewportHeight) {
      const scrollY = Math.min(y, pageHeight - viewportHeight);
      
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (yPos) => window.scrollTo(0, yPos),
        args: [scrollY]
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: hideFunc });
      
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
          const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
          captures.push(dataUrl);
      } catch (error) {
          console.error('Error during captureVisibleTab:', error.message);
          throw error;
      } finally {
        await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: showFunc });
      }
    }
    
    console.log('Captured parts:', captures.length);
    
    await setupOffscreenDocument();
    chrome.runtime.sendMessage({
      action: 'stitchImages',
      captures: captures,
      pageDimensions: { pageHeight, viewportHeight, scrollbarWidth, devicePixelRatio }
    });

  } catch (error) {
    console.error('An error occurred during full page capture:', error);
  } finally {
    await chrome.scripting.removeCSS({
      target: { tabId: tab.id },
      css: HIDE_ELEMENTS_CSS
    });
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => { window.scrollTo(0, 0); }
    });
  }
}
