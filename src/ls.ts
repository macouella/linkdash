import stub from "./stub";
let ls: typeof stub | Storage = stub;

try {
  if ("localStorage" in window && window.localStorage) {
    ls = window.localStorage;
  }
} catch (e) {
  console.info("using stubbed local storage");
}

export function accessor(key: string, value: any) {
  if (arguments.length === 1) {
    return get(key);
  }
  return set(key, value);
}

export function get(key: string) {
  return JSON.parse(ls.getItem(key));
}

export function set(key: string, value: any) {
  try {
    ls.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

export function remove(key: string) {
  return ls.removeItem(key);
}

export function clear() {
  return ls.clear();
}

export function backend(store: Storage) {
  store && (ls = store);
  return ls;
}

export default {
  accessor,
  get,
  set,
  remove,
  clear,
  backend,
};
