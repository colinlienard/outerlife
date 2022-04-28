class Editor {
  #canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.#canvas = canvas;
    const context = canvas.getContext('2d');
    context?.fillRect(0, 0, 0, 0);
  }
}

export default Editor;
