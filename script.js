document.onkeydown = tasteGedrueckt;
document.getElementById("startButton").addEventListener("click", spielStarten);
document.getElementById("expert").addEventListener("click", openExpert);
document.getElementById("close").addEventListener("click", closeExpert);
document.getElementById("pause").addEventListener("click", pause);

function pause() {
  if (paused == false) {
    clearInterval(intervalId);
    document.getElementById("pause").innerHTML = '<img alt="Pause" src="images/play.png" width="30">';
    paused = true;
  } else {
    paused = false;
    document.getElementById("pause").innerHTML = '<img alt="Pause" src="images/pause.png" width="30">';
    geschwindigkeit = document.getElementById("geschwindigkeit_start").value;
    intervalId = setInterval(setupBewegungswerte, geschwindigkeit);
  }
}

function closeExpert() {
  document.getElementById("gameSettings").style.display = "none";
}

function openExpert() {
  document.getElementById("gameSettings").style.display = "block";
}

function spielStarten() {
  document.getElementById("buttonDiv").style.display = "none";
  var feld = document.getElementById("spielfeld");

  var congratulation = document.getElementById("congratulation");
  congratulation.style.display = "none";

  while(feld.hasChildNodes())
    feld.removeChild(feld.firstChild);

  feldBreite = document.getElementById("breite_start").value;
  feldHoehe = document.getElementById("hoehe_start").value;
  paused = false;

  snake.besetzteFelder = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0]
  ];

  pflaumeErzeugen();
  fruchtErzeugen();

  var aktZeit = new Date();
  zeit1 = aktZeit.getTime();

  tabelleErstellen();

  document.getElementById("startDiv").style.display = "none";
  document.getElementById("endDiv").style.display = "none";
  document.getElementById("gameSettings").style.display = "none";
  document.getElementById("pause").style.display = "block";

  snake.orientation = 1;

  snake.gefressen = false;

  var zellen = document.getElementsByTagName("td");
  for(var i=0; i<zellen.length; i++) {
    zellen[i].style.backgroundColor = "#505050";
  }

  geschwindigkeit = document.getElementById("geschwindigkeit_start").value;
  intervalId = setInterval(setupBewegungswerte, geschwindigkeit);
}

function fruchtErzeugen() {
  snake.fruchtPos[0] = Math.floor(Math.random()*feldBreite);
  snake.fruchtPos[1] = Math.floor(Math.random()*feldHoehe);

  for(var t=0; t<pflaumenPoses.length; t++) {
    //Liegt der Apfel auf einer Pflaume?
    if((snake.fruchtPos[0] == pflaumenPoses[t][0]) && (snake.fruchtPos[1] == pflaumenPoses[t][1])) {
      fruchtErzeugen();
    }
  }
}

function pflaumeErzeugen() {
  pflaumenPoses = [];
  var number = document.getElementById("anzPflaumen_start").value;

  for (var i = 0; i < number; i++) {
    addPflaume(i);
  }

  /*for (var k = 0; k < number; k++) {
    pflaumenPoses[k] = [Math.floor(Math.random()*feldBreite), Math.floor(Math.random()*feldHoehe)];
    //liegt eine Pflaume auf einer Pflaume?
    for (var t = 0; t < pflaumenPoses.length-1; t++) {
      if (pflaumenPoses[pflaumenPoses.length-1][0] == pflaumenPoses[t][0] && pflaumenPoses[pflaumenPoses.length-1][1] == pflaumenPoses[t][1]) {
        pflaumeErzeugen();
        return;
      }
    }
  }

  for(var u=0; u<pflaumenPoses.length; u++) {
    for (var i = 0; i < snake.besetzteFelder.length; i++) {
      //Liegt eine Pflaume auf Snake?
      if((snake.besetzteFelder[i][0] == pflaumenPoses[u][0]) && (snake.besetzteFelder[i][1] == pflaumenPoses[u][1])) {
        pflaumeErzeugen();
        return;
      }
    }
    if (pflaumenPoses[u][0] == 4 && pflaumenPoses[u][1] == 0) {
      pflaumeErzeugen();
      return;
    }
  }*/
}

function addPflaume(k) {
  pflaumenPoses[k] = [Math.floor(Math.random()*feldBreite), Math.floor(Math.random()*feldHoehe)];
  //liegt eine Pflaume auf einer Pflaume?
  for (var t = 0; t < pflaumenPoses.length-1; t++) {
    if (pflaumenPoses[pflaumenPoses.length-1][0] == pflaumenPoses[t][0] && pflaumenPoses[pflaumenPoses.length-1][1] == pflaumenPoses[t][1]) {
      addPflaume(k);
      return;
    }
  }

  for (var i = 0; i < snake.besetzteFelder.length; i++) {
    //Liegt eine Pflaume auf Snake?
    if((snake.besetzteFelder[i][0] == pflaumenPoses[k][0]) && (snake.besetzteFelder[i][1] == pflaumenPoses[k][1])) {
      addPflaume(k);
      return;
    }
  }
}

