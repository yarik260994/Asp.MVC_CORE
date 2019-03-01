import * as gulp from 'gulp';
import * as browserSync from 'browser-sync';
import * as historyApiFallback from 'connect-history-api-fallback/lib';
import * as project from '../aurelia.json';
import build from './build';
import watch from './watch';
import { CLIOptions } from 'aurelia-cli';

let serve = gulp.series(
  build,
  done => {
    browserSync({
      online: true,
      open: false,
      port: 9000,
      logLevel: 'silent',      
      server: {
        baseDir: [project.run.basePath],
        middleware: [historyApiFallback(), function (req, res, next) {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");

          next();
        }]
      }
    }, function (err, bs) {
      if (err) return done(err);
      let urls = bs.options.get('urls').toJS();
      console.log(`Application Available At: ${urls.local}`);
      console.log(`BrowserSync Available At: ${urls.ui}`);
      done();
    });
  }
);

function reload() {
  console.log('Refreshing the browser');
  browserSync.reload();
}

let run;

if (CLIOptions.hasFlag('watch')) {
  run = gulp.series(
    serve,
    done => { watch(reload); done(); }
  );
} else {
  run = serve;
}

export default run;