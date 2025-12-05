# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2024-12-05

### Added
- Initial library extraction from jam-station project
- Core Web Audio API utilities (`lib/core.js`)
- ADSR envelope generator (`lib/controls/adsr.js`)
- Low-frequency oscillator (LFO) effect (`lib/effects/lfo.js`)
- Reverb effect (`lib/effects/reverb.js`)
- Sampler for audio sample playback (`lib/sources/sampler.js`)
- High-level API with factory functions (vco, vca, vcf, adsr, lfo)
- Node connection and routing utilities (connect, disconnect, reroute, chain)
- Note-to-frequency conversion utility
- Comprehensive documentation and examples
- ESM-first module system with CommonJS build
- TypeScript type definitions
- Test suite with Web Audio API polyfill for Node.js
- GitHub Actions CI/CD workflows
- Zero runtime dependencies

### Changed
- Extracted and refactored audio utilities from jam-station for standalone use
- Adapted code to follow iblokz library patterns
- Converted from CommonJS to ES modules
- Removed dependency on iblokz-data

---

## How to Use This Changelog

### Types of Changes

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** in case of vulnerabilities

### When Releasing

1. Move items from `[Unreleased]` to a new version section
2. Add the release date
3. Create a new empty `[Unreleased]` section at the top
4. Update the version numbers in the comparison links at the bottom

### Example Entry

```markdown
## [0.2.0] - 2024-01-15

### Added
- New delay effect (#123)
- Support for custom audio contexts (#124)

### Fixed
- Bug in ADSR release phase (#125)
- Memory leak in sampler (#126)

### Changed
- Improved performance of node connections by 20% (#127)
```

[Unreleased]: https://github.com/iblokz/audio/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/iblokz/audio/releases/tag/v0.1.0

