const chai = require('chai');
const assert = chai.assert;

const index = require('../lib/index');


describe('index.js', function() {

  it('should load', function() {
    const { transform, blokus, game } = index;

    assert.isOk(transform);
    assert.isOk(blokus);
    assert.isOk(game);
  });

});
