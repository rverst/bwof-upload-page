export function url(p) {
  if (p.startsWith('/')) {
    return document.baseUrl + p.substring(1);
  }
  return document.baseUrl + p;
}

export function elementId(id) {
  return 'el_' + id;
}

export function elementChildId(id, tag) {
  return 'el_' + id + '_' + tag;
}
