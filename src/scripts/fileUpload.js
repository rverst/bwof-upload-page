import {url} from "./utils";

export default class FileUpload {
  constructor(id) {

    this.container = document.getElementById(id);

    document.getElementById('fu-cancel').onclick = (ev) => this.close(false, ev);
    document.getElementById('fu-submit').onclick = (ev) => this.close(true, ev);
    document.getElementById('btn_new').onclick = () => this.open();
  }

  container

  open() {
    this.container.classList.remove('hidden');
    document.addEventListener('keypress', ev => {
      if (ev.key === 'Escape' || ev.key === 'Esc') {
        this.close(false);
      }
    }, {once: true});
  }

  close(upload, event) {

    if (upload) {
      event.preventDefault();
      const frm = document.forms['fu-form'];
      const fu = document.getElementById('fu-url');
      console.log(fu);
      const what = (fu.value === '') ? 'picture' : 'instagram';
      const uri =  url('/api/' + what);

      fetch(uri, {
        method: 'POST',
        body: new FormData(frm)
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          document.ig.addImage(data, true);
          frm.reset();
        })
        .catch(err => {
          console.error(err);
        });
    }

    this.container.classList.add('hidden');
  }

}
