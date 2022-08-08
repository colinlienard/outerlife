import { Tilemap } from '~~/game/utils';
import { map001 } from './map001';
import { map002 } from './map002';

export const tilemapIndex: Record<string, Tilemap> = {
  '001': map001,
  '002': map002,
};
