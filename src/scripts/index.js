import '../styles/index.scss';
import 'croppr/dist/croppr.min.css';

import ImageGrid from "./imageGrid";
import FileUpload from "./fileUpload";

document.baseUrl = '../';
document.fu = undefined;
document.ig = undefined;

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
  document.baseUrl = 'http://localhost:8000/';
  //document.baseUrl = 'https://bwof.rverst.dev/';
}

function init() {
  console.log('Benni\'s Wall of Fame - Upload');
  document.fu = new FileUpload('fileUpload');
  document.ig = new ImageGrid('imageGrid');
}

init();
