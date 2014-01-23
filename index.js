(function (){
  'use strict';
  var JSHintReporter = function(loggerFactory) {
    var jshint, log;
    jshint = require('jshint').JSHINT;
    log = loggerFactory.create('preprocessor.jshint');

    return function(content,file,done){
      var i, errors;
      log.debug('Processing "%s".', file.originalPath);
      if(!jshint(content)) {
        errors = jshint.data().errors;
        for(i=0;i<errors.length;i++){
          log.info(
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
      
      return done(content);
    };

  };

  JSHintReporter.$inject = ['logger'];

  module.exports = {
    'preprocessor:jshint': ['factory', JSHintReporter]
  };
}).call(this);
