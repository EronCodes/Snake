document.onkeydown = tasteGedrueckt;
document.getElementById("startButton").addEventListener("click", spielStarten);
document.getElementById("expert").addEventListener("click", openExpert);
document.getElementById("close").addEventListener("click", closeExpert);
document.getElementById("pause").addEventListener("click", pause);
document.getElementById("sounds").addEventListener("click", sound);
document.getElementById("powerup").addEventListener("click", setPflaumeSteigt);
document.getElementById("pflaumenAdd").addEventListener("click", setPowerupUnchecked);

initCss();

function initCss() {
  var expert = document.getElementById("gameSettings");
  var start = document.getElementById("startDiv");
  var end = document.getElementById("endDiv");
  var congratulation = document.getElementById("congratulation");

  expert.style.marginLeft = expert.offsetWidth/-2 + "px";
  expert.style.marginTop = expert.offsetHeight/-2 + "px";
  expert.style.display = "none";

  start.style.marginLeft = start.offsetWidth/-2 + "px";
  start.style.marginTop = start.offsetHeight/-2 + "px";

  end.style.marginLeft = end.offsetWidth/-2 + "px";
  end.style.marginTop = end.offsetHeight/-2 + "px";
  end.style.display = "none";

  congratulation.style.marginTop = congratulation.offsetHeight/-2 + "px";
  congratulation.style.display = "none";
}

function spielStarten() {
  document.getElementById("buttonDiv").style.display = "none";
  var feld = document.getElementById("spielfeld");

  var congratulation = document.getElementById("congratulation");
  congratulation.style.display = "none";

  var counter = document.getElementById("counter");
  counter.innerHTML = '0 <img src="images/apple.svg" alt="Äpfel" width="50">';
  counter.style.display = "block";

  while (feld.hasChildNodes())
    feld.removeChild(feld.firstChild);

  feldBreite = document.getElementById("breite_start").value;
  feldHoehe = document.getElementById("hoehe_start").value;
  paused = false;

  aepfel = 0;

  snake.besetzteFelder = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0]
  ];

  powerup = {
    inGame: false,
    waiting: 0,
    timeLeft: 100,
    pos: [5,5]
  };

  pflaumeErzeugen();
  fruchtErzeugen();

  var aktZeit = new Date();
  zeit1 = aktZeit.getTime();

  tabelleErstellen();

  document.getElementById("startDiv").style.display = "none";
  document.getElementById("endDiv").style.display = "none";
  document.getElementById("gameSettings").style.display = "none";
  document.getElementById("pause").style.display = "block";
  document.getElementById("sounds").style.display = "block";

  snake.orientation = 1;

  snake.gefressen = false;

  var zellen = document.getElementsByTagName("td");
  for (var i = 0; i < zellen.length; i++) {
    zellen[i].style.backgroundColor = "#505050";
  }

  geschwindigkeit = document.getElementById("geschwindigkeit_start").value;
  intervalId = setInterval(setupBewegungswerte, geschwindigkeit);
}

function tabelleErstellen() {
  var tabelle = document.getElementById("spielfeld");

  for (var i = 0; i < feldHoehe; i++) {
    var tr = document.createElement("tr");
    for (var k = 0; k < feldBreite; k++) {
      var td = document.createElement("td");
      td.setAttribute("id", k + "_" + i);
      tr.appendChild(td);
    }
    tabelle.appendChild(tr);
  }
}

