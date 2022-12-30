import { Dialogue } from '~~/game/utils';

export abstract class DialogueManager {
  private static dialogues = new Map<number, Dialogue>();

  private static open = false;

  private static async load(id: number) {
    if (this.dialogues.has(id)) {
      return;
    }

    const dialogue = (await import(
      `../../data/dialogues/dialogue-${id}.json`
    )) as Dialogue;

    this.dialogues.set(id, dialogue);
  }

  static async start(id: number) {
    await this.load(id);

    this.open = true;

    return this.dialogues.get(id) as Dialogue;
  }

  static end() {
    this.open = false;
  }

  static isOpen() {
    return this.open;
  }
}
