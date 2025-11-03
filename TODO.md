# TODO - Framer Motion Performance Optimizations

## Completed ✅

- [x] Memoize animation variants in `src/lib/animation-variants.ts`
- [x] Add `ssr: false` to AnimatedBackground dynamic import
- [x] Reduce floating icons on mobile (< 768px) - max 3 icons
- [x] Test and validate changes (type-check passed, format applied)

## Medium Priority

- [ ] Run `npm run analyze` - monitor framer-motion chunk size
- [ ] Document animation performance baseline in GENERAL.md

## Low Priority

- [ ] Consider CSS-based animations for static backgrounds
- [ ] Profile runtime performance with DevTools
- [ ] Test Lighthouse score after optimizations
