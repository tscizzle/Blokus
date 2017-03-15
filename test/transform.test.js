const chai = require('chai');
const assert = chai.assert;
const _ = require('lodash');

const transform = { flip, rotate } = require('../blokus/transform');


describe('transform.js', function() {

  describe('flipping a shape', function() {

    it('should be able to flip a shape', function() {
      const shape2x2 = [['X'],
                        ['X']];
      const shape3x3 = [['X', 'O'],
                        ['X', 'X'],
                        ['X', 'O']];
      const flippedShape2x2 = flip(shape2x2);
      const flippedShape3x3 = flip(shape3x3);

      assert.deepEqual(flippedShape2x2, [['X'],
                                         ['X']]);
      assert.deepEqual(flippedShape3x3, [['O', 'X'],
                                         ['X', 'X'],
                                         ['O', 'X']]);
    });

  });

  describe('rotating a shape', function() {

    it('should be able to rotate a shape', function() {
      const shape2x2 = [['X'],
                        ['X']];
      const shape3x3 = [['X', 'X'],
                        ['X', 'X'],
                        ['X', 'O']];
      const rotatedShape2x2 = rotate(shape2x2, 3);
      const rotatedShape3x3 = rotate(shape3x3, 2);

      assert.deepEqual(rotatedShape2x2, [['X', 'X']]);
      assert.deepEqual(rotatedShape3x3, [['O', 'X'],
                                         ['X', 'X'],
                                         ['X', 'X']]);
    });

  });

});
