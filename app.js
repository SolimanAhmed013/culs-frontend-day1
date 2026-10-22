// Loads the herbs from data/herbs.json and shows each one as a card.
// index.html#<id> shows one herb, loaded from data/<id>.json.

const list = document.querySelector("#herbs-list")
const count = document.querySelector(".count")
const searchInput = document.querySelector("#search")
const noResults = document.querySelector(".no-results")
const herbPage = document.querySelector("#herb-page")
const homeSections = [...document.querySelectorAll("main > section")]
  .filter((section) => section !== herbPage)
const siteTitle = document.title

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
  const name = element("h3", "name", "")
  const link = element("a", "", herb.name)
  link.href = `#${herb.id}`
  name.append(link)
  item.append(
    name,
    element("p", "latin", herb.latin),
    element("p", "use", herb.use),
    element("p", "life", herb.life),
  )

  if (herb.id === "basil") {
    item.classList.add("basil-card")
  }

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
      element("p", "", problem(error, `We don't grow “${id}” here.`)),
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

window.addEventListener("hashchange", route)
showHerbs()
route()
