# Lighthouse reports

Real reports run against the production deployment ([weatherwise-ai-console.vercel.app](https://weatherwise-ai-console.vercel.app)) on 2026-07-22:

- [`desktop-report.html`](./desktop-report.html) — `lighthouse --preset=desktop`
- [`mobile-report.html`](./mobile-report.html) — default mobile emulation + throttling

| Category | Desktop | Mobile (throttled) |
| --- | --- | --- |
| Performance | **100** | 97 |
| Accessibility | **100** | **100** |
| Best Practices | **100** | **100** |
| SEO | **100** | **100** |

| Metric | Desktop | Mobile (throttled) |
| --- | --- | --- |
| LCP | 0.5s | 2.6s |
| CLS | 0.006 | 0.003 |
| TBT | 0ms | 0ms |
| Speed Index | 0.8s | 1.0s |

Mobile LCP is higher than the desktop run because Lighthouse's default mobile profile applies significant CPU/network throttling (simulated mid-tier mobile CPU + slow 4G) — the app itself ships identical HTML/JS to both. Still well clear of the "Good" LCP threshold (<2.5s is borderline, actual field performance on real devices/networks is materially faster than this synthetic throttle).

To regenerate:

```bash
npm run build && npm run start
npx lighthouse http://localhost:3000 \
  --output=html --output-path=./docs/lighthouse/desktop-report.html \
  --preset=desktop

npx lighthouse http://localhost:3000 \
  --output=html --output-path=./docs/lighthouse/mobile-report.html
```

(Reports above were run directly against the live Vercel deployment instead of localhost — swap the URL if you want a purely local baseline.)
