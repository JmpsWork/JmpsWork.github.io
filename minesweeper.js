/*
JEUX MINESWEEPER
Ce fichier contient toute le code pour faire fonctionner le jeux. 
*/
var tableau = [];
/*
La variable tableau est organiser comme ceci
[
  [Case1(),Case2(),Case3(),CaseN()],
  [Case1(),Case2(),Case3(),CaseN()],
  [Case1(),Case2(),Case3(),CaseN()],
  [Case1(),Case2(),Case3(),CaseN()],
  [Case1(),Case2(),Case3(),CaseN()],
  [Case1(),Case2(),Case3(),CaseN()],
  [Case1(),Case2(),Case3(),CaseN()],
  [Case1(),Case2(),Case3(),CaseN()],
  . . .
]
*/

var jeuxPerdu = false;  // Si le jeux est perdu, ce variable devient true
var premierClick = true;
var restantPasReveler = 0;  // Nombre de cases qui ne sont pas reveler
// Si le jeux est perdu, ceci est le coordonnes du mine qui cause la condition perdu
var minePerduXY = [0, 0]

// Sons pour le jeux
var sondClick = new Audio("click.wav");
var sondExplosion = new Audio("explode.wav");
var sondMarque = new Audio("mark.wav");
sondClick.volume = 0.4;  // Pourcentage du volume, ex: 0.4 = 40% du volume normale
sondExplosion.volume = 0.25;
sondMarque.volume = 0.4;

// Construit un objet (classe) appelé Case, ou on peut accéder certains informations facilement
class Case {
  constructor(estMarquer, estMine, x, y) {
    this.x = x;  // La position de ce case dans le grille
    this.y = y;
    this.estMarquer = estMarquer;  // Si ce case a un drapeau au-dessus
    this.estMine = estMine;  // Si ce case est un mine
    this.adjacent = 0;  // Le nombre de mines adjacents à ce case
    this.estReveler = false; 
  }
}

// Une fonction pour creer un tableau vide (sans mines)
function creeTableau() {
  document.getElementById("perduTexte").innerHTML = "";
  jeuxPerdu = false;
  premierClick = true;
  let longeur = parseInt(document.getElementById('longeur').value); // X
  let hauteur = parseInt(document.getElementById('largeur').value); // Y
  let pourcentageMines = parseFloat(document.getElementById('pourcentage').value); // rapport de mines
  restantPasReveler = longeur * hauteur;
  tableau = [];
  
  //Afficher un alert si l'utilisateur essaye de mettre la taille de la grille à 0
  if (document.getElementById(`longeur`).value == 0 || document.getElementById(`largeur`).value == 0){
    alert('S.V.P choisi un taille de grille valide')
  }

  for (let i = 0; i < hauteur; i++) {
    ranger = [];
    for (let j = 0; j < longeur; j++) {
      ranger.push(new Case(false, false, j, i));
      // ranger[j].estReveler = true;
    }
    tableau.push(ranger);
  }

  nouvelleTableauHTML(hauteur);
  afficheTout(hauteur, longeur);
}

// Fonction pour generer les mines dans le tableau
function genereMines(minesPourcentage, xSelect, ySelect) {
  // rapportMines est le pourcentage (minesPourcentage / 100)
  minesPourcentage /= 100
  let numDeMines = (tableau.length * tableau[0].length) * minesPourcentage;
  let x, y;
  let i = 0;
  while (i < numDeMines) {
    x = Math.round(Math.random() * (tableau[0].length-1));
    y = Math.round(Math.random() * (tableau.length-1));
    // éviter de choisir le case que l'utilisateur a clické
    if (x != xSelect || y != ySelect) {
      ceCase = caseIci(x, y);
      if (!ceCase.estMine) { // eviter un "over-lap"
        ceCase.estMine = true;
        restantPasReveler -= 1;
        i++;
      }
    }
  }
  return tableau;
}

function afficheTout(hauteur, longeur) {
  // Ce fonction affiche toutes les lignes du grille
  for (let i = 0; i < hauteur; i++) {
    afficheLigne(i, longeur);
  }
}

function determineAdjacent(hauteur, longeur) {
  // Ce fonction détermine le nombre de mines adjacents pour tous les cases dans le grille
  for (let y = 0; y < hauteur; y++) {
    for (let x = 0; x < longeur; x++) {
      let ceCase = caseIci(x, y);
      let minesAdjacent = 0;
      let adjacents = caseProches(x, y);
      for (let i = 0; i < adjacents.length; i++) {
        if (adjacents[i]) {  // Si ce case existe et c'est un mine, ajoute 1 au mines adjacent
          if (adjacents[i].estMine) {
            minesAdjacent++;
          }
        }
      }
      ceCase.adjacent = minesAdjacent;
    }
  }
}

