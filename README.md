# AngularJS Environment

## Requirements
Check if you have npm with `npm -v`

## Installation
Download the repository.

```bash
git clone git@github.com:vincent-chapron/angularjs-environment.git
cd angularjs-environment
```
Then install the npm dependencies.

```
npm install
```

Now you can run `gulp`or `gulp help`to see all commands available.

Install bower dependencies and compile your files.

```bash
gulp bower
gulp generate
```

You can open the index.html file in you browser.

## Angular basics
You can start development using
```bash
gulp watch
```

You can easily add controller, directive, factory or filter to your angularJS application.

Let's start with a controller.
```bash
gulp create:script:controller --name first
```
Keep in mind, for each command, you can use --help option. `gulp create:script:controller --help`

As you can see, `src/scripts/controllers/firstController.coffee` has been created and `src/scripts/controllers.coffee` has been updated.

Now you just need to add the following script to your `index.html`

```html
<script src="scripts/controllers/firstController.js"></script>
```

Now, to check if your controller is loaded, use it on your body tag

```html
<body ng-controller="firstController">
```

And try to display something by replacing `<!-- CONTENT GOES HERE -->` with

```html
{{ hello }}
```

don't forget to update your controller, change `# HERE IS YOUR CONTROLLER` with

```coffee
$scope.hello = 'Hello world!'
```

if `gulp watch`doesn't run, use 

```bash
gulp generate
```

If you reload your page (index.html) you should see `Hello world!`

## Style basics
As angular, you can generate css parts for your application.

```bash
gulp create:stylesheet:part --name button
```

You can add `--scss` option to create a .scss file.

A new folder and a new file have been created `src/stylesheets/button/_button.sass`.
This file is now imported in `src/stylesheets/style.sass`.

`style.css` is already imported in your `index.html`.

Try to add the following style in `_button.sass`
```sass
body
    background-color: red
```
if `gulp watch`doesn't run, use 

```bash
gulp generate
```

If you reload your page (index.html) you should see a red page.

## Live reload
Live reload is implemented in all watch commands.

```
gulp watch
```

now, go on your browser and active live reload.
Return on you css, html, of coffee file, update it, save it and look at your browser reload automatically.

## Futur
I will try to implement more commands, I surely start with auto-import of scripts and stylesheets in index.html.
Don't forget to fork, thanks ;)
