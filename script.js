const boardEl = document.getElementById('board')

const keyboardEl = document.getElementById('keyboard')

let row;
for (let i = 0; i < 6; i++) {
    row = document.createElement('tr')
    row.classList.add('boardRow')
    for (let j = 0; j < 5; j++) {
        el = document.createElement('td')
        el.classList.add('boardEl')
        row.appendChild(el)
    }
    boardEl.appendChild(row)
}

const keys = ["qwertyuiop", "asdfghjkl⌫", "zxcvbnm↵"]

for (let i = 0; i < 3; i++) {
    row = document.createElement('div')
    row.classList.add('keyboardRow')
    for (let j = 0; j < keys[i].length; j++) {
        el = document.createElement('button')
        el.classList.add('keyboardEl')
        el.innerText = keys[i][j]
        el.addEventListener('click', onButtonPress);
        row.appendChild(el)
    }
    keyboardEl.appendChild(row)
}

function onButtonPress(event) {
  if (event.defaultPrevented) return;

  let s = this.innerText;
  if (s == '⌫') s = 'Backspace';
  else if (s == '↵') s = 'Enter';

  onInput(s);

  event.preventDefault();
}


let solution;

let guessList = ['codes', 'opens', 'plays', 'plate', 'opooo', 'ooooo']

let currRow = 0
let currCol = 0

let gameIsEnded = false;

function onKeyPress (event) {
  if (event.defaultPrevented) return;

  onInput(event.key);

  event.preventDefault();
}

function onInput(key) {
  if (gameIsEnded || currRow >= 6) return;

  else if (key === 'Enter') handleGuess();

  else if (key === 'Backspace') {
    if (currCol > 0) {
      currCol--;
      boardEl.children[currRow].children[currCol].innerText = '';
    }
  }

  else if (key.length === 1 && /[a-zA-Z]/.test(key) && currCol < 5) {
    let letter = key.toUpperCase();

    boardEl.children[currRow].children[currCol].innerText = letter;
    currCol++;
  }

  function handleGuess() {
    if (currCol < 5) return;
    
    const word = Array.from(boardEl.children[currRow].children).map(a => a.innerText).join('').toLowerCase();

    if (!guessList.includes(word)) {
      return;
    }

    const statuses = ['incorrect', 'incorrect', 'incorrect', 'incorrect', 'incorrect'];

    const letterCount = new Map();

    let allCorrect = true;

    for (let i = 0; i < word.length; i++) {
      if (solution[i] === word[i]) {
        statuses[i] = 'correct';
        continue;
      }

      allCorrect = false;

      const prevLetterCount = letterCount.get(solution[i]) ?? 0;

      letterCount.set(solution[i], prevLetterCount + 1);
    }

    gameIsEnded = allCorrect;

    for (let i = 0; i < word.length; i++) {
      if (statuses[i] === 'correct') continue;

      const prevLetterCount = letterCount.get(word[i]) ?? 0; 

      if (prevLetterCount <= 0) {
        letterCount.delete(word[i])
      }
      else {
        letterCount.set(word[i], prevLetterCount - 1);
        statuses[i] = 'misplaced';
      }
    }

    for (let i = 0; i < 5; i++) {
      boardEl.children[currRow].children[i].classList.add(statuses[i]);
    }
    
    currCol = 0;
    currRow ++;
  }
}

window.addEventListener("keydown", onKeyPress, true);

Promise.all([fetch('word-list.txt'), fetch('solution-list.txt')]).then(rs => Promise.all(rs.map(r => r.text()))).then(rs => rs.map(r => r.split('\n'))).then(files => {
  guessList = files[0]
  solution = files[1][currentSolutionIndex]
})