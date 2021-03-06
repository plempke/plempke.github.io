//Initial Variable declaration and establishes an event listener
//for move selections
const rows = 10;
const columns = 10;
let mines, remaining, revealed;
let status = document.getElementById('status');
status.addEventListener('click', init)

//Initail variables for gameboard, pictures, and tiles
let board = new Array(rows);
let picture = new Array(rows);
let tile = new Array(rows);
for (let i = 0; i < board.length; i++) {
  board[i] = new Array(columns);
  picture[i] = new Array(columns);
  tile[i] = new Array(columns)
}

init();

//checks our rows and columns for a proper game board
function check(row, column) {
  if (column >= 0 && row >= 0 && column < columns && row < rows)
    return board[row][column];
}


//intializes our game for the user to play by creating a game Board
//and applying the proper styling that we need for a suitable game.
//also used to format where the board is on the page 
function init() {
  mines = 10;
  remaining = mines;
  revealed = 0;
  status.innerHTML = ('Click on the tiles to reveal them');
  for (let row = 0; row < rows; row++)
    for (let column = 0; column < columns; column++) {
      let index = row * columns + column;
      tile[row][column] = document.createElement('img');
      tile[row][column].src = 'hidden.png';
      tile[row][column].style = 'position:absolute;height:40px; width: 40px';
      tile[row][column].style.top = 350 + row * 40;
      tile[row][column].style.left = 770 + column * 40;
      tile[row][column].addEventListener('mousedown', click);
      tile[row][column].id = index;
      document.body.appendChild(tile[row][column]);
      picture[row][column] = 'hidden';
      board[row][column] = '';
    }


  //while our placed amount of items (guess, mine or flag, or program will
  //recognize the amount of open spaces and increment placed to know how many
  //spaces remain to be discovered and how many occupy a mine.
  let placed = 0;
  do {
    let column = Math.floor(Math.random() * columns);
    let row = Math.floor(Math.random() * rows);

    if (board[row][column] != 'mine') {
      board[row][column] = 'mine';
      placed++;
    }
  } while (placed < mines);
  //checks the row and column to see what spaces are open/taken
  for (let column = 0; column < columns; column++)
    for (let row = 0; row < rows; row++) {
      if (check(row, column) != 'mine') {
        board[row][column] =
          ((check(row + 1, column) == 'mine') | 0) +
          ((check(row + 1, column - 1) == 'mine') | 0) +
          ((check(row + 1, column + 1) == 'mine') | 0) +
          ((check(row - 1, column) == 'mine') | 0) +
          ((check(row - 1, column - 1) == 'mine') | 0) +
          ((check(row - 1, column + 1) == 'mine') | 0) +
          ((check(row, column - 1) == 'mine') | 0) +
          ((check(row, column + 1) == 'mine') | 0);
      }
    }
}

//envokes a function for the event listener we created at the top.
function click(event) {
  let source = event.target;
  let id = source.id;
  let row = Math.floor(id / columns);
  let column = id % columns;

  //creates a swith with various cases for our game logic in minesweeper, being that
  //you have the option to palce a flag, question mark, or to unerath a hidden space.
  if (event.which == 3) {
    switch (picture[row][column]) {
      case 'hidden':
        tile[row][column].src = 'flag.png';
        remaining--;
        picture[row][column] = 'flag';
        break;
      case 'flag':
        tile[row][column].src = 'question.png';
        remaining++;
        picture[row][column] = 'question';
        break;
      case 'question':
        tile[row][column].src = 'hidden.png';
        picture[row][column] = 'hidden';
        break;
    }
    event.preventDefault();
  }
  //reports the status of how many mines remain in the game.
  status.innerHTML = 'Mines remaining: ' + remaining;

  //if the item selected is a mine then the system will take noe of that
  //however if a mine is improperly selected then it will track that as well
  //if you select a mine then it will report to you that the game is over
  if (event.which == 1 && picture[row][column] != 'flag') {
    if (board[row][column] == 'mine') {
      for (let row = 0; row < rows; row++)
        for (let column = 0; column < columns; column++) {
          if (board[row][column] == 'mine') {
            tile[row][column].src = 'mine.png';
          }
          if (board[row][column] != 'mine' && picture[row][column] == 'flag') {
            tile[row][column].src = 'misplaced.png';
          }
        }
      status.innerHTML = 'GAME OVER!<br>Click here to restart';
    } else
    if (picture[row][column] == 'hidden') reveal(row, column);
  }
  //if you reveal all the rows in columns, minus the mines, then the system will report
  //to you that you won!
  if (revealed == rows * columns - mines)
    status.innerHTML = 'YOU WIN!<br><br>Click here to restart';
}
//reveal function to determine whether or not a mine has been selected and is used in
//the previous functions
function reveal(row, column) {
  tile[row][column].src = board[row][column] + '.png';
  if (board[row][column] != 'mine' && picture[row][column] == 'hidden')
    revealed++;
  picture[row][column] = board[row][column];

  if (board[row][column] == 0) {
    if (column > 0 && picture[row][column - 1] == 'hidden') reveal(row, column - 1);
    if (column < (columns - 1) && picture[row][+column + 1] == 'hidden') reveal(row, +column + 1);
    if (row < (rows - 1) && picture[+row + 1][column] == 'hidden') reveal(+row + 1, column);
    if (row > 0 && picture[row - 1][column] == 'hidden') reveal(row - 1, column);
    if (column > 0 && row > 0 && picture[row - 1][column - 1] == 'hidden') reveal(row - 1, column - 1);
    if (column > 0 && row < (rows - 1) && picture[+row + 1][column - 1] == 'hidden') reveal(+row + 1, column - 1);
    if (column < (columns - 1) && row < (rows - 1) && picture[+row + 1][+column + 1] == 'hidden') reveal(+row + 1, +column + 1);
    if (column < (columns - 1) && row > 0 && picture[row - 1][+column + 1] == 'hidden') reveal(row - 1, +column + 1);
  }
}
