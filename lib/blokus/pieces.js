'use strict';

var _ = require('lodash');

var pieceCollection = function pieceCollection() {
  var pieces = [{
    numCells: 1,
    shape: [['X']]
  }, {
    numCells: 2,
    shape: [['X'], ['X']]
  }, {
    numCells: 3,
    shape: [['X'], ['X'], ['X']]
  }, {
    numCells: 3,
    shape: [['X', 'O'], ['X', 'X']]
  }, {
    numCells: 4,
    shape: [['X'], ['X'], ['X'], ['X']]
  }, {
    numCells: 4,
    shape: [['X', 'O'], ['X', 'O'], ['X', 'X']]
  }, {
    numCells: 4,
    shape: [['X', 'O'], ['X', 'X'], ['X', 'O']]
  }, {
    numCells: 4,
    shape: [['X', 'O'], ['X', 'X'], ['O', 'X']]
  }, {
    numCells: 4,
    shape: [['X', 'X'], ['X', 'X']]
  }, {
    numCells: 5,
    shape: [['X'], ['X'], ['X'], ['X'], ['X']]
  }, {
    numCells: 5,
    shape: [['X', 'O'], ['X', 'O'], ['X', 'O'], ['X', 'X']]
  }, {
    numCells: 5,
    shape: [['X', 'O'], ['X', 'O'], ['X', 'X'], ['X', 'O']]
  }, {
    numCells: 5,
    shape: [['X', 'O'], ['X', 'O'], ['X', 'X'], ['O', 'X']]
  }, {
    numCells: 5,
    shape: [['X', 'X', 'O'], ['O', 'X', 'X'], ['O', 'X', 'O']]
  }, {
    numCells: 5,
    shape: [['O', 'X', 'O'], ['X', 'X', 'X'], ['O', 'X', 'O']]
  }, {
    numCells: 5,
    shape: [['X', 'O', 'O'], ['X', 'X', 'O'], ['O', 'X', 'X']]
  }, {
    numCells: 5,
    shape: [['X', 'O', 'O'], ['X', 'O', 'O'], ['X', 'X', 'X']]
  }, {
    numCells: 5,
    shape: [['X', 'O', 'O'], ['X', 'X', 'X'], ['X', 'O', 'O']]
  }, {
    numCells: 5,
    shape: [['X', 'X'], ['X', 'X'], ['X', 'O']]
  }, {
    numCells: 5,
    shape: [['X', 'X'], ['X', 'O'], ['X', 'X']]
  }, {
    numCells: 5,
    shape: [['X', 'X', 'O'], ['O', 'X', 'O'], ['O', 'X', 'X']]
  }];
  return pieces;
};

module.exports = {
  pieceCollection: pieceCollection
};