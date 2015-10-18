/**
 *
 * *
 * **
 * ***
 * **** VARS
 * ***
 * **
 * *
 *
 * */

var gulp         = require('gulp'),
    gutil        = require('gulp-util'),
    bower        = require('gulp-bower'),
    sass         = require('gulp-sass'),
    coffee       = require('gulp-coffee'),
    autoprefixer = require('gulp-autoprefixer'),
    rename       = require('gulp-rename'),
    minifycss    = require('gulp-minify-css'),
    uglify       = require('gulp-uglify'),
    modify       = require('gulp-modify'),
    livereload   = require('gulp-livereload'),
    fs           = require('fs');

var src                = 'src',
    app                = 'web',
    bowerFolder        = 'bower_components',
    styles             = 'stylesheets',
    mainStyle          = 'style.sass',
    scripts            = 'scripts',
    images             = 'images',
    mainAngular        = 'app.coffee',
    mainController     = 'controllers.coffee',
    mainDirective      = 'directives.coffee',
    mainFactory        = 'factories.coffee',
    mainFilter         = 'filters.coffee',
    angularControllers = 'controllers',
    angularDirectives  = 'directives',
    angularFactories   = 'factories',
    angularFilters     = 'filters';

var pathToSrcStyles    = src + '/' + styles,
    pathToSrcMainStyle = pathToSrcStyles + '/' + mainStyle,
    pathToAppStyles    = app + '/' + styles,
    pathToAppMainStyle = pathToAppStyles + '/' + mainStyle;

var pathToSrcScripts     = src + '/' + scripts,
    pathToMainScript     = pathToSrcScripts + '/' + mainAngular,
    pathToMainController = pathToSrcScripts + '/' + mainController,
    pathToMainDirective  = pathToSrcScripts + '/' + mainDirective,
    pathToMainFactory    = pathToSrcScripts + '/' + mainFactory,
    pathToMainFilter     = pathToSrcScripts + '/' + mainFilter,
    pathToSrcControllers = pathToSrcScripts + '/' + angularControllers,
    pathToSrcDirectives  = pathToSrcScripts + '/' + angularDirectives,
    pathToSrcFactories   = pathToSrcScripts + '/' + angularFactories,
    pathToSrcFilters     = pathToSrcScripts + '/' + angularFilters,
    pathToAppScripts     = app + '/' + scripts,
    pathToAppControllers = pathToAppScripts + '/' + angularControllers,
    pathToAppDirectives  = pathToAppScripts + '/' + angularDirectives,
    pathToAppFactories   = pathToAppScripts + '/' + angularFactories,
    pathToAppFilters     = pathToAppScripts + '/' + angularFilters;




/**
 *
 * *
 * **
 * ***
 * **** TASKS
 * ***
 * **
 * *
 *
 * */

gulp.task('default', ['help']);

/**
 * HELP
 */
gulp.task('help', function() {
    console.log("\n\tGULP HELP");
    console.log("\tlegend: gulp command --required <value> [--optionnal <value>] [--optionnal]");

    var commands = [
        'bower',
        'create:script:controller',
        'create:script:directive',
        'create:script:filter',
        'create:stylesheet:part',
        'generate',
        'generate:html',
        'generate:images',
        'generate:scripts',
        'generate:stylesheets',
        'help',
        'watch',
        'watch:html',
        'watch:images',
        'watch:scripts',
        'watch:stylesheets'
    ];

    var command;
    for (command in commands) {
        help(commands[command]);
    }

    console.log("");
});

/**
 * BOWER
 */
gulp.task('bower', function() {
    if (gutil.env.help) {
        help('bower');
        gutil.beep();

        return false;
    }

    bower().pipe(gulp.dest(src + '/' + bowerFolder)).pipe(gulp.dest(app + '/' + bowerFolder));
});

/**
 * CREATE:STYLESHEET:PART
 */
gulp.task('create:stylesheet:part', function() {
    var name = gutil.env.name;
    if (!name || gutil.env.help) {
        help('create:stylesheet:part');
        gutil.beep();

        return false;
    }
    name = name.toLowerCase();

    var ext = (gutil.env.scss) ? 'scss' : 'sass',
        file = '_' + name + '.' + ext,
        content = '/** START ' + name.toUpperCase() + ' */\n\n\n\n/** END ' + name.toUpperCase() + ' */\n';

    newFile(file, content, pathToSrcStyles + '/' + name);
    fs.appendFile(pathToSrcMainStyle, '@import ' + name + '/' + name + '\n');
});

