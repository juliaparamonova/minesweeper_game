startGame(8, 8, 15);

function startGame(WIDTH, HEIGHT, BOMBS_COUNT) {
  const field = document.querySelector('.field');
  const cellsCount = WIDTH * HEIGHT;
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

  function open(row, column) {
    const index = row * WIDTH + column;
    const cell = cells[index];
    cell.innerHTML = isBomb(row, column) ? 'X' : getCount(row, column);
    cell.disabled = true;
  }

  function isBomb(row, column) {
    const index = row * WIDTH + column;
    return bombs.includes(index);
  }
}
