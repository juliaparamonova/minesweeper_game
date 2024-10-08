document.getElementById('startButton').addEventListener('click', () => {
  const bombsCount = parseInt(document.getElementById('bombsCount').value, 10);

  if (bombsCount > 32) {
    alert('The number of bombs cannot exceed 32');
    document.getElementById('bombsCount').value = 32;
    return;
  }
  startGame(8, 8, bombsCount);
});

function startGame(WIDTH, HEIGHT, BOMBS_COUNT) {
  const field = document.querySelector('.field');
  if (!field) {
    console.error('Element with class "field" not found');
    return;
  }

  const cellsCount = WIDTH * HEIGHT;
  let closedCount = cellsCount;

  field.innerHTML = '<button></button>'.repeat(cellsCount);
  const cells = [...field.children];

  const bombs = [...Array(cellsCount).keys()]
    .sort(() => Math.random() - 0.5)
    .slice(0, BOMBS_COUNT);

  field.addEventListener('click', event => {
    if (event.target.tagName !== 'BUTTON') {
      return;
    }

    const index = cells.indexOf(event.target);
    const column = index % WIDTH;
    const row = Math.floor(index / WIDTH);
    open(row, column);
  });

  field.addEventListener('contextmenu', event => {
    event.preventDefault();
    if (event.target.tagName !== 'BUTTON') {
      return;
    }

    const cell = event.target;
    if (cell.classList.contains('flag')) {
      cell.classList.remove('flag');
      cell.textContent = '';
    } else {
      cell.classList.add('flag');
      cell.textContent = '🚩';
    }
  });

  function isValid(row, column) {
    return row >= 0 && row < HEIGHT && column >= 0 && column < WIDTH;
  }

  function getCount(row, column) {
    let count = 0;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (isBomb(row + y, column + x)) {
          count++;
        }
      }
    }
    return count;
  }

  function openAllBombs() {
    bombs.forEach(index => {
      const cell = cells[index];
      if (cell.innerHTML !== 'X') {
        cell.innerHTML = 'X';
        cell.disabled = true;
      }
    });
  }

  let gameOver = false;

  function open(row, column) {
    if (gameOver || !isValid(row, column)) return;
    const index = row * WIDTH + column;
    const cell = cells[index];
    if (cell.disabled === true) return;

    cell.disabled = true;
    closedCount--;

    if (isBomb(row, column)) {
      cell.innerHTML = 'X';
      if (!gameOver) {
        alert('You lost! Try again.');
        openAllBombs();
        gameOver = true;
      }
    } else {
      const count = getCount(row, column);
      cell.innerHTML = count !== 0 ? count : '';
      if (count === 0) {
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            open(row + y, column + x);
          }
        }
      }
    }

    if (closedCount === BOMBS_COUNT && !gameOver) {
      alert('You won!');
      gameOver = true;
    }
  }

  function isBomb(row, column) {
    if (!isValid(row, column)) return false;
    const index = row * WIDTH + column;
    return bombs.includes(index);
  }
}
