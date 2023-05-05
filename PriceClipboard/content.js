function getProductInfo(settings, quantity) {
    const title = settings.name ? document.getElementById('productTitle').innerText.trim() : '';
    const priceElement = document.querySelector('#priceblock_ourprice, #priceblock_dealprice');
    const priceValue = parseFloat(priceElement.innerText.replace(/[^\d.]/g, ''));
    const price = settings.price ? priceElement.innerText.trim() : '';
    const url = settings.url ? window.location.href : '';
    const quantityText = settings.quantity ? `Quantity: ${quantity}` : '';
    const subtotal = settings.subtotal ? `Subtotal: ${(priceValue * quantity).toFixed(2)}${priceElement.innerText.match(/[\d.,]+(\D+)/)[1]}` : '';
  
    const productInfo = [];
    if (title) productInfo.push(title);
    if (price) productInfo.push(price);
    if (url) productInfo.push(url);
    if (quantityText) productInfo.push(quantityText);
    if (subtotal) productInfo.push(subtotal);

    console.log(productName, productPrice, productURL);
  
    return productInfo.join('\n');
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'copyProductInfo') {
      const textToCopy = getProductInfo(request.settings, request.quantity);
      copyToClipboard(textToCopy);
    }
  });
  