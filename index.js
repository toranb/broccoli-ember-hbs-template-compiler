var path = require('path');
var Filter = require('broccoli-persistent-filter');
var jsStringEscape = require('js-string-escape');
var compiler = require('ember-template-compiler');

module.exports = TemplateCompiler;
TemplateCompiler.prototype = Object.create(Filter.prototype);
TemplateCompiler.prototype.constructor = TemplateCompiler;
function TemplateCompiler (inputTree, _options) {
  var options = _options || {};
  options.persist = true;
  if (!(this instanceof TemplateCompiler)) {
    return new TemplateCompiler(inputTree, options);
  }
  Filter.call(this, inputTree, options);
  this.options = options;
}

TemplateCompiler.prototype.extensions = ['hbs', 'handlebars'];
TemplateCompiler.prototype.targetExtension = 'js';
TemplateCompiler.prototype.baseDir = function() {
  return __dirname;
};

TemplateCompiler.prototype.processString = function (string, relativePath) {
  var extensionRegex = /.handlebars|.hbs/gi;
  var filename = relativePath.toString().split('templates' + path.sep).reverse()[0].replace(extensionRegex, '');
  var input = compiler.precompile(string, false);
  var template = "Ember.Handlebars.template(" + input + ");\n";
  if (this.options.module === true) {
    return "import Ember from 'ember';\nexport default " + template;
  } else if (this.options.commonjs === true) {
    return "var Ember = require('ember');\nmodule.exports = " + template;
  } else {
    return "Ember.TEMPLATES['" + filename + "'] = " + template;
  }
};
