// more sound effects at https://www.myinstants.com/en/search/?name=FNAF

let count0 = 1;
let count1 = 1;
let count2 = 1;
let count3 = 1;
let count4 = 1;
let count5 = 1;
let ambiance = null;

window.addEventListener("load", () => {
  const blink = document.getElementById("blink-overlay");

  // remove from DOM after animation ends
  blink.addEventListener("animationend", () => {
    blink.remove();
  });
});

// Start ambience after user interacts (required by browsers)
window.addEventListener("click", startAmbienceOnce, { once: true });

function startAmbienceOnce() {
  ambiance = document.getElementById("ambience"); // <-- FIXED
  ambiance.volume = 0.2;
  ambiance.play().catch((e) => console.log("Autoplay blocked:", e));
}

function fadeOutAmbience() {
  const amb = document.getElementById("ambience");
  let fadeInterval = setInterval(() => {
    if (amb.volume > 0.05) {
      amb.volume -= 0.05;
    } else {
      amb.volume = 0;
      amb.pause();
      clearInterval(fadeInterval);
    }
  }, 80); // smooth fade over ~2 seconds
}

function handleNailClick(side) {
  let hammerUnlocked = window.hammerUnlocked || false;

  if (!hammerUnlocked) {
    let box;

    if (side === "left") {
      box = document.getElementById("SMISNEEDEDLEFTSCREEN");
    } else {
      box = document.getElementById("SMISNEEDEDRIGHTSCREEN");
    }

    // Set message + class
    box.innerText = "I'll need something to knock this out...";
    box.classList.add("nail-message");

    // Reset opacity (in case message was shown before)
    box.style.opacity = "1";

    // Fade out after 2.4 seconds
    setTimeout(() => {
      box.style.opacity = "0";
    }, 2400);

    // Clear message after 3 seconds
    setTimeout(() => {
      box.innerText = "";
    }, 3000);

    return;
  }

  // If hammer is unlocked, do the nail removal logic here
  console.log("Hammer is unlocked — remove nail.");
}
const TOTAL_TIME = 250; // The full starting time
let timeLeft = TOTAL_TIME;
let timerInterval;

let twoThirdsTriggered = false;
let oneThirdTriggered = false;

function startLighterTimer() {
  const timerDisplay = document.getElementById("lighter-timer");
  if (!timerDisplay) {
    console.error("lighter-timer element not found!");
    return;
  }

  console.log("Starting lighter timer. initial timeLeft =", timeLeft);
  timerDisplay.textContent = timeLeft;

  // make sure class removed at start
  timerDisplay.classList.remove("low-time");

  // threshold when low-time should start
  const LOW_THRESHOLD = 60;

  // ensure we immediately reflect the current state (if timeLeft already low)
  if (timeLeft <= LOW_THRESHOLD) {
    timerDisplay.classList.add("low-time");
    console.log("Timer already below threshold — added low-time class");
  }

  // clear any previous interval for safety
  if (typeof timerInterval === "number") {
    clearInterval(timerInterval);
  }

  timerInterval = setInterval(() => {
    // safety check (so we don't go negative)
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = 0;
      timerDisplay.classList.remove("low-time");
      console.log("Timer hit 0 — triggering lighter death");
      triggerLighterDeath();
      return;
    }

    timeLeft--;
    timerDisplay.textContent = timeLeft;

    // add flashing when at or below threshold
    if (
      timeLeft <= LOW_THRESHOLD &&
      !timerDisplay.classList.contains("low-time")
    ) {
      timerDisplay.classList.add("low-time");
      console.log("Added low-time class at", timeLeft);
    }

    // optional: remove class if time somehow increases above threshold
    if (
      timeLeft > LOW_THRESHOLD &&
      timerDisplay.classList.contains("low-time")
    ) {
      timerDisplay.classList.remove("low-time");
      console.log("Removed low-time class at", timeLeft);
    }

    // 2/3 time left → LEFT HAND
    if (!twoThirdsTriggered && timeLeft <= Math.floor((TOTAL_TIME * 2) / 3)) {
      twoThirdsTriggered = true;
      showLeftHand();
    }

    // 1/3 time left → RIGHT HAND
    if (!oneThirdTriggered && timeLeft <= Math.floor(TOTAL_TIME / 3)) {
      oneThirdTriggered = true;
      showRightHand();
    }
  }, 1000);
}

