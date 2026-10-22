// Raw HTTP — fetch only, no DOM, no state.

export async function loadJSON(url) {
  const response = await fetch(url)
  if (!response.ok) {
    const error = new Error(`Could not load ${response.url}: ${response.status} ${response.statusText}`)
    error.status = response.status
    throw error
  }
  return response.json()
}

// Turns a fetch error into a sentence a visitor can understand.
export function problem(error, missing) {
  console.error(error)
  if (error.status === 404) return missing
  // fetch() rejects with a TypeError when there is no server to answer.
  if (error instanceof TypeError) return "The garden can't be reached right now. Check your connection and reload the page."
  return "Something went wrong in the garden. Please reload the page."
}
