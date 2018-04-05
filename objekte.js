var intervalId;

var feldBreite = 20;
var feldHoehe = 10;

var zeit1;

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
