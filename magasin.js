// Chaque achats à un montant en grammes, ceci est le multiplieur en grammes
const poidsID = [
  100,  // ID 0
  100,
  50,
  50,
  50,
  5,
  500  // ID 6
];
// ID associé au nom
const nomID = [
  "Granite",
  "Marbre",
  "Quartz",
  "Zircon",
  "Émeraude",
  "Diamant",
  "Amiante"
];
// coût pour chaque ID
const coutID = [
  0.10,
  0.15,
  0.75,
  25.00,
  115.00,
  15000.00,
  14.99
]
// Liste d'achats, pensé à un "shopping cart" qui prend forme de plusieurs ID de produits
// Ex: [[0, 0.15], [2, 0.1]] - ID, $ de ce id
var achats = [];
// Du texte au fin de la page qui liste tous les achats
var panierAchats = "";

// ------------------------------
// Fonctions pour le panier et les achats individuels
// ------------------------------

function getOccurence() {
  // Ce fonction cherche tous les achats et compte le nombre de fois qu'un ID apparait
  let occurences = {};  // "id de produit": "nombre d'occurences"
  for (let i = 0; i < achats.length; i++) {
    if (occurences.hasOwnProperty(achats[i][0])) {  // Si il y a déja un occurence,
      occurences[achats[i][0]] = occurences[achats[i][0]] + 1;
    }  // Si il n'y a pas d'occurences
    else {
      occurences[achats[i][0]] = 1;
    }
  }
  return occurences
}
function updatePanier() {
  // Ce fonction affiche une version à jour du panier sur le site web
  var affiche = document.getElementById("panierAchats");
  var panierFinale = "<h2>Panier</h2>\n";
  let occurences = getOccurence();
  for (let montant in occurences) {
    // montant est le ID du produit, occurences[montant] est le montant d'occurences
    let poids = occurences[montant] * poidsID[montant];
    let cout = (coutID[montant] * occurences[montant]).toFixed(2);
    // Créer le HTML pour le panier
    /* Le résultat finale regarde comme ceci:
    <div class="panierItem">
      <p>Granite</p>
      <p>Montant: 100g<br>
      Coût: 0.10$</p>
      <input type="button" value="Enlever" onclick="enleverAchat(0)" style="color:coral; font-weight:bold; padding:10px 20px;">
    </div>
    */
    let message = "<div class=\"panierItem\"><p>" + nomID[montant] + "</p>";
    message = message + "<p>Montant: " + poids + "g<br>";
    message = message + "Coût: " + cout + "$</p>";
    message = message + "<input type=\"button\" value=\"Enlever\" onclick=\"enleverAchat(" + montant
    message = message + ")\" style=\"color:coral; font-weight:bold; padding:10px 20px;\" ></div>\n";
    panierFinale = panierFinale + message;
  }
  affiche.innerHTML = panierFinale;
}
function ajouteAchat(id) {
  // Ajoute un item au panier
  achats.push([id, coutID[id]]);
  updatePanier();
}
function enleverAchat(id) {
  // Trouve un ID qui égale à celle ci-dans achats et enlever.
  for (let i = 0; i < achats.length; i++) {
    if (achats[i][0] == id) {
      achats.splice(i, 1);  // Enlever seulement cet index et arrêter la boucle
      break;
    }
  }
  updatePanier();
}

// ------------------------------
// Fonctions pour l'affichement du Reçu
// ------------------------------

