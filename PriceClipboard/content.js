function getProductInfo(settings, quantity) {
  let titleElement;
  let priceElement;
  let url;

  if (window.location.href.includes('amazon')) {
    titleElement = document.getElementById('productTitle');
    priceElement = document.querySelector('#priceblock_ourprice, #priceblock_dealprice');
    url = settings.url ? `https://www.amazon.co.jp/dp/${window.location.href.match(/dp\/([A-Z0-9]{10})/)[1]}` : '';
  } else if (window.location.href.includes('akizukidenshi')) {
    titleElement = document.querySelector(".order_g");
    let titleText;
    if (titleElement) {
      titleText = titleElement.innerText
        .replace(/\s*\n.*/, "") // Remove everything after the first newline
        .trim();
    }
    titleElement = { innerText: titleText };
    priceElement = document.querySelectorAll(".f14b")[1];
    url = settings.url ? window.location.href : '';
  }

  const title = settings.name ? titleElement.innerText.trim() : '';
  const priceValue = parseFloat(priceElement.innerText.replace(/[^\d.]/g, ''));
  const price = settings.price ? priceElement.innerText.trim() : '';
  const quantityText = settings.quantity ? `Quantity: ${quantity}` : '';
  const subtotal = settings.subtotal ? `Subtotal: ${(priceValue * quantity).toFixed(2)}${priceElement.innerText.match(/[\d.,]+(\D+)/)[1]}` : '';

  const productInfo = [];
  if (title) productInfo.push(title);
  if (price) productInfo.push(price);
  if (url) productInfo.push(url);
  if (quantityText) productInfo.push(quantityText);
  if (subtotal) productInfo.push(subtotal);

  return productInfo.join('\n');
}

  
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'copyProductInfo') {
    const textToCopy = getProductInfo(request.settings, request.quantity);
    copyToClipboard(textToCopy);
  }
});
