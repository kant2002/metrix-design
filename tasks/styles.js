var gulp = require("gulp"),
    pluginsFactory = require("gulp-load-plugins"),
    config = require("../build.json");

var plugins = pluginsFactory();

var generatedGliphs;
gulp.task("styles:generate_font", function () {
    return gulp.src([config.icons.src])
    .pipe(plugins.iconfont({
        fontName: config.icons.fontName,
        normalize: true,
        fontHeight: 1001,
        svg: true
    }))
    .on("glyphs", function (glyphs) {
        generatedGliphs = glyphs.map(function (glyph) {
            // this line is needed because gulp-iconfont has changed the api from 2.0
            return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0).toString(16) };
        });
    })
    .pipe(gulp.dest("public/fonts/"));
});

gulp.task("styles:generate_icons_scss", ["styles:generate_font"], function () {
    var options = {
        glyphs: generatedGliphs,
        fontName: config.icons.fontName,
        fontPath: "../fonts/",
        className: "metrix"
    };
    return gulp.src(config.icons.template)
          .pipe(plugins.consolidate("lodash", options))
          .pipe(gulp.dest(config.styles.sassFolder));
});

gulp.task("styles:icons", ["styles:generate_icons_scss"]);

gulp.task("styles:main", [], function () {
    return gulp.src(config.styles.entryPoint)
    // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
    .pipe(plugins.sass({ onError: function (e) { console.log(e); } }))
    // Optionally add autoprefixer
    .pipe(plugins.autoprefixer("last 2 versions", "> 1%", "ie 8"))
    // These last two should look familiar now :)
    .pipe(plugins.rename("metrix-bootstrap.css"))
    .pipe(gulp.dest("public/css/"));
});

gulp.task("styles:reset", [], function () {
    return gulp.src(config.styles.resetFile)
    // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
    .pipe(plugins.sass({ onError: function (e) { console.log(e); } }))
    // Optionally add autoprefixer
    .pipe(plugins.autoprefixer("last 2 versions", "> 1%", "ie 8"))
    // These last two should look familiar now :)
    .pipe(plugins.rename("metrix-reset.css"))
    .pipe(gulp.dest("public/css/"));
});
