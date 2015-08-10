'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var thinksay = require('thinksay');
var htmlwiring = require("html-wiring");
var ncp = require('ncp');

var bowerDependencies = false;

var gruntPackageLookup = {
	"bower-install-simple":["bower","grunt-bower-install-simple"],
	"modernizr":["grunt-modernizr"],
	"copy":["grunt-contrib-copy"],

	"newer:browserify:babel":["grunt-browserify","babelify","grunt-babel"],
	"newer:jscs":["grunt-jscs"],
	"newer:eslint":["grunt-eslint"],
	"newer:uglify":["grunt-contrib-uglify"],

	"sass":["grunt-sass"],
	"newer:sass-convert":["grunt-sass-convert"],
	"newer:csslint":["grunt-contrib-csslint"],
	"newer:postcss":["grunt-postcss","autoprefixer-core"],
	"newer:stripmq":["grunt-stripmq"],
	"newer:cssmin":["grunt-contrib-cssmin"],

	"newer:zetzer":["grunt-zetzer"],
	"wiredep":["grunt-wiredep"],
	"newer:htmlhintplus":["grunt-htmlhint-plus"],

	"real_favicon":["grunt-real-favicon"],
	"svgmin:icons":["grunt-svgmin"],
	"grunticon:build":["grunt-grunticon"],

	"newer:imagemin":["grunt-contrib-imagemin"],
	"newer:webp":["webp-bin","grunt-webp"],

	"newer:jsdoc":["grunt-jsdoc"],
	"exec:styleguide":["grunt-exec","gulp","gulp-sass","sc5-styleguide","sassdoc"],
	"newer:phantomas":["phantomas","grunt-phantomas"],

  "phantomcss":["phantomjs@1.9.7-14","git://github.com/anselmh/grunt-phantomcss.git"]
}

var thinkDependancies = [
  "th-nk-modules/css.constants",
  "th-nk-modules/css.defaults",
  "th-nk-modules/css.elements",
  "th-nk-modules/css.functions",
  "th-nk-modules/css.mixins",
  "th-nk-modules/css.normalize",
  "th-nk-modules/css.placeholders",
  "th-nk-modules/css.utility",
  "th-nk-modules/js.ajax",
  "susy"
];

var bowerFeaturesArr = [
    {name:'jquery',value:'jquery',checked:false},
    {name:'velocity',value:'velocity',checked:false},
    {name:'snap.svg',value:'snap.svg',checked:false},
    {name:'animate.css',value:'animate.css',checked:false},
    {name:'modernizr',value:'modernizr',checked:true},
    {name:'hammerjs',value:'hammerjs',checked:true},
    {name:'normalize.css',value:'normalize.css',checked:false},
]

var preOpsFeaturesArr =[
    {name:'copy',value:'copy',checked:true},
]

var jsFeaturesArr =[
    {name:'newer:browserify:babel',value:'newer:browserify:babel',checked:true},
    {name:'newer:jscs',value:'newer:jscs',checked:true},
    {name:'newer:eslint',value:'newer:eslint',checked:true},
    {name:'newer:uglify',value:'newer:uglify',checked:true},
]

var cssFeaturesArr =[
    {name:'sass',value:'sass',checked:true},
    {name:'newer:sass-convert',value:'newer:sass-convert',checked:true},
    {name:'newer:csslint',value:'newer:csslint',checked:true},
    {name:'newer:postcss',value:'newer:postcss',checked:true},
    {name:'newer:stripmq',value:'newer:stripmq',checked:true},
    {name:'newer:cssmin',value:'newer:cssmin',checked:true},
]

var htmlFeaturesArr =[
    {name:'newer:zetzer',value:'newer:zetzer',checked:true},
    {name:'newer:htmlhintplus',value:'newer:htmlhintplus',checked:true},
]

var iconsFeaturesArr =[
    {name:'real_favicon',value:'real_favicon',checked:false},
    {name:'svgmin:icons',value:'svgmin:icons',checked:false},
    {name:'grunticon:build',value:'grunticon:build',checked:false},
]

var imagesFeaturesArr =[
    {name:'newer:imagemin',value:'newer:imagemin',checked:false},
    {name:'newer:webp',value:'newer:webp',checked:false},
]

var testsFeaturesArr =[
    {name:'phantomcss',value:'phantomcss',checked:false}
]

var docsFeaturesArr =[
    {name:'newer:jsdoc',value:'newer:jsdoc',checked:true},
    {name:'exec:styleguide',value:'exec:styleguide',checked:true},
    {name:'newer:phantomas',value:'newer:phantomas',checked:false},
]

var watchersFeaturesArr = [];


function hasFeature(feat,arr) { //one feature
    return arr.indexOf(feat) !== -1; 
}

function hasFeatures(feat,feat2,arr) { //two features
    if(arr.indexOf(feat) !== -1){
        return arr.indexOf(feat2) !== -1
    }
    else{
        return false;
    }
}