function showLeftHand() {
  document.getElementById("splat").play();
  const box = document.getElementById("lefthandbox");
  box.style.backgroundImage = 'url("images/LEFTHAND.png")';
  box.style.backgroundSize = "cover";
  box.style.backgroundRepeat = "no-repeat";
}

function showRightHand() {
  document.getElementById("splat").play();
  const box = document.getElementById("righthandbox");
  box.style.backgroundImage = 'url("images/RIGHTHAND.png")';
  box.style.backgroundSize = "cover";
  box.style.backgroundRepeat = "no-repeat";
}

function triggerLighterDeath() {
  let blackout = document.getElementById("blackout");
  let jumpscareImg = document.getElementById("jumpscare-img");

  console.log("Triggering lighter death…");
  fadeOutAmbience();

  // Start fade-to-black
  blackout.style.opacity = "1";
  blackout.style.pointerEvents = "all"; // block clicks

  let jumpscareSound = new Audio("sounds/jollibee-jumpscare.mp3");
  jumpscareSound.volume = 1.0;

  // Wait for the fade to finish (1 sec), THEN show image + play audio together
  setTimeout(() => {
    console.log("Showing jumpscare…");

    // Show image
    jumpscareImg.style.display = "block";

    // Play audio at the same moment

    // FORCE the browser to start audio immediately
    jumpscareSound.play().catch((e) => console.log(e));

    // Disable cursor globally
    document.body.classList.add("jumpscare-active");
    // 🔥 SHOW RESET BUTTON
    document.getElementById("resetButton").style.display = "block";
  }, 1000); // <-- delay stays the same as before
}
function resetGame() {
  window.location.reload();
}

window.onload = function () {
  startLighterTimer();
};

function triggerExitSequence() {
  console.log("Both nails removed — triggering exit.");

  let fadeOut = setInterval(() => {
    if (ambiance && ambiance.volume > 0.01) {
      ambiance.volume -= 0.02;
    } else {
      clearInterval(fadeOut);
      if (ambiance) {
        ambiance.pause();
        ambiance.currentTime = 0;
      }
    }
  }, 100);

  // Stop timer if running
  clearInterval(timerInterval);

  // Hide timer
  const timer = document.getElementById("lighter-timer-wrapper");
  if (timer) timer.style.display = "none";

  // Blackout
  const blackout = document.getElementById("blackout");
  blackout.style.opacity = "1";
  blackout.style.pointerEvents = "all";

  // Hide cursor
  document.body.style.cursor = "none";
  blackout.style.cursor = "none";
  
  const exitText = document.getElementById("exitText");
  exitText.style.display = "block";
  setTimeout(() => {
    exitText.style.opacity = "1";
  }, 50);
  // Play exit sound
  const exitSound = document.getElementById("exitSound");
  exitSound.volume = 1.0;

  // IMPORTANT → wait until audio is **allowed** to play
  exitSound
    .play()
    .then(() => {
      // Redirect AFTER sound finishes
      exitSound.onended = () => {
        window.location.href = "https://zaza-a.github.io/TheBasement/"; // ← YOUR LINK HERE
      };
    })
    .catch((err) => {
      console.log("Autoplay prevented. Redirecting immediately.", err);
      window.location.href = "https://zaza-a.github.io/TheBasement/";
    });
}

function checkBothNailsGone() {
  const rightNail = document.getElementById("BNAILRIGHT1");
  const leftNail = document.getElementById("BNAILRIGHT2");

  const rightGone = rightNail.classList.contains("transparent");
  const leftGone = leftNail.classList.contains("transparent");

  if (rightGone && leftGone) {
    triggerExitSequence();
  }
}

function hitNail(event) {
  document.getElementById("hammerSMASH").play();
  event.target.classList.add("transparent"); // hide the nail or make it gone

  checkBothNailsGone();
}

function enableHammerForNails() {
  let nails = document.querySelectorAll(".hammer-nail");

  nails.forEach((nail) => {
    nail.classList.add("clickable");
    nail.onclick = hitNail;
  });
}

