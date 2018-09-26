import { Plugin } from 'webpack';

interface ContructorProps {
  pattern?: RegExp;
}

declare class ReadLaterPlugin extends Plugin {
  constructor(opts: ContructorProps);
}

export = ReadLaterPlugin;