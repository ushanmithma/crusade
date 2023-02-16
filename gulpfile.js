// Initizlise modules
const { src, dest, watch, series, parallel } = require('gulp')
const gulpif = require('gulp-if')
const sass = require('gulp-sass')(require('sass'))
const postcss = require('gulp-postcss')
const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const browserify = require('browserify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const terser = require('gulp-terser')
const browserSync = require('browser-sync').create()

// File paths variables
const files = {
	scssPath: './src/scss/**/*.scss',
	jsPath: './src/js/**/*.js',
}

const jsFiles = ['app.js']

// Sass task
let sassTask = () => {
	return src(files.scssPath)
		.pipe(gulpif(process.env.NODE_ENV == 'development', sourcemaps.init()))
		.pipe(sass().on('error', sass.logError))
		.pipe(gulpif(process.env.NODE_ENV == 'production', postcss([autoprefixer(), cssnano()])))
		.pipe(gulpif(process.env.NODE_ENV == 'development', sourcemaps.write('.')))
		.pipe(dest('./dist/css'))
}

// JavaScript task
let jsTask = (cb) => {
	jsFiles.map((entry) => {
		return browserify({ entries: ['./src/js/' + entry] })
			.transform(babelify, { presets: ['@babel/preset-env'] })
			.bundle()
			.pipe(source(entry))
			.pipe(buffer())
			.pipe(gulpif(process.env.NODE_ENV == 'development', sourcemaps.init({ loadMaps: true })))
			.pipe(gulpif(process.env.NODE_ENV == 'production', terser({ toplevel: true, output: { comments: false } })))
			.pipe(gulpif(process.env.NODE_ENV == 'development', sourcemaps.write('./')))
			.pipe(dest('./dist/js'))
	})
	cb()
}

let browserSyncServe = (cb) => {
	browserSync.init({
		server: {
			baseDir: '.',
		},
	})
	cb()
}

let browserSyncReload = (cb) => {
	browserSync.reload()
	cb()
}

// Watch task
let watchTask = () => {
	watch('./*.html', browserSyncReload)
	watch([files.scssPath, files.jsPath], parallel(sassTask, jsTask, browserSyncReload))
}

exports.build = series(sassTask, jsTask)

exports.dev = series(parallel(sassTask, jsTask), browserSyncServe, watchTask)
