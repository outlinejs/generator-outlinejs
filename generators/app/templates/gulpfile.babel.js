// generated on <%= date %> using <%= name %> <%= version %>
import gulp from 'gulp';
import OutlineJsTasks from 'outlinejs/lib/utils/build/tasks';
import browserify from 'browserify';
import eslint from 'gulp-eslint';

class GulpTasks extends OutlineJsTasks {
  getBrowserify(debug = false, forNode = false, watch = false, files = [this.projectJsEntry]) {
    var b = super.getBrowserify(debug, forNode, watch, files);
    if (forNode) {
      //
      b = b.exclude('jquery');
    }
    return b;
  }
}

const ojsTasks = new GulpTasks(gulp, browserify, eslint);
ojsTasks.load();

gulp.task('default', ['ojs:clean'], () => {
  gulp.start('ojs:build');
});
