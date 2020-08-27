import Croppr from "croppr";
import {elementChildId, url} from "./utils";

export default class ImageEditor {
  constructor(image) {

    this.image = image;
    this.imageRatio = this.image.height / this.image.width;
    this.x1 = this.image.top_crop.Min.X;
    this.y1 = this.image.top_crop.Min.Y;
    this.x2 = Math.min(this.image.top_crop.Max.X, this.image.width);
    this.y2 = Math.min(this.image.top_crop.Max.Y, this.image.height);

    this.w = Math.min(this.x2 - this.x1, this.image.width);
    this.h = Math.min(this.y2 - this.y1, this.image.height);

    if (this.w === 0 || this.h === 0) {
      this.w = 200;
      this.h = this.w * this.targetRatio;
    }

    console.info(`dimensions: ${this.image.width}x${this.image.height} | ratio: (${this.imageRatio})`);
    console.info(`top_crop: ${this.w}x${this.h} = (${this.x1},${this.y1} | ${this.x2},${this.y2})`);
    console.info(this.image);

    this.imgTag = document.createElement('img');
    this.imgTag.src = url(this.image.orig_url);

    const iconCancel = document.createElement('i');
    iconCancel.className = 'icon material-icons md-light md-48';
    iconCancel.innerText = 'close';
    iconCancel.onclick = () => this.close(false);

    const iconSave = document.createElement('i');
    iconSave.className = 'icon material-icons md-light md-48';
    iconSave.innerText = 'save';
    iconSave.onclick = () => this.close(true);

    const iconTopCrop = document.createElement('i');
    iconTopCrop.className = 'icon material-icons md-light md-48';
    iconTopCrop.innerText = 'crop_free';
    iconTopCrop.onclick = () => {
      if (this.croppr !== undefined) {
        this.destroyCroppr();
      }
      this.createCroppr(this.getRatio(), this.image.cropped_bounds);
    };

    const iconOriginalCrop = document.createElement('i');
    iconOriginalCrop.className = 'icon material-icons md-light md-48';
    iconOriginalCrop.innerText = 'crop_original';
    iconOriginalCrop.onclick = () => {
      if (this.croppr !== undefined) {
        this.destroyCroppr();
      }
    };

    const iconLastCrop = document.createElement('i');
    iconLastCrop.className = 'icon material-icons md-light md-48';
    iconLastCrop.innerText = 'transform';
    iconLastCrop.onclick = () => {
      if (this.croppr !== undefined) {
        this.destroyCroppr();
      }
      this.createCroppr(this.getRatio(), this.image.top_crop);
    };

    const iconRatio = document.createElement('i');
    iconRatio.className = 'icon material-icons md-light md-48' + ((this.imageRatio <= 0.8) ? ' active' : '');
    iconRatio.innerText = 'crop_16_9';
    iconRatio.onclick = () => {

      if (this.croppr !== undefined) {
        this.destroyCroppr();
      }

      if (iconRatio.classList.contains('active')) {
        iconRatio.classList.remove('active');

        this.createCroppr(null);
      } else {
        iconRatio.classList.add('active');

        this.createCroppr(this.targetRatio);
      }
    };

    const iconContainerR = document.createElement('div');
    iconContainerR.id = elementChildId(this.image.id, 'icr');
    iconContainerR.className = 'icon-container right';
    iconContainerR.appendChild(iconSave);
    iconContainerR.appendChild(iconCancel);

    const iconContainerL = document.createElement('div');
    iconContainerL.id = elementChildId(this.image.id, 'icl');
    iconContainerL.className = 'icon-container left';
    iconContainerL.appendChild(iconOriginalCrop);
    iconContainerL.appendChild(iconTopCrop);
    iconContainerL.appendChild(iconLastCrop);
    iconContainerL.appendChild(iconRatio);

    this.innerDivTag = document.createElement('div');
    this.innerDivTag.className = 'image';
    this.innerDivTag.appendChild(iconContainerL);
    this.innerDivTag.appendChild(iconContainerR);
    this.innerDivTag.appendChild(this.imgTag);

    this.wrapperDivTag = document.createElement('div');
    this.wrapperDivTag.className = 'imageEdit';
    this.wrapperDivTag.appendChild(this.innerDivTag);

    document.addEventListener('keydown', ev => {
      if (ev.key === "Escape"
        || ev.key === "Esc"
        || ev.key === "q") {
        this.close(false);
      } else if (ev.key === 's') {
        this.close(true);
      }
    }, {once: true});

  }

  targetRatio = 0.5625;
  image
  imageRatio
  imgTag
  innerDivTag
  wrapperDivTag
  x1
  y1
  x2
  y2
  w
  h

  croppr = undefined
  onCloseCb

  open(onCloseCb) {

    this.onCloseCb = onCloseCb;
    document.body.appendChild(this.wrapperDivTag);

    if (this.image.use_crop) {
      this.createCroppr(this.getRatio(), this.image.cropped_bounds);
    }
  }

  close(save) {

    let crop = undefined;
    if (this.croppr !== undefined) {
      crop = this.croppr.getValue('real');
      this.croppr.destroy();
    }
    document.body.removeChild(this.wrapperDivTag);
    if (this.onCloseCb !== undefined) {
      this.onCloseCb(save, crop, this.image);
    }
  }

  createCroppr(ratio, bounds) {
    console.log('createCroppr', ratio, bounds);

    let size = [100, 100, 'px'];
    let posx = 10;
    let posy = 10;
    if (bounds !== null && bounds !== undefined) {
      size = [Math.max(100, bounds.Max.X - bounds.Min.X),
        Math.max(100,  bounds.Max.Y - bounds.Min.Y), 'px'];
      posx = bounds.Min.X;
      posy = bounds.Min.Y;
    }

    console.log('createCroppr', size, posx, posy);
    this.croppr = new Croppr(this.imgTag, {
      aspectRatio: ratio,
      startSize: size,
      onInitialize(instance) {
        instance.moveTo(posx, posy);
      }
    });
  }

  destroyCroppr() {
    this.croppr.destroy();
    this.croppr = undefined;
  }

  getRatio() {
    return (this.imageRatio <= 0.8) ? this.targetRatio : null;
  }
}