/**
 * CREATE:SCRIPT:CONTROLLER
 */
gulp.task('create:script:controller', function() {
    var name = gutil.env.name;
    if (!name || gutil.env.help) {
        help('create:script:controller');
        gutil.beep();

        return false;
    }
    name = name.toLowerCase();

    var file = name + 'Controller.coffee',
        module = "app" + name.ucfirst() + "Controller = angular.module '" + name + "-controller', []\n\n",
        controller = "app" + name.ucfirst() + "Controller.controller '" + name + "Controller', ['$scope', ($scope) ->\n\t# HERE IS YOUR CONTROLLER\n]",
        content = '### START ' + name.toUpperCase() + ' CONTROLLER ###\n\n' + module + controller + '\n\n### END ' + name.toUpperCase() + ' CONTROLLER ###\n';

    newFile(file, content, pathToSrcControllers);
    gulp.src(pathToMainController)
        .pipe(modify({
            fileModifier: function(file, content) {
                content = content.replace("## ADD CONTROLLER MODULES HERE ##", "'" + name + "-controller',\n\t## ADD CONTROLLER MODULES HERE ##");
                return content;
            }
        }))
        .pipe(gulp.dest(pathToSrcScripts));
});

/**
 * CREATE:SCRIPT:DIRECTIVE
 */
gulp.task('create:script:directive', function() {
    var name = gutil.env.name;
    if (!name || gutil.env.help) {
        help('create:script:directive');
        gutil.beep();

        return false;
    }
    name = name.toLowerCase();

    var file = name + 'Directive.coffee',
        module = "app" + name.ucfirst() + "Directive = angular.module '" + name + "-directive', []\n\n",

        restrict = (gutil.env.attribute) ? '\t\trestrict: "A",\n' : '\t\trestrict: "E",\n',
        replace = (gutil.env.replace) ? '\t\treplace: true,\n' : '',
        transclude = (gutil.env.transclude) ? '\t\ttransclude: true,\n' : '',
        template = (gutil.env.template) ? '\t\ttemplateUrl: "' + gutil.env.template + '",\n' : '',
        controller = (gutil.env.controller) ? '\t\tcontroller: "' + gutil.env.controller + '",\n' : '',
        directive = "app" + name.ucfirst() + "Directive.directive '" + gutil.env.name + "', ->\n\t{\n" + restrict + replace + transclude + template + controller + "\t}",

        content = '### START ' + name.toUpperCase() + ' DIRECTIVE ###\n\n' + module + directive + '\n\n### END ' + name.toUpperCase() + ' DIRECTIVE ###\n';

    newFile(file, content, pathToSrcDirectives);
    gulp.src(pathToMainDirective)
        .pipe(modify({
            fileModifier: function(file, content) {
                content = content.replace("## ADD DIRECTIVE MODULES HERE ##", "'" + name + "-directive',\n\t## ADD DIRECTIVE MODULES HERE ##");
                return content;
            }
        }))
        .pipe(gulp.dest(pathToSrcScripts));
});

/**
 * CREATE:SCRIPT:FACTORY
 */
gulp.task('create:script:factory', function() {
    var name = gutil.env.name;
    if (!name || gutil.env.help) {
        help('create:script:factory');
        gutil.beep();

        return false;
    }
    name = name.toLowerCase();

    var file = name + 'Factory.coffee',
        module = "app" + name.ucfirst() + "Factory = angular.module '" + name + "-factory', []\n\n",
        factory = "app" + name.ucfirst() + "Factory.factory '" + name + "Factory', [ ->\n\tinstance = {}\n\n\treturn instance\n]",

        content = '### START ' + name.toUpperCase() + ' FACTORY ###\n\n' + module + factory + '\n\n### END ' + name.toUpperCase() + ' FACTORY ###\n';

    newFile(file, content, pathToSrcFactories);
    gulp.src(pathToMainFactory)
        .pipe(modify({
            fileModifier: function(file, content) {
                content = content.replace("## ADD FACTORY MODULES HERE ##", "'" + name + "-factory',\n\t## ADD FACTORY MODULES HERE ##");
                return content;
            }
        }))
        .pipe(gulp.dest(pathToSrcScripts));
});

/**
 * CREATE:SCRIPT:FILTER
 */
