/*
 * @Author: shuwen.wang 
 * @Date: 2017-07-11 18:37:44 
 * @Last Modified by: shuwen.wang
 * @Last Modified time: 2017-07-11 18:38:29
 */
const gulp = require('gulp')
const ts = require('gulp-typescript')
/* 加载tsconfig*/
const tsObject = ts.createProject('tsconfig.json')
const clean = require('gulp-clean')
const nodemon = require('gulp-nodemon');

/* 清空输出目录中的文件*/
gulp.task('clean', () => {
    return gulp.src('./dest/')
        .pipe(clean())
})

/* 将非ts文件复制到dest中*/
gulp.task('copyfile',
    // 暂时去掉clean
    // ['clean'],
    () => {
    return gulp.src(['./src/**', '!./src/**/*.ts'])
        .pipe(gulp.dest('./dest/'));
    });

/* 编译ts*/
gulp.task('build', () => {
    return gulp.src('./src/**/*.ts')
        .pipe(tsObject())
        .pipe(gulp.dest('./dest'))
})

/* 启动服务器*/
gulp.task('server-start', ['build'], () => {
    return nodemon({
        script: './dest/app.js',
        delay: 1000,
        watch: './dest',
        env: { 'NODE_ENV': 'development' },
    });
});

/* 监听typescript文件变化*/
gulp.task('watcher', () => {
    gulp.watch('./src/**/*.ts', ['build']);
});

gulp.task('default', ['copyfile'], () => {
    gulp.start(['server-start','watcher'])
});