function setupGrafik() {
  //Grundiere/Resette Zellen
  var zellen = document.getElementsByTagName("td");
  for (var i = 0; i < zellen.length; i++) {
    zellen[i].style.backgroundColor = "#0a0";
    zellen[i].style.borderRadius = "0";
    zellen[i].innerHTML = "";
  }

  //Zeichne Frucht
  var fruchtFeld = document.getElementById(snake.fruchtPos[0] + "_" + snake.fruchtPos[1]);
  fruchtFeld.innerHTML = '<img src="images/apple.svg" alt="Apfel">';

  //Zeichne Pflaumen
  for (var v = 0; v < pflaumenPoses.length; v++) {
    var pflaumenFeld = document.getElementById(pflaumenPoses[v][0] + "_" + pflaumenPoses[v][1]);
    pflaumenFeld.innerHTML = '<img src="images/plum.svg" alt="Pflaume">';
  }

  //Hat Snake einen Apfel gefressen?
  if (snake.gefressen == true) {
    document.getElementById("counter").innerHTML = aepfel + ' <img src="images/apple.svg" alt="Äpfel" width="50">';
  }

  //Zeichne Powerup
  if (document.getElementById("powerup").checked) {
    var powerupFeld = document.getElementById(powerup.pos[0] + '_' + powerup.pos[1]);
    if (powerup.inGame == true) {
      powerupFeld.innerHTML = '<img src="images/powerup.svg" width="50" alt="Pflaumen-Powerup">';
    } else {
      powerupFeld.innerHTML = '';
    }
  }

  //Zeichne Snake
  for (var k = 0; k < snake.besetzteFelder.length-1; k++) {
    var id = snake.besetzteFelder[k];
    var feld = document.getElementById(id[0] + "_" + id[1]);
    feld.style.backgroundColor = "#00f";
  }

  //Runde die Ecken von Snakes Schwanz ab
  var schwanz = document.getElementById(snake.besetzteFelder[0][0] + "_" + snake.besetzteFelder[0][1]);
  //In welche Richtung geht der Schwanz?
  if (direction(snake.besetzteFelder[0], snake.besetzteFelder[1]) == 0) {
    //oben
    schwanz.style.borderRadius = "0 0 10px 10px";
  }
  if (direction(snake.besetzteFelder[0], snake.besetzteFelder[1]) == 2) {
    //unten
    schwanz.style.borderRadius = "10px 10px 0 0";
  }
  if (direction(snake.besetzteFelder[0], snake.besetzteFelder[1]) == 3) {
    //links
    schwanz.style.borderRadius = "0 10px 10px 0";
  }
  if (direction(snake.besetzteFelder[0], snake.besetzteFelder[1]) == 1) {
    //rechts
    schwanz.style.borderRadius = "10px 0 0 10px";
  }

  //Zeichne Snakes Kopf
  var kopfFeld = document.getElementById(snake.besetzteFelder[snake.besetzteFelder.length - 1][0] + "_" + snake.besetzteFelder[snake.besetzteFelder.length - 1][1]);
  kopfFeld.innerHTML = '<img src="images/kopf_' + snake.orientation + '.svg" alt="Kopf">';
}

function tasteGedrueckt(event) {
  event.cancelBubble = true;
  event.returnValue = false;

  if (paused == false) {
    switch (event.keyCode) {
      case 37: //links
        if (direction(snake.besetzteFelder[snake.besetzteFelder.length-2], snake.besetzteFelder[snake.besetzteFelder.length-1]) != 1) {
          snake.orientation = 3;
        }
        break;
      case 38: //oben
        if (direction(snake.besetzteFelder[snake.besetzteFelder.length-2], snake.besetzteFelder[snake.besetzteFelder.length-1]) != 2) {
          snake.orientation = 0;
        }
        break;
      case 39: //rechts
        if (direction(snake.besetzteFelder[snake.besetzteFelder.length-2], snake.besetzteFelder[snake.besetzteFelder.length-1]) != 3) {
          snake.orientation = 1;
        }
        break;
      case 40: //unten
        if (direction(snake.besetzteFelder[snake.besetzteFelder.length-2], snake.besetzteFelder[snake.besetzteFelder.length-1]) != 0) {
          snake.orientation = 2;
        }
        break;
    }
  }

  if (event.keyCode == 13 && !todesPruefung()) {
    pause();
  }

  return event.returnValue;
}

function setupBewegungswerte() {
  if (snake.gefressen == false) {
    //Schwanzelement entfernen
    snake.besetzteFelder.shift();
  } else {
    snake.gefressen = false;
    fruchtErzeugen();
    if (document.getElementById("pflaumenAdd").checked) {
      addPflaume(pflaumenPoses.length);
    }
  }

  //temporäres Array, also Kopie von snake.besetzteFelder, erzeugen
  var pos = [];
  for (var z in snake.besetzteFelder) {
    pos.push(snake.besetzteFelder[z]);
  }

  var kopfPos = pos.pop();

  var ende = [];
  for (var r in kopfPos) {
    ende.push(kopfPos[r]);
  }

  switch (snake.orientation) {
    case 3: //links
      ende[0]--;
      break;
    case 0: //oben
      ende[1]--;
      break;
    case 1: //rechts
      //Schwanzelement entfernen
      ende[0]++;
      break;
    case 2: //unten
      ende[1]++;
      break;
  }
  snake.besetzteFelder.push(ende);

  if (document.getElementById("powerup").checked) {
    if (powerup.inGame == false) {
      if (powerup.waiting == 0) {
        powerup.inGame = true;
        powerup.timeLeft = Math.floor(Math.random() * 5) + 7;
        setPowerup();
      }
    } else {
      powerup.timeLeft--;
      if (powerup.timeLeft == 0) {
        deletePowerup();
      }
    }
  }

  for (var k = 0; k < snake.besetzteFelder.length; k++) {
    //Hat Snake einen Apfel gefressen?
    if ((snake.besetzteFelder[k][0] == snake.fruchtPos[0]) && (snake.besetzteFelder[k][1] == snake.fruchtPos[1])) {
      snake.gefressen = true;
      aepfel++;
      if (sounds.status == true) {
        sounds.eat.play();
      }
      if (powerup.inGame == false) {
        powerup.waiting--;
      }
    }
  }

  //Hat Snake das Powerup gefressen?
  if (document.getElementById("powerup").checked) {
    if (powerup.inGame == true && (snake.besetzteFelder[snake.besetzteFelder.length - 1][0] == powerup.pos[0]) && (snake.besetzteFelder[snake.besetzteFelder.length - 1][1] == powerup.pos[1])) {
      deletePowerup();
      pflaumenPoses = [];
    }
  }

  if (todesPruefung()) {
    if (sounds.status == true) {
      sounds.die.play();
    }
    spielBeenden();
  } else {
    setupGrafik();
  }
}

