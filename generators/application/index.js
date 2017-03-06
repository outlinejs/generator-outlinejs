'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _s = require('underscore.string');

module.exports = Generator.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the stellar ' + chalk.red('outlinejs:application') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'applicationName',
      message: 'What is the name of the new application?',
      validate: function (value) {
        if (value.trim()) {
          return true;
        }
        return false;
      }
    }];

    return this.prompt(prompts).then(function (props) {
      this.applicationName = props.applicationName.trim();
      this.applicationSlug = _s.slugify(this.applicationName);
      this.baseDir = 'project/' + this.applicationSlug + '/';
      this.log(this.applicationSlug);

      done();
    }.bind(this));
  },
  media: function () {
    this.fs.copy(
        this.templatePath('media/fonts/.keep'),
        this.destinationPath(this.baseDir + 'media/fonts/.keep'));
    this.fs.copy(
        this.templatePath('media/images/.keep'),
        this.destinationPath(this.baseDir + 'media/images/.keep'));
  },
  styles: function () {
    this.fs.copy(
        this.templatePath('styles/main.scss'),
        this.destinationPath(this.baseDir + 'styles/main.scss'));
  },
  tests: function () {
    this.fs.copy(
        this.templatePath('tests/test.js'),
        this.destinationPath(this.baseDir + 'tests/test.js'));
  },
  modules: function () {
    this.fs.copyTpl(
        this.templatePath('controllers.js'),
        this.destinationPath(this.baseDir + 'controllers.js'));
    this.fs.copyTpl(
        this.templatePath('middleware.js'),
        this.destinationPath(this.baseDir + 'middleware.js'));
    this.fs.copyTpl(
        this.templatePath('urls.js'),
        this.destinationPath(this.baseDir + 'urls.js'),
        {
          applicationSlug: this.applicationSlug
        });
    this.fs.copyTpl(
        this.templatePath('views.js'),
        this.destinationPath(this.baseDir + 'views.js'),
        {
          applicationName: this.applicationName
        });
  }
});