function takeHammer() {
  window.hammerUnlocked = true;

  // show message
  showHammerHintMessage();

  let boxImg = document.getElementById("LOCKEDBOX_IMAGE");

  // Change box to empty image
  boxImg.src = "images/OPENEDBOXWITHOUTHAMMER.png";
  boxImg.onclick = null;
  boxImg.classList.remove("clickable");

  // Enable hammer mode
  document.body.classList.add("hammer-mode");

  // Set custom cursor
  document.body.style.cursor = "url('images/HAMMER48X48.png') 5 5, auto";

  // Activate nails
  enableHammerForNails();
  // 🔥 SHOW THE NEW MESSAGE
  showHammerHintMessage();
}
function showHammerHintMessage() {
  const box = document.getElementById("SMISNEEDEDRIGHTSCREEN");

  box.classList.add("hammer-hint");
  box.innerText = "Now that I have the hammer, I can knock those nails out!";

  box.style.display = "block";
  box.style.opacity = "1";

  setTimeout(() => (box.style.opacity = "0"), 10000);
  setTimeout(() => {
    box.innerText = "";
    box.style.display = "none";
  }, 4000);
}

// JS FOR LOCKED MODAL
function unlockBox() {
  // 1. Hide the locked-box modal
  document.getElementById("myLOCKEDBOX").style.display = "none";

  // 2. Change the main box image to "opened" version
  let boxImg = document.getElementById("LOCKEDBOX_IMAGE");
  boxImg.src = "images/OPENEDBOXOFFICAL.png";

  // 3. Remove the ability to open the modal again
  boxImg.onclick = null;

  boxImg.onclick = takeHammer;

  // Add clickable class
  boxImg.classList.add("clickable");
}

function checkCode() {
  const col1 = document.getElementById("COLUMNONEMIDDLE").src;
  const col2 = document.getElementById("COLUMNTWOMIDDLE").src;
  const col3 = document.getElementById("COLUMNTHREEMIDDLE").src;
  const col4 = document.getElementById("COLUMNFOURMIDDLE").src;
  const col5 = document.getElementById("COLUMNFIVEMIDDLE").src;
  const col6 = document.getElementById("COLUMNSIXMIDDLE").src;

  // Extract filenames (ONE.JPG, TWO.JPG, etc.)
  const extract = (s) => s.split("/").pop();

  const code =
    extract(col1) +
    extract(col2) +
    extract(col3) +
    extract(col4) +
    extract(col5) +
    extract(col6);

  if (code === "FOUR.JPGSEVEN.JPGNINE.JPGTHREE.JPGONE.JPGSIX.JPG") {
    unlockBox();
  }
}

window.addEventListener("load", () => {
  const text = document.getElementById("textBox");
  if (!text) return;

  const stayTime = 10000; // ← change this to however long you want (ms)

  // Make sure text starts visible
  text.style.opacity = "1";
  text.style.display = "block";

  // Fade out after stayTime
  setTimeout(() => {
    text.style.opacity = "0";
  }, stayTime);

  // Remove from layout after fade completes
  setTimeout(() => {
    text.style.display = "none";
  }, stayTime + 1000); // fade is 1 second long
});

function slotspin1() {
  if (count0 == 1) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNONEBLUEABOVE").src = "images/TWO.JPG";
    document.getElementById("COLUMNONEMIDDLE").src = "images/THREE.JPG";
    document.getElementById("COLUMNONEBLUEBELOW").src = "images/FOUR.JPG";
    count0++;
  } else if (count0 == 2) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNONEBLUEABOVE").src = "images/THREE.JPG";
    document.getElementById("COLUMNONEMIDDLE").src = "images/FOUR.JPG";
    document.getElementById("COLUMNONEBLUEBELOW").src = "images/FIVE.JPG";
    count0++;
  } else if (count0 == 3) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNONEBLUEABOVE").src = "images/FOUR.JPG";
    document.getElementById("COLUMNONEMIDDLE").src = "images/FIVE.JPG";
    document.getElementById("COLUMNONEBLUEBELOW").src = "images/SIX.JPG";
    count0++;
  } else if (count0 == 4) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNONEBLUEABOVE").src = "images/FIVE.JPG";
    document.getElementById("COLUMNONEMIDDLE").src = "images/SIX.JPG";
    document.getElementById("COLUMNONEBLUEBELOW").src = "images/SEVEN.JPG";
    count0++;
  } else if (count0 == 5) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNONEBLUEABOVE").src = "images/SIX.JPG";
    document.getElementById("COLUMNONEMIDDLE").src = "images/SEVEN.JPG";
    document.getElementById("COLUMNONEBLUEBELOW").src = "images/EIGHT.JPG";
    count0++;
  } else if (count0 == 6) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNONEBLUEABOVE").src = "images/SEVEN.JPG";
    document.getElementById("COLUMNONEMIDDLE").src = "images/EIGHT.JPG";
    document.getElementById("COLUMNONEBLUEBELOW").src = "images/NINE.JPG";
    count0++;
    document.getElementById("combo").play();
  } else if (count0 == 7) {
    document.getElementById("COLUMNONEBLUEABOVE").src = "images/EIGHT.JPG";
    document.getElementById("COLUMNONEMIDDLE").src = "images/NINE.JPG";
    document.getElementById("COLUMNONEBLUEBELOW").src = "images/ONE.JPG";
    count0++;
  } else if (count0 == 8) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNONEBLUEABOVE").src = "images/NINE.JPG";
    document.getElementById("COLUMNONEMIDDLE").src = "images/ONE.JPG";
    document.getElementById("COLUMNONEBLUEBELOW").src = "images/TWO.JPG";
    count0++;
  } else if (count0 == 9) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNONEBLUEABOVE").src = "images/ONE.JPG";
    document.getElementById("COLUMNONEMIDDLE").src = "images/TWO.JPG";
    document.getElementById("COLUMNONEBLUEBELOW").src = "images/THREE.JPG";
    count0 = 1;
  }

  checkCode();
}

