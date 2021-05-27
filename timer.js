var counter = 0;
var timer = setInterval(updateTimer, 1000);

var timerDisplayValue = document.getElementById("timer");
var upgradeDisplay = document.getElementById("upgrades");
var trophyDisplay = document.getElementById("achievements");

var trophies = "";
var upgrades = "";
var timerMult = 1;
var clickMult = 1;

function updateTimer() {
  augmentCounter(1);
}
function clickCounter() {
  augmentCounter(clickMult);
}
function updateText() {
  trophyDisplay.innerHTML = trophies;
  upgradeDisplay.innerHTML = upgrades;
}
function changeTimerInterval(interval) {
  clearInterval(timer)
  timer = setInterval(updateTimer, interval)
}

function augmentCounter(mult) {
  while (mult > 0) {
    mult--;
    counter++;
    timerDisplayValue.innerHTML = counter;
    if (counter === 10) {
      trophies = trophies + "<br>You reached 10! Cool<br>";
      upgrades = upgrades + "<br>You now earn twice as much from clicking.<br>";
      clickMult = 2;
      updateText();
    }
    else if (counter === 50) {
      trophies = trophies + "<br>You reached 50! Good<br>";
      upgrades = upgrades + "<br>You now earn twice as much from the timer.<br>";
      timerMult = 2;
      changeTimerInterval(1000 / timerMult)
      updateText();
    }
    else if (counter === 100) {
      trophies = trophies + "<br>You reached 100! Great<br>";
      updateText();
    }
    else if (counter === 200) {
      trophies = trophies + "<br>You reached 200! Tubular<br>";
      updateText();
    }
    else if (counter === 400) {
      trophies = trophies + "<br>You reached 400! Dope<br>";
      upgrades = upgrades + "<br>You now earn quadruple from clicking.<br>";
      clickMult = 4;
      updateText();
    }
    else if (counter === 1000) {
      trophies = trophies + "<br>You reached 1000! Impressive<br>";
      upgrades = upgrades + "<br>You now earn quadruple from the timer.<br>";
      timerMult = 4;
      changeTimerInterval(1000 / timerMult)
      updateText();
    }
    else if (counter === 2000) {
      trophies = trophies + "<br>You reached 2000! Fantastic<br>";
      upgrades = upgrades + "<br>You now earn octuple from clicking.<br>";
      clickMult = 8;
      updateText();
    }
    else if (counter === 3000) {
      trophies = trophies + "<br>You reached 3000! Rare<br>";
      updateText();
    }
    else if (counter === 4000) {
      trophies = trophies + "<br>You reached 4000! Epic<br>";
      upgrades = upgrades + "<br>You now earn octuple from the timer, and sixteen as much from clicking. The next trophy is a long way ahead, brave traveler...<br>";
      timerMult = 8;
      clickMult = 16;
      changeTimerInterval(1000 / timerMult)
      updateText();
    }
    else if (counter === 10000) {
      trophies = trophies + "<br>You reached 10000! Awesome<br><font color=\"blue\">The color is now blue!<br>";
      updateText();
    }
    else if (counter === 20000) {
      trophies = trophies + "<br>You reached 20000! Spectacular<br>Your final reward will be at 100000...<br>";
      updateText();
    }
    else if (counter === 100000) {
      trophies = trophies + "<br>You reached 100000! Incredible<br>You now get 16 times as much from the timer and 32 times as much from clicking.<br>";
      trophies = trophies + "<br>You now get a jpeg of a trollface. Was it worth it?<br><img src=\"https://jmpswork.github.io/trollmaw.jpg\"><br>";
      timerMult = 16;
      clickMult = 32;
      changeTimerInterval(1000 / timerMult)
      updateText();
    }
  }
}
