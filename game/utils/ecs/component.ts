export abstract class Component {}

export type ComponentConstructor = new (...args: any[]) => Component;