function slotspin2() {
  if (count1 == 1) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNTWOBLUEABOVE").src = "images/TWO.JPG";
    document.getElementById("COLUMNTWOMIDDLE").src = "images/THREE.JPG";
    document.getElementById("COLUMNTWOBLUEBELOW").src = "images/FOUR.JPG";
    count1++;
  } else if (count1 == 2) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNTWOBLUEABOVE").src = "images/THREE.JPG";
    document.getElementById("COLUMNTWOMIDDLE").src = "images/FOUR.JPG";
    document.getElementById("COLUMNTWOBLUEBELOW").src = "images/FIVE.JPG";
    count1++;
  } else if (count1 == 3) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNTWOBLUEABOVE").src = "images/FOUR.JPG";
    document.getElementById("COLUMNTWOMIDDLE").src = "images/FIVE.JPG";
    document.getElementById("COLUMNTWOBLUEBELOW").src = "images/SIX.JPG";
    count1++;
  } else if (count1 == 4) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNTWOBLUEABOVE").src = "images/FIVE.JPG";
    document.getElementById("COLUMNTWOMIDDLE").src = "images/SIX.JPG";
    document.getElementById("COLUMNTWOBLUEBELOW").src = "images/SEVEN.JPG";
    count1++;
  } else if (count1 == 5) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNTWOBLUEABOVE").src = "images/SIX.JPG";
    document.getElementById("COLUMNTWOMIDDLE").src = "images/SEVEN.JPG";
    document.getElementById("COLUMNTWOBLUEBELOW").src = "images/EIGHT.JPG";
    count1++;
  } else if (count1 == 6) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNTWOBLUEABOVE").src = "images/SEVEN.JPG";
    document.getElementById("COLUMNTWOMIDDLE").src = "images/EIGHT.JPG";
    document.getElementById("COLUMNTWOBLUEBELOW").src = "images/NINE.JPG";
    count1++;
  } else if (count1 == 7) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNTWOBLUEABOVE").src = "images/EIGHT.JPG";
    document.getElementById("COLUMNTWOMIDDLE").src = "images/NINE.JPG";
    document.getElementById("COLUMNTWOBLUEBELOW").src = "images/ONE.JPG";
    count1++;
  } else if (count1 == 8) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNTWOBLUEABOVE").src = "images/NINE.JPG";
    document.getElementById("COLUMNTWOMIDDLE").src = "images/ONE.JPG";
    document.getElementById("COLUMNTWOBLUEBELOW").src = "images/TWO.JPG";
    count1++;
  } else if (count1 == 9) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNTWOBLUEABOVE").src = "images/ONE.JPG";
    document.getElementById("COLUMNTWOMIDDLE").src = "images/TWO.JPG";
    document.getElementById("COLUMNTWOBLUEBELOW").src = "images/THREE.JPG";
    count1 = 1;
  }
  checkCode();
}

