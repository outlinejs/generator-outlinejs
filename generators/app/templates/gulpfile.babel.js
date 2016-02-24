// generated on <%= date %> using <%= name %> <%= version %>
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import watchify from 'watchify';
import browserify from 'browserify';
import {stream as wiredep} from 'wiredep';
import vinylSource from 'vinyl-source-stream';
import vinylBuffer from 'vinyl-buffer';
import gettext from 'gulp-gettext-parser';
import po2json from 'gulp-po2json';
import plumber from 'gulp-plumber'; //why not using $? Easy: because for some reason is not loaded by gulp load plugins
import eslint from 'gulp-eslint'; //why not using $? Easy: because for some reason is not loaded by gulp load plugins
import useref from 'gulp-useref'; //why not using $? Easy: because for some reason is not loaded by gulp load plugins
import uglify from 'gulp-uglify'; //why not using $? Easy: because for some reason is not loaded by gulp load plugins
import cssnano from 'gulp-cssnano'; //why not using $? Easy: because for some reason is not loaded by gulp load plugins
import htmlmin from 'gulp-htmlmin'; //why not using $? Easy: because for some reason is not loaded by gulp load plugins
import gsize from 'gulp-size'; //why not using $? Easy: because for some reason is not loaded by gulp load plugins
import mocaccino from 'mocaccino';
import glob from 'glob';
import phantomic from 'phantomic';
import nodemon from 'gulp-nodemon';
import merge2 from 'merge2';
import httpProxy from 'http-proxy';
import nconf from 'nconf';
import fs from 'fs';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

function getBrowserify(debug = false, forNode = false, watch = false) {
  var b = browserify(
    Object.assign({}, watch ? watchify.args : {}, {
      entries: ['./project/main.js'],
      debug: debug
    })
  );
  b.on('log', $.util.log);
  if (forNode) {
    b = b
      .require('./.tmp/main.html', {expose: '__main.html'})
      .exclude('http')
      .exclude('https')
      .exclude('url')
      .exclude('fs')
      .exclude('querystring')
      .exclude('buffer')
      .exclude('console-browserify');
  }
  b = b.exclude('__main.html');
  //include env
  b = b.require('./.tmp/env.json', {expose: '__outlineEnv'});
  if (watch) {
    b = watchify(b);
  }
  return b;
}

function browserifyBundle(b, clientMode = true) {
  var bundle = b.bundle()
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(vinylSource('main.js'))
    .pipe(vinylBuffer());
  if (clientMode) {
    bundle = bundle
      .pipe($.sourcemaps.init({loadMaps: true}))
      .pipe($.sourcemaps.write('./')) // writes .map file
      .pipe(gulp.dest('./.tmp/scripts'))
      .on('end', function () {
        reload();
      });
  } else {
    bundle = bundle
      .pipe(gulp.dest('./.tmp/node-scripts'));
  }
  return bundle;
}

gulp.task('js:build', ['node-html', 'env'], () => {
  var clientBundle = browserifyBundle(getBrowserify());
  var serverBundle = browserifyBundle(getBrowserify(false, true, false), false);
  return merge2(clientBundle, serverBundle);
});

gulp.task('js:watch', ['node-html', 'env'], () => {
  var bc = getBrowserify(true, false, true);
  var bs = getBrowserify(true, true, true);
  var clientBundle = browserifyBundle(bc);
  var serverBundle = browserifyBundle(bs, false);
  bc.on('update', () => {
    browserifyBundle(bc);
  });
  bs.on('update', () => {
    browserifyBundle(bs, false);
  });
  return merge2(clientBundle, serverBundle);
});

gulp.task('pot', () => {
  return gulp.src('project/**/*.js')
    .pipe(gettext({}))
    .pipe($.rename('template.pot'))
    .pipe(gulp.dest('locale/'));
});

gulp.task('locale-build', () => {
  return gulp.src('locale/*.po')
    .pipe(po2json({ format: 'jed1.x' }))
    .pipe(gulp.dest('.tmp/locale'))
    .pipe(gulp.dest('dist/locale'));
});

