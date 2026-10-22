# GROUP MEMBERS
- Aziz Bishoy Raafat Fares
- Soliman Ahmed



# The Little Herb Garden

A small website for day 1 of **Frontend Development**.

It is fixed by @pepe Josef Pospisil

## What you need

- a GitHub account
- Git
- an editor
- a browser (Firefox recommended)
- [Node.js](https://nodejs.org/) (the LTS version), which brings `npx`

## Get your copy

1. **Fork** this repository to your GitHub account.
2. **Clone your fork**, not this repository:

   ```sh
   git clone https://github.com/<your-name>/culs-frontend-day1.git
   cd culs-frontend-day1
   ```

## Run it

Start a small web server in the project folder:

```sh
npx serve
```

The first time, `npx` asks whether to install `serve`. Answer `y`.

Then open the address it prints, usually <http://localhost:3000>.
Stop the server with `Ctrl+C`.

Do not open `index.html` by double-clicking it. A `file://` page is not the Web.

## Your mission

Something is wrong. Several things, in fact.

1. Inspect before you change anything: the page, the Console, the Network panel, the Inspector.
2. Pick one problem and find out why it happens.
3. Fix it, reload, verify.
4. Commit that one fix, with a message that says what you fixed.
5. Repeat.

You are done when:

- the Console shows no unexplained errors
- the Network panel shows no missing files
- every link on the page goes where it says
- `git status` is clean, and `git push` has sent your commits to GitHub

## The project

```text
index.html    the page
style.css     how it looks
app.js        what it does
data/         the herbs, as JSON
images/       the logo and a picture
```

## One page for every herb

`index.html` is the only page. The part after `#` picks what you see:

- `index.html#herbs`, `#visit`, `#about` scroll to that part of the home page
- `index.html#basil` shows one herb. `app.js` loads `data/basil.json` with `fetch()` and builds the page

If the herb does not exist, a file is missing or the server cannot be reached,
the page says so instead of staying empty.

## The data format

`data/herbs.json` lists every herb shown on the home page:

```json
[
  {
    "id": "basil",
    "name": "Basil",
    "latin": "Ocimum basilicum",
    "use": "Tomatoes, pesto and anything summery.",
    "life": "annual"
  }
]
```

Every herb also has its own file, `data/<id>.json`, for example `data/basil.json`:

```json
{
  "name": "Basil",
  "latin": "Ocimum basilicum",
  "use": "Tomatoes, pesto and anything summery.",
  "life": "annual",
  "about": "An aromatic herb with soft, glossy leaves. …"
}
```

| field   | meaning                                                 |
| ------- | ------------------------------------------------------- |
| `id`    | lowercase letters and `-` only; the file name and the `#` in the URL |
| `name`  | the common name                                          |
| `latin` | the botanical name                                       |
| `use`   | what it is good for, in one sentence                     |
| `life`  | `annual` or `perennial`                                  |
| `about` | a short description, shown on the herb's own page        |

To add a herb: add an entry to `data/herbs.json` and create `data/<id>.json`.
