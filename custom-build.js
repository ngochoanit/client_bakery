const jsdom = require('jsdom');
const fs = require('fs');

// eslint-disable-next-line no-extend-native
String.prototype.replaceAll = function (str1, str2, ignore) {
  return this.replace(
    new RegExp(
      // eslint-disable-next-line no-useless-escape
      str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, '\\$&'),
      ignore ? 'gi' : 'g',
    ),
    typeof str2 === 'string' ? str2.replace(/\$/g, '$$$$') : str2,
  );
};

fs.readFile('./build/index.html', 'utf8', (error, data) => {
  const dom = new jsdom.JSDOM(data);
  data = dom.serialize().replaceAll('/static', './static');
  data = data.replaceAll('/image/logo.png', './image/logo.png');
  data = data.replaceAll('/manifest', './manifest');
  data = data.replaceAll(
    '/plugins/jsoneditor/dist/jsoneditor.min.css',
    './plugins/jsoneditor/dist/jsoneditor.min.css',
  );
  data = data.replaceAll('/css/nprogress.min.css', './css/nprogress.min.css');
  data = data.replaceAll('/js/highcharts.js', './js/highcharts.js');
  data = data.replaceAll('/js/exporting.js', './js/exporting.js');
  data = data.replaceAll('/js/export-data.js', './js/export-data.js');
  data = data.replaceAll('/js/alasql.min.js', './js/alasql.min.js');
  data = data.replaceAll('/js/xlsx.core.min.js', './js/xlsx.core.min.js');
  data = data.replaceAll('React App', 'CMS CRM');
  fs.writeFile('./build/index.html', data, (error) => {
    if (error) throw error;
  });
});
