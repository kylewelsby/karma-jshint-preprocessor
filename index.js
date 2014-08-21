(function (){
  'use strict';
  var JSHintReporter = function(loggerFactory, jshintPreprocessorConfig) {
    var jshint, jshintcli, pathToJshintrc, log, RcLoader, rcLoader;

    RcLoader = require('rcloader');
    jshint = require('jshint').JSHINT;
    jshintcli = require('jshint/src/cli');
    pathToJshintrc = jshintPreprocessorConfig && jshintPreprocessorConfig.jshintrc;
    rcLoader = new RcLoader('.jshintrc', pathToJshintrc || null, {
      loader: function (path) {
        var cfg = jshintcli.loadConfig(path);
        delete cfg.dirname;
        return cfg;
      }
    });
    log = loggerFactory.create('preprocessor.jshint');


    return function(content,file,done){
      var i, errors;
      log.debug('Processing "%s".', file.originalPath);
      rcLoader.for(file.path, function (err,cfg) {
        if(err) {
          return done(content);
        }
        var globals, success;

        if(cfg.globals) {
          globals = cfg.globals;
          delete cfg.globals;
        }

        success = jshint(content, cfg, globals);
        if(!success) {
          errors = jshint.data().errors;
          for(i=0;i<errors.length;i++){
            log.error(
              file.originalPath +
              ': line ' +
              errors[i].line +
              ', col ' +
              errors[i].character +
              ', ' +
              errors[i].reason +
              ' \n`' + errors[i].evidence + '`'
            );
          }
        }

      });


      return done(content);
    };

  };

  JSHintReporter.$inject = ['logger', 'config.jshintPreprocessor'];

  module.exports = {
    'preprocessor:jshint': ['factory', JSHintReporter]
  };
}).call(this);
