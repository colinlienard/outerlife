import { Point } from '../types';

export type ControllerEvent = 'joystick-left' | 'joystick-right' | number;

export type ControllerEventCallback<C extends ControllerEvent> = (
  value: C extends string ? Point : never
) => void;

export type Events<C extends ControllerEvent> = Map<
  C,
  ControllerEventCallback<C>[]
>;