function slotspin3() {
  if (count2 == 1) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNTHREEBLUEABOVE").src = "images/TWO.JPG";
    document.getElementById("COLUMNTHREEMIDDLE").src = "images/THREE.JPG";
    document.getElementById("COLUMNTHREEBLUEBELOW").src = "images/FOUR.JPG";
    count2++;
  } else if (count2 == 2) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNTHREEBLUEABOVE").src = "images/THREE.JPG";
    document.getElementById("COLUMNTHREEMIDDLE").src = "images/FOUR.JPG";
    document.getElementById("COLUMNTHREEBLUEBELOW").src = "images/FIVE.JPG";
    count2++;
  } else if (count2 == 3) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNTHREEBLUEABOVE").src = "images/FOUR.JPG";
    document.getElementById("COLUMNTHREEMIDDLE").src = "images/FIVE.JPG";
    document.getElementById("COLUMNTHREEBLUEBELOW").src = "images/SIX.JPG";
    count2++;
  } else if (count2 == 4) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNTHREEBLUEABOVE").src = "images/FIVE.JPG";
    document.getElementById("COLUMNTHREEMIDDLE").src = "images/SIX.JPG";
    document.getElementById("COLUMNTHREEBLUEBELOW").src = "images/SEVEN.JPG";
    count2++;
  } else if (count2 == 5) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNTHREEBLUEABOVE").src = "images/SIX.JPG";
    document.getElementById("COLUMNTHREEMIDDLE").src = "images/SEVEN.JPG";
    document.getElementById("COLUMNTHREEBLUEBELOW").src = "images/EIGHT.JPG";
    count2++;
  } else if (count2 == 6) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNTHREEBLUEABOVE").src = "images/SEVEN.JPG";
    document.getElementById("COLUMNTHREEMIDDLE").src = "images/EIGHT.JPG";
    document.getElementById("COLUMNTHREEBLUEBELOW").src = "images/NINE.JPG";
    count2++;
  } else if (count2 == 7) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNTHREEBLUEABOVE").src = "images/EIGHT.JPG";
    document.getElementById("COLUMNTHREEMIDDLE").src = "images/NINE.JPG";
    document.getElementById("COLUMNTHREEBLUEBELOW").src = "images/ONE.JPG";
    count2++;
  } else if (count2 == 8) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNTHREEBLUEABOVE").src = "images/NINE.JPG";
    document.getElementById("COLUMNTHREEMIDDLE").src = "images/ONE.JPG";
    document.getElementById("COLUMNTHREEBLUEBELOW").src = "images/TWO.JPG";
    count2++;
  } else if (count2 == 9) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNTHREEBLUEABOVE").src = "images/ONE.JPG";
    document.getElementById("COLUMNTHREEMIDDLE").src = "images/TWO.JPG";
    document.getElementById("COLUMNTHREEBLUEBELOW").src = "images/THREE.JPG";
    count2 = 1;
  }
  checkCode();
}

function slotspin4() {
  if (count3 == 1) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNFOURBLUEABOVE").src = "images/TWO.JPG";
    document.getElementById("COLUMNFOURMIDDLE").src = "images/THREE.JPG";
    document.getElementById("COLUMNFOURBLUEBELOW").src = "images/FOUR.JPG";
    count3++;
  } else if (count3 == 2) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNFOURBLUEABOVE").src = "images/THREE.JPG";
    document.getElementById("COLUMNFOURMIDDLE").src = "images/FOUR.JPG";
    document.getElementById("COLUMNFOURBLUEBELOW").src = "images/FIVE.JPG";
    count3++;
  } else if (count3 == 3) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNFOURBLUEABOVE").src = "images/FOUR.JPG";
    document.getElementById("COLUMNFOURMIDDLE").src = "images/FIVE.JPG";
    document.getElementById("COLUMNFOURBLUEBELOW").src = "images/SIX.JPG";
    count3++;
  } else if (count3 == 4) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNFOURBLUEABOVE").src = "images/FIVE.JPG";
    document.getElementById("COLUMNFOURMIDDLE").src = "images/SIX.JPG";
    document.getElementById("COLUMNFOURBLUEBELOW").src = "images/SEVEN.JPG";
    count3++;
  } else if (count3 == 5) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNFOURBLUEABOVE").src = "images/SIX.JPG";
    document.getElementById("COLUMNFOURMIDDLE").src = "images/SEVEN.JPG";
    document.getElementById("COLUMNFOURBLUEBELOW").src = "images/EIGHT.JPG";
    count3++;
  } else if (count3 == 6) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNFOURBLUEABOVE").src = "images/SEVEN.JPG";
    document.getElementById("COLUMNFOURMIDDLE").src = "images/EIGHT.JPG";
    document.getElementById("COLUMNFOURBLUEBELOW").src = "images/NINE.JPG";
    count3++;
  } else if (count3 == 7) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNFOURBLUEABOVE").src = "images/EIGHT.JPG";
    document.getElementById("COLUMNFOURMIDDLE").src = "images/NINE.JPG";
    document.getElementById("COLUMNFOURBLUEBELOW").src = "images/ONE.JPG";
    count3++;
  } else if (count3 == 8) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNFOURBLUEABOVE").src = "images/NINE.JPG";
    document.getElementById("COLUMNFOURMIDDLE").src = "images/ONE.JPG";
    document.getElementById("COLUMNFOURBLUEBELOW").src = "images/TWO.JPG";
    count3++;
  } else if (count3 == 9) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNFOURBLUEABOVE").src = "images/ONE.JPG";
    document.getElementById("COLUMNFOURMIDDLE").src = "images/TWO.JPG";
    document.getElementById("COLUMNFOURBLUEBELOW").src = "images/THREE.JPG";
    count3 = 1;
  }
  checkCode();
}

