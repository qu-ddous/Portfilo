const { PLAYER_X, PLAYER_O, STATUS_PLAYING, STATUS_WON, STATUS_DRAW } = require('../config/constants');

class GameService {
  static createEmptyBoard(gridSize) {
    return Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
  }

  static checkWinner(board, gridSize) {
    // Check rows
    for (let i = 0; i < gridSize; i++) {
      if (board[i][0] && board[i].every(cell => cell === board[i][0])) {
        return board[i][0];
      }
    }

    // Check columns
    for (let j = 0; j < gridSize; j++) {
      const column = board.map(row => row[j]);
      if (column[0] && column.every(cell => cell === column[0])) {
        return column[0];
      }
    }

    // Check main diagonal
    const mainDiag = board.map((row, i) => row[i]);
    if (mainDiag[0] && mainDiag.every(cell => cell === mainDiag[0])) {
      return mainDiag[0];
    }

    // Check anti-diagonal
    const antiDiag = board.map((row, i) => row[gridSize - 1 - i]);
    if (antiDiag[0] && antiDiag.every(cell => cell === antiDiag[0])) {
      return antiDiag[0];
    }

    return null;
  }

  static getWinningLine(board, gridSize) {
    // Check rows
    for (let i = 0; i < gridSize; i++) {
      if (board[i][0] && board[i].every(cell => cell === board[i][0])) {
        return Array.from({ length: gridSize }, (_, j) => i * gridSize + j);
      }
    }

    // Check columns
    for (let j = 0; j < gridSize; j++) {
      const column = board.map(row => row[j]);
      if (column[0] && column.every(cell => cell === column[0])) {
        return Array.from({ length: gridSize }, (_, i) => i * gridSize + j);
      }
    }

    // Check main diagonal
    const mainDiag = board.map((row, i) => row[i]);
    if (mainDiag[0] && mainDiag.every(cell => cell === mainDiag[0])) {
      return Array.from({ length: gridSize }, (_, i) => i * gridSize + i);
    }

    // Check anti-diagonal
    const antiDiag = board.map((row, i) => row[gridSize - 1 - i]);
    if (antiDiag[0] && antiDiag.every(cell => cell === antiDiag[0])) {
      return Array.from({ length: gridSize }, (_, i) => i * gridSize + (gridSize - 1 - i));
    }

    return null;
  }

  static isBoardFull(board) {
    return board.every(row => row.every(cell => cell !== ''));
  }

  static isValidMove(board, row, col) {
    if (row < 0 || row >= board.length) return false;
    if (col < 0 || col >= board[0].length) return false;
    return board[row][col] === '';
  }

  static getAvailableMoves(board) {
    const moves = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === '') {
          moves.push({ row: i, col: j });
        }
      }
    }
    return moves;
  }
}

module.exports = GameService;
