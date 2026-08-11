# Decision log

Why the project looks and works the way it does. Each entry records the
decision, the reason behind it, and what it forbids — the reasons matter more
than the actions, because they are what a future contributor (human or agent)
needs in order not to undo them by accident.

Written retroactively up to 2026-08-05, kept current from then on.

---

## Architecture

### One `Dish`, priced through `Placement`

A dish carries no price and no menu membership. Both live on `Placement`,
which binds a dish to a category, with its own price, portion and sort order.

**Why.** The same dish appears in Фуршет and Банкет at different prices and
different portions. Any model where the dish owns the price forces a second
copy of the dish, and two copies drift apart the first time someone edits one.

**Consequence.** Cart lines reference `placementId`, never `dishId` — that is
the only id that identifies what the guest actually ordered. Order lines and,
later, the admin panel follow the same rule.

### Photos are a collection, not a column

`Dish.photos` is a list of `DishPhoto`, even though the UI shows one.

**Why.** The planned CMS has "upload multiple photos". A single `photo` string
would have meant a data migration instead of an added table.

### Read models, not raw tables

Pages consume `MenuView` / `MenuCategory` / `PlacedDish`, assembled in
`lib/menu.ts`. They never touch `menu-data.ts` directly.

**Why.** That boundary is where the mock source gets replaced by Supabase.
Every query is already `async` for the same reason: adding `await supabase…`
must not change a single call site.

### Money is integer cents

Stored as cents everywhere, divided only in `formatPrice`.

**Why.** Floating point arithmetic in a cart produces sums like
`0.30000000000000004`, and the total in the Telegram message stops matching
what the guest saw.

### Translations are objects, not strings

`Translated = { uk, en, es? }`, read through `t()` with a fallback.

**Why.** UA-first was agreed, but the copy is still English. With objects,
adding a language is adding a key; with plain strings it would be a rewrite of
every component. A missing translation shows another language rather than an
empty space.

### A missing translation is left missing

`readTranslated` writes only the languages that were actually filled in. The
earlier `en: en || uk` fallback copied Ukrainian into the English column, which
is how «Фуршет» became the English name of the buffet menu: the row looked
translated to every reader, and the panel had no way to show which fields still
needed work. A missing key falls back to Ukrainian at render time anyway — the
difference is that the gap stays visible.

**Consequence.** Rows written before this rule were cleaned in the database:
`update … set title = title - 'en' where title->>'en' = title->>'uk'`.

### Translation is one shared action, not one per entity

`translateFields` takes a bag of named Ukrainian strings and a sentence saying
what the text is; dishes, categories, menus and the page blocks all use it
through a single server action and a single `TranslateButton`. Adding a
translatable field anywhere costs one line.

**Why a server action rather than a route.** The Gemini key is read from the
database on the server and never reaches the browser. The browser posts
Ukrainian text and receives translated text — nothing else crosses.

**Why a button and not on save.** Translating and saving are separate
decisions. The chef presses translate, reads what came back, corrects it, and
only then saves. Nothing generated reaches the database unreviewed.

### The server prices the order

`POST /api/orders` accepts only ids and quantities. Titles, portions and
prices are re-read server-side in `resolveOrder`.

**Why.** The cart lives in `localStorage`, which the guest can edit. Trusting
its prices means accepting a banquet ordered for one cent. Verified against a
hostile payload: a forged `price`, an unknown `placementId` and a negative
quantity were all discarded.

### Order delivery never has a single point of failure

Telegram and e-mail are called in parallel over plain `fetch`; each returns a
result instead of throwing. The order fails only when every channel fails, and
then the full order is written to the log for manual recovery.

**Why.** A dead notification channel must not lose a paying customer.

### No SDKs for HTTP APIs

Telegram and Resend are called with `fetch`. The order validator is
hand-written. No icon package for four glyphs.

**Why.** Every dependency is a licence, a supply chain and an upgrade. None of
these earn their weight.

---

## Client/server boundaries

### The client bundle stays small on purpose

Client components: the header (scroll listener), the cart store and its four
controls, the lightbox, the sticky category nav, the scroll indicator. Nothing
else.

**Why.** Pages, sections and cards stay server-rendered. `CartProvider` wraps
`{children}` in the layout, but children are passed as props, so the client
boundary does not travel down the tree.

### The cart stores a snapshot

Cart lines carry a copy of the title, price, portion and photo.