function afficheNombresMines() {
  /* Ce fonction affiche le nombre totale de mines quand l'utilisateur 
  change les valuers de la longeur, la largeur ou la pourcentage de 
  mines dans la grille*/
  let longeur = parseInt(document.getElementById('longeur').value); // X
  let hauteur = parseInt(document.getElementById('largeur').value); // Y
  let pourcentageMines = parseFloat(document.getElementById('pourcentage').value); // rapport
  let minesTotales = (hauteur * longeur) * (pourcentageMines / 100);
  document.getElementById("mineTexte").innerHTML = `Mines: ${Math.round(minesTotales)}`;
}

function perdreJeux(ceCase) {
  // Transforme le jeux en condition perdu
  // ceCase est le case qui a été clické pour perdre le jeux
  document.getElementById("perduTexte").innerHTML = "S.V.P Recommencer";
  jeuxPerdu = true;
  minePerduXY = [ceCase.x, ceCase.y];  // Le mine qui à fait l'échec
  afficheTout(parseInt(document.getElementById('largeur').value), parseInt(document.getElementById('longeur').value));
}

function caseClicker(x, y, clickType=0) {
  /* Si un tile clickable est clické, ce fonction active 
  clickType détermine si le click était un click-gauche ou un click-droite, 0 et 1 respectivement*/
  // Si c'était la première action sur la grille, on génere la grille sans que la case choisi est un mine
  if (premierClick && clickType === 0) {
    genereMines(parseFloat(document.getElementById('pourcentage').value), x, y);
    determineAdjacent(document.getElementById('largeur').value, document.getElementById('longeur').value)
    premierClick = false;
  }

  // Si le jeux n'est pas terminé, permettre l'utilisateur de clicker sur les cases
  if (!jeuxPerdu && !premierClick  && restantPasReveler != 0) {
    // Obtient le case à ce position, et éxecute un left-click
    if (clickType === 0) {
      ceCase = caseIci(x, y);

      // Si ce case est un mine ET ce n'est pas marqué, le jeux est perdu
      if (ceCase.estMine && !ceCase.estMarquer) {
        perdreJeux(ceCase);
        sondExplosion.play();
      }
      // Si ce case n'est pas marqué ET n'est pas un mine, on le révéler
      else if (!ceCase.estMarquer && !ceCase.estReveler) {
        caseReveler(x, y);
        sondClick.play();
      }
    }
    // Éxecute un right-click pour marquer un cases qui n'est pas révéler
    else if (clickType === 1) {
      caseMarque(x, y);
    }
  }
  // Si tous les cases qui ne sont pas mines sont revelés, le jeux est gagné
  if (restantPasReveler === 0) {
    document.getElementById("perduTexte").innerHTML = "Jeux Gagné!";
  }
}

function caseIci(x, y) {
  // Ce fonction return le case à ce position. Si le position est invalide, ça return false
  let longeur = parseInt(document.getElementById('longeur').value); // X
  let hauteur = parseInt(document.getElementById('largeur').value); // Y
  // Si le case est dans un position invalide, return false
  if (x < 0 || x >= longeur || y < 0 || y >= hauteur) {
    return false;
  }
  else {
    return tableau[y][x]
  }
}

function caseProches(x, y) {
  // Ce fonction return les cases à côtés de ce case.
  proches = [
    caseIci(x - 1, y - 1),  // En haut
    caseIci(x, y - 1),
    caseIci(x + 1, y - 1),

    caseIci(x - 1, y),  // A côté
    caseIci(x + 1, y),

    caseIci(x - 1, y + 1),  // En bas
    caseIci(x, y + 1),
    caseIci(x + 1, y + 1),
  ]
  return proches
}

function caseReveler(x, y) {
  /*
  Ce fonction revele tous les cases qui peut être revelé de cette case
  Parce que il peut avoir une nombre variante de cases à revelé, il y a un liste
  qui garde trace de les cases qui ont besoin d'être reveler
  */
  let cases = [caseIci(x, y)];  // Commence à ce case
  while (cases.length != 0) {  // Si le liste de cases à reveler n'est pas vide,
    let ceCase = cases.pop();  // On prend la dernière case du liste et l'efface du liste
    // Si ce case est complétement vide, ajoute les cases à côtés pour être revelé
    if (ceCase.adjacent == 0 && !ceCase.estReveler) {
      ceCase.estReveler = true;
      restantPasReveler -= 1;
      let casesAdjacents = caseProches(ceCase.x, ceCase.y);
      for (let i = 0; i < casesAdjacents.length; i++) {
        // Si ce case existe, ajoute le au cases qui ont besoin d'être reveler
        if (casesAdjacents[i]) {
          cases.push(casesAdjacents[i]);
        }
      }
    }
    // Si ce case n'est pas un mine mais est adjacent à des autres tiles, on le révele
    if (!ceCase.estMine && !ceCase.estReveler) {
      ceCase.estReveler = true;
      restantPasReveler -= 1;
    }
  }
  afficheTout(document.getElementById('largeur').value, document.getElementById('longeur').value);
}