gulp.task('styles', () => {
  return gulp.src('project/**/styles/*.scss')
    .pipe(plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.postcss([
      require('autoprefixer')({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']})
    ]))
    .pipe($.concat('main.css'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe(eslint(options))
      .pipe(eslint.format())
      .pipe($.if(!browserSync.active, eslint.failAfterError()));
  };
}

gulp.task('lint', lint('project/**/*.js'));
gulp.task('lint:test', lint('project/**/tests/*.js', {
  env: {
    mocha: true
  }
}));

gulp.task('html', ['js:build', 'styles'], () => {
  return gulp.src('project/*.html')
    .pipe(useref({searchPath: ['.tmp', '.']}))
    .pipe($.if('*.js', uglify()))
    .pipe($.if('*.css', cssnano()))
    .pipe($.if('*.html', htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('node-app', ['js:build'], () => {
  return gulp.src('.tmp/node-scripts/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/node-scripts'));
});

gulp.task('node-html', () => {
  return gulp.src('project/main.html')
    .pipe(useref({searchPath: ['.tmp', '.'], noAssets: true}))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('images', () => {
  return gulp.src('project/**/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/static'));
});

gulp.task('apps-fonts', () => {
  return gulp.src('project/**/media/fonts/**/*')
    .pipe(gulp.dest('.tmp/static'))
    .pipe(gulp.dest('dist/static'));
});

gulp.task('vendor-fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function () {})
    .concat('node_modules/**/*.{eot,svg,ttf,woff,woff2}')
    .concat('!node_modules/gulp-if/**/*')
    .concat('!node_modules/browser-sync-ui/**/*')
    .concat('!node_modules/ternary-stream/**/*'))
    .pipe(gulp.dest('.tmp/static/vendor-fonts'))
    .pipe(gulp.dest('dist/static/vendor-fonts'));
});

gulp.task('fonts', ['apps-fonts', 'vendor-fonts'], () => {});

gulp.task('extras', () => {
  return gulp.src([
    'project/*.*',
    '!project/*.html',
    '!project/*.js'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('env', (cb) => {
  //only env vars with BROWSER_ prefix are exposed
  var safeRegEx = new RegExp('^BROWSER_');
  var env = nconf.env().stores.env.store;
  var safeEnv = {};
  for (var k of Object.keys(env)) {
    if (safeRegEx.test(k)) {
      safeEnv[k.replace(safeRegEx, '')] = env[k];
    }
  }
  try {
    fs.mkdirSync('./.tmp/');
  } catch(ex) { }
  fs.writeFile('./.tmp/env.json', JSON.stringify(safeEnv), (err) => {
    if (err) {
      $.util.log(err);
    }
    cb();
  });
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['js:watch', 'styles', 'fonts', 'pot', 'locale-build'], () => {
  gulp.watch('project/**/styles/*.scss', ['styles']);
  gulp.watch('project/**/media/fonts/**/*', ['apps-fonts']);
  gulp.watch('bower.json', ['wiredep', 'vendor-fonts']);
  gulp.watch('package.json', ['vendor-fonts']); //TODO: and other tasks :)
  gulp.watch('project/**/*.js', ['pot']);
  gulp.watch('locale/*.po', ['locale-build']);

  gulp.watch([
    'project/*.html',
    'project/**/media/fonts/**/*',
    '.tmp/static/vendor-fonts/**/*',
    '.tmp/styles/**/*',
    '.tmp/locale/*.json'
  ]).on('change', reload);

  var nmStarted = false;

  nodemon({
    script: './.tmp/node-scripts/main.js',
    watch: './.tmp/node-scripts/',
    ext: 'js',
    delay: 1000
  }).on('start', function () {
    if (!nmStarted) {
      nmStarted = true;
      var proxy = httpProxy.createProxyServer({
        target: 'http://localhost:1337/'
      }).on('error', (err) => {
        $.util.log(err);
      });
      setTimeout(() => {
        browserSync({
          notify: false,
          port: 9000,
          server: {
            baseDir: ['.tmp', 'project'],
            routes: {
              '/bower_components': 'bower_components',
              '/static': 'project',
              '/static/vendor-fonts/': '.tmp/static/vendor-fonts'
            },
            middleware: (req, res, next) => {
              if (!/(\/scripts)|(\/styles)|(\/static)|(\/bower_components)/.test(req.url)) {
                proxy.web(req, res);
              } else {
                next();
              }
            }
          }
        });
      }, 2000);
    }
  });
});

gulp.task('serve:dist', () => {
  return nodemon({
    script: './dist/node-scripts/main.js',
    watch: './dist/node-scripts/'
  }).on('start', function () {
    browserSync({
      notify: false,
      proxy: 'http://localhost:1337',
      serveStatic: ['./dist/'],
      port: 9001
    });
  });
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('project/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('project/styles'));

  gulp.src('project/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('project'));
});

gulp.task('test', ['lint:test'], () => {
  var files = glob.sync('project/**/tests/*.js');
  var b = browserify({entries: files})
    .plugin(mocaccino, {reporter: 'spec'})
    .bundle();

  phantomic(b, {
    debug: false,
    port: 0,
    brout: true,
    'web-security': false,
    'ignore-ssl-errors': true
  }, function (code) {
    if (code !== 0) {
      process.exit(code);
    }
  }).pipe(process.stdout);
});

gulp.task('build', ['lint', 'test', 'html', 'node-app', 'images', 'fonts', 'extras', 'locale-build'], () => {
  return gulp.src('dist/**/*').pipe(gsize({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
