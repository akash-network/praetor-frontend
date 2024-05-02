export function getStorageItem(itemName) {
  return localStorage.getItem(itemName)
}

export function setStorageItem(itemName, itemValue) {
  return localStorage.setItem(itemName, itemValue)
}

export function removeStorageItem(itemName) {
  return localStorage.removeItem(itemName)
}

export function purgeStorage() {
  localStorage.clear()
}
