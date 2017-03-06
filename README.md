# Blokus
The game *Blokus* in Javascript


Installation
------------

    npm install blokus


Usage
-----

```javascript
const blokus = require('blokus');
```

Start a game

```javascript
// default game

const myBlokus = new blokus();

// custom game (can change board dimensions, player names)

const myBlokus = new blokus({
  height: 20, (optional, default is 20)
  width: 20, (optional, default is 20)
  players: ['Tyler', 'Bob'], (optional, and gets filled up to 4 players if fewer than 4 are specified)
});
```

Read the game state

```javascript
// players

const players = myBlokus.players();

// player fields: ['id', 'name']
// e.g. {id: 0, name: 'Player 0'}

// pieces

const pieces = myBlokus.pieces();

// piece fields: ['id', 'player', 'shape', 'used', 'numCells']
// e.g. {id: 5,
//       player: 0,
//       shape: [['X', 'O', 'O'],
//               ['X', 'O', 'O'],
//               ['X', 'X', 'O']],
//       used: false,
//       numCells: 4,
//       }

// board

const board = myBlokus.board();

// 2D array of cells, each cell is the 'id' of a player or null
// e.g. [[1,    null, 2,    2],
//       [1,    1,    null, 2],
//       [null, 3,    4,    4],
//       [3,    3,    3,    4]]

// turns

const turns = myBlokus.turns();

// turn fields: ['player', 'piece', 'flipped', 'rotations', 'position']
// e.g. {player: 0, piece: 5, flipped: true, rotations: 2, position: {row: 4, col: 7}}
```

Placing a piece

```javascript
myBlokus.place({
  player: 1, // 'id' field of the player
  piece: 2, // 'id' field of the piece
  flipped: false, // (optional) whether or not to horizontally reflect the piece
  rotations: 3, // (optional) how many times to rotate the piece counterclockwise
  position: {row: 0, col: 0}, // the board cell where the top left cell of the piece's 'shape' goes
  probe: false, // (optional) if true then still check the move's validity but don't perform the move
});

// the 'shape' may have extra padding ('O's that aren't really necessary)
// this means the 'position' field of the placement argument may be off the board
// this is fine as long as the piece (the 'X's) are all in valid positions

// if the placement is invalid, 'place' returns an object of the form:
//    {failure: true, message: 'NotDiagonalFromSamePlayer'}
// otherwise, 'place' places the piece on the board and returns an object of form:
//    {success: true, positions: [{row: 3, col: 6}, ...]}
// where 'positions' is a list of cells the placed piece now occupies
```