**Why.** The alternative is importing the catalogue into the browser to render
three lines. The snapshot is a display value only — see "The server prices the
order".

### Hydration starts empty

The cart renders empty on both server and client, then loads from storage in
an effect.

**Why.** Reading `localStorage` during render produces a hydration mismatch.
The visible cost is the counter flicking from `(0)` to its real value; that is
the accepted trade.

---

## Design language

### Two type roles

Inter for interface — navigation, buttons, labels, prices, headings. Cormorant
Garamond for prose. A script face for the logotype only.

**Why.** The contrast between "what it says" and "what you do" carries the
structure. A display serif for headings (Newsreader, standing in for the paid
Canela) was tried and rolled back — the client preferred the sans.

Cormorant runs small for its point size, so its sizes sit one step above the
sans equivalent.

### Font choices live in one file

`app/fonts.ts` declares the families; four lines in the `@theme` block bind
them to roles. Components use `font-sans` / `font-serif` / `font-signature`
and never name a family.

**Why.** Typography was iterated a dozen times. Rollback has to be one commit,
not a search across the codebase.

### Hover changes weight, not position

`BoldOnHover` renders an invisible bold copy that reserves the width, and
animates the visible copy inside it.

**Why.** Bold glyphs are wider; a naive `hover:font-semibold` shifts every
neighbouring item sideways on every hover.

### Animate transform, not filter

The dish photo scales on hover with `transform-gpu` and `will-change`, and its
saturation stays fixed.

**Why.** Animating `filter` on a 2048px image re-rasterises it every frame and
visibly stutters. Transform stays on the compositor.

### Dialogs are native

The lightbox and the cart drawer are `<dialog>` with `showModal()`.

**Why.** Esc, focus containment, an inert background and backdrop clicks come
for free. Animating them needs `@starting-style` and `allow-discrete`, which
is why those rules live in `globals.css` and cannot be utility classes.

### The drawer leaves in a different direction than it enters

Enters from the right, leaves to the left while fading.

**Why.** The base rule is the exit state and `@starting-style` is the entry
state; that asymmetry is the whole mechanism.

---

## Layout

### Hero: two layouts, one markup tree

From `xl` the photo is absolutely positioned against the container's right
edge; below `xl` the same element falls back into the flow under the text.

**Why.** Percentage offsets made the photo drift while resizing. Pinning it to
the container keeps it on the same vertical line as the header at any width.

### Hero height is capped by width

`h-[min(100svh,66vw)]` with `min-h` as a floor.

**Why.** The photo is square and sized by the section height. With a fixed
`100svh`, a narrow window made the photo stop short and left an empty band
above the next section. Tying the height to the width means the frame fills
the section exactly, whatever the window shape.

### Sticky elements need a tall parent

The category bar is `sticky` inside `<nav>`, with the container inside it.

**Why.** A sticky element is bounded by its parent's box. Wrapped in a
container of its own height, it would stick for zero pixels.

---

## Supabase

### The seam held

Migrating from the in-memory source to Postgres changed four files in `lib/`
and not a single component. That was the whole point of making every query
async and giving pages read models instead of tables, months before there was
a database to read from.

### Missing configuration degrades, it never throws

Both client factories return `null` when their variables are absent. No
Supabase means the mock data; no service role key means the file log. A dead
database must not take the site down, and an unreachable one must not lose an
order that Telegram already delivered.

The failure is always logged. A silent fallback that looks like success is the
one outcome worth engineering against.

### Both env naming schemes are accepted

`SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_SECRET_KEY` and the
older `NEXT_PUBLIC_*` / `SERVICE_ROLE` names both work. A variable set under
the other name would otherwise leave the site quietly serving mock data.

### Connect through the pooler, not the direct host

`db.<ref>.supabase.co` resolves over IPv6 only unless the IPv4 add-on is paid
for; it is unreachable from most sandboxes, CI runners and build environments.
Migrations run through the session pooler on port 5432. Transaction mode is
the wrong choice for DDL — it does not hold prepared statements.

### Order rows are written by the server alone

Row level security is on for all seven tables, with select-only policies on the
five menu tables and no policies at all on `orders` and `order_items`. With RLS
on and no policy, the publishable key sees an empty table rather than an error,
which is exactly the intended protection. Writes go through the secret key,
inside route handlers only.

