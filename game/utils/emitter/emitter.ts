export class Emitter {
  protected static events = new Map<string, ((...args: any[]) => void)[]>();

  static emit(event: string, ...args: any[]) {
    if (!this.events.has(event)) {
      throw new Error(`Emitter '${event}' has not been created.`);
    }
    this.events.get(event)?.forEach((callback) => callback(...args));
  }

  static on(event: string, callback: (...args: any[]) => void) {
    this.events.set(event, [...(this.events.get(event) || []), callback]);
  }

  static unbind(event: string) {
    this.events.delete(event);
  }
}