function tabelleErstellen() {
  var tabelle = document.getElementById("spielfeld");

  for(var i=0; i<feldHoehe; i++) {
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
  var zellen = document.getElementsByTagName("td");
  for(var i=0; i<zellen.length; i++) {
    zellen[i].style.backgroundColor = "#0a0";
    zellen[i].innerHTML = "";
  }

  var fruchtFeld = document.getElementById(snake.fruchtPos[0] + "_" + snake.fruchtPos[1]);
  fruchtFeld.innerHTML = '<img src="images/apfel.jpg" alt="Apfel">';

  for(var v=0; v<pflaumenPoses.length; v++) {
    var pflaumenFeld = document.getElementById(pflaumenPoses[v][0] + "_" + pflaumenPoses[v][1]);
    pflaumenFeld.innerHTML = '<img src="images/pflaume.jpg" alt="Pflaume">';
  }

  for (var k=0; k<snake.besetzteFelder.length; k++) {
    var id = snake.besetzteFelder[k];
    var feld = document.getElementById(id[0]+"_"+id[1]);
    feld.style.backgroundColor = "#00f";

    //Hat Snake einen Apfel gefressen?
    if((snake.besetzteFelder[k][0] == snake.fruchtPos[0]) && (snake.besetzteFelder[k][1] == snake.fruchtPos[1])) {
      snake.gefressen = true;
      var apfel = document.getElementById(snake.fruchtPos[0] + "_" + snake.fruchtPos[1]);
      apfel.style.backgroundColor = "#00f";
      fruchtErzeugen();
    }
  }

  var kopfFeld = document.getElementById(snake.besetzteFelder[snake.besetzteFelder.length-1][0] + "_" + snake.besetzteFelder[snake.besetzteFelder.length-1][1]);
  kopfFeld.innerHTML = '<img src="images/kopf_' + snake.orientation + '.png" alt="Kopf">';
}

function tasteGedrueckt(event) {
  event.cancelBubble = true;
  event.returnValue = false;

  if(paused == false) {
    switch (event.keyCode) {
      case 37: //links
        snake.orientation = 3;
        break;
      case 38: //oben
        snake.orientation = 0;
        break;
      case 39: //rechts
        snake.orientation = 1;
        break;
      case 40: //unten
        snake.orientation = 2;
        break;
    }
  }

  if (event.keyCode == 13) {
    pause();
  }

  return event.returnValue;
}

function setupBewegungswerte() {
  if(snake.gefressen == false) {
    //Schwanzelement entfernen
    snake.besetzteFelder.shift();
  }else {
    snake.gefressen = false;
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

  if(todesPruefung())
    spielBeenden();
  else
    setupGrafik();
}

function todesPruefung() {
  var tmpFelder = [];
  for (var i in snake.besetzteFelder) {
    tmpFelder[i] = snake.besetzteFelder[i];
  }

  //Snake auf Pflaume?
  for(var t=0; t<pflaumenPoses.length; t++) {
   if((tmpFelder[tmpFelder.length-1][0] == pflaumenPoses[t][0]) && (tmpFelder[tmpFelder.length-1][1] == pflaumenPoses[t][1]))
     return true;
  }

  var kopf = tmpFelder[tmpFelder.length-1];

  //Snake außerhalb der Welt?
  if (kopf[0] > feldBreite-1 || kopf[0] < 0 || kopf[1] < 0 || kopf[1] > feldHoehe-1)
    return true;

  //Hat Snake sich selbst gefressen?
  for(var z=0; z<tmpFelder.length-1; z++) {
    if(kopf[0] == tmpFelder[z][0] && kopf[1] == tmpFelder[z][1])
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
  var spieldauer = (zeit2 - zeit1)/1000;
  var statistik = document.getElementById("statistik");

  if (window.localStorage) {
    var wertissimo = [];

    var noSnakeElements = 0;
    for (var i = 0; i < localStorage.length; i++) {
      if(localStorage.key(i).substring(0, 18) == "Snake_Ivo_Ziesche_")
        wertissimo[i-noSnakeElements] = localStorage.getItem(localStorage.key(i));
      else
        noSnakeElements++;
    }

    var aktZeit = new Date();
    var zeit = aktZeit.getTime();
    localStorage.setItem("Snake_Ivo_Ziesche_" + zeit, snake.besetzteFelder.length-4);

    var platzierung = calcPlace(wertissimo, snake.besetzteFelder.length-4);
    var highscore = calcHighscore(wertissimo);

    //Erster Platz?
    if (platzierung == 1) {
      var congratulation = document.getElementById("congratulation");
      congratulation.style.display = "block";
    }

    gameValues = snake.besetzteFelder.length-4 + " Äpfel" + "<br>" + spieldauer + " Sekunden<br>" + platzierung + " Platz insgesamt<br>" + highscore + " Äpfel Highscore";
  } else {
    gameValues = snake.besetzteFelder.length-4 + " Äpfel<br>" + spieldauer + " Sekunden";
  }

  statistik.innerHTML = gameValues;
}

function calcPlace(werte, aktWert) {
  var platz = 0;
  for(var i=0; i<werte.length; i++) {
    if(aktWert > werte[i])
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
