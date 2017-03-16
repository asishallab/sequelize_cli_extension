var jsb = require('js-beautify').js_beautify;

module.exports = {

  associationsArray: function(associationsStr) {
    return associationsStr.trim().split(/\s+|,/).filter(function(x) {
      return x !== ''
    }).map(function(x) {
      return x.trim().split(/:/)
    })
  },

  generateJs: function(templateName, options) {
    return ejs.renderFile(
      path.resolve(__dirname, 'views', 'pages', templateName + '.ejs'),
      options, {},
      function(err, str) {
        return jsb(str);
      });
  }

}