gulp.task('create:script:filter', function() {
    var name = gutil.env.name;
    if (!name || gutil.env.help) {
        help('create:script:filter');
        gutil.beep();

        return false;
    }
    name = name.toLowerCase();

    var file = name + 'Filter.coffee',
        module = "app" + name.ucfirst() + "Filter = angular.module '" + name + "-filter', []\n\n",
        filter = "app" + name.ucfirst() + "Filter.filter '" + gutil.env.name + "', [ ->\n\t\n]",

        content = '### START ' + name.toUpperCase() + ' FILTER ###\n\n' + module + filter + '\n\n### END ' + name.toUpperCase() + ' FILTER ###\n';

    newFile(file, content, pathToSrcFilters);
    gulp.src(pathToMainFilter)
        .pipe(modify({
            fileModifier: function(file, content) {
                content = content.replace("## ADD FILTER MODULES HERE ##", "'" + name + "-filter',\n\t## ADD FILTER MODULES HERE ##");
                return content;
            }
        }))
        .pipe(gulp.dest(pathToSrcScripts));
});

/**
 * GENERATE:STYLESHEETS
 */
gulp.task('generate:stylesheets', function() {
    if (gutil.env.help) {
        help('generate:stylesheets');
        gutil.beep();

        return false;
    }

    var stylesheet = gulp.src([pathToSrcStyles + '/**/*.sass', pathToSrcStyles + '/**/*.scss'])
        .pipe(sass({ style: 'expanded' }))
        .on('error', function(err){
            console.log("\n" + gutil.colors.red(err.messageFormatted) + "\n");
                gutil.beep();
            this.emit('end');
        })
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'));

    if (gutil.env.prod) {
        stylesheet.pipe(rename({ suffix: '.min' })).pipe(minifycss());
    }

    stylesheet.pipe(gulp.dest(pathToAppStyles)).pipe(livereload());
});

/**
 * WATCH:STYLESHEETS
 */
gulp.task('watch:stylesheets', ['generate:stylesheets'], function() {
    if (gutil.env.help) {
        help('watch:stylesheets');
        gutil.beep();

        return false;
    }

    livereload({ start: true });
    gulp.watch([pathToSrcStyles + '/**/*.sass', pathToSrcStyles + '/**/*.scss'], ['generate:stylesheets']);
});

/**
 * GENERATE:SCRIPTS
 */
gulp.task('generate:scripts', function() {
    if (gutil.env.help) {
        help('generate:scripts');
        gutil.beep();

        return false;
    }

    var folders = [
        [pathToSrcScripts + '/*.coffee', pathToAppScripts],
        [pathToSrcControllers + '/**/*.coffee', pathToAppControllers],
        [pathToSrcDirectives + '/**/*.coffee', pathToAppDirectives],
        [pathToSrcFactories + '/**/*.coffee', pathToAppFactories],
        [pathToSrcFilters + '/**/*.coffee', pathToAppFilters]
    ];

    var folder, scripts;
    for (folder in folders) {
        scripts = gulp.src(folders[folder][0])
            .pipe(coffee())
            .on('error', function(err){
                console.log("\n" + gutil.colors.red(err) + "\n");
                gutil.beep();
                this.emit('end');
            })
        ;

        if (gutil.env.prod) {
            scripts.pipe(rename({ suffix: '.min' })).pipe(uglify());
        }

        scripts.pipe(gulp.dest(folders[folder][1])).pipe(livereload());
    }

    folders = [
        [pathToSrcScripts + '/**/*.js', pathToAppScripts]
    ];

    for (folder in folders) {
        scripts = gulp.src(folders[folder][0]);

        if (gutil.env.prod) {
            scripts.pipe(rename({ suffix: '.min' })).pipe(uglify());
        }

        scripts.pipe(gulp.dest(folders[folder][1])).pipe(livereload());
    }
});

/**
 * WATCH:SCRIPT
 */
gulp.task('watch:scripts', ['generate:scripts'], function() {
    if (gutil.env.help) {
        help('watch:scripts');
        gutil.beep();

        return false;
    }

    livereload({ start: true });
    gulp.watch([pathToSrcScripts + '/**/*.coffee', pathToSrcScripts + '/**/*.js'], ['generate:scripts']);
});

/**
 * GENERATE:HTML
 */
gulp.task('generate:html', function() {
    if (gutil.env.help) {
        help('generate:html');
        gutil.beep();

        return false;
    }

    return gulp.src(src + '/**/*.html').pipe(gulp.dest(app)).pipe(livereload());
});

/**
 * WATCH:HTML
 */
