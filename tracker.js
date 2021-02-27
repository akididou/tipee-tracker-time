/* -------------------------------------------------------------------------- */
/*                                 USER CONFIG                                */
/* -------------------------------------------------------------------------- */
var products = [
  '6800 XT',
  '6900 XT',
  // '3950X',
] // Names of products searched
var timer = 1000 * 30; // Duration of checking in milliseconds

/* -------------------------------------------------------------------------- */
/*                              EXTENSION CONFIG                              */
/* -------------------------------------------------------------------------- */
var titles = document.querySelectorAll('.shop-title');
var indexTitle = {};
var elementExist = false
var hasPermissionNotification = false;

var interval = setInterval(() => {
  console.log('Test ping : ' + formattedDate())
  var verif = false;
  setCookie('amd-ping', formattedDate());
  // Close if a product is already in cart
  if (document.querySelector('.fa-shopping-cart').hasAttribute('data-count')) {
    console.log('clearInterval')
    clearInterval(interval);
  }

  // Request notification permission
  Notification.requestPermission((permission) => {
    hasPermissionNotification = permission === 'granted'
    if (hasPermissionNotification && !getCookie('testNotification')) {
      setCookie('amd-notification', true);
      new Notification(`Notification test`, {
        body: `Just to check that permissions are allowed`,
        timestamp: Math.floor(Date.now()),
        renotify: true,
        tag: 'adm-tracker'
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
        verif = true;
        if (hasPermissionNotification) {
          clearInterval(interval);
          tempDom.querySelector('.shop-links button').click();
          var notification = new Notification(`${index} is available !!!`, {
            body: `${index} is available at ${formattedDate()}`,
            timestamp: Math.floor(Date.now()),
            renotify: true,
            tag: 'adm-tracker'
          })
          notification.addEventListener('click', (event) => {
            event.preventDefault(); // prevent the browser from focusing the Notification's tab
            window.open('https://www.amd.com/fr/direct-buy/fr', '_blank');
          })

          setCookie(`amd-${index}-available`, formattedDate());
          window.open('https://www.amd.com/fr/direct-buy/fr', '_blank');
        }
      } else {
        console.log(`${index} isn't available at ${formattedDate()}`)
      }
    } else {
      console.warn('Product ' + index + 'do not exist on this page.')
    }
  })

  if (!verif) {
    document.location.reload();
  }
}, timer)

// Format Date 
function formattedDate(d = new Date) {
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  let hours = String(d.getHours());
  let minutes = String(d.getMinutes());
  let seconds = String(d.getSeconds());
  const year = String(d.getFullYear());

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  if (hours.length < 2) hours = '0' + hours;
  if (minutes.length < 2) minutes = '0' + minutes;
  if (seconds.length < 2) seconds = '0' + seconds;

  return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name, value) {
  document.cookie = name + "=" + value + ";path=/;";
}
