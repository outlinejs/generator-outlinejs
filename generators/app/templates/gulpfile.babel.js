// generated on <%= date %> using <%= name %> <%= version %>
import gulp from 'gulp';
import OutlineJsTasks from 'outlinejs/lib/utils/build/tasks';
import browserify from 'browserify';
import eslint from 'gulp-eslint';

const ojsTasks = new OutlineJsTasks(gulp, browserify, eslint);
ojsTasks.load();

gulp.task('default', ['ojs:clean'], () => {
  gulp.start('ojs:build');
});

