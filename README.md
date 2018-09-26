# read-story-later
Defer story-pages execution and isolate chapters

## How it works
It alters source code, executing only the "current" storybook story.

- if current page is `iframe.html`
- and current file define a story
- and the story name equals to `selectedKind` query param
- then execute file, and all files required from it
-  .....
- in other case - dont.

This wont decrease script _evaluation_ time or script size, but will sky rocket script execution and will remove
any side effects, running your story in isolation

> For example - any styled-component, every used in your codebase, will create a STYLE. Even if it never got used.

## Configuration
Just add a new webpack plugin. 
```js
import { ReadStoryLaterPlugin } from 'read-story-later/webpack';

module.exports = {  
  plugins: [
    ...
    new ReadStoryLaterPlugin(),
    
    // you may change used `story` pattern
    new ReadStoryLaterPlugin({ pattern: /\.story\.(jsx?|tsx?)?$/}),
  ]
}
```

# License
MIT