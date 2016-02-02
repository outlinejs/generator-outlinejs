'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _s = require('underscore.string');

module.exports = yeoman.generators.Base.extend({
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

    this.prompt(prompts, function (props) {
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
  modules: function () {
    this.fs.copyTpl(
        this.templatePath('controllers.js'),
        this.destinationPath(this.baseDir + 'controllers.js'));
    this.fs.copyTpl(
        this.templatePath('managers.js'),
        this.destinationPath(this.baseDir + 'managers.js'));
    this.fs.copyTpl(
        this.templatePath('middleware.js'),
        this.destinationPath(this.baseDir + 'middleware.js'));
    this.fs.copyTpl(
        this.templatePath('models.js'),
        this.destinationPath(this.baseDir + 'models.js'));
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