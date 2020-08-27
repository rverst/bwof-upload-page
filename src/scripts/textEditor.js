export default class TextEditor {
  constructor(image) {

    this.image = image;
    document.addEventListener('keydown', ev => {
      if (ev.key === "Escape"
        || ev.key === "Esc") {
        this.close(false);
      }
    }, {once: true});
  }

  mode
  image
  onCloseCb


  open(onCloseCb) {

    document.getElementById('textEditor')
      .classList.remove('hidden');

    // document.getElementById('btn-pic').onclick =
    //   () => {
    //     this.mode = 1;
    //   };
    //
    // document.getElementById('btn-ins').onclick =
    //   () => {
    //     this.mode = 2;
    //   };

    document.getElementById('te-save').onclick =
      () => this.close(true);

    document.getElementById('te-close').onclick =
      () => this.close(false);

    document.getElementById('te-title').value = this.image.title;
    document.getElementById('te-text').value = this.image.text;

    this.onCloseCb = onCloseCb;
  }

  close(save) {
    console.log('close', save);

    if (save) {
      this.image.title = document.getElementById('te-title').value;
      this.image.text = document.getElementById('te-text').value;
    }

    const te = document.getElementById('textEditor');
    if (te !== undefined) {
      te.classList.add('hidden');
    }

    if (this.onCloseCb !== undefined) {
      this.onCloseCb(save, this.image);
    }
  }
}
