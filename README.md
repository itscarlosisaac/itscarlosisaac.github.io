# Gulp boilerplate

Gulp boilerplate for static templates to be selled in themeforest.

---

## NPM Scripts

`yarn dev` - To run the Development enviroment. Localhost is serve by BrowserSync in `http://localhost:3000`

`yarn build` - To build the production files

## Files Organization

### Views / Pug Files

`views > index.pug`

Main homepage for the Template.

`views > _layouts > base.pug`

The layout folder will contain all the different layouts a template could have.

`views > _partials > main.pug`

The partials folder will contain all the different pages for that template and inside will have the resources, which will contain the meta information, styles and scripts needed for the template to work properly.

`views > _partials > resources > meta.pug`

`views > _partials > resources > styles.pug`

`views > _partials > resources > scripts.pug`

Notes

- To use images with css as background image the url needs to go up two directories: `../../images/image-name.png`

### JavaScript

`js > app.js`

`js > vendor > tiny-slider.min.js`

`js > partials > Slider.js`

### Assets

`images > images(jpg|png|svg)`

`favicon > favicon(png|ico)`

### HTML beautifier

Is using the `gulp-beautify` package to format the HTML code. To avoid inline tags to be in the same line as the block tags was added an inline option with an empty array to remove all inline tags from being passed into the beautify. [ Beautify Settings ](https://github.com/HookyQR/VSCodeBeautify/blob/master/Settings.md) - Here is the list of settings that can be passed to the Beautify package.

### Credits

Themify - [Themify Icons](https://themify.me/themify-icons)

Bootstrap - [Bootstrap](https://getbootstrap.com/)

Tiny Slider 2 - [Tiny Slider 2](https://github.com/ganlanyuan/tiny-slider)

### Development dependencies

```json
{
  "@babel/core": "^7.8.3",
  "@babel/preset-env": "^7.8.3",
  "autoprefixer": "^9.7.3",
  "browser-sync": "^2.26.7",
  "del": "^5.1.0",
  "gulp": "^4.0.2",
  "gulp-babel": "^8.0.0",
  "gulp-changed": "^4.0.2",
  "gulp-clean": "^0.4.0",
  "gulp-concat": "^2.6.1",
  "gulp-if": "^3.0.0",
  "gulp-imagemin": "^6.2.0",
  "gulp-plumber": "^1.2.1",
  "gulp-postcss": "^8.0.0",
  "gulp-pug": "^4.0.1",
  "gulp-replace": "^1.0.0",
  "gulp-sass": "^4.0.2",
  "gulp-sourcemaps": "^2.6.5",
  "node-sass": "^4.13.0",
  "pre-commit": "^1.2.2"
}
```
