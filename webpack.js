const {ConcatSource} = require('webpack-sources');

const matchAll = (pattern, selected) => str => (
  (str.match(new RegExp(pattern, 'g')) || [])
    .map(statement => ({
      statement,
      match: statement.match(new RegExp(pattern, 'i'))[selected],
      rule: pattern
    }))
);

class ReadStoryLaterPlugin {
  constructor({pattern = /\.story\.(jsx?|tsx?)?$/} = {}) {
    this.pattern = pattern;
  }

  apply(compiler) {
    const {pattern} = this;
    compiler.plugin('compilation', function (compilation) {
      compilation.moduleTemplate.plugin('render', function (moduleSource, module) {
        const source = new ConcatSource();
        const moduleContent = moduleSource.source();
        const moduleId = module.identifier();

        if (moduleId && moduleId.match && moduleId.match(pattern) && moduleContent.indexOf('storiesOf') > 0) {
          const stories = [];
          // `storiesOf('storyname',
          stories.push(...matchAll(`storiesOf\\(['"]([^'^"]+)['"]`, 1)(moduleContent).map(({match}) => match));
          // `Object(_storybook_react__WEBPACK_IMPORTED_MODULE_0__["storiesOf"])('storyname',
          stories.push(...matchAll(`storiesOf['"]\\]\\)\\(['"]([^'^"]+)['"]`, 1)(moduleContent).map(({match}) => match));
          // storiesOf)("storyname"
          stories.push(...matchAll(`storiesOf\\)\\(['"]([^'^"]+)['"]`, 1)(moduleContent).map(({match}) => match));

          const isNotValid = stories.length === 0;

          source.add(`
const query = location.search.substr(1).split('&').map( item => item.split('=').map(decodeURIComponent)).reduce( (acc, [key,value]) => { acc[key]=value; return acc;}, {});
if(${isNotValid} || !location.pathname.endsWith('iframe.html') || !query.selectedKind || ${JSON.stringify(stories)}.includes(query.selectedKind)) {
`);
          source.add(moduleSource);
          source.add('}');
        } else {
          source.add(moduleSource);
        }
        return source;
      });
    });
  }
}

module.exports = { ReadStoryLaterPlugin };
