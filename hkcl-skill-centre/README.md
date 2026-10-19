# HKCL Skill Centre website (frontend)

A modern, responsive website for **HKCL Skill Centre, Sirsa**, built with React, Vite, Tailwind CSS and React Router.

This is a **frontend-only** project. There is no backend, database, login system, payment system or chatbot yet. The code is organised so those can be added later without rebuilding the site.

---

## What is inside

| Page | Address | Notes |
| --- | --- | --- |
| Home | `/` | Hero, courses, HCOC overview, reasons to choose the centre, FAQ preview, contact |
| About | `/about` | Centre description, what you can study, replaceable photo areas |
| Courses | `/courses` | Category filter, search, reusable course cards |
| Course details | `/courses/:slug` | One reusable page; reads from `src/data/courses.js` |
| Contact | `/contact` | Call, WhatsApp, email, address, hours, Google Maps link |
| Student Login | `/student-login` | Redirects to the official HKCL portal (no login form here) |
| Not found | any other address | Custom 404 page |

---

## 1. Prerequisites

- **Node.js 20.19 or newer** (22.12+ also works). Download the LTS version from <https://nodejs.org>.
- **VS Code** (optional but recommended): <https://code.visualstudio.com>
- **Git** (only needed for GitHub): <https://git-scm.com/downloads>

Check your Node.js version in a terminal:

```bash
node -v
npm -v
```

If `node -v` shows a version lower than 20.19, install the current LTS from nodejs.org and open a new terminal.

## 2. Install the project

1. Unzip `hkcl-skill-centre.zip` somewhere easy to find, for example your Desktop.
2. Open VS Code, choose **File > Open Folder...**, and select the `hkcl-skill-centre` folder.
3. Open the built-in terminal with **Terminal > New Terminal**.
4. Run:

```bash
npm install
```

This downloads all dependencies into a `node_modules` folder. It can take a minute.

## 3. Start the development server

```bash
npm run dev
```

The terminal prints a local address, usually **http://localhost:5173**. Hold Ctrl (or Cmd on Mac) and click it, or paste it into your browser. The page updates automatically when you save a file. Press `Ctrl + C` in the terminal to stop the server.

## 4. Scripts (these match `package.json`)

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Regenerates `sitemap.xml` and `robots.txt`, then creates the production build in `dist/` |
| `npm run preview` | Serves the production build locally so you can test it |

## 5. Edit the content

You almost never need to touch the page components. Edit these files:

| What you want to change | File |
| --- | --- |
| Centre name, phone, WhatsApp, email, address, hours, social links, logo, website domain | `src/data/siteConfig.js` |
| Courses, fees, durations, eligibility, descriptions | `src/data/courses.js` |
| FAQ questions and answers | `src/data/faqs.js` |
| Centre photographs | `src/data/gallery.js` and `public/images/` |
| Colours and fonts | `src/index.css` (the `@theme` block) |

### Courses, fees and durations

- Open `src/data/courses.js`.
- **Change a fee or duration:** edit `fee` (a number such as `4500`) or `duration` (text such as `'3 months'`) on that course.
- **Add a course:** copy an existing course object, give it a unique `slug` (lowercase, hyphens only) and fill in what you know. For an HCOC course, add one line to the `hcocList` array instead.
- **Remove or hide a course:** delete it, or set `published: false`.
- **Unknown information:** leave the value as `null`. The website then shows "Contact the centre for details" rather than a made-up value.
- The course page address is `/courses/<slug>`, so changing a slug changes its web address.

### Contact details

Edit `contact` in `src/data/siteConfig.js`. To hide a method (for example WhatsApp), set its value to an empty string `''`. The site removes it automatically.

### Photos

1. Put JPG or WebP files in `public/images/` (aim for under 300 KB each and about 1600 px wide).
2. Add them to `src/data/gallery.js`, following the commented example.

Until you add photos, the About page shows labelled placeholders and the home page hides the gallery preview. The centre's existing profile has photographs. Download your own copies from there (with permission) instead of linking to that site.

### Logo

By default the site uses a text-based brand mark. To use a logo image, put the file in `public/images/` and set `logo.src` in `siteConfig.js`, for example `'/images/logo.png'`.

