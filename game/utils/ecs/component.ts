// eslint-disable-next-line import/no-cycle
import { Entity, Lifecycle } from './index';

export interface Component extends Lifecycle {
  readonly entity?: Entity;
}