//End of Game
function todesPruefung() {
  var tmpFelder = [];
  for (var i in snake.besetzteFelder) {
    tmpFelder[i] = snake.besetzteFelder[i];
  }

  //Snake auf Pflaume?
  for (var t = 0; t < pflaumenPoses.length; t++) {
    if ((tmpFelder[tmpFelder.length - 1][0] == pflaumenPoses[t][0]) && (tmpFelder[tmpFelder.length - 1][1] == pflaumenPoses[t][1]))
      return true;
  }

  var kopf = tmpFelder[tmpFelder.length - 1];

  //Snake außerhalb der Welt?
  if (kopf[0] > feldBreite - 1 || kopf[0] < 0 || kopf[1] < 0 || kopf[1] > feldHoehe - 1)
    return true;

  //Hat Snake sich selbst gefressen?
  for (var z = 0; z < tmpFelder.length - 1; z++) {
    if (kopf[0] == tmpFelder[z][0] && kopf[1] == tmpFelder[z][1])
      return true;
  }

  return false;
}

function spielBeenden() {
  clearInterval(intervalId);

  var gameValues;

  document.getElementById("endDiv").style.display = "block";
  var button = document.getElementById("buttonDiv");
  button.style.display = "block";
  button.style.margin = "140px 0 0 -98.5px";
  document.getElementById("endButton").addEventListener("click", spielStarten);

  var aktZeit2 = new Date();
  var zeit2 = aktZeit2.getTime();
  var spieldauer = (zeit2 - zeit1) / 1000;
  var statistik = document.getElementById("statistik");

  if (window.localStorage) {
    var wertissimo = [];

    var noSnakeElements = 0;
    for (var i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).substring(0, 18) == "Snake_Ivo_Ziesche_")
        wertissimo[i - noSnakeElements] = localStorage.getItem(localStorage.key(i));
      else
        noSnakeElements++;
    }

    var aktZeit = new Date();
    var zeit = aktZeit.getTime();
    localStorage.setItem("Snake_Ivo_Ziesche_" + zeit, snake.besetzteFelder.length - 4);

    var platzierung = calcPlace(wertissimo, snake.besetzteFelder.length - 4);
    var highscore = calcHighscore(wertissimo);

    //Erster Platz?
    if (platzierung == 1) {
      var congratulation = document.getElementById("congratulation");
      congratulation.style.display = "block";
    }

    gameValues = aepfel + " Äpfel" + "<br>" + spieldauer + " Sekunden<br>" + platzierung + " Platz insgesamt<br>" + highscore + " Äpfel Highscore";
  } else {
    gameValues = aepfel + " Äpfel<br>" + spieldauer + " Sekunden";
  }

  statistik.innerHTML = gameValues;
}

function calcPlace(werte, aktWert) {
  var platz = 0;
  for (var i = 0; i < werte.length; i++) {
    if (aktWert > werte[i])
      platz++;
  }

  var highscore = werte.length - platz + 1;
  return highscore;
}

function calcHighscore(wertissimo) {
  var bigger = 0;

  for (var i = 0; i < wertissimo.length; i++) {
    if (parseInt(bigger) < parseInt(wertissimo[i]))
      bigger = wertissimo[i];
  }

  return bigger;
}

//create fruits/powerups/pflaumen, etc.
function fruchtErzeugen() {
  snake.fruchtPos[0] = Math.floor(Math.random() * feldBreite);
  snake.fruchtPos[1] = Math.floor(Math.random() * feldHoehe);

  if (posOnPflaume(snake.fruchtPos[0], snake.fruchtPos[1], false) == true || posOnPowerup(snake.fruchtPos[0], snake.fruchtPos[1]) == true || posOnSnake(snake.fruchtPos[0], snake.fruchtPos[1]) == true) {
    fruchtErzeugen();
  }
}

