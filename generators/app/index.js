'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../../package.json');
  },
  prompting: function () {
    var done = this.async();
    this.appSlug = _s.slugify(this.appname);

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the terrific ' + chalk.red('outlinejs') + ' generator!'
    ));

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'Bootstrap',
        value: 'includeBootstrap',
        checked: true
      }, {
        name: 'Modernizr',
        value: 'includeModernizr',
        checked: false
      }]
    }];

    this.prompt(prompts, function (props) {
      var features = props.features;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      };

      this.includeBootstrap = hasFeature('includeBootstrap');
      this.includeModernizr = hasFeature('includeModernizr');

      done();
    }.bind(this));
  },
  writing: {
    packageJSON: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          includeBootstrap: this.includeBootstrap,
          includeModernizr: this.includeModernizr
        }
      );
    },
    gulpfile: function () {
      this.fs.copyTpl(
        this.templatePath('gulpfile.babel.js'),
        this.destinationPath('gulpfile.babel.js'),
        {
          date: (new Date).toISOString().split('T')[0],
          name: this.pkg.name,
          version: this.pkg.version
        }
      );
    },
    git: function () {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore'));

      this.fs.copy(
        this.templatePath('gitattributes'),
        this.destinationPath('.gitattributes'));
    },
    bower: function () {
      this.fs.copy(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc')
      );
      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        {
          appSlug: this.appSlug
        }
      );
      mkdirp('bower_components');
    },
    eslint: function () {
      this.fs.copy(
        this.templatePath('eslintrc'),
        this.destinationPath('.eslintrc')
      );
    },
    babel: function () {
      this.fs.copy(
        this.templatePath('babelrc'),
        this.destinationPath('.babelrc')
      );
    },
    project: function () {
      var bsPath;

      this.fs.copyTpl(
        this.templatePath('app/index.html'),
        this.destinationPath('app/index.html'),
        {
          appname: this.appname,
          includeBootstrap: this.includeBootstrap,
          includeModernizr: this.includeModernizr
        }
      );
      this.fs.copy(
        this.templatePath('app/urls.js'),
        this.destinationPath('app/urls.js')
      );
      this.fs.copy(
        this.templatePath('app/settings.js'),
        this.destinationPath('app/settings.js')
      );
      this.fs.copy(
        this.templatePath('app/main.js'),
        this.destinationPath('app/main.js')
      );
    },
    alloApp: function () {
      this.fs.copy(
        this.templatePath('app/allo-app/controllers.js'),
        this.destinationPath('app/allo-app/controllers.js')
      );
      this.fs.copy(
        this.templatePath('app/allo-app/middleware.js'),
        this.destinationPath('app/allo-app/middleware.js')
      );
      this.fs.copy(
        this.templatePath('app/allo-app/urls.js'),
        this.destinationPath('app/allo-app/urls.js')
      );
      this.fs.copyTpl(
        this.templatePath('app/allo-app/views.js'),
        this.destinationPath('app/allo-app/views.js'),
        {
          appname: this.appname,
          includeBootstrap: this.includeBootstrap,
          includeModernizr: this.includeModernizr
        }
      );
      if (this.includeBootstrap) {
        this.fs.copy(
          this.templatePath('app/allo-app/styles/main.scss'),
          this.destinationPath('app/allo-app/styles/main.scss')
        );
      } else {
        mkdirp('app/allo-app/styles');
      }
    },
    alloAppMedia: function () {
      mkdirp('app/allo-app/media/fonts');
      this.fs.copy(
        this.templatePath('app/allo-app/media/images/yeoman.png'),
        this.destinationPath('app/allo-app/media/images/yeoman.png')
      );
    }
  },

  install: function () {
    this.installDependencies();
  }
});
