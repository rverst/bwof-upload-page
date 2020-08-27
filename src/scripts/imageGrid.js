import {loadImages} from "./api";
import {url} from "./utils";
import ImageEditor from "./imageEditor";
import TextEditor from "./textEditor";

export default class ImageGrid {
  constructor(id) {

    this.baseElement = document.getElementById(id);
    if (this.baseElement === null || this.baseElement === undefined) {
      console.error(`can't find element: ${id}`);
    }
    this.baseElement.classList.add('imageGrid');

    loadImages().then(data => {
      console.log(data);
      this.imageList = data;
      this.addImages();
    }).catch(err => console.log(err));
  }

  baseElement
  imageList
  imageEditor
  textEditor

  addImages() {
    this.imageList.forEach((picItem, i) => {
      this.addImage(picItem, false);
    });
  }

  addImage(item, upFront) {
    const img = document.createElement('img');
    if (item.type === 1) {
      img.src = item.use_crop ? url(item.thumb_crop_url) : url(item.thumb_url);
    }
    else {
      img.src = url(item.thumb_url);
    }
    img.onload = ev => {
      const w = ev.currentTarget.width;
      const h = ev.currentTarget.height;
      if (h > w) {
        ev.currentTarget.classList.add('scale-height');
      } else {
        ev.currentTarget.classList.add('scale-width');
      }
    };


    const figCap = document.createElement('figcaption');
    if (item.type === 1) {

      const iconEditPic = document.createElement('i');
      iconEditPic.className = 'icon crop material-icons md-48';
      iconEditPic.innerText = 'crop';
      iconEditPic.onclick = ev => this.openImageEditor(ev, item);

      const iconEditTxt = document.createElement('i');
      iconEditTxt.className = 'icon edit material-icons md-48';
      iconEditTxt.innerText = 'edit';
      iconEditTxt.onclick = ev => this.openTextEditor(ev, item);

      figCap.appendChild(iconEditPic);
      figCap.appendChild(iconEditTxt);
    }

    const iconDisable = document.createElement('i');
    iconDisable.className = 'icon crop material-icons md-48';
    iconDisable.innerText = item.disabled ? 'visibility_off' : 'visibility';
    iconDisable.onclick = ev => this.disableItem(ev, iconDisable, item);

    const iconDel = document.createElement('i');
    iconDel.className = 'icon crop material-icons md-48';
    iconDel.innerText = 'delete';
    iconDel.onclick = ev => this.deleteImage(ev, item);

    figCap.appendChild(iconDisable);
    figCap.appendChild(iconDel);

    const fig = document.createElement('figure');
    fig.appendChild(img);
    fig.appendChild(figCap);

    const wrapper = document.createElement('div');
    wrapper.id = item.id;
    wrapper.appendChild(fig);

    if (upFront) {
      this.baseElement.insertBefore(wrapper, this.baseElement.firstChild);
    } else {
      this.baseElement.appendChild(wrapper);
    }
  }

  openImageEditor(ev, item) {
    this.imageEditor = new ImageEditor(item);
    this.imageEditor.open((save, crop, image) => {
      const uri =  url('/api/picture/' + item.id + '/crop');
      console.info('imageEditor onClose', save, uri, crop, image);
      if (!save) {
        return;
      }

      fetch(uri, {
        method: 'PATCH',
        body: JSON.stringify({crop: crop})
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          location.reload();
        })
        .catch(err => {
          console.error(err);
        });
    });
  }

  openTextEditor(ev, item) {
    this.textEditor = new TextEditor(item);
    this.textEditor.open((save, image) => {
      if (!save) {
        return;
      }
      const what = (item.type === 1) ? 'picture' : 'instagram';
      const uri =  url('/api/'+ what +'/' + item.id + '/edit');
      console.info('textEditor onClose', save, uri, image);
      fetch(uri, {
        method: 'PATCH',
        body: JSON.stringify({title: image.title, text: image.text})
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          location.reload();
        })
        .catch(err => {
          console.error(err);
        });
    });
  }

  deleteImage(ev, item) {
    let r = confirm("Soll das Bild wirklich gelöscht werden?");
    if (r === true) {
      const what = (item.type === 1) ? 'picture' : 'instagram';
      const uri =  url('/api/' + what + '/' + item.id);
      console.log("DELETE",uri, item);
      fetch(uri, {
        method: "DELETE"
      })
        .then(data => {
          console.log(data);
          location.reload();
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  disableItem(ev, iconDisable, item) {
    const what = (item.type === 1) ? 'picture' : 'instagram';
    const uri =  url('/api/' + what + '/' + item.id + '/disable');
    console.log("DISABLE", uri, item);
    fetch(uri, {
      method: 'PATCH',
      body: JSON.stringify({disable: !item.disabled})
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        location.reload();
      })
      .catch(err => {
        console.error(err);
      });

  }
}