### Uploads are server-side, the bucket is read-only in public

The `menu` bucket is public for reads so `next/image` can optimise plain URLs
without signing every request. There are no insert, update or delete policies:
uploads go through the service role key inside server actions, exactly like
every other write. Verified — an upload with the publishable key is rejected.

`next.config.ts` derives `images.remotePatterns` from `SUPABASE_URL`. Without
that entry every uploaded photo renders as a broken box, and the failure looks
like a bug in the admin rather than a missing config line.

### Upload before writing the row, delete the file after

A failed upload leaves the entity with its previous photo instead of a
reference to a file that was never stored, and the old file is removed only
once the new URL is safely in the database.

### The first photo is the main one

Dish photos have no "is main" flag: the card renders `photos[0]`, so ordering
is the setting. A flag would be a second source of truth that can disagree
with the order it is supposed to describe.

### Order status lives behind a check constraint

`new | confirmed | done | cancelled`, enforced by the database rather than by
the form. Verified — an invalid value is rejected at the constraint (23514).

---

### A booking is an order without dishes

The Contact section asks for a dinner from someone who has not opened the menu.
That request carries the same fields an order carries and differs only in
having no items and no total, so it lives in the same table behind a `kind`
column with a check constraint, and reuses the numbering, the notification
path and the chef's single inbox. A second table would have duplicated all
four and split the inbox in two.

### Where orders are delivered is configuration, not deployment

Telegram token, chat id and the e-mail addresses moved out of `.env.local` and
into `app_settings`, read through the same "environment first, database second"
rule as the Gemini key. Changing where an order lands should not require a
rebuild.

**Consequence.** Two buttons exist because this configuration cannot be
verified by reading it. "Знайти чати" asks Telegram which chats the bot can
see — a bot cannot message a person by @username, it needs a numeric id, and it
only learns that id after the person writes to it first. "Перевірити звʼязок"
sends through the real senders.

### An error message carries the body, not the status code

Resend answers 403 for an unverified sender domain, a revoked key and a
Cloudflare block alike; Telegram is no better. Both senders now pass the
response text through to the panel. The status code alone cost an evening.

---

## Verification

Rules earned by getting them wrong. Intended as the working brief for a future
debugging agent.

### Report the file, not the intention

After an edit, read back what the file actually contains before saying it is
done. An edit that silently failed to apply and a report that says "done" are
indistinguishable to the client until they open the browser.

### Type-check after every change, however small

`npx tsc --noEmit` after each edit. It costs seconds and catches the class of
mistake that a screenshot review never will — a renamed prop, a stale import,
a value outside a union.

### Test the hostile case, not the happy one

The order pipeline was verified with a forged price, an unknown id and a
negative quantity — not with a valid cart. A validator only proves something
when it is given something to reject.

### Locate the containing block before positioning anything

Two bugs in this project came from the same wrong assumption about which
ancestor an absolutely or stickily positioned element is measured against:

- the category bar wrapped in its own container stuck for zero pixels,
  because `sticky` is bounded by the parent's box;
- the Hero photo stopped reaching under the header once it moved inside the
  container, because `inset-y-0` then referred to the container, which starts
  below the section's top padding.

Both were invisible to the type checker and to a quick glance at the diff.
When an element is positioned, name its containing block out loud.

### Prove a claim with data the client can see

"The site now reads the database" is unverifiable from the outside. Changing a
single price to 9,99 € and asking which number appears on the page is not.
When a claim cannot be tested directly, engineer a signal that can.

### Prefer a cause over a coincidence

"The photos are different sizes" was a width bug, not an aspect-ratio bug.
"The image jumps on hover" was a filter repaint, not an easing curve. "The
menu shows one column" was the data, not the grid. Change the thing that
explains the symptom, not the thing nearest to it.

---

## Process

### Desktop first, on purpose

Mobile adaptation and the burger menu were deliberately deferred until the
core flow (Hero, About, Menu, Contact, cart, checkout) was finished.

**Consequence.** The header still shows only the logotype below `md`. That is
the last known gap.

### Placeholders are marked, never invented

Contact details, dish data and prices are placeholders carrying a `TODO`, all
collected at the top of their file.

**Why.** Invented numbers presented as facts are worse than obvious blanks —
the client asked explicitly for no fabricated figures.

### Personal data stays out of git

`orders.jsonl` is ignored; it holds names and phone numbers.
