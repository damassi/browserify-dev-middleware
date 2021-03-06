var express = require('express')
  , request = require('superagent');

var app = express()
app.use(require('../')({
  src: __dirname + '/assets',
  transforms: [require('caching-coffeeify')]
}));
app.get('/moobar.js', function(req, res){
  res.send('Fell through')
});

describe('browserifyMiddleware', function() {

  var server;

  before(function(done) {
    server = app.listen(1234, done);
  });

  after(function() {
    server.close();
  });

  it('serves browserify files from the specified directory', function(done) {
    request.get('http://localhost:1234/foo.js').end(function(err, res){
      res.text.should.containEql('function(require,module,exports){');
      done()
    });
  });

  it('serves up some javascript that throws a warning when', function(done) {
    // TODO: Test this properly
    done()
  });

  it('compiles coffeescript too', function(done) {
    request.get('http://localhost:1234/coffee.js').end(function(err, res){
      res.text.should.containEql('MOO BAR TO THE BAZ');
      done()
    });
  });

  it('falls through if the asset doesnt exist', function(done) {
    request.get('http://localhost:1234/moobar.js').end(function(err, res){
      res.text.should.containEql('Fell through');
      done()
    });
  });
});