gulp.task('watch:html', ['generate:html'], function() {
    if (gutil.env.help) {
        help('watch:html');
        gutil.beep();

        return false;
    }

    livereload({ start: true });
    gulp.watch(src + '/**/*.html', ['generate:html']);
});

/**
 * GENERATE:IMAGES
 */
gulp.task('generate:images', function() {
    if (gutil.env.help) {
        help('generate:images');
        gutil.beep();

        return false;
    }

    return gulp.src(src + '/' + images + '/**/*').pipe(gulp.dest(app + '/' + images)).pipe(livereload());
});

/**
 * WATCH:IMAGES
 */
gulp.task('watch:images', ['generate:images'], function() {
    if (gutil.env.help) {
        help('watch:images');
        gutil.beep();

        return false;
    }

    livereload({ start: true });
    gulp.watch(src + '/' + images + '/**/*', ['generate:images']);
});

/**
 * GENERATE
 */
gulp.task('generate', ['generate:stylesheets', 'generate:scripts', 'generate:html', 'generate:images'], function() {
    if (gutil.env.help) {
        help('generate');
        gutil.beep();

        return false;
    }
});

/**
 * WATCH
 */
gulp.task('watch', ['watch:stylesheets', 'watch:scripts', 'watch:html', 'watch:images'], function() {
    if (gutil.env.help) {
        help('watch');
        gutil.beep();

        return false;
    }
});



/**
 *
 * *
 * **
 * ***
 * **** FUNCTIONS
 * ***
 * **
 * *
 *
 * */

function newFile(filename, content, path) {
    var src = require('stream').Readable({ objectMode: true });

    gutil.log('Creating ', gutil.colors.cyan(filename), 'in', gutil.colors.cyan(path));

    fileExists(path + '/' + filename, function(){
        gutil.log(gutil.colors.red(path + '/' + filename + ' already exists.'));
        return false;
    }, function() {
        src._read = function () {
            this.push(new gutil.File({
                cwd: "",
                base: "",
                path: filename,
                contents: new Buffer(content)
            }));
            this.push(null);
        };
        gutil.log('Created', gutil.colors.cyan(path + '/' + filename));
        return src.pipe(gulp.dest(path));
    });
}

function fileExists(pathToFile, successCallback, failCallback) {
    fs.stat(pathToFile, function(err, stat) {
        if (err === null) {
            if (successCallback) successCallback();
        }
        else {
            if (failCallback) failCallback();
        }
    });
}

String.prototype.ucfirst = function() {
    return this.charAt(0).toUpperCase() + this.substr(1);
};

