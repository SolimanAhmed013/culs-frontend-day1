// Pure DOM building — no fetch, no localStorage.
// Receives data and callbacks; never calls services or data directly.

export function element(tag, className, text) {
  const node = document.createElement(tag)
  node.className = className
  node.textContent = text
  return node
}

export function card(herb, { starred, onStar }) {
  const item = element("li", "card", "")
  item.dataset.herbId = herb.id

  const name = element("h3", "name", "")
  const link = element("a", "", herb.name)
  link.href = `#${herb.id}`
  name.append(link)

  const star = document.createElement("button")
  star.className = "star"
  star.textContent = "★"
  star.setAttribute("aria-pressed", String(starred))
  star.setAttribute("aria-label", starred
    ? `Remove ${herb.name} from favourites`
    : `Add ${herb.name} to favourites`)
  star.addEventListener("click", () => onStar(herb, star))

  item.append(
    name,
    element("p", "latin", herb.latin),
    element("p", "use", herb.use),
    element("p", "life", herb.life),
    star,
  )

  return item
}

export function backLink() {
  const back = element("a", "", "← Back to all herbs")
  back.href = "#herbs"
  const line = element("p", "back", "")
  line.append(back)
  return line
}

export function herbDetails(herb) {
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

export function favItem(herb, { onRemove }) {
  const li = document.createElement("li")
  li.className = "fav-item"

  const info = document.createElement("div")
  info.className = "fav-item-info"

  const nameLink = element("a", "fav-item-name", herb.name)
  nameLink.href = `#${herb.id}`

  const latin = element("p", "fav-item-latin", herb.latin)
  const use = element("p", "fav-item-use", herb.use)
  info.append(nameLink, latin, use)

  const remove = document.createElement("button")
  remove.className = "fav-remove"
  remove.textContent = "✕"
  remove.setAttribute("aria-label", `Remove ${herb.name} from favourites`)
  remove.addEventListener("click", () => onRemove(herb, li))

  li.append(info, remove)
  return li
}
