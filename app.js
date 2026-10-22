// Loads the herbs from data/herbs.json and shows each one as a card.
// index.html#<id> shows one herb, loaded from data/<id>.json.

const list = document.querySelector("#herbs-list")
const count = document.querySelector(".count")
const searchInput = document.querySelector("#search")
const noResults = document.querySelector(".no-results")
const herbPage = document.querySelector("#herb-page")
const favBtn = document.querySelector("#fav-btn")
const favCount = document.querySelector("#fav-count")
const favDialog = document.querySelector("#fav-dialog")
const favList = document.querySelector("#fav-list")
const favEmpty = document.querySelector(".fav-empty")
const favClose = document.querySelector("#fav-close")
const homeSections = [...document.querySelectorAll("main > section")]
  .filter((section) => section !== herbPage)
const siteTitle = document.title

// --- Favourites: localStorage helpers ---

function getFavourites() {
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

function isFavourite(id) {
  return getFavourites().includes(id)
}

function updateFavCount() {
  const n = getFavourites().length
  favCount.textContent = n
  favCount.hidden = n === 0
}

function toggleFavourite(id) {
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

// --- Favourites: dialog ---

function favItem(herb) {
  const li = document.createElement("li")
  li.className = "fav-item"

  const info = document.createElement("div")
  info.className = "fav-item-info"

  const nameLink = document.createElement("a")
  nameLink.className = "fav-item-name"
  nameLink.href = `#${herb.id}`
  nameLink.textContent = herb.name
  nameLink.addEventListener("click", () => favDialog.close())

  const latin = element("p", "fav-item-latin", herb.latin)
  const use = element("p", "fav-item-use", herb.use)
  info.append(nameLink, latin, use)

  const remove = document.createElement("button")
  remove.className = "fav-remove"
  remove.textContent = "✕"
  remove.setAttribute("aria-label", `Remove ${herb.name} from favourites`)
  remove.addEventListener("click", () => {
    toggleFavourite(herb.id)
    updateStarOnCard(herb.id, false)
    updateFavCount()
    li.remove()
    favEmpty.hidden = favList.children.length > 0
  })

  li.append(info, remove)
  return li
}

async function openFavourites() {
  const ids = getFavourites()
  favEmpty.hidden = ids.length > 0
  favList.replaceChildren()

  if (ids.length > 0) {
    // Load each favourite's data to show name, latin and use.
    const herbs = await Promise.all(
      ids.map((id) =>
        loadJSON(`data/${id}.json`).catch(() => ({ id, name: id, latin: "", use: "Data unavailable." }))
      )
    )
    favList.replaceChildren(...herbs.map(favItem))
  }

  favDialog.showModal()
}

// --- Star button helpers ---

function updateStarOnCard(id, pressed) {
  const star = list.querySelector(`[data-herb-id="${id}"] .star`)
  if (star) {
    star.setAttribute("aria-pressed", String(pressed))
    star.setAttribute("aria-label", pressed ? `Remove ${id} from favourites` : `Add ${id} to favourites`)
  }
}

// --- Fetch helpers ---

async function loadJSON(url) {
  const response = await fetch(url)
  if (!response.ok) {
    const error = new Error(`Could not load ${response.url}: ${response.status} ${response.statusText}`)
    error.status = response.status
    throw error
  }
  return response.json()
}

// Turns an error into a sentence a visitor can understand.
function problem(error, missing) {
  console.error(error)
  if (error.status === 404) return missing
  // fetch() rejects with a TypeError when there is no server to answer.
  if (error instanceof TypeError) return "The garden can't be reached right now. Check your connection and reload the page."
  return "Something went wrong in the garden. Please reload the page."
}

function element(tag, className, text) {
  const node = document.createElement(tag)
  node.className = className
  node.textContent = text
  return node
}

function card(herb) {
  const item = element("li", "card", "")
  item.dataset.herbId = herb.id

  const name = element("h3", "name", "")
  const link = element("a", "", herb.name)
  link.href = `#${herb.id}`
  name.append(link)

  const starred = isFavourite(herb.id)
  const star = document.createElement("button")
  star.className = "star"
  star.textContent = "★"
  star.setAttribute("aria-pressed", String(starred))
  star.setAttribute("aria-label", starred ? `Remove ${herb.name} from favourites` : `Add ${herb.name} to favourites`)

  star.addEventListener("click", () => {
    const nowFav = toggleFavourite(herb.id)
    star.setAttribute("aria-pressed", String(nowFav))
    star.setAttribute("aria-label", nowFav ? `Remove ${herb.name} from favourites` : `Add ${herb.name} to favourites`)
    updateFavCount()
  })

  item.append(
    name,
    element("p", "latin", herb.latin),
    element("p", "use", herb.use),
    element("p", "life", herb.life),
    star,
  )

  return item
}

// Filter the visible cards based on the current search term.
function filterCards(term) {
  const query = term.trim().toLowerCase()
  const cards = list.querySelectorAll(".card")
  let visible = 0

  cards.forEach((card) => {
    const text = card.textContent.toLowerCase()
    const match = !query || text.includes(query)
    card.hidden = !match
    if (match) visible++
  })

  noResults.hidden = visible > 0
}

async function showHerbs() {
  try {
    const herbs = await loadJSON("data/herbs.json")
    list.replaceChildren(...herbs.map(card))
    count.textContent = `${herbs.length} herbs grow here.`
    // Wire up search after cards exist.
    searchInput.addEventListener("input", () => filterCards(searchInput.value))
  } catch (error) {
    count.textContent = problem(error, "The list of herbs is missing.")
  }
}

function herbDetails(herb) {
  const heading = element("h1", "", herb.name)
  heading.tabIndex = -1
  return [
    heading,
    element("p", "latin", herb.latin),
    element("p", "about", herb.about),
    element("h2", "", "Uses"),
    element("p", "use", herb.use),
    element("h2", "", "Life cycle"),
    element("p", "life", herb.life),
    backLink(),
  ]
}

function backLink() {
  const back = element("a", "", "← Back to all herbs")
  back.href = "#herbs"
  const line = element("p", "back", "")
  line.append(back)
  return line
}

async function showHerb(id) {
  try {
    // Only plain ids like "basil" become file names.
    if (!/^[a-z-]+$/.test(id)) {
      throw Object.assign(new Error(`Not a herb id: ${id}`), { status: 404 })
    }
    const herb = await loadJSON(`data/${id}.json`)
    herbPage.replaceChildren(...herbDetails(herb))
    document.title = `${herb.name} | ${siteTitle}`
  } catch (error) {
    const heading = element("h1", "", "Herb not found")
    heading.tabIndex = -1
    herbPage.replaceChildren(
      heading,
      element("p", "", problem(error, `We don't grow "${id}" here.`)),
      backLink(),
    )
    document.title = `Herb not found | ${siteTitle}`
  }
}

function showView(herbView) {
  herbPage.hidden = !herbView
  homeSections.forEach((section) => { section.hidden = herbView })
}

// The hash is either a section of the page (#herbs, #visit…) or a herb (#basil).
async function route() {
  const id = decodeURIComponent(location.hash.slice(1))
  const target = id ? document.getElementById(id) : null

  if (!id || target) {
    showView(false)
    document.title = siteTitle
    target?.scrollIntoView()
    return
  }

  showView(true)
  herbPage.replaceChildren(element("p", "", "Loading…"))
  await showHerb(id)
  herbPage.querySelector("h1")?.focus()
  window.scrollTo(0, 0)
}

// --- Event wiring ---

favBtn.addEventListener("click", openFavourites)
favClose.addEventListener("click", () => favDialog.close())

// Close when clicking the backdrop.
favDialog.addEventListener("click", (e) => {
  if (e.target === favDialog) favDialog.close()
})

window.addEventListener("hashchange", route)
showHerbs()
route()
updateFavCount()