## 6. Update the student login URL

The Student Login button, footer link and `/student-login` page all use **one** constant in `src/data/siteConfig.js`:

```js
export const STUDENT_PORTAL_URL = 'https://www.hkcl.in/';
```

**Important:** `https://www.hkcl.in/` is the HKCL homepage supplied for this project. It has **not** been confirmed as the student-login page. Before launch:

1. Find the official student-login page and confirm it with HKCL or the centre.
2. Replace the URL above.
3. Set `studentPortal.verified` to `true` in the same file (this removes a developer-only warning).

The website never shows a login form and never collects usernames or passwords. The navbar button is a normal link that opens the official site in a new tab.

## 7. Run the production build

```bash
npm run build
npm run preview
```

`npm run build` writes the finished site into the `dist/` folder. `npm run preview` serves it, usually at **http://localhost:4173**, so you can check it before publishing.

## 8. Upload the code to GitHub

1. Create a free account at <https://github.com> and click **New repository**. Name it (for example `hkcl-skill-centre`), leave it empty (no README), and create it.
2. In the VS Code terminal, inside the project folder:

```bash
git init
git add .
git commit -m "Initial HKCL Skill Centre website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/hkcl-skill-centre.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. `node_modules` and `dist` are excluded automatically by `.gitignore`.

## 9. Deploy on Vercel

1. Create a free account at <https://vercel.com> and sign in with GitHub.
2. Click **Add New > Project** and import your `hkcl-skill-centre` repository.
3. Vercel detects Vite automatically. Confirm these settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Click **Deploy**.

The included `vercel.json` makes direct links such as `/courses/hs-cit` work when someone opens or refreshes them. Every time you push to GitHub, Vercel redeploys automatically.

## 10. Connect a custom domain

1. In Vercel, open your project, then **Settings > Domains**, and add your domain (for example `www.yourdomain.in`).
2. Vercel shows the DNS records to create. Add them where you bought the domain (GoDaddy, Namecheap, Hostinger and similar):
   - For `www`: a **CNAME** record pointing to the value Vercel shows.
   - For the root domain (without `www`): an **A** record pointing to the address Vercel shows.
3. Wait for DNS to update (minutes to a few hours). Vercel issues the HTTPS certificate automatically.
4. **Then update `siteUrl`** in `src/data/siteConfig.js` to your real domain (for example `'https://www.yourdomain.in'`), commit and push. This fixes the canonical links, social sharing tags, `sitemap.xml` and `robots.txt`.

After launch you can submit the sitemap (`https://your-domain/sitemap.xml`) in Google Search Console. Being listed in Google is not instant and is not guaranteed.

## 11. SEO and performance notes

- Every page sets its own title, description, canonical link and Open Graph tags (`src/components/Seo.jsx`).
- `sitemap.xml` and `robots.txt` are generated from your data every time you run `npm run build`. The student-login page is excluded.
- Social sharing: add an `og:image` tag in `index.html` once you have a 1200 x 630 image in `public/images/`.
- Images: use WebP or well-compressed JPG, keep files under about 300 KB, and give every meaningful photo descriptive `alt` text.
- Fonts are bundled with the site (no Google Fonts requests). Animations switch off for visitors who have "reduce motion" enabled.

## 12. Content you must verify or replace before launch

All facts were taken from the centre's existing public profile at <https://profile.nextapsolutions.com/HKCL-Skill-Centre>. Please confirm each one with the centre.

**Must replace**

- [ ] `siteUrl` in `siteConfig.js` is a placeholder (`https://www.example.com`).
- [ ] `STUDENT_PORTAL_URL` is the HKCL homepage, not a confirmed login page (see section 6).
- [ ] No centre photographs are included. Add real photos (section 5).

**Please verify**