function help(help) {
    switch (help) {
        case 'bower':
            console.log("\n\tgulp " + gutil.colors.cyan('bower') + ':');
            console.log("\t\tInstall bower dependencies in :\n\t\t\t- " + src + '/' + bowerFolder + "\n\t\t\t- " + app + '/' + bowerFolder);
            break;
        case 'create:script:controller':
            console.log("\n\tgulp " + gutil.colors.cyan('create:script:controller') + ' --name <name>:');
            console.log("\t\t<name>: name of the controller.");
            console.log("\n\t\tCreate a new angular controller in " + pathToSrcControllers + ' and update ' + pathToMainController +'.');
            console.log("\t\tYou have to add the new script in your html.");
            break;
        case 'create:script:directive':
            console.log("\n\tgulp " + gutil.colors.cyan('create:script:directive') + ' --name <name> [--template <template>] [--controller <controller>] [--attribute] [--replace] [--transclude]:');
            console.log("\t\t<name>: name of the controller.");
            console.log("\t\t<template>: path to the template use by the directive. templateurl: '<template>'");
            console.log("\t\t<controller>: name of the controller use by the directive. controller: '<controller>'");
            console.log("\t\t--attribute: by default, directive will be an element, use this option if you want use your directive as attribute. restrict: 'A'");
            console.log("\t\t--replace: use this option to enable replace of your directive. replace: true");
            console.log("\t\t--transclude: use this option to enable transclude of your directive. transclude: true");
            console.log("\n\t\tCreate a new angular directive in " + pathToSrcDirectives + ' and update ' + pathToMainDirective +'.');
            console.log("\t\tYou have to add the new script in your html.");
            break;
        case 'create:script:filter':
            console.log("\n\tgulp " + gutil.colors.cyan('create:script:filter') + ' --name <name>:');
            console.log("\t\t<name>: name of the filter.");
            console.log("\n\t\tCreate a new angular filter in " + pathToSrcFilters + ' and update ' + pathToMainFilter +'.');
            console.log("\t\tYou have to add the new script in your html.");
            break;
        case 'create:stylesheet:part':
            console.log("\n\tgulp " + gutil.colors.cyan('create:stylesheet:part') + ' --name <name> [--scss]:');
            console.log("\t\t<name>: name of the new css part.");
            console.log("\t\t--scss: by default the extension of file is sass, but with this option it will be scss.");
            console.log("\n\t\tCreate " + pathToSrcStyles + '/<name>/ folder.');
            console.log("\t\tCreate " + pathToSrcStyles + '/<name>/_<name>.sass (or .scss).');
            console.log('\t\tInclude the created file into ' + pathToSrcMainStyle + ' file.');
            console.log("\t\tYou have to add the new stylesheet in your html.");
            break;
        case 'generate':
            console.log("\n\tgulp " + gutil.colors.cyan('generate') + ' [--prod]:');
            console.log("\t\t--prod: Add .min suffix and uglify the code for scripts and stylesheets.");
            console.log("\t\tUse the generate:* commands to compile the modified files.");
            break;
        case 'generate:html':
            console.log("\n\tgulp " + gutil.colors.cyan('generate:html') + ':');
            console.log("\t\tGenerate html, move *.html file to " + app + '/ folder. Nothing more for the moment.');
            break;
        case 'generate:images':
            console.log("\n\tgulp " + gutil.colors.cyan('generate:images') + ':');
            console.log("\t\tGenerate image, move files from " + src + '/' + images + "/ to " + app + '/' + images + '/. Nothing more for the moment.');
            break;
        case 'generate:scripts':
            console.log("\n\tgulp " + gutil.colors.cyan('generate:scripts') + ' [--prod]:');
            console.log("\t\t--prod: Add .min suffix and uglify the code.");
            console.log("\n\t\tGenerate all coffee scripts in javascript.");
            console.log("\t\tCompiled scripts go in the " + pathToAppScripts + "/ folder.");
            break;
        case 'generate:stylesheets':
            console.log("\n\tgulp " + gutil.colors.cyan('generate:stylesheets') + ' [--prod]:');
            console.log("\t\t--prod: Add .min suffix and uglify the code.");
            console.log("\n\t\tGenerate all .sass|.scss files in css.");
            console.log("\t\tCompiled stylesheets go in the " + pathToAppStyles + "/ folder.");
            break;
        case 'help':
            console.log("\n\tgulp " + gutil.colors.cyan('help') + ':');
            console.log("\t\tDisplay this help.");
            console.log("\t\tYou can use --help option on all commands to see its use.");
            break;
        case 'watch':
            console.log("\n\tgulp " + gutil.colors.cyan('watch') + ' [--prod]:');
            console.log("\t\t--prod: Add .min suffix and uglify the code for scripts and stylesheets.");
            console.log("\n\t\tWait a change of any files in " + src + "/ folder.");
            console.log("\t\tOn change, use the generate:* commands to compile the modified files.");
            break;
        case 'watch:html':
            console.log("\n\tgulp " + gutil.colors.cyan('watch:html') + ':');
            console.log("\t\tWait a change of html files in " + src + "/ folder.");
            console.log("\t\tOn change, use the generate:html command to compile the modified files.");
            break;
        case 'watch:images':
            console.log("\n\tgulp " + gutil.colors.cyan('watch:images') + ':');
            console.log("\t\tWait a change of any files in " + src + "/" + images + "/ folder.");
            console.log("\t\tOn change, use the generate:images command to compile the modified files.");
            break;
        case 'watch:scripts':
            console.log("\n\tgulp " + gutil.colors.cyan('watch:scripts') + ' [--prod]:');
            console.log("\t\t--prod: Add .min suffix and uglify the code for scripts.");
            console.log("\n\t\tWait a change of .coffee|.js file in " + pathToSrcScripts + "/ folder.");
            console.log("\t\tOn change, use the generate:scripts command to compile the modified files.");
            break;
        case 'watch:stylesheets':
            console.log("\n\tgulp " + gutil.colors.cyan('watch:stylesheets') + ' [--prod]:');
            console.log("\t\t--prod: Add .min suffix and uglify the code for stylesheets.");
            console.log("\n\t\tWait a change of .sass|.scss file in " + pathToSrcStyles + "/ folder.");
            console.log("\t\tOn change, use the generate:stylesheets command to compile the modified files.");
            break;
    }
}
