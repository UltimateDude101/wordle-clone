let boardEl = document.getElementById('board')

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

let solution;

let guessList = ['codes', 'opens', 'plays', 'plate', 'opooo', 'ooooo']

let currRow = 0
let currCol = 0

let gameIsEnded = false;

onKeyPress = function (event) {
  if (event.defaultPrevented || gameIsEnded || currRow >= 6) return;

  if (event.key === 'Backspace') {
    if (currCol > 0) {
      currCol--;
      boardEl.children[currRow].children[currCol].innerText = '';
    }
  }

  else if (event.key === 'Enter') {
    handleGuess();
  }
  
  else if (event.key.length === 1 && /[a-zA-Z]/.test(event.key) && currCol < 5) {
    let letter = event.key.toUpperCase();

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

const currentSolutionIndex = moment().diff(moment("06/17/2021", "MM-DD-YYYY"), 'days');

console.log(currentSolutionIndex);

Promise.all([fetch('word-list.txt'), fetch('solution-list.txt')]).then(rs => Promise.all(rs.map(r => r.text()))).then(rs => rs.map(r => r.split('\n'))).then(files => {
  guessList = files[0]
  solution = files[1][currentSolutionIndex]
  window.addEventListener("keydown", onKeyPress, true);
})