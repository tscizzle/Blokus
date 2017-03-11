const chai = require('chai');
const assert = chai.assert;

const index = require('../index');


describe('index.js', function() {

  it('should load', function() {
    const { game, blokus } = index;

    assert.isOk(game);
    assert.isOk(blokus);
  });

});
