/*
 * gulp-api2swagger-ext
 * 
 * Copyright (c) 2017 Yaser, contributors
 * Licensed under the MIT license.
 * https://github.com/Yaser-Amin/gulp-api2swagger-ext/blob/master/LICENSE
 */

// through2 is a thin wrapper around node transform streams
const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const fs = require('fs');
const api2swagger = require('api2swagger-ext');
const touch = require('touch');

// ConstsÍ
const PLUGIN_NAME = 'gulp-api2swagger-ext';

// Plugin level function(dealing with files)
function gulpApi2SwaggerExt(outputFile) {

    if (typeof outputFile !== 'string') throw new PluginError(PLUGIN_NAME, 'Missing output file!');

    // Creating a stream through which each file will pass
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            // return empty file
            // gutil.log('empty file');
            cb(null, file);
        }

        let inputFile = JSON.parse(file.contents);        
        // gutil.log(`${(new Date()).toTimeString()} Start processing api endpoint ${inputFile.method}:${inputFile.endpoint}`);
        // gutil.log(inputFile);
        api2swagger.processRequest({
            endpoint: inputFile.endpoint,
            httpMethod: inputFile.method,
            output: outputFile,
            headers: ['Content-Type:application/json'],
            input: inputFile,
        }, (err) => {
            // gutil.log(`${(new Date()).toTimeString()} End processing api endpoint ${inputFile.method}:${inputFile.endpoint}`);
            this.push(file);
            cb(err, file);
        });
    });

}

// Exporting the plugin main function
module.exports = gulpApi2SwaggerExt;