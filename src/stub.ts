let ms: Record<string, any> = {};

function getItem(key: string) {
  return key in ms ? ms[key] : null;
}

function setItem(key: string, value: any) {
  ms[key] = value;
  return true;
}

function removeItem(key: string) {
  const found = key in ms;
  if (found) {
    return delete ms[key];
  }
  return false;
}

function clear() {
  ms = {};
  return true;
}

export default {
  getItem: getItem,
  setItem: setItem,
  removeItem: removeItem,
  clear: clear,
};
