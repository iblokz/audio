# Contributing to iblokz-audio

Thank you for your interest in contributing to iblokz-audio! This document provides guidelines and information for contributors.

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/audio.git
   cd audio
   ```
3. Install dependencies:
   ```bash
   npm install
   npm run prepare  # Setup git hooks
   ```

## Development Workflow

### Running Tests

```bash
npm test
```

This runs the test suite with coverage reporting using Mocha and NYC.

### Linting

```bash
npm run lint
```

We use ESLint with Google's style guide. Make sure your code passes linting before submitting a PR.

### Generating Documentation

```bash
npm run docs
```

This generates `API.md` from JSDoc comments. The documentation is auto-generated, so **do not edit API.md manually**.

To watch for changes and regenerate docs automatically:

```bash
npm run docs:watch
```

## Code Style Guidelines

1. **Follow existing patterns** - Look at existing code for style guidance
2. **Use functional programming** - Functions should be pure and immutable where possible
3. **Add JSDoc comments** - All public functions must have complete JSDoc annotations
4. **Write tests** - New features need corresponding tests
5. **Keep it simple** - Prefer clarity over cleverness
6. **Web Audio API** - Follow Web Audio API best practices and patterns

### JSDoc Requirements

Every exported function must have:

- A clear description
- `@param` tags for all parameters (with types)
- `@returns` tag describing the return value (with type)
- At least one `@example` showing usage

Example:

```javascript
/**
 * Creates a voltage controlled oscillator.
 * @param {Object} prefs - Oscillator preferences
 * @param {string} [prefs.type='sine'] - Waveform type
 * @param {number} [prefs.freq=440] - Frequency in Hz
 * @returns {Object} VCO node object
 * @example
 * const vco = vco({ type: 'sawtooth', freq: 440 });
 */
const vco = (prefs) => { /* ... */ };
```

## Testing Guidelines

1. **Test both happy paths and edge cases**
2. **Use descriptive test names**
3. **Keep tests focused** - One assertion per concept
4. **Test audio nodes** - Verify nodes are created and connected correctly
5. **Test timing** - Be careful with timing-dependent tests (use mocks when needed)

Example test structure:

```javascript
describe('vco', () => {
  it('should create an oscillator with default settings', () => {
    const vco = a.vco({});
    expect(vco).to.have.property('output');
    expect(vco.output).to.be.instanceOf(OscillatorNode);
  });

  it('should set frequency correctly', () => {
    const vco = a.vco({ freq: 880 });
    expect(vco.output.frequency.value).to.equal(880);
  });
});
```

## Submitting Changes

1. **Create a feature branch** from `master`:
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes** following the guidelines above

3. **Add tests** for your changes

4. **Run the full test suite** and make sure everything passes:
   ```bash
   npm test
   npm run lint
   ```

5. **Update documentation** by adding/updating JSDoc comments

6. **Commit your changes** with clear commit messages:
   ```bash
   git commit -m "feat: add new audio effect"
   ```

   We follow conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `test:` - Test additions/changes
   - `refactor:` - Code refactoring
   - `chore:` - Maintenance tasks

7. **Push to your fork**:
   ```bash
   git push origin feature/my-new-feature
   ```

8. **Open a Pull Request** with:
   - Clear title describing the change
   - Description of what changed and why
   - Link to any related issues

## Pull Request Review Process

1. Maintainers will review your PR
2. You may be asked to make changes
3. Once approved, a maintainer will merge your PR
4. Your contribution will be credited in the release notes

## Adding New Audio Components

When adding new audio components:

1. **Choose the right module** - Put controls in `lib/controls/`, effects in `lib/effects/`, sources in `lib/sources/`
2. **Follow Web Audio API patterns** - Use the existing core utilities
3. **Export from index.js** - Make sure new components are accessible
4. **Add comprehensive examples** - Show common use cases
5. **Consider performance** - Audio processing should be efficient
6. **Handle edge cases** - Handle null, undefined, invalid parameters

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions or ideas
- Check existing issues before creating a new one

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on the code, not the person
- Help others learn and grow

Thank you for contributing! 🎉

