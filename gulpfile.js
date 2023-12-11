'use strict';

const gulp = require('gulp');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
const scss = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const csscomb = require('gulp-csscomb');
const csso = require('gulp-csso');
const criticalCss = require('gulp-critical-css');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
// const webp = require('imagemin-webp');
const svgSprite = require('gulp-svg-sprite');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const plumber = require('gulp-plumber');
const debug = require('gulp-debug');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const newer = require('gulp-newer');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const gulpIf = require('gulp-if');
const del = require('del');
const browserSync = require('browser-sync').create();

const root = {
	src: 'assets/',
	build: 'markup/',
};

const path = {
	src: {
		html: root.src + '*.html',
		css: root.src + 'scss/*.scss',
		js: root.src + 'js/**/*.js',
		img: root.src + 'img/',
		font: root.src + '/fonts/**/*.{woff,woff2,ttf}',
		ico: root.src + 'theme/icons/**/*.svg',
		vid: root.src + 'theme/video/**/*.mp4',
		ven: root.src + 'js/plugins/*.js',
	},
	build: {
		php: root.build,
		html: root.build,
		css: root.build + 'css/',
		js: root.build + 'js/',
		img: root.build + 'img/',
		font: root.build + 'fonts/',
		ico: root.build + 'icons/',
		vid: root.build + 'videos/',
		ven: root.build + 'plugins/',
	},
	watch: {
		html: [
			root.src + 'templates/**/*.html',
			root.src + '*.html',
			root.src + 'sections/**/*.html',
		],
		css: [
			// root.src + 'scss/blocks/**/*.scss',
			// root.src + 'scss/common/**/*.scss',
			// root.src + 'scss/helpers/**/*.scss'
			root.src + 'scss/**/*.scss',
			// root.src,
		],
		js: root.src + 'js/**/*.js',
		img: root.src + 'img/',
		font: root.src + '/fonts/**/*.{ttf,woff,woff2}',
		ico: root.src + 'theme/icons/**/*.svg',
		vid: root.src + 'theme/video/**/*.mp4',
		ven: root.src + 'js/plugins/*.js',
	},
};

// CLEAN ============================

function cleanDirectory() {
	return del(['markup'], ['plugins']);
}

// HTML ============================

function compileHTML() {
	return gulp
		.src(path.src.html)
		.pipe(
			plumber({
				errorHandler: notify.onError({
					title: 'Ошибка в HTML',
					message: 'Error: <%= error.message %>',
				}),
			})
		)
		.pipe(posthtml([include()]))
		.pipe(gulp.dest(path.build.html))
		.pipe(browserSync.stream());
}

// CSS ============================

function compileCSS() {
	return (
		gulp
			.src(path.src.css)
			.pipe(
				plumber({
					errorHandler: notify.onError({
						title: 'Ошибка в CSS',
						message: 'Error: <%= error.message %>',
					}),
				})
			)
			.pipe(csscomb())
			.pipe(scss())
			// .pipe(
			// 	csso({
			// 		comments: false,
			// 	})
			// )
			// .pipe(
			// 	rename({
			// 		// basename: '',
			// 		dirname: '',
			// 		suffix: '.min',
			// 	})
			// )
			.pipe(gulp.dest(path.build.css))
			.pipe(browserSync.stream())
	);
}

// JS ============================

function compileJS() {
	return (
		gulp
			.src(path.src.js)
			.pipe(
				plumber({
					errorHandler: notify.onError({
						title: 'Ошибка в JS',
						message: 'Error: <%= error.message %>',
					}),
				})
			)
			// .pipe( concat('script.js') )
			// .pipe(uglify())
			// .pipe(
			// 	rename({
			// 		dirname: '',
			// 		suffix: '.min',
			// 	})
			// )
			.pipe(gulp.dest(path.build.js))
			.pipe(browserSync.stream())
	);
}

function assemblyVendor() {
	return gulp
		.src(path.src.ven)
		.pipe(newer(path.build.ven))
		.pipe(gulp.dest(path.build.ven))
		.pipe(browserSync.stream());
}

// IMG ============================

function optimizeImages() {
	return gulp
		.src(path.src.img + '**/*.{jpg,png,svg}')
		.pipe(newer(path.build.img))
		.pipe(gulp.dest(path.build.img))
		.pipe(browserSync.stream());
}

function copyFonts() {
	return gulp
		.src(path.src.font)
		.pipe(newer(path.build.font))
		.pipe(gulp.dest(path.build.font))
		.pipe(browserSync.stream());
}

// function convertImagesToWebp() {

//   return gulp.src(path.src.img + '**/*.{jpg,png}')
//     .pipe(newer(path.build.img))
//     .pipe(imagemin([
//       webp({
//         quality: 80
//       })
//     ]))
//     .pipe(rename({
//       extname: '.webp'
//     }))
//     .pipe(gulp.dest(path.build.img))
//     .pipe(browserSync.stream());

// }

// Оптимизация SVG

// function optimizeSvg() {
// 	return gulp
// 		.src(path.src.ico)
// 		.pipe(
// 			imagemin([
// 				imagemin.svgo({
// 					plugins: [
// 						{
// 							removeViewBox: false,
// 						},
// 						{
// 							removeTitle: true,
// 						},
// 						{
// 							cleanupNumericValues: {
// 								floatPrecision: 0,
// 							},
// 						},
// 					],
// 				}),
// 			])
// 		)
// 		.pipe(
// 			rename({
// 				dirname: '',
// 			})
// 		)
// 		.pipe(gulp.dest(path.build.ico))
// 		.pipe(browserSync.stream());
// }

// // VIDEO ============================

// function optimizeVideos() {
// 	return gulp
// 		.src(path.src.vid)
// 		.pipe(newer(path.build.vid))
// 		.pipe(gulp.dest(path.build.vid))
// 		.pipe(browserSync.stream());
// }

// BUILD ============================

exports.cleanDirectory = cleanDirectory;

const build = gulp.series(
	cleanDirectory,
	gulp.parallel(
		compileHTML,
		compileCSS,
		compileJS,
		assemblyVendor,
		optimizeImages,
		copyFonts
		// convertImagesToWebp,
		// optimizeSvg,
		// optimizeVideos
	)
);

exports.build = build;

// SERVER ============================

function runServer() {
	browserSync.init({
		server: root.build,
		cors: true,
		notify: false,
	});

	browserSync.watch(root.src + '**/*.*').on('change', browserSync.reload);
}

// WATCH ============================

function watchFiles() {
	gulp.watch(path.watch.html, compileHTML);
	gulp.watch(path.watch.css, compileCSS);
	gulp.watch(path.watch.js, compileJS);
	gulp.watch(path.watch.ven, assemblyVendor);
	gulp.watch(path.watch.img + '**/*.{jpg,png,svg}', optimizeImages);
	gulp.watch(path.watch.font, copyFonts);
	// gulp.watch(path.watch.img + '**/*.{jpg,png}', convertImagesToWebp);
	// gulp.watch(path.watch.ico, optimizeSvg);
	// gulp.watch(path.watch.vid, optimizeVideos);
}

// DEVELOPMENT ============================

exports.start = gulp.series(build, gulp.parallel(runServer, watchFiles));
