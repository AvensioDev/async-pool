# @avensio/async-pool

Lightweight TypeScript promise pool that caps concurrency without introducing extra workers or dependencies.

## Usage

```ts
import { createPool } from '@avensio/async-pool';

const pool = createPool(4);

await Promise.all([
  pool(() => writeFile('a.ts', '...')),
  pool(() => writeFile('b.ts', '...')),
]);
```

## Development

- `npm run build` – emit ESM output and type declarations to `dist/`.
- `npm run test` – run the Vitest suite.

Contributions should keep the implementation dependency-free and fast.
