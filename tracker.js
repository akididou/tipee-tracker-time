/* -------------------------------------------------------------------------- */
/*                              EXTENSION CONFIG                              */
/* -------------------------------------------------------------------------- */

function getUser() {
  return fetch('https://infomaniak.tipee.net/brain/users/me')
    .then((resp) => resp.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
}

function getWorkday(user) {
  return fetch(`https://infomaniak.tipee.net/api/employees/${user.id}/workday`)
    .then((resp) => resp.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
}

function beautifyTime(minutes) {
  return (Math.abs(minutes) / 60) > 1 ? (Math.floor(Math.abs(minutes) / 60)) + 'h' + (Math.abs(minutes) % 60) + 'min' :
    '0h' + Math.abs(minutes) + 'min';
}

function toMinutes(s) {
  const a = s.split(':');
  return (+a[0]) * 60 + (+a[1]);
};


function getRemaining(init) {
  getUser()
    .then((user) => {
      getWorkday(user)
        .then(result => {
          let text = '';
          let date = new Date();
          let x = (60 * 8) - (+(result.timechecks
            .map(x => x.duration > 0 ?
              Math.floor(x.duration) :
              toMinutes(date.getHours() + ':' + date.getMinutes()) - toMinutes(x.hour_in))
            .reduce((a, b) => a + b, 0)));

          let hourToDo = Math.floor(x / 60);
          let minuteToDo = x % 60;
          minuteToDo = result.timechecks[0].time_out === null ? minuteToDo + 30 : minuteToDo;
          let endHour = date.getHours() + hourToDo;
          let endMinute = date.getMinutes() + minuteToDo;
          if (endMinute >= 60) {
            endHour++;
            endMinute -= 60;
          }
          if (x > 0) {
            text = beautifyTime(x) + ' left (A ' + endHour + 'H' + endMinute + ')';
          } else {
            text = 'Felicitation, you can go ! (You did : ' + beautifyTime(-x) + ' of overtime)';
          }

          if (init) {
            const containerDiv = document.createElement('div');
            containerDiv.setAttribute('id','containerTimer');
            containerDiv.style.cssText = 'display:flex;';
            const nav = document.querySelector('.nav.navbar-toolbar.navbar-toolbar-left')
            if (nav) {
              nav.appendChild(containerDiv);
            } else {
              document.body.appendChild(containerDiv)
            }

            const textDiv = document.createElement('div');
            textDiv.innerHTML = text;
            textDiv.setAttribute('id','textTimer');
            textDiv.style.cssText = 'display: flex;width: 100%;padding: 15px;z-index: 100;background: #f1f1f1;color: #333;align-items: center;border: 0;border-radius: 4px;';
            document.querySelector('#containerTimer').appendChild(textDiv);
            
            const btnDiv = document.createElement("BUTTON");
            btnDiv.innerText = 'Refresh';
            btnDiv.style.cssText = 'display: flex;padding: 15px;z-index: 100;background: #f1f1f1;color: #333;border: 0;margin-left: 10px;align-items: center;border-radius: 4px;height: 100%;';
            btnDiv.onclick = function () { getRemaining() };
            document.querySelector('#containerTimer').appendChild(btnDiv);

            // btnDiv.appendChild(buttonTitle);
            // const buttonTitle = document.createTextNode("Refresh"); // Create a text node
          } else {
            document.querySelector('#textTimer').innerText = text;
          }
        })
    })
}

document.onreadystatechange = (e) => {
  if (document.readyState == "complete") {
    getRemaining(true);
  }
}