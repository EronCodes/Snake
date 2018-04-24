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

  if (posOnPflaume(snake.fruchtPos[0], snake.fruchtPos[1]) == true || posOnPowerup(snake.fruchtPos[0], snake.fruchtPos[1]) == true || posOnSnake(snake.fruchtPos[0], snake.fruchtPos[1]) == true) {
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

  if (posOnSnake(pflaumenPoses[k][0], pflaumenPoses[k][1]) == true || posOnApfel(pflaumenPoses[k][0], pflaumenPoses[k][1]) == true || posOnPowerup(pflaumenPoses[k][0], pflaumenPoses[k][1]) == true) {
    addPflaume(k);
  }

  //Liegt Snakes Kopf auf Anfangsposition?                                                                                                 //Liegt dort die Pflaume?
  if ((snake.besetzteFelder[snake.besetzteFelder.length - 1][0] == 3 && snake.besetzteFelder[snake.besetzteFelder.length - 1][1] == 0) && (pflaumenPoses[k][0] == 4 && pflaumenPoses[k][1] == 0)) {
    addPflaume(k);
  }
}

function setPowerup() {
  powerup.pos = [Math.floor(Math.random() * feldBreite), Math.floor(Math.random() * feldHoehe)];

  if (posOnApfel(powerup.pos[0], powerup.pos[1]) == true || posOnSnake(powerup.pos[0], powerup.pos[1]) == true || posOnPflaume(powerup.pos[0], powerup.pos[1]) == true) {
    setPowerup();
  }
}

function deletePowerup() {
  powerup.inGame = false;
  powerup.waiting = Math.floor(Math.random() * 5) + 10;
}

//Expert-Window-Functions and the pause-funktion
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

//posOn... - functions
function posOnSnake(x, y) {
  for (var i = 0; i < snake.besetzteFelder.length; i++) {
    if ((snake.besetzteFelder[i][0] == x) && (snake.besetzteFelder[i][1] == y)) {
      return true;
    }
  }
  return false;
}

function posOnPflaume(x, y) {
  for (var t = 0; t < pflaumenPoses.length - 1; t++) {
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
