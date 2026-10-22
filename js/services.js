// Business logic — calls data.js, manages localStorage state.
// No DOM access.

import { loadJSON } from "./data.js"

export async function fetchHerbList() {
  return loadJSON("data/herbs.json")
}

export async function fetchHerb(id) {
  // Only plain ids like "basil" become file names.
  if (!/^[a-z-]+$/.test(id)) {
    throw Object.assign(new Error(`Not a herb id: ${id}`), { status: 404 })
  }
  return loadJSON(`data/${id}.json`)
}

// --- Favourites ---

export function getFavourites() {
  try {
    return JSON.parse(localStorage.getItem("favourites") || "[]")
  } catch {
    return []
  }
}

function saveFavourites(ids) {
  try {
    localStorage.setItem("favourites", JSON.stringify(ids))
  } catch {
    // localStorage may be blocked in some environments; silently ignore.
  }
}

export function isFavourite(id) {
  return getFavourites().includes(id)
}

export function toggleFavourite(id) {
  const favs = getFavourites()
  const index = favs.indexOf(id)
  if (index === -1) {
    favs.push(id)
  } else {
    favs.splice(index, 1)
  }
  saveFavourites(favs)
  return favs.includes(id)
}
