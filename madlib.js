function createText() {
  var affiche = document.getElementById("divAffiche");
  var message = "J'adore l'été! Chaque jour, quand je suis en vacances, je me réveille, je mets <br>";
  message = message + "mes " + document.getElementById("0").value + " , je me rend à la cuisine et je <br>";
  message = message + "mange " + document.getElementById("1").value + " pour déjeuner. Ensuite,<br>";
  message = message + "mon activité préféré est de " + document.getElementById("2").value + " avec mon <br>";
  message = message + "ami " + document.getElementById("3").value + ". À 14h, je dîne. Je mange des";
  message = message + document.getElementById("4").value + " " + document.getElementById("5").value + ".<br> Durant";
  message = message + "l'après midi, j'aime me rendre au parc et de " + document.getElementById("6").value + " " + document.getElementById("7").value + ".<br>";
  message = message + "En soirée, je mange toujours du <br>" + document.getElementById("8").value + " pour le souper. Finalement, je me <br>";
  message = message + "couche et je rêve de " + document.getElementById("9").value + ". Quel été " + document.getElementById("10").value + "!";

  affiche.innerHTML = message;
}
