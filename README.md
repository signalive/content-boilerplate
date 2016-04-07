# Signalive Content Boilerplate

### Requirements
- [Node.js](https://nodejs.org/en/download/)
- [Gulp](http://gulpjs.com/) (`npm install --global gulp-cli`)

### Why?
Since signalive content system is working with just `index.html`, we can not use `link` or `script` tags to load external files. This is hard to develop and maintain. Don't worry, we're planning to provide full file system to you, until then this boilerplate will help you to develop contents in your way.

### Usage
- Fork or download this repo.
- Run `npm install` inside it.
- Start development with src/index.html!

### Media Usage
You should upload all your non-plain-text files (images, videos, fonts) as medias. All these medias will be already downloaded and ready to use, when your content is loaded. You need to use custom `media://...` protocol to require your medias. After uploading medias to our system via panel, you can require it by `id` field. Ex: `media://73`, `media://96`

For development, store all your medias in `src/medias/` folder. Look at `src/medias.json` file where `KOALA_JPG` is just a templating variable name.

```
{
    "KOALA_JPG": {
        "dev": "./medias/koala.jpg",
        "prod": "media://73"
    }
}
```
This boilerplate uses angular-style `{{...}}` templating to replace medias. You should use `{{KOALA_JPG}}` when you need to refer file path to `koala.jpg`. You can do this in `index.html` and all your css & js files you required.

For `dev` environment, all the `{{KOALA_JPG}}` strings will be replaced with `./medias/koala.jpg`. For `prod` environment, obviously, it will be replaced with `media://73`.

**You should create a record in `medias.json` for every media you use.**

### CSS & Javascript Usage
Take a look at `src/index.html`:

You should require external css files inside this block:
```html
<!-- build:css -->
<link rel="stylesheet" href="css/layout.css">
<!-- endbuild -->
```

And for javascript files:
```html
<!-- build:js -->
<script src="js/app.js"></script>
<!-- endbuild -->
```

### Development
For development just run `gulp`. Gulp will copy your source files, replaces media links and save them into `dist/` folder. Open up `dist/index.html` in your favorite browser.

When you make changes in the source code, you need to run `gulp` again. To avoid that, you can use `gulp watch`. It will watch `src/` folder for changes, runs `gulp` automatically.

### Publishing (Building)
As mentioned above, to upload the content you make into signalive system, you need to export just `index.html`. When you run `gulp build --env prod`, gulp will replace your media links with `prod` environment value, concats all the css and js files, embeds them into `index.html` as inline.

If you pass `--compile` flag (like `gulp build --compile --env prod`), it will also [minifies all your css](https://www.npmjs.com/package/gulp-minify-css) and [uglifies all your js](https://www.npmjs.com/package/gulp-uglify) files.

If you don't pass `--env prod` flag, your medias will be replaced with `dev` environment. This can be useful to check whether js&css compilation breakes your content.
