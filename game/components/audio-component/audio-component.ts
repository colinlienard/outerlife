import { Component, getRandomNumber } from '~~/game/utils';
import { EffectOptions } from '~~/game/managers';

interface RecurringSound extends Omit<EffectOptions, 'spatialization'> {
  readonly source: string;
  readonly spatialization: boolean;
  readonly randomFramesBetween: [number, number];
  framesBetween: number;
  frameWaiter: number;
}

type RecurringSoundProps = Omit<
  RecurringSound,
  'frameWaiter' | 'framesBetween'
>;

export class AudioComponent implements Component {
  readonly sources: string[];

  recurringSounds: RecurringSound[] = [];

  constructor(sources: string[], recurringSounds?: RecurringSoundProps[]) {
    this.sources = sources;
    if (recurringSounds) {
      this.recurringSounds = recurringSounds.map((item) => ({
        ...item,
        framesBetween: getRandomNumber(...item.randomFramesBetween),
        frameWaiter: 0,
      }));
    }
  }
}
