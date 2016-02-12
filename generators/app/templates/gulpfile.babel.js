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

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

function jsbundle(bundler) {
  return bundler.bundle()
    // log errors if they happen
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(vinylSource('main.js'))
    .pipe(vinylBuffer())
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./.tmp/scripts'))
    .on('end', function () {
      reload();
    });
}

gulp.task('js:watch', () => {
  var bundler = watchify(browserify(
    Object.assign({}, watchify.args, {
      entries: ['./project/main.js'],
      debug: true
    })
  ));
  bundler.on('log', $.util.log);
  bundler.on('update', () => {
    jsbundle(bundler);
  });
  return jsbundle(bundler);
});

gulp.task('js:build', () => {
  var bundler = browserify({entries: ['./project/main.js']});
  bundler.on('log', $.util.log);
  return jsbundle(bundler);
});

gulp.task('js:build-node', () => {
  var bundler = browserify({entries: ['./project/main.js']})
    .exclude('http')
    .exclude('url')
    .exclude('fs')
    .exclude('querystring')
    .exclude('buffer')
    .exclude('console-browserify');
  bundler.on('log', $.util.log);
  return jsbundle(bundler)
    .pipe(gulp.dest('./dist/node-scripts'));
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

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['js:watch', 'styles', 'fonts', 'pot', 'locale-build'], () => {
  gulp.watch([
    'project/*.html',
    'project/**/media/fonts/**/*',
    '.tmp/static/vendor-fonts/**/*',
    '.tmp/styles/**/*',
    '.tmp/locale/*.json'
  ]).on('change', reload);

  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'project'],
      routes: {
        '/bower_components': 'bower_components',
        '/static': 'project',
        '/static/vendor-fonts/': '.tmp/static/vendor-fonts'
      }
    }
  });

  gulp.watch('project/**/styles/*.scss', ['styles']);
  gulp.watch('project/**/media/fonts/**/*', ['apps-fonts']);
  gulp.watch('bower.json', ['wiredep', 'vendor-fonts']);
  gulp.watch('project/**/*.js', ['pot']);
  gulp.watch('locale/*.po', ['locale-build']);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9001,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:node', ['nodemon'], () => {
  browserSync({
    notify: false,
    proxy: 'http://localhost:1337',
    serveStatic: ['./dist/'],
    port: 9002
  });
});

gulp.task('nodemon', ['build'], (cb) => {
  var started = false;
  return nodemon({
    script: './dist/node-scripts/main.js'
  }).on('start', function () {
    if (!started) {
      cb();
      started = true;
    }
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

gulp.task('build', ['lint', 'test', 'js:build-node', 'html', 'images', 'fonts', 'extras', 'locale-build'], () => {
  return gulp.src('dist/**/*').pipe(gsize({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
