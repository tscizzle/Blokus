const chai = require('chai');
const assert = chai.assert;
const _ = require('lodash');

const blokusGame = require('../game');


describe('instantiating a game', function() {
  it('should make a game', function() {
    const bg = blokusGame();

    assert.isOk(bg);
  });
});
