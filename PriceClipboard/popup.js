document.addEventListener("DOMContentLoaded", function () {
  const copyButton = document.getElementById("copyButton");
  const quantityInput = document.getElementById("quantityInput");

  copyButton.addEventListener("click", function () {
    const quantity = parseInt(quantityInput.value);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: getProductInfo,
        args: [quantity],
      });
    });
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "COPY_PRODUCT_INFO") {
    const { productName, productPrice, quantity, subtotal, productUrl } = request;
    const copyText = 
`名称：${productName}
単価：${productPrice}円
個数：${quantity}
小計：${subtotal}円
URL：${productUrl}`
    ;
    navigator.clipboard.writeText(copyText).then(
      function () {
        console.log("Product info copied to clipboard.");
      },
      function (err) {
        console.error("Error copying product info: ", err);
      }
    );
  }
});

function getProductInfo(quantity) {
  let productNameElement;
  let productPriceElement;
  let productUrl = window.location.href;
  
  if (productUrl.includes('amazon')) {
    productNameElement = document.getElementById("productTitle");
    productPriceElement = document.querySelector(".a-price-whole");
    const asinMatch = productUrl.match(/dp\/([A-Z0-9]{10})/);
    const asin = asinMatch ? asinMatch[1] : null;
    productUrl = asin ? `https://www.amazon.co.jp/dp/${asin}` : productUrl;
  } else if (productUrl.includes('akizukidenshi')) {
    productNameElement = document.querySelector(".order_g");
    productPriceElement = document.querySelectorAll(".f14b")[1];
    let productNameText;
    if (productNameElement) {
      productNameText = productNameElement.innerText
        .replace(/\s*\n.*/, "") // Remove everything after the first newline
        .trim();
    }
    productNameElement = { innerText: productNameText };
  }

  const productName = productNameElement ? productNameElement.innerText.trim() : "Product name not found";
  const productPrice = productPriceElement
    ? parseFloat(productPriceElement.innerText.replace(",", "").replace("￥", "").trim())
    : 0;
  const subtotal = productPrice * quantity;

  chrome.runtime.sendMessage({
    type: "COPY_PRODUCT_INFO",
    productName: productName,
    productPrice: productPrice,
    quantity: quantity,
    subtotal: subtotal,
    productUrl: productUrl,
  });
}


// function getProductInfo(quantity) {
//   const productNameElement = document.getElementById("productTitle");
//   const productPriceElement = document.querySelector(".a-price-whole");
//   const productUrl = window.location.href;
//   const asinMatch = productUrl.match(/dp\/([A-Z0-9]{10})/);
//   const asin = asinMatch ? asinMatch[1] : null;
//   const shortProductUrl = asin ? `https://www.amazon.co.jp/dp/${asin}` : productUrl;

//   const productName = productNameElement ? productNameElement.innerText.trim() : "Product name not found";
//   const productPrice = productPriceElement
//     ? parseFloat(productPriceElement.innerText.replace(",", "").replace("￥", "").trim())
//     : 0;
//   const subtotal = productPrice * quantity;

//   chrome.runtime.sendMessage({
//     type: "COPY_PRODUCT_INFO",
//     productName: productName,
//     productPrice: productPrice,
//     quantity: quantity,
//     subtotal: subtotal,
//     productUrl: shortProductUrl,
//   });
// }

