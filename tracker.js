/* -------------------------------------------------------------------------- */
/*                                 USER CONFIG                                */
/* -------------------------------------------------------------------------- */
var products = [
  '6800 XT',
  '6900 XT',
] // Names of products searched
var timer = 1000 * 3; // Duration of checking in milliseconds

/* -------------------------------------------------------------------------- */
/*                              EXTENSION CONFIG                              */
/* -------------------------------------------------------------------------- */
var titles = document.querySelectorAll('.shop-title');
var indexTitle = {};
var elementExist = false
var hasPermissionNotification = false;
var testNotification = false;


var interval = setInterval(() => {
  console.log('Test ping : ' + formattedDate())
  // Close if a product is already in cart
  if (document.querySelector('.fa-shopping-cart').hasAttribute('data-count')) {
    clearInterval(interval);
  }

  // Request notification permission
  Notification.requestPermission(function (permission) {
    hasPermissionNotification = permission === 'granted'
    if (hasPermissionNotification && !testNotification) {
      testNotification = true;
      new Notification(`Notification test`, {
        body: `Just to check that permissions are allowed`,
        timestamp: Math.floor(Date.now()),
        renotify: true,
      })
    }
  });

  // Find products
  titles.forEach((title, index) => {
    products.forEach(product => {
      if (title.textContent.includes(product)) {
        indexTitle = {
          ...indexTitle,
          [product]: index
        }
      }
    })
  })

  Object.keys(indexTitle).forEach((index) => {
    if (indexTitle[index] >= 0) {
      var tempDom = document.querySelectorAll('.shop-title')[indexTitle[index]].parentElement
      if (tempDom.querySelector('.shop-links button')) {
        console.log(`${index} is available at ${formattedDate()}`)
        if (hasPermissionNotification) {
          clearInterval(interval);

          tempDom.querySelector('.shop-links button').click();
          var notification = new Notification(`${index} is available !!!`, {
            body: `${index} is available at ${formattedDate()}`,
            timestamp: Math.floor(Date.now()),
            renotify: true,
          })
          notification.addEventListener('click', (event) => {
            event.preventDefault(); // prevent the browser from focusing the Notification's tab
            window.open('https://www.amd.com/fr/direct-buy/fr', '_blank');
          })
        }
      }
    } else {
      console.warn('Product ' + index + 'do not exist on this page.')
    }
  })
}, timer)

// Format Date 
function formattedDate(d = new Date) {
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = String(d.getFullYear());

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return `${day}/${month}/${year} - ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}