function slotspin5() {
  if (count4 == 1) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNFIVEBLUEABOVE").src = "images/TWO.JPG";
    document.getElementById("COLUMNFIVEMIDDLE").src = "images/THREE.JPG";
    document.getElementById("COLUMNFIVEBLUEBELOW").src = "images/FOUR.JPG";
    count4++;
  } else if (count4 == 2) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNFIVEBLUEABOVE").src = "images/THREE.JPG";
    document.getElementById("COLUMNFIVEMIDDLE").src = "images/FOUR.JPG";
    document.getElementById("COLUMNFIVEBLUEBELOW").src = "images/FIVE.JPG";
    count4++;
  } else if (count4 == 3) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNFIVEBLUEABOVE").src = "images/FOUR.JPG";
    document.getElementById("COLUMNFIVEMIDDLE").src = "images/FIVE.JPG";
    document.getElementById("COLUMNFIVEBLUEBELOW").src = "images/SIX.JPG";
    count4++;
  } else if (count4 == 4) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNFIVEBLUEABOVE").src = "images/FIVE.JPG";
    document.getElementById("COLUMNFIVEMIDDLE").src = "images/SIX.JPG";
    document.getElementById("COLUMNFIVEBLUEBELOW").src = "images/SEVEN.JPG";
    count4++;
  } else if (count4 == 5) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNFIVEBLUEABOVE").src = "images/SIX.JPG";
    document.getElementById("COLUMNFIVEMIDDLE").src = "images/SEVEN.JPG";
    document.getElementById("COLUMNFIVEBLUEBELOW").src = "images/EIGHT.JPG";
    count4++;
  } else if (count4 == 6) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNFIVEBLUEABOVE").src = "images/SEVEN.JPG";
    document.getElementById("COLUMNFIVEMIDDLE").src = "images/EIGHT.JPG";
    document.getElementById("COLUMNFIVEBLUEBELOW").src = "images/NINE.JPG";
    count4++;
  } else if (count4 == 7) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNFIVEBLUEABOVE").src = "images/EIGHT.JPG";
    document.getElementById("COLUMNFIVEMIDDLE").src = "images/NINE.JPG";
    document.getElementById("COLUMNFIVEBLUEBELOW").src = "images/ONE.JPG";
    count4++;
  } else if (count4 == 8) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNFIVEBLUEABOVE").src = "images/NINE.JPG";
    document.getElementById("COLUMNFIVEMIDDLE").src = "images/ONE.JPG";
    document.getElementById("COLUMNFIVEBLUEBELOW").src = "images/TWO.JPG";
    count4++;
  } else if (count4 == 9) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNFIVEBLUEABOVE").src = "images/ONE.JPG";
    document.getElementById("COLUMNFIVEMIDDLE").src = "images/TWO.JPG";
    document.getElementById("COLUMNFIVEBLUEBELOW").src = "images/THREE.JPG";
    count4 = 1;
  }
  checkCode();
}