function caseMarque(x, y) {
  let caseSelectionner = caseIci(x, y);
  // Si c'est déja marqué, on enlève le marque
  if (caseSelectionner.estMarquer && !caseSelectionner.estReveler) {
    caseSelectionner.estMarquer = false;
    sondMarque.play();
  }
  // Sinon, on ajoute un marque
  else {
    caseSelectionner.estMarquer = true;
    sondMarque.play();
  }
  // On doit afficher seulement un ligne pour la marque au lieu d'afficher tout
  afficheLigne(y, document.getElementById('longeur').value);
}

function afficheLigne(y, longeur) {
  // Ce fonction mise à jour le ligne y du tableau sur le site web
  let tableauLigne = document.getElementById("l" + y);  // Obitent le ligne
  let nouvelleHTML = `<tr><div id="l${y}">`;  // La nouvelle HTML pour remplacer
  // Pour chaque case dans ce ligne,
  for (let i = 0; i < longeur; i++) {
    ceCase = caseIci(i, y);
    let caseHTML = "<tr>";  // Le HTML de ce case spécifiquement
    
    let imgClass = "pasreveler";
    // Si le case est déja révéler ou non, ont change comment le case est afficher
    if (ceCase.estReveler) {
      imgClass = "reveler";
      caseHTML += `<button onclick="caseClicker(${i}, ${y})" class="revelerBouton" oncontextmenu="caseClicker(${i}, ${y}, 1)" id="${i} ${y}">`
    }
    else {
      caseHTML += `<button onclick="caseClicker(${i}, ${y})" oncontextmenu="caseClicker(${i}, ${y}, 1)" id="${i} ${y}">`
    }
    
    if (!ceCase.estReveler) {  // Si ce n'est pas reveler,
      if (ceCase.estMarquer) {
        // La première image est au dessus du class
        caseHTML += `<img src="https://jmpswork.github.io/mine_flag.png" class="${imgClass}">`;
      }
      // Si le jeux est terminé, ont affiche les mines
      else if (ceCase.estMine && jeuxPerdu || restantPasReveler === 0) {
        if (ceCase.x === minePerduXY[0] && ceCase.y === minePerduXY[1]) {
          caseHTML += `<img src="https://jmpswork.github.io/mine_on.png" class="${imgClass}">`;
        }
        else {
          caseHTML += `<img src="https://jmpswork.github.io/mine_off.png" class="${imgClass}">`;
        }
      }
      // Si ce case est adjacent à des mines et le jeux est perdu, ont affiche le nombre de mines adjacent
      else if (ceCase.adjacent > 0 && jeuxPerdu) {
        caseHTML += `<img src="https://jmpswork.github.io/${ceCase.adjacent}.png" class="${imgClass}">`;
      }
      // Si il y a rien sur ce case, ont affiche seulement un case vide
      else {
        caseHTML += "<td><img src=\"https://jmpswork.github.io/tile.png\"></td>";
      }
    }
    else {
      if (ceCase.estMine) {  // Si il y a un mine
        caseHTML += `<img src="https://jmpswork.github.io/mine_off.png" class="${imgClass}">`;
      }
      // Si ce case est adjacent à des mines , ont affiche le nombre de mines adjacent
      else if (ceCase.adjacent != 0) {
        caseHTML += `<img src="https://jmpswork.github.io/${ceCase.adjacent}.png" class="${imgClass}">`;
      // Si il n'y a rien sur ce case, ont affiche le case révéler vide
      }
      else {
        caseHTML += "<td><img src=\"https://jmpswork.github.io/tile_revealed.png\">";
      }
    }
    caseHTML += "</button></td>";
    nouvelleHTML += caseHTML;
  }
  // Afficher la nouvelle HTML
  nouvelleHTML += "</div>";
  tableauLigne.innerHTML = nouvelleHTML;
}

function nouvelleTableauHTML(hauteur) {
  // Ce fonction créer toute le HTML de base nécessaire pour le fonctionnement du jeux
  let tableau = document.getElementById("grille");
  let tableauHTML = "";
  for (let y = 0; y < hauteur; y++) {
    // Créer tous les sections div de lignes
    let ligneHTML = `<div id="l${y}"></div>`
    tableauHTML += ligneHTML;
  }
  tableau.innerHTML = tableauHTML;
}
