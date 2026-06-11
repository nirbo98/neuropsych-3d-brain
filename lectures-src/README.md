# lectures-src/

Drop the lecturer's lecture files here (the `.pdf` files that are actually ZIP
archives of `<slide>.jpeg` + `<slide>.txt`), then run:

```bash
npm run lectures
```

That regenerates `src/data/lectures.generated.ts` and writes the **mapped** slide
images into `public/lectures/`. Mapping lives in `src/data/lectures.annotations.json`.

`Maintenance_reserve_and_compensation_Nat_Rev_2018.pdf` is excluded automatically
(it's an article, not a lecture deck). The raw `.pdf` files here are gitignored.
