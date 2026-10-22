// Loads the herbs from data/herbs.json and shows each one as a card.
// index.html#<id> shows one herb, loaded from data/<id>.json.

const list = document.querySelector("#herbs-list")
const count = document.querySelector(".count")
const herbPage = document.querySelector("#herb-page")
const homeSections = [...document.querySelectorAll("main > section")]
  .filter((section) => section !== herbPage)
const siteTitle = document.title

async function loadJSON(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Could not load ${response.url}: ${response.status} ${response.statusText}`)
  }
  return response.json()
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

async function showHerbs() {
  const herbs = await loadJSON("data/herbs.json")
  list.replaceChildren(...herbs.map(card))
  count.textContent = `${herbs.length} herbs grow here.`
}

function herbDetails(herb) {
  const heading = element("h1", "", herb.name)
  heading.tabIndex = -1
  const back = element("a", "", "← Back to all herbs")
  back.href = "#herbs"
  const backLine = element("p", "back", "")
  backLine.append(back)
  return [
    heading,
    element("p", "latin", herb.latin),
    element("p", "about", herb.about),
    element("h2", "", "Uses"),
    element("p", "use", herb.use),
    element("h2", "", "Life cycle"),
    element("p", "life", herb.life),
    backLine,
  ]
}

async function showHerb(id) {
  const herb = await loadJSON(`data/${id}.json`)
  herbPage.replaceChildren(...herbDetails(herb))
  document.title = `${herb.name} | ${siteTitle}`
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
