var gulp = require("gulp"),
    jasmine = require("gulp-jasmine"),
    header = require("gulp-header"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    pkg = require("./package.json");

var d = new Date();
var releaseDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()

var banner = "// Stik-courier - Version: <%= pkg.version %> | From: <%= date %>\n";

gulp.task("test", function(){
  gulp.src("specs/*_spec.js")
      .pipe(jasmine());
});

gulp.task("pack", function(){
  gulp.src("src/boundary.js")
      .pipe(concat("stik-courier.js"))
      .pipe(header(banner, { pkg: pkg, date: releaseDate }))
      .pipe(gulp.dest("dist"))
      .pipe(concat("stik-courier.min.js"))
      .pipe(uglify())
      .pipe(gulp.dest("dist"));
});
