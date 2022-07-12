export abstract class Component {}

export type ComponentInstance = new (...args: any[]) => Component;