function printRecu() {
  // Afficher le reçu finale sur le site web
  // Déclaré les variables initiales
  var htmlReceipt = document.getElementById("receipt");
  var message = "<h3>Reçu</h3>\n<p class=\"textGros\" style=\"padding:4px 20px; text-align: left;\">";
  let dateLivraison = document.getElementById("dateLivraison").value;
  let dateMaintenant = new Date();
  let province = document.getElementById("prov").value;
  let tax = 13;
  let occurences = getOccurence();
  let itemSousTotal = 0;
  let livraisonCout = 45;

  // Convertir la date de livraison dans une Date() object
  let annee = dateLivraison.split("-")[0];
  let mois = dateLivraison.split("-")[1] - 1; // Les mois commence à 0
  let jour = dateLivraison.split("-")[2];
  dateLivraison = new Date(annee, mois, jour);
  // La différence entre des dates sont des millisecondes, alors ça doit être convertit à des jours
  let dateDifferenceJours = Math.round((dateLivraison - dateMaintenant) / (1000*60*60*24));
  // Si la différence entre le date est négatif ou 0 ou aucun date est donné, c'est invalide
  if (dateDifferenceJours < 0 || dateDifferenceJours != dateDifferenceJours) {
    message += "Date de livraison invalide! Ça doit être au moins un jours à partir d'aujourd'hui!</p>";
    htmlReceipt.innerHTML = message;
    return
  }

  let i = 0;
  for (let montant in occurences) {
    // Afficher chaque achat individuel
    i++;
    let itemString = i + ". \t"  // Le message pour chaque achat individuel
    let poids = occurences[montant] * poidsID[montant];  // Calcule la poids et le cout totale
    let cout = (coutID[montant] * occurences[montant]);
    itemString += nomID[montant] + " (" + poids + "g) " + cout.toFixed(2) + "<br>";
    // Ajoute le achat au reçu
    message += itemString;
    itemSousTotal += cout;
  }
  // Si le personne n'achete rien, on n'affiche aucun reçu et arrête ce fonction
  if (itemSousTotal === 0) {
    message += "Aucun item dans le panier.<br></p>";
    htmlReceipt.innerHTML = message;
    return
  }
  // Changer la taxe dépendant de la province, la défault est ON (13%)
  if (province == "QC") {
    tax = 15;
  }
  // Compléter le reçu finale
  message += "----------------------------------------<br>";
  message += "Sous-total des items \t" + itemSousTotal.toFixed(2) + "<br>";
  if (dateDifferenceJours >= 5) {
    livraisonCout = 10;
  }
  message += "Livraison \t" + livraisonCout.toFixed(2) + "<br>";
  message += "Sous-total \t" + (itemSousTotal + livraisonCout).toFixed(2) + "<br>";
  message += "Taxes (" + province + " " + tax +"%)\t" + ((itemSousTotal + livraisonCout) * (tax / 100)).toFixed(2) + "<br>";
  message += "<strong>TOTAL \t" + ((itemSousTotal + livraisonCout) * (1 + tax / 100)).toFixed(2) + "$</strong><br>";
  message += "----------------------------------------<br></p>";

  htmlReceipt.innerHTML = message;
  // Afficher les billets à redonnées après avoir afficher le reçu
  billetsRedonne((itemSousTotal + livraisonCout) * (1 + tax / 100));
}
function billetsRedonne(prixTotal) {
  /* Ce fonction calcule le montant de billets et de pièces à redonners si le montant d'argent donnée est plus grande que 0
  De plus, ça fait l'affichage des billets à redonnées dans le reçu */
  let montantDonne = document.getElementById("dollarDonne").value;
  if (montantDonne > 0) {
    montantDonne = parseFloat(parseFloat(montantDonne).toFixed(2));  // Convertir à deux places décimals
    // Billets possibles à donnée
    let moneyPieces = [50, 20, 10, 5, 2, 1, 0.25, 0.1, 0.05];
    let currentPiece = 0;  // Index du pièce
    let returnedAmount = {};  // Billets totales a redonnés
    let difference = 0;  // La différence entre ce que le client paie et le prix total
    // Si on doit encore redonné de l'arget,
    while (montantDonne > prixTotal && currentPiece != -1) {
      // Choisir pièce de la plus grande valeur à redonné
      difference = montantDonne - prixTotal;
      if (difference >= 50) {
        currentPiece = 0;
      }
      else if (difference >= 20) {
        currentPiece = 1;
      }
      else if (difference >= 10) {
        currentPiece = 2;
      }
      else if (difference >= 5) {
        currentPiece = 3;
      }
      else if (difference >= 2) {
        currentPiece = 4;
      }
      else if (difference >= 1) {
        currentPiece = 5;
      }
      else if (difference >= 0.25) {
        currentPiece = 6;
      }
      else if (difference >= 0.1) {
        currentPiece = 7;
      }
      else if (difference >= 0.05) {
        currentPiece = 8;
      }
      else {
        currentPiece = -1;
      }
      // Ajouter un de cette pièce
      if (currentPiece != -1) {
        if (returnedAmount.hasOwnProperty(moneyPieces[currentPiece])) {
          returnedAmount[moneyPieces[currentPiece]] += 1;
        }
        else {
          returnedAmount[moneyPieces[currentPiece]] = 1;
        }
        // Soustrait ce montant du
        montantDonne -= moneyPieces[currentPiece];
      }
    }
    // Commencé l'affichement des billets à redonnées
    var htmlReceipt = document.getElementById("receipt");
    let message = "<br><h3>Billets</h3>\n<p class=\"textGros\" style=\"padding:4px 20px; text-align: left;\"><br>";
    for (piece in returnedAmount) {
      // Choisir le bon mot et si il y a plusieurs de ce billet ou pièce conjuge le au pluriel
      let pieceMot = "pièce";
      // Si la valeur de ce pièce est plus grande que 2$, ça doit être un billet
      if (parseFloat(piece) > 2) {
        pieceMot = "billet";
      }
      if (returnedAmount[piece] > 1) {
        pieceMot += "s";
      }
      // Construire le message
      message += returnedAmount[piece] + " " + pieceMot + " de " + parseFloat(piece).toFixed(2) + "$<br>";
    }
    htmlReceipt.innerHTML += message;
  }
}
