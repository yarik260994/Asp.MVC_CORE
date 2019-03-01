import * as gulp from 'gulp';
//import * as changedInPlace from 'gulp-changed-in-place';
import * as concat  from 'gulp-concat';
import * as project from '../aurelia.json';

export default function copyVendorCss() {
    return gulp.src(project.copyVendorCss.sources)
        //.pipe(changedInPlace(project.copyCss.sources, {extension: '.scss'}))
        .pipe(concat(project.copyVendorCss.filename))
        .pipe(gulp.dest(project.copyVendorCss.output));
}