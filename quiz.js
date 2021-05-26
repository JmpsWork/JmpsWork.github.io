function verifierReponse() {
 var affiche = document.getElementById("divAffiche");
 var q1r = parseInt(document.getElementById("q1r").value);
 // Check pour seulement la bonne réponse
 var q2r = document.getElementsByName("q2r")[2].checked;
 var q3r = parseFloat(document.getElementById("q3r").value);
 var message = "<br><br>"
 console.log(q1r, q2r, q3r);
 
 if (q1r === 7) {
   message = message + "Bonne réponse!" + "<br><br>";
 }
 else {
   message = message + "Mauvaise réponse! La bonne réponse est 7." + "<br><br>";
 }
 if (q2r) {
   message = message + "Bonne réponse!" + "<br><br>";
 }
 else {
   message = message + "Mauvaise réponse! La bonne réponse est Katerine Barbieri." + "<br><br>";
 }
 if (q3r === 2.6) {
   message = message + "Bonne réponse!" + "<br><br>";
 }
 else {
   message = message + "Mauvaise réponse! La bonne réponse est 2.6." + "<br><br>";
 }
 affiche.innerHTML = message;
}