function slotspin6() {
  if (count5 == 1) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNSIXBLUEABOVE").src = "images/TWO.JPG";
    document.getElementById("COLUMNSIXMIDDLE").src = "images/THREE.JPG";
    document.getElementById("COLUMNSIXBLUEBELOW").src = "images/FOUR.JPG";
    count5++;
  } else if (count5 == 2) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNSIXBLUEABOVE").src = "images/THREE.JPG";
    document.getElementById("COLUMNSIXMIDDLE").src = "images/FOUR.JPG";
    document.getElementById("COLUMNSIXBLUEBELOW").src = "images/FIVE.JPG";
    count5++;
  } else if (count5 == 3) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNSIXBLUEABOVE").src = "images/FOUR.JPG";
    document.getElementById("COLUMNSIXMIDDLE").src = "images/FIVE.JPG";
    document.getElementById("COLUMNSIXBLUEBELOW").src = "images/SIX.JPG";
    count5++;
  } else if (count5 == 4) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNSIXBLUEABOVE").src = "images/FIVE.JPG";
    document.getElementById("COLUMNSIXMIDDLE").src = "images/SIX.JPG";
    document.getElementById("COLUMNSIXBLUEBELOW").src = "images/SEVEN.JPG";
    count5++;
  } else if (count5 == 5) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNSIXBLUEABOVE").src = "images/SIX.JPG";
    document.getElementById("COLUMNSIXMIDDLE").src = "images/SEVEN.JPG";
    document.getElementById("COLUMNSIXBLUEBELOW").src = "images/EIGHT.JPG";
    count5++;
  } else if (count5 == 6) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNSIXBLUEABOVE").src = "images/SEVEN.JPG";
    document.getElementById("COLUMNSIXMIDDLE").src = "images/EIGHT.JPG";
    document.getElementById("COLUMNSIXBLUEBELOW").src = "images/NINE.JPG";
    count5++;
  } else if (count5 == 7) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNSIXBLUEABOVE").src = "images/EIGHT.JPG";
    document.getElementById("COLUMNSIXMIDDLE").src = "images/NINE.JPG";
    document.getElementById("COLUMNSIXBLUEBELOW").src = "images/ONE.JPG";
    count5++;
  } else if (count5 == 8) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNSIXBLUEABOVE").src = "images/NINE.JPG";
    document.getElementById("COLUMNSIXMIDDLE").src = "images/ONE.JPG";
    document.getElementById("COLUMNSIXBLUEBELOW").src = "images/TWO.JPG";
    count5++;
  } else if (count5 == 9) {
    document.getElementById("combo").play();
    document.getElementById("COLUMNSIXBLUEABOVE").src = "images/ONE.JPG";
    document.getElementById("COLUMNSIXMIDDLE").src = "images/TWO.JPG";
    document.getElementById("COLUMNSIXBLUEBELOW").src = "images/THREE.JPG";
    count5 = 1;
  }
  checkCode();
}

function TRASHGONE1() {
  document.getElementById("TRSH1").classList.add("transparent");
  document.getElementById("trashshuffle").play();
}
function TRASHGONE2() {
  document.getElementById("TRSH2").classList.add("transparent");
  document.getElementById("trashshuffle").play();
}
function TRASHGONE3() {
  document.getElementById("TRSH3").classList.add("transparent");
  document.getElementById("trashshuffle").play();
}

function showLOCKEDBOX() {
  document.getElementById("myLOCKEDBOX").style.display = "flex";
}

function hideLOCKEDBOX() {
  document.getElementById("myLOCKEDBOX").style.display = "none";
}

function showNOTE() {
  document.getElementById("myNOTE").style.display = "flex";
  document.getElementById("leftmodalarrow").style.display = "none";
  document.getElementById("paperopen").play();
}

function hideNOTE() {
  document.getElementById("myNOTE").style.display = "none";
  document.getElementById("leftmodalarrow").style.display = "flex";
  document.getElementById("paperclose").play();
}

function playWipe(direction, callback) {
  const wipe = document.getElementById("screen-wipe");

  // Reset all classes
  wipe.className = "";

  // Activate
  wipe.classList.add("active");

  // Apply direction effect
  wipe.classList.add("wipe-" + direction);

  // After wipe completes (0.4s), run callback
  setTimeout(() => {
    wipe.classList.add("hidden");

    if (callback) callback();

    // Reset after fade-out
    setTimeout(() => {
      wipe.className = "";
    }, 200);
  }, 400);
}

