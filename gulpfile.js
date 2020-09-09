/* ================
 Template Name: Template Name
 Description: Template Description
 Version: 1.0
 Author: https://themeforest.net/user/seasonsca
======================= */
/* IMPORT DEPENCIES */
require("dotenv").config();
const { parallel, series, src, dest, watch } = require("gulp");
const babel = require("gulp-babel");
const imagemin = require("gulp-imagemin");
const del = require("del");
const browserSync = require("browser-sync");
const plumber = require("gulp-plumber");
const pug = require("gulp-pug");
const concat = require("gulp-concat");
const changed = require("gulp-changed");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("autoprefixer");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const sorting = require("postcss-sorting");
const gulpif = require("gulp-if");
const replace = require("gulp-replace");
const gulpStylelint = require("gulp-stylelint");
const eslint = require("gulp-eslint");
const beautify = require("gulp-beautify");
const gcmq = require("gulp-group-css-media-queries");

// List of options
const options = {
  uglifyJS: false,
  sourceMaps: true,
  useBabel: true,
  htmlbeautify: {
    indentSize: 2,
    inline: []
  }
};

/************************
 * PATHS  *
 ************************/
const paths = {
  input: {
    root: "./src/",
    sass: "./src/scss/",
    js: "./src/js/",
    data: "./src/data/",
    images: "./src/assets/images/",
    fonts: "./src/assets/fonts/"
  },
  output: {
    css: "./public/css/",
    js: "./public/js/",
    images: "./public/images/",
    fonts: "./public/fonts/"
  },
  public: "./public/"
};

const Pug = () => {
  return src("./src/views/pages/*.pug")
    .pipe(plumber())
    .pipe(
      pug({
        data: {
          pageTitle: ""
        }
      })
    )
    .pipe(beautify.html(options.htmlbeautify))
    .pipe(dest(paths.public))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
};

/************************
 * CREATE BROWSER  *
 ************************/
const Serve = () => {
  browserSync({
    server: {
      baseDir: paths.public
    },
    notify: false
  });
};

/************************
 * RECOMPILE PUG AND RELOAD BROWSER  *
 ************************/
const Rebuild = () => {
  browserSync.reload();
};

/************************
 * CLEAN DIRECTORY  *
 ************************/
const Clean = () => {
  return del(paths.public);
};

/************************
 * SASS *
 ************************/
const Styles = () => {
  return src([paths.input.sass + "app.scss"])
    .pipe(plumber())
    .pipe(gulpif(options.sourceMaps, sourcemaps.init()))
    .pipe(
      sass({
        includePaths: [paths.input.sass],
        outputStyle: "expanded"
      })
    )
    .pipe(
      gulpStylelint({
        reporters: [{ formatter: "verbose", console: true }]
      })
    )
    .pipe(gcmq())
    .pipe(postcss([autoprefixer(), sorting()]))
    .pipe(gulpif(options.sourceMaps, sourcemaps.write("/maps")))
    .pipe(dest(paths.output.css))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
};

/************************
 * STYLES VENDORS *
 ************************/

const StylesVendors = () => {
  return src([paths.input.sass + "vendors/**.scss"])
    .pipe(plumber())
    .pipe(gulpif(options.sourceMaps, sourcemaps.init()))
    .pipe(
      sass({
        includePaths: [paths.input.sass],
        outputStyle: "expanded"
      })
    )
    .pipe(postcss([autoprefixer(), sorting()]))
    .pipe(dest(paths.output.css + "/vendors"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
};

/************************
 * JAVASCRIPT *
 ************************/
const JavaScript = () => {
  return src([`${paths.input.js}app.js`, `${paths.input.js}/partials/*.js`])
    .pipe(plumber())
    .pipe(gulpif(options.sourceMaps, sourcemaps.init()))
    .pipe(
      gulpif(
        options.useBabel,
        babel({
          presets: ["@babel/preset-env"]
        })
      )
    )
    .pipe(concat("scripts.js"))
    .pipe(replace(/('|")use strict\1;/g, ""))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulpif(options.sourceMaps, sourcemaps.write("/maps")))
    .pipe(dest(paths.output.js))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
};

/************************
 * JAVASCRIPT DEPENDENCIES *
 ************************/
const JSDependencies = () => {
  return src(`${paths.input.js}/vendor/*.js`)
    .pipe(plumber())
    .pipe(dest(`${paths.output.js}/vendor/`))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
};

/************************
 * IMAGES *
 ************************/
const Images = () => {
  return src(paths.input.images + "**/*.+(png|jpg|gif|svg|jpeg)")
    .pipe(plumber())
    .pipe(changed(paths.output.images))
    .pipe(imagemin())
    .pipe(dest(paths.output.images));
};

/************************
 * COPY FONTS *
 ************************/
const Fonts = () => {
  return src(paths.input.fonts + "**/*.+(eot|svg|ttf|woff)").pipe(
    dest(paths.output.fonts)
  );
};

/************************
 * COPY Utilities Files *
 ************************/
const Utilities = () => {
  return src([
  ]).pipe(dest(paths.public));
};

/************************
 * WATCHING *
 ************************/
const Watch = () => {
  watch("./src/**/*.pug", Pug).on("change", Rebuild);
  watch(
    paths.input.sass + "**/*.scss",
    series(Styles, StylesVendors, Fonts)
  ).on("change", Rebuild);
  watch(paths.input.images + "**/*.+(png|jpg|gif|svg|jpeg)", Images).on(
    "change",
    Rebuild
  );
  watch(paths.input.js + "**/*.js", JavaScript).on("change", Rebuild);
  watch(paths.input.js + "**/*.js", series(JSDependencies, JavaScript)).on(
    "change",
    Rebuild
  );
};

// EXPORTS
exports.dev = series(
  Clean,
  parallel(
    Pug,
    Styles,
    StylesVendors,
    Fonts,
    Images,
    JSDependencies,
    JavaScript
  ),
  parallel(Watch, Serve)
);
exports.build = series(
  Clean,
  parallel(
    Pug,
    Styles,
    StylesVendors,
    Fonts,
    Images,
    JSDependencies,
    JavaScript,
    // Utilities
  )
);
exports.deploy = series(
  Clean,
  parallel(
    Pug,
    Styles,
    StylesVendors,
    Fonts,
    Images,
    JSDependencies,
    JavaScript,
    // Utilities
  )
);