function pflaumeErzeugen() {
  pflaumenPoses = [];
  var number = document.getElementById("anzPflaumen_start").value;

  for (var i = 0; i < number; i++) {
    addPflaume(i);
  }
}

function addPflaume(k) {
  pflaumenPoses[k] = [Math.floor(Math.random() * feldBreite), Math.floor(Math.random() * feldHoehe)];

  if (posOnSnake(pflaumenPoses[k][0], pflaumenPoses[k][1]) == true || posOnApfel(pflaumenPoses[k][0], pflaumenPoses[k][1]) == true || posOnPowerup(pflaumenPoses[k][0], pflaumenPoses[k][1]) == true || posOnPflaume(pflaumenPoses[k][0], pflaumenPoses[k][1], true) == true) {
    addPflaume(k);
  }

  //Liegt Snakes Kopf auf Anfangsposition?                                                                                                 //Liegt dort die Pflaume?
  if ((snake.besetzteFelder[snake.besetzteFelder.length - 1][0] == 3 && snake.besetzteFelder[snake.besetzteFelder.length - 1][1] == 0) && (pflaumenPoses[k][0] == 4 && pflaumenPoses[k][1] == 0)) {
    addPflaume(k);
  }
}

function setPflaumeSteigt() {
  if (document.getElementById("powerup").checked) {
    document.getElementById("pflaumenAdd").checked = true;
  }
}

function setPowerupUnchecked() {
  if (!document.getElementById("pflaumenAdd").checked) {
    document.getElementById("powerup").checked = false;
  }
}

function setPowerup() {
  powerup.pos = [Math.floor(Math.random() * feldBreite), Math.floor(Math.random() * feldHoehe)];

  if (posOnApfel(powerup.pos[0], powerup.pos[1]) == true || posOnSnake(powerup.pos[0], powerup.pos[1]) == true || posOnPflaume(powerup.pos[0], powerup.pos[1], false) == true) {
    setPowerup();
  }
}

function deletePowerup() {
  powerup.inGame = false;
  powerup.waiting = Math.floor(Math.random() * 5) + 10;
}

//Expert-Window-Functions and the pause/sound-funktion
function pause() {
  if (paused == false) {
    clearInterval(intervalId);
    document.getElementById("pause").innerHTML = '<img alt="Pause" src="images/play.svg" width="50">';
    paused = true;
  } else {
    paused = false;
    document.getElementById("pause").innerHTML = '<img alt="Pause" src="images/pause.svg" width="50">';
    geschwindigkeit = document.getElementById("geschwindigkeit_start").value;
    intervalId = setInterval(setupBewegungswerte, geschwindigkeit);
  }
}

function sound() {
  if (sounds.status == false) {
    document.getElementById("sounds").innerHTML = '<img alt="Sounds on" src="images/audio_on.svg" width="50">';
    sounds.status = true;
  } else {
    sounds.status = false;
    document.getElementById("sounds").innerHTML = '<img alt="Sounds off" src="images/audio_off.svg" width="50">';
  }
}

function closeExpert() {
  document.getElementById("gameSettings").style.display = "none";
}

function openExpert() {
  document.getElementById("gameSettings").style.display = "block";
}

                // // XXX:
function direction(point1, point2) {
  //return values:
  /*
    0: oben
    1: rechts
    2: unten
    3: links
  */
  if (point2[0] == point1[0] && point2[1] < point1[1]) {
    //oben
    return 0;
  }
  if (point2[0] == point1[0] && point2[1] > point1[1]) {
    //unten
    return 2;
  }
  if (point2[0] < point1[0] && point2[1] == point1[1]) {
    //links
    return 3;
  }
  if (point2[0] > point1[0] && point2[1] == point1[1]) {
    //rechts
    return 1;
  }
}

//posOn... - functions
function posOnSnake(x, y) {
  for (var i = 0; i < snake.besetzteFelder.length; i++) {
    if ((snake.besetzteFelder[i][0] == x) && (snake.besetzteFelder[i][1] == y)) {
      return true;
    }
  }
  return false;
}

function posOnPflaume(x, y, whichCondition) {
  var condition;
  //whichCondition == true => pflaumenPoses.length-1
  if (whichCondition == true) {
    condition = pflaumenPoses.length - 1;
  } else {
    condition = pflaumenPoses.length;
  }

  for (var t = 0; t < condition; t++) {
    if (pflaumenPoses[t][0] == x && pflaumenPoses[t][1] == y) {
      return true;
    }
  }
  return false;
}

function posOnApfel(x, y) {
  if (snake.fruchtPos[0] == x && snake.fruchtPos[1] == y)
    return true;
  return false;
}

function posOnPowerup(x, y) {
  if (powerup.pos[0] == x && powerup.pos[1] == y)
    return true;
  return false;
}
