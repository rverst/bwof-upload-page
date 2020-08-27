import {url} from "./utils";

export function loadImages() {

  return new Promise((resolve, reject) => {
    console.log('load-images', url('/api/posts') );
    fetch(url('api/posts'))
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
  });
}
