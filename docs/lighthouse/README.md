# Lighthouse reports

Generate a report against a production build and drop the export here:

```bash
npm run build && npm run start
npx lighthouse http://localhost:3000 \
  --output=html --output-path=./docs/lighthouse/report.html \
  --preset=desktop
```

Target scores (see [`/performance`](../../app/performance/page.tsx) for the live checklist):

| Category | Target |
| --- | --- |
| Performance | 96 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
