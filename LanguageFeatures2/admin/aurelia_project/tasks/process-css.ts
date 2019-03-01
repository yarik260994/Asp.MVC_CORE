import * as gulp from 'gulp';
import * as sass from 'gulp-sass';
import * as project from '../aurelia.json';
import { build } from 'aurelia-cli';

export default function processCSS() {
  return gulp.src(project.cssProcessor.source)
    .pipe(sass().on('error', sass.logError))
    .pipe(build.bundle());
};
