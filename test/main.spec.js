var fs = require('fs');
var path = require('path');
var assert = require('assert');
var TemplateFilter = require('../index');

describe('broccoli-ember-hbs-template-compiler', function() {
  function assertSameAsFileContent(string, expectedPath) {
    var expected = fs.readFileSync(path.resolve(__dirname, expectedPath)).toString();
    assert.equal(string, expected);
  }

  it('it sets options', function() {
    var filter = new TemplateFilter('templates', {module: true});

    assert(filter.options.module);
  });

  it('returns a precompiled global template', function() {
    var filter = new TemplateFilter('templates');
    var template = filter.processString('foo', './templates/foo.hbs');

    assertSameAsFileContent(template, 'expected-global.js');
  });

  it('returns a precompiled module template', function() {
    var filter = new TemplateFilter('templates', {module: true});
    var template = filter.processString('foo', './templates/foo.hbs');

    assertSameAsFileContent(template, 'expected-module.js');
  });

  it('returns a precompiled commonjs template', function() {
    var filter = new TemplateFilter('templates', {commonjs: true});
    var template = filter.processString('foo', './templates/foo.hbs');

    assertSameAsFileContent(template, 'expected-commonjs.js');
  });
});
