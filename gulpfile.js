var gulp = require("gulp"),
    requireDir = require("require-dir");

requireDir("tasks");

gulp.task("styles:web", ["styles:main"]);
gulp.task("styles", ["styles:generate_icons_scss"], function () {
    gulp.run("styles:web");
});

gulp.task("default", ["styles"], function () {
    // This will only run if the lint task is successful...
});