- [ ] Phone, WhatsApp, email, address and opening hours in `siteConfig.js`.
- [ ] Fees and durations: HS-CIT (3 months, 4,500), HS-CIT (A) (6 months, 9,000), HS-CIT (A+) (1 year, 18,000).
- [ ] **Typing Skills fee.** The profile shows a selling price of 1,500 and a struck-through price of 4,500.
- [ ] **HTSE.** The profile gives only the name and a price of 150. Its full name, content and what the fee covers are unknown. Set `published: false` in `courses.js` if you prefer to hide it until confirmed.
- [ ] **HCOC course count.** The profile says 28 courses but lists 30. All 30 are included and no total is shown on the site.
- [ ] **Which HCOC courses are 60 hours and which are 120 hours.** Each shows "60 or 120 hours, depending on the course" until you add `duration` to its entry.
- [ ] Eligibility, syllabus and certificate details for every course. These are unpublished and show "Contact the centre for details".
- [ ] Certificates: the site says HS-CIT and 120-hour HCOC courses carry HKCL and HSBTE certificates, as the profile states.
- [ ] Social links (Facebook, Instagram, WhatsApp channel) were copied from the profile. Instagram's tracking parameter was removed.
- [ ] The profile describes the centre as "Promoted By Government Of Haryana Computer Education & Training Centre Achariya Educational Institution". That wording is unclear, so it is **not** shown on the website. It is saved under `unverifiedNotes` in `siteConfig.js` for you to clarify.

**Deliberately left out**

- The sample testimonials on the existing profile (names and quotes cannot be verified).
- The appointment and newsletter forms from the existing profile (they need a backend).
- Statistics, awards, placement claims and partner logos.

## 13. Project structure

```
hkcl-skill-centre/
  public/
    favicon.svg            Text-based favicon
    robots.txt             Generated on build
    sitemap.xml            Generated on build
    images/                Put your photos and logo here
  scripts/
    generate-seo-files.js  Builds sitemap.xml and robots.txt
  src/
    components/            Navbar, Footer, Button, CourseCard, SectionHeading, Seo, ...
    pages/                 Home, About, Courses, CourseDetails, Contact, StudentLogin, NotFound
    data/                  siteConfig.js, courses.js, faqs.js, gallery.js
    utils/                 contact.js (links), format.js (display helpers)
    App.jsx                Route table
    main.jsx               Entry point
    index.css              Tailwind and design tokens
  index.html
  vite.config.js
  vercel.json              Makes direct links work on Vercel
  package.json
```

## 14. Preparing for a backend and chatbot later

- Contact and enquiry links are built in one place (`src/utils/contact.js`). A real enquiry form can replace them there.
- Course data sits behind small helper functions in `courses.js` (`getCourseBySlug` and others). They can be swapped for API calls later without changing the pages.
- `src/components/` is presentation-only. A chatbot widget can be added once in `App.jsx`.

## 15. Common errors and fixes

| Problem | Fix |
| --- | --- |
| `npm: command not found` or `node: command not found` | Install Node.js LTS from nodejs.org, then close and reopen VS Code. |
| `Unsupported engine` warning or Vite fails to start | Your Node.js is too old. Install Node.js 20.19 or newer. |
| `npm install` fails with network or permission errors | Check your internet connection. Delete `node_modules` and `package-lock.json`, then run `npm install` again. |
| Port 5173 already in use | Stop the other dev server, or run `npm run dev -- --port 3000`. |
| Blank white page | Open the browser console (F12). A syntax error in a data file (a missing comma or quote in `courses.js`) is the usual cause. |
| Page changes do not show | Save the file, then refresh. If still stale, stop the server (`Ctrl + C`) and run `npm run dev` again. |
| `404` when refreshing a page on Vercel | Make sure `vercel.json` is committed and pushed. |
| Course page says "We could not find that course" | The `slug` in the link does not match any course in `courses.js`. Slugs must be unique. |
| Warning about the placeholder `siteUrl` during build | Set your real domain in `siteConfig.js` (section 10). |
| Contact buttons are missing | A value in `siteConfig.js` is empty on purpose or by mistake. Fill it in. |

## 16. Known limitations

- No online enquiry form (it needs a backend). Visitors use phone, WhatsApp or email.
- Page titles and descriptions are set by JavaScript. Google reads them, but some social preview tools only read the defaults in `index.html`.
- No real photographs are bundled.
- Course descriptions for HCOC courses are intentionally generic until the centre supplies syllabus details.