module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },
  

  prompting: function () {
      
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(thinksay(
      'Welcome to the TH_NK generator'
    ));

    var promptName = [{
      type: 'input',
      name: 'name',
      message: 'What is the name of your project?',
      default: this.appname
    }];
    
  	var preOpsFeatures= [{
        type: 'checkbox',
        name: 'modules',
        message: 'Which pre-ops grunt tasks do you want to include?',
        choices: preOpsFeaturesArr
    }];
    
    var jsFeatures= [{
        type: 'checkbox',
        name: 'modules',
        message: 'Which js grunt tasks do you want to include?',
        choices: jsFeaturesArr
    }];
    
    var cssFeatures= [{
        type: 'checkbox',
        name: 'modules',
        message: 'Which css grunt tasks do you want to include?',
        choices: cssFeaturesArr
    }];
    
    var htmlFeatures= [{
        type: 'checkbox',
        name: 'modules',
        message: 'Which html grunt tasks do you want to include?',
        choices: htmlFeaturesArr
    }];
    
    var iconsFeatures= [{
        type: 'checkbox',
        name: 'modules',
        message: 'Which icon grunt tasks do you want to include?',
        choices: iconsFeaturesArr
    }];
    
    var imagesFeatures= [{
        type: 'checkbox',
        name: 'modules',
        message: 'Which image grunt tasks do you want to include?',
        choices: imagesFeaturesArr
    }];
    
    var testsFeatures= [{
        type: 'checkbox',
        name: 'modules',
        message: 'Which test grunt tasks do you want to include?',
        choices: testsFeaturesArr
    }];

    var docsFeatures= [{
        type: 'checkbox',
        name: 'modules',
        message: 'Which docs grunt tasks do you want to include?',
        choices: docsFeaturesArr
    }];
    
    var watchersFeatures= [{
        type: 'checkbox',
        name: 'modules',
        message: 'Which watch grunt tasks do you want to include?',
        choices: watchersFeaturesArr
    }];
    
    
    var bowerFeatures= [{
        type: 'checkbox',
        name: 'modules',
        message: 'Now choose some bower packages...',
        choices: bowerFeaturesArr
    }];


    this.prompt(promptName, function (nameanswers) {
  		this.projectName = nameanswers.name;
              
        this.prompt(bowerFeatures, function (answers) {
      		this.bowerFeatures = answers.modules;
              
            if(this.bowerFeatures.length>0){
                bowerDependencies = true;
            }
      		
      		this.prompt(preOpsFeatures, function (answers) {
                this.preOpsFeatures = answers.modules;
                
                this.prompt(jsFeatures, function (answers) {
                    this.jsFeatures = answers.modules;
                    
                    this.prompt(cssFeatures, function (answers) {
                        this.cssFeatures = answers.modules;
                        
                        this.prompt(htmlFeatures, function (answers) {
                            this.htmlFeatures = answers.modules;
                            
                            this.prompt(iconsFeatures, function (answers) {
                                this.iconsFeatures = answers.modules;
                                
                                this.prompt(imagesFeatures, function (answers) {
                                    this.imagesFeatures = answers.modules;
                                    
                                    this.prompt(testsFeatures, function (answers) {
                                        this.testsFeatures = answers.modules;

                                    this.prompt(docsFeatures, function (answers) {
                                        this.docsFeatures = answers.modules;
                                        
                                        //check for features and generate dynamic watch list
                                        addWatchTasks('sass','watch:css',this.cssFeatures,true);
                                        addWatchTasks('newer:browserify:babel','watch:js',this.jsFeatures,true);
                                        addWatchTasks('newer:zetzer','watch:html',this.htmlFeatures,true);
                                        addWatchTasks('real_favicon','watch:favicon',this.iconsFeatures,true);
                                        addWatchTasks('svgmin:icons','watch:svgmin',this.iconsFeatures,true);
                                        addWatchTasks('grunticon:build','watch:grunticon',this.iconsFeatures,true);
                                        
                                        function addWatchTasks(mod,wMod,arr,checked){
                                            if(hasFeature(mod,arr)){
                                                watchersFeaturesArr.push(
                                                    {name:wMod,value:wMod,checked:checked}
                                                )
                                            }
                                        }
                                        
                                        if(bowerDependencies){
                                            watchersFeaturesArr.push(
                                                {name:'watch:deps',value:'watch:deps',checked:true}
                                            )
                                        }
                                        
                                        //check if there are any watch questions to show and if not just continue
                                        if(watchersFeaturesArr.length>0){
                                            
                                            //run watcher prompt
                                            this.prompt(watchersFeatures, function (answers) {
                                                this.watchersFeatures = answers.modules;
                                            
                                                loadRemoteData.call(this);
                                    
                                            }.bind(this));
                                            
                                        }
                                        else{
                                            loadRemoteData.call(this);
                                        }
                                        
                                        
                                        function loadRemoteData(){
                                            //get remote data and copy to root
                                            this.remote('sionnnn', 'fink','master', function(err, remote) {
                                                
                                                ncp(remote.cachePath,this.destinationPath(),function(err){
                                                    done();
                                                });
                                                //move to next step
                                                
                                               
                                            }.bind(this),true);
                                        }
                                        
                                        
                                    }.bind(this))

                                    }.bind(this))
                                    
                                }.bind(this))
                                
                            }.bind(this))
                            
                        }.bind(this))
                        
                    }.bind(this))
                    
                }.bind(this))
                
            }.bind(this))
          
        }.bind(this))
        
    }.bind(this))
    
    
    
  },

  writing: function(){
              
      var packageFile = htmlwiring.readFileAsString('package.generate.json');
      packageFile = packageFile.replace("F_NK",this.projectName);
      htmlwiring.writeFileFromString(packageFile,'package.json');

      var _this = this;
      
      function htmlHintPlusIncluded(){
          if(hasFeature('newer:htmlhintplus',_this.htmlFeatures)){
              var string = {'package': 'grunt-htmlhint-plus'};
            return string;
          }
          else{
              return false;
          }
      }
      
      this.tasksData = {
          "pre_ops": {
              "tasks": {
                  "clean":true,
                  "copy": hasFeature('copy',this.preOpsFeatures),
                  "bower-install-simple": bowerDependencies,
                  "newer:modernizr": hasFeature('modernizr',this.bowerFeatures),
              }
          },
          "js": {
              "tasks": {
                  "newer:browserify:babel": hasFeature('newer:browserify:babel',this.jsFeatures),
                  "newer:jscs": hasFeature('newer:jscs',this.jsFeatures),
                  "newer:eslint": hasFeature('newer:eslint',this.jsFeatures),
                  "newer:uglify": hasFeature('newer:uglify',this.jsFeatures)
              }
          },
          "css": {
              "tasks": {
                  "sass": hasFeature('sass',this.cssFeatures),
                  "newer:sass-convert": hasFeatures('sass','newer:sass-convert',this.cssFeatures),
                  "newer:csslint": hasFeature('newer:csslint',this.cssFeatures),
                  "newer:postcss": hasFeature('newer:postcss',this.cssFeatures),
                  "newer:stripmq": hasFeature('newer:stripmq',this.cssFeatures),
                  "newer:cssmin": hasFeature('newer:cssmin',this.cssFeatures)
              }
          },
          "html": {
              "tasks": {
                  "newer:zetzer": hasFeature('newer:zetzer',this.htmlFeatures),
                  "wiredep": bowerDependencies,
                  "newer:htmlhintplus": htmlHintPlusIncluded(),
              }
          },
          "icons": {
              "tasks": {
                  "real_favicon": hasFeature('real_favicon',this.iconsFeatures),
                  "svgmin:icons": hasFeature('svgmin:icons',this.iconsFeatures),
                  "grunticon:build": hasFeature('grunticon:build',this.iconsFeatures)
              }
          },
          "images": {
              "tasks": {
                  "newer:imagemin": hasFeature('newer:imagemin',this.imagesFeatures),
                  "newer:webp": hasFeature('newer:webp',this.imagesFeatures),
              }
          },
          "docs": {
              "devonly":true,
              "tasks": {
                  "newer:jsdoc": hasFeature('newer:jsdoc',this.docsFeatures),
                  "exec:styleguide": hasFeature('exec:styleguide',this.docsFeatures),
                  "newer:phantomas": hasFeature('newer:phantomas',this.docsFeatures),
              }
          },
          "tests":{
            "tasks":{
              "phantomcss":hasFeature('phantomcss',this.testsFeatures)
            }
          },
          "watchers": this.watchersFeatures
    }
    
    

    //copy bower.json file
    this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
    );
    
    //install grunt modules
    installGruntDependencies([this.preOpsFeatures,this.jsFeatures,this.cssFeatures,this.htmlFeatures,this.iconsFeatures,this.imagesFeatures,this.docsFeatures,this.testsFeatures])
    
    function installGruntDependencies(arrays){
        for(var i=0;i<arrays.length;i++){
            for(var e=0;e<arrays[i].length;e++){
                
                var packs = gruntPackageLookup[arrays[i][e]];
                for(var o=0;o<packs.length;o++){
                    _this.npmInstall([packs[o]], { 'saveDev': true});
                }
            }
        }
    }
    
    //install bower dependencies
    for(var i=0;i<this.bowerFeatures.length;i++){
        console.log(_this.bowerFeatures[i])
        if(_this.bowerFeatures[i] == "jquery"){
          _this.bowerInstall([_this.bowerFeatures[i]], { "saveDev" : true});
        }else{
          _this.bowerInstall([_this.bowerFeatures[i]], { "save" : true});
        }
    }
    
    for(var i=0;i<thinkDependancies.length;i++){
        _this.bowerInstall([thinkDependancies[i]], { 'saveDev': true});
    }
    
  
    
  },
    end:function(){
        var _this = this;
        fs.unlink("grunt_tasks.json", function(){
            fs.writeFile("grunt_tasks.json", JSON.stringify(_this.tasksData, null, 2), function(err) {
            })
        })

  },

  install: function () {
    this.installDependencies();
  }
});
