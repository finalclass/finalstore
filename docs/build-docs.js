#!/usr/local/bin/node

var fs = require('fs');

fs.readdir(__dirname, function (err, files) {
    var contents = [],
        mdFiles;

    mdFiles = files.filter(function (file) {
        return file.substr(-3) === '.md' && 
               file !== 'latest-build.md';
    });

    mdFiles.sort();

    mdFiles.forEach(function (file, index) {
        contents.push(fs.readFileSync(file, 'utf-8'));
    });

    fs.writeFile(__dirname + '/latest-build.md', contents.join('\n\n'));

});