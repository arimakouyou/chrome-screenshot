chrome.runtime.onMessage.addListener(async (request) => {
  if (request.action === 'cropImage') {
    await handleCropImage(request);
  } else if (request.action === 'stitchImages') {
    await handleStitchImages(request);
  }
});

async function handleCropImage({ dataUrl, area }) {
  const dpr = area.devicePixelRatio || 1;
  const scaledArea = {
    x: area.x * dpr,
    y: area.y * dpr,
    width: area.width * dpr,
    height: area.height * dpr
  };

  const canvas = new OffscreenCanvas(scaledArea.width, scaledArea.height);
  const ctx = canvas.getContext('2d');

  const blob = await (await fetch(dataUrl)).blob();
  const imageBitmap = await createImageBitmap(blob);
  
  ctx.drawImage(
    imageBitmap, 
    scaledArea.x, 
    scaledArea.y, 
    scaledArea.width, 
    scaledArea.height, 
    0, 
    0, 
    scaledArea.width, 
    scaledArea.height
  );
  
  const outputBlob = await canvas.convertToBlob({ type: 'image/png' });
  const reader = new FileReader();
  
  reader.onload = (e) => {
    chrome.runtime.sendMessage({ action: 'cropComplete', dataUrl: e.target.result });
  };
  
  reader.readAsDataURL(outputBlob);
}

async function handleStitchImages({ captures, pageDimensions }) {
    const { pageHeight, viewportHeight, scrollbarWidth, devicePixelRatio } = pageDimensions;

    const firstImageBlob = await (await fetch(captures[0])).blob();
    const firstImage = await createImageBitmap(firstImageBlob);
    const imageWidth = firstImage.width;

    const scaledScrollbarWidth = scrollbarWidth * devicePixelRatio;
    const finalWidth = imageWidth - scaledScrollbarWidth;
    const finalHeight = pageHeight * devicePixelRatio;

    const canvas = new OffscreenCanvas(finalWidth, finalHeight);
    const ctx = canvas.getContext('2d');

    let currentY = 0;
    for (let i = 0; i < captures.length; i++) {
        const dataUrl = captures[i];
        const blob = await (await fetch(dataUrl)).blob();
        const image = await createImageBitmap(blob);
        const imageHeight = image.height;

        const isLastImage = i === captures.length - 1;
        
        let drawHeightOnCanvas = imageHeight;
        if (currentY + imageHeight > finalHeight) {
            drawHeightOnCanvas = finalHeight - currentY;
        }

        let sourceY = 0;
        if (isLastImage) {
            sourceY = imageHeight - drawHeightOnCanvas;
        }

        if (drawHeightOnCanvas > 0) {
             ctx.drawImage(
                image,
                0, // sourceX
                sourceY, // sourceY
                finalWidth, // sourceWidth (crop out the scrollbar)
                drawHeightOnCanvas, // sourceHeight
                0, // destX
                currentY, // destY
                finalWidth, // destWidth
                drawHeightOnCanvas // destHeight
            );
        }
       
        currentY += imageHeight;
    }

    const blob = await canvas.convertToBlob({ type: 'image/png' });
    const reader = new FileReader();
    reader.onload = (e) => {
        chrome.runtime.sendMessage({ action: 'stitchComplete', dataUrl: e.target.result });
    };
    reader.readAsDataURL(blob);
}
