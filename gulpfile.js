var gulp = require("gulp");
var ts = require("gulp-typescript");
var arg = require("arg");
var tsProject = ts.createProject("tsconfig.json");
var paths = {
  public: [
    "src/public/*.html",
    "src/public/**/*.mjs",
  ],
  server: [
    "src/server/**/*.ts",
  ]
};
const args = arg({
  "--watch": Boolean,
  "-w": "--watch",
  "--build": Boolean,
  "-b": "--build"
}, {
  argv: process.argv.slice(2)
});

var tasks = {
  'copy-public'(){
    return gulp.src(paths.public).pipe(gulp.dest("dist/public"));
  },
  'build-server'(){  
    return tsProject
    .src()
    .pipe(tsProject()).js
    .pipe(gulp.dest(tsProject.options.outDir));
  }
}

gulp.task("copy-public", tasks['copy-public']);

gulp.task("build-server", tasks['build-server']);

gulp.task("watch", function(){
  gulp.watch(paths.server, tasks['build-server']);
  gulp.watch(paths.public, tasks['copy-public']);
});
const series = [];
const shouldBuild = (!args['--build'] && !args['--watch']) || (args['--build'] && args['--watch'])
const shouldWatch = args['--watch'];
if(shouldBuild){
  series.push(
    gulp.parallel("copy-public"),
    gulp.parallel("build-server"),
  );
}
if(shouldWatch){
  series.push(gulp.parallel("watch"));
}
gulp.task("default", gulp.series(
  ...series
));