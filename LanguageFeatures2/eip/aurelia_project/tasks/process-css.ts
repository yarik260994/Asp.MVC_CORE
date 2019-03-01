import * as gulp from 'gulp';
import * as sass from 'gulp-sass';
import * as autoprefixer from 'gulp-autoprefixer';
import * as project from '../aurelia.json';
import { build } from 'aurelia-cli';

export default function processCSS() {
  return gulp.src(project.cssProcessor.source)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'Chrome <= 12'],
      cascade: false
    }))
    .pipe(build.bundle());
};
