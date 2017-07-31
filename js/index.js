var count = document.getElementById('count');
var startBtn = document.getElementById('start');
var strictBtn = document.getElementById('strict');
var resetBtn = document.getElementById('reset');
var modal = document.getElementById('modal');
var modalMessage = document.getElementById('modalMessage');
var quadrants = document.getElementsByClassName('quadrant');

var gameStarted = false;
var strictMode = false;
var correctCount = 0;
var counter = 0;

var soundAddrs = ['/assets/kickbox.mp3', '/assets/hhbox.mp3', '/assets/snarebox.mp3', '/assets/openhat.mp3'];

var gameOn = false;
var strictOn = false;

//Store Simon's sequence of actions in this array
var simonSequence = [];
var userSequence = [];

function getRand() {
  var test = Math.floor(Math.random() * (4)) + 1;
  console.log(test);
  return test;
}

function newMove() {
  var quad = getRand();
  simonSequence.push(quad - 1);
}

var audio = new Audio();

function playAudio(index) {
  audio.src = (soundAddrs[index]);
  audio.play();
}

function darkenQuad(index) {
  quadrants[index].className += ' played';
  setTimeout(function(){
    quadrants[index].classList.remove('played'); }, 500);
}

function simonSays(i) {
  setTimeout(function(){ 
      var quadIndex = simonSequence[i];
      playAudio(quadIndex);
      darkenQuad(quadIndex);
      userSequence = [];  //clears userSeq so user has to click all quads again
  }, i * 800);
}

function compareSequences() {
  console.log('compared');
  for (var i = 0; i < userSequence.length; i += 1) {
    if (simonSequence[i] !== userSequence[i]) {
      return false;
    }   
  }
  return true;
}

function updateCount(inc) {
  correctCount += inc;
  count.innerHTML = correctCount;
}

function reset() {
  simonSequence = [];
  userSequence = [];
  gameStarted = false;
  correctCount = 0;
  count.innerHTML = 0;
}

function retry() {
  userSequence = [];
  modalMessage.innerHTML = 'Try Again';
  modal.classList.remove('hidden');
  setTimeout(function() {
    modal.classList.add('hidden');
    strictBtn.classList.remove('on');
    for (var i = 0; i < simonSequence.length; i += 1) {
      simonSays(i);
    }
  }, 1200);
}

function makeQuadsClickable(quad, index) {
  quad.addEventListener('click', function() {
    if (userSequence.length < simonSequence.length) {
      userSequence.push(index);
      playAudio(index);
      darkenQuad(index);
      //compare partial sequence to simonsequence

        //compare sequences  //todo make function
        var compare = compareSequences();
        if (compare === false) {
          if (strictMode) {
            reset();
            modalMessage.innerHTML = 'Lose';
            modal.classList.remove('hidden');
            setTimeout(function() {
              modal.classList.add('hidden');
              strictBtn.classList.remove('on');
            }, 1200);
          }
          else {
            retry();
          }
        }
        else {
          if (userSequence.length === simonSequence.length) {
            updateCount(1);
            setTimeout(simonTurn, 1500);
          }
        }
      if (correctCount === 8) {
        modal.classList.remove('hidden');
        modalMessage.innerHTML = 'Win!';
        gameStarted = false;
        setTimeout(function() {
          modal.classList.add('hidden');
          gameStarted = true;
          simonTurn();
        }, 5000);
      }
    }
  });
}

for (var i = 0; i < 4; i += 1) {
  makeQuadsClickable(quadrants[i], i);
}

function simonTurn() {
  if (gameStarted === true) {
    newMove();  //todo only add new move after verrifying that userSequence matches simonSequence
    for (var i = 0; i < simonSequence.length; i += 1) {
      simonSays(i);
    }
  }
}

startBtn.addEventListener('click', function() {
  if (gameStarted === false) {
    gameStarted = true;
    setTimeout(simonTurn, 1000);
  }
});

resetBtn.addEventListener('click', function() {
  reset();
});

strictBtn.addEventListener('click', function() {
  if (!gameStarted) {
    strictMode = true;
    strictBtn.classList.add('on');
  }
})