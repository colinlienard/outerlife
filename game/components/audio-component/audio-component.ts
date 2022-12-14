import { Component } from '~~/game/utils';

export class AudioComponent implements Component {
  sources: string[];

  constructor(sources: string[]) {
    this.sources = sources;
  }
}