function playCloseAnimation(direction, callback) {
  const cover = document.createElement("div");
  cover.classList.add("gradient-cover");

  if (direction === "left") {
    cover.style.background = "linear-gradient(to right, black, transparent)";
    cover.style.animation = "closeFromLeft 0.3s ease-out";
  }
  if (direction === "right") {
    cover.style.background = "linear-gradient(to left, black, transparent)";
    cover.style.animation = "closeFromRight 0.3s ease-out";
  }
  if (direction === "up") {
    cover.style.background = "linear-gradient(to bottom, black, transparent)";
    cover.style.animation = "closeFromTop 0.3s ease-out";
  }

  document.body.appendChild(cover);

  setTimeout(() => {
    cover.remove();
    callback(); // hide modal AFTER animation finishes
  }, 300);
}
let rightHintTimeout = null;

function showRightSideHint() {
  const box = document.getElementById("SMISNEEDEDRIGHTSCREEN");

  // Clear any previous timers (important)
  if (rightHintTimeout) {
    clearTimeout(rightHintTimeout);
  }

  // Set text
  box.innerText =
    "There’s a box with a lock and a nail here... and more numbers on the walls...\nI wonder how to find the order to put these numbers in...";

  // Styling (safe to do here)
  box.style.display = "block";
  box.style.opacity = "1";
  box.style.textAlign = "center";
  box.style.color = "#ffd27d"; // readable warm color
  box.style.fontSize = "40px";
  box.style.fontFamily = "'Creepster', cursive";

  // Fade out after 20 seconds
  rightHintTimeout = setTimeout(() => {
    box.style.opacity = "0";

    // Fully hide after fade
    setTimeout(() => {
      box.innerText = "";
      box.style.display = "none";
    }, 1000);
  }, 20000);
}
let leftHintTimeout = null;

function showLeftSideHint() {
  const box = document.getElementById("SMISNEEDEDLEFTSCREEN");

  // Clear previous timer if re-entering
  if (leftHintTimeout) {
    clearTimeout(leftHintTimeout);
  }

  box.innerText =
    "More numbers carved into the wall here...a nail...and a note, Maybe this note can help me with the numbers?";

  box.style.display = "block";
  box.style.opacity = "1";
  box.style.textAlign = "center";
  box.style.color = "#ffd27d";
  box.style.fontSize = "40px";
  box.style.fontFamily = "'Creepster', cursive";

  // Fade out after 20 seconds
  leftHintTimeout = setTimeout(() => {
    box.style.opacity = "0";

    setTimeout(() => {
      box.innerText = "";
      box.style.display = "none";
    }, 1000);
  }, 20000);
}

function showModalRight() {
  document.getElementById("moving").play();
  playWipe("right", () => {
    document.getElementById("myModalRight").style.display = "flex";
  });
  showRightSideHint();
}

function hideModalRight() {
  document.getElementById("moving").play();
  playCloseAnimation("right", () => {
    document.getElementById("myModalRight").style.display = "none";
  });
}

function showModalLeft() {
  document.getElementById("moving").play();
  playWipe("left", () => {
    document.getElementById("myModalLeft").style.display = "flex";
  });
  showLeftSideHint();
}

function hideModalLeft() {
  document.getElementById("moving").play();
  playCloseAnimation("left", () => {
    document.getElementById("myModalLeft").style.display = "none";
  });
}

function showModalUP() {
  document.getElementById("movingup").play();
  playWipe("up", () => {
    document.getElementById("myModalUP").style.display = "flex";
  });
}

function hideModalUP() {
  document.getElementById("moving").play();
  playCloseAnimation("up", () => {
    document.getElementById("myModalUP").style.display = "none";
  });
}

function showModal2() {
  // https://www.w3schools.com/howto/howto_css_modals.asp
  // https://www.w3schools.com/css/css_positioning.asp
  // essentially you have a second page that is "position: fixed" filling up the screen, but it is in "display: none" so you can't see it!
  document.getElementById("myModal2").style.display = "flex";
}

function hideModal2() {
  document.getElementById("myModal2").style.display = "none";
}

function nextEscapeRoomPage() {
  window.location.href = "https://7g5n9s.csb.app/";
}

function decay1() {
  document.getElementById("freddy1").src = "images/decayed_freddy.png";
  document.getElementById("screamingsound").play();
}

function decay2() {
  document.getElementById("freddy2").src = "images/decayed_freddy.png";
  document.getElementById("screamingsound").play();
}

function decay3() {
  document.getElementById("freddy3").src = "images/decayed_freddy.png";
  document.getElementById("screamingsound").play();
}

function decay4() {
  document.getElementById("freddy4").src = "images/decayed_freddy.png";
  document.getElementById("screamingsound").play();
}








