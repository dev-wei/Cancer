'use strict';
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

describe('Icomoon', function () {
  it('Generate Icomoon css.', function () {
    var file = path.resolve(__dirname, '../../public/css/fonts/selection.json');
    var content = fs.readFileSync(file, 'UTF-8');
    var json = JSON.parse(content);

    var icons = _.map(json.icons, function(icon){
      return {
        "name": icon.properties.name,
        "code": icon.properties.code
      };
    });

    var iconsCss =_.map(icons, function(icon){
      return '@icomoon-' + icon.name + ':\'\\' + parseInt(icon.code).toString(16) + '\';';
    });
    console.log(iconsCss.join('\r\n'));
  });
});