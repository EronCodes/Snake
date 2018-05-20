var intervalId;

var feldBreite = 20;
var feldHoehe = 10;

var zeit1;

var aepfel = 0;

var geschwindigkeit;

var paused = false;

var pflaumenPoses = [];

var snake = {
  //Die besetzten Felder werden vom Schwanz (Anfang des Arrays) bis zum Kopf (Ende des Arrays) geordnet
  besetzteFelder: [],

  fruchtPos: [],
  gefressen: false,

  /*
    0: oben
    1: rechts
    2: unten
    3: links
  */
    orientation: 1
};

var powerup = {
  inGame: false,
  waiting: 0,
  timeLeft: 100,
  pos: [5,5]
};

var sounds = {
  die: new Audio("sounds/die.mp3"),
  eat: new Audio("sounds/eat.mp3"),
  status: true
};
