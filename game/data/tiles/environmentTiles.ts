import {
  Crystal001,
  Crystal002,
  Grass001,
  Grass002,
  Grass003,
  Tree001,
  Tree002,
} from '~~/game/entities';
import { Entity } from '~~/game/utils';

export const environmentTiles: {
  [key: string]: new (x: number, y: number) => Entity;
} = {
  '001': Tree001,
  '002': Tree002,
  '003': Crystal001,
  '004': Crystal002,
  '005': Grass001,
  '006': Grass002,
  '007': Grass003,
};
