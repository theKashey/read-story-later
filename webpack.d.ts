import { Plugin } from 'webpack';

export interface ReadStoryLaterPluginConstructorProps {
  pattern?: RegExp;
}

export class ReadStoryLaterPlugin extends Plugin {
  constructor(opts?: ReadStoryLaterPluginConstructorProps);
}