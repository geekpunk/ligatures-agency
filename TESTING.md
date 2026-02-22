# Testing Guide

This project uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/react) for testing.

## Running Tests

```bash
# Run tests in watch mode (interactive)
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests are located in `src/test/` directory:

```
src/test/
├── setup.js              # Test configuration and global mocks
├── mockConfig.js         # Mock album configuration for tests
├── App.test.jsx          # Main app component tests
└── AlbumViewer.test.jsx  # Album viewer specific tests
```

## What's Tested

### Configuration Loading
- ✅ Shows loading state while fetching config
- ✅ Loads and displays configuration from JSON
- ✅ Sets page title dynamically
- ✅ Applies custom colors from config

### Album Viewer
- ✅ Renders album artwork correctly
- ✅ Shows 4 navigation dots
- ✅ Highlights active page dot
- ✅ Interactive viewer element
- ✅ Proper CSS styling for mobile touch

### Music Player
- ✅ Displays current track information
- ✅ Play/pause button functionality
- ✅ Previous/next track navigation
- ✅ Progress bar display
- ✅ Lyrics button (conditional on track)

### Lyrics Display
- ✅ Opens lyrics dialog
- ✅ Closes lyrics dialog
- ✅ Displays lyrics content
- ✅ Only shows for tracks with lyrics

### Track List
- ✅ Displays all tracks
- ✅ Shows track durations
- ✅ Download links for each track
- ✅ Track selection/playback

### Downloads
- ✅ Album download button present
- ✅ Links to correct ZIP file

### Credits & Social Links
- ✅ Displays credits section
- ✅ Renders embedded links correctly
- ✅ Shows all social media links

### URL Parameters
- ✅ Loads specific song from `?song=` parameter

## Writing New Tests

### Basic Test Structure

```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from '../App'
import { mockConfig } from './mockConfig'

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup: mock fetch to return config
    global.fetch.mockReset()
    global.fetch.mockResolvedValue({
      json: async () => mockConfig
    })
  })

  it('does something', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Expected Text')).toBeInTheDocument()
    })
  })
})
```

### Testing User Interactions

```javascript
import userEvent from '@testing-library/user-event'

it('handles click event', async () => {
  const user = userEvent.setup()
  render(<App />)

  await waitFor(() => {
    expect(screen.getByText('Button')).toBeInTheDocument()
  })

  await user.click(screen.getByText('Button'))

  // Assert expected behavior
})
```

### Mocking Audio Elements

Audio playback is automatically mocked in `setup.js`:

```javascript
window.HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve())
window.HTMLMediaElement.prototype.pause = vi.fn()
```

## Test Coverage

To generate a coverage report:

```bash
npm run test:coverage
```

This will create a `coverage/` directory with detailed coverage reports.

## Mocking Strategy

### Global Mocks (in setup.js)
- `fetch` - for loading configuration
- `performance.now` - for animations
- `requestAnimationFrame` / `cancelAnimationFrame` - for smooth animations
- `HTMLMediaElement` methods - for audio playback

### Test-Specific Mocks
- Mock configuration object (`mockConfig.js`)
- URL parameters (per test basis)
- Window scroll position (per test basis)

## Best Practices

1. **Always wait for async updates**
   ```javascript
   await waitFor(() => {
     expect(element).toBeInTheDocument()
   })
   ```

2. **Use semantic queries**
   ```javascript
   screen.getByRole('button', { name: 'Play' })
   screen.getByLabelText('Close')
   screen.getByText(/pattern/i)
   ```

3. **Test behavior, not implementation**
   - Test what users see and do
   - Avoid testing internal state
   - Focus on user interactions

4. **Keep tests isolated**
   - Each test should be independent
   - Use `beforeEach` for setup
   - Don't rely on test execution order

## Debugging Tests

### Run single test file
```bash
npm test -- App.test.jsx
```

### Run specific test
```bash
npm test -- -t "test name pattern"
```

### Visual debugging with UI
```bash
npm run test:ui
```

The UI will open in your browser showing test results, coverage, and allowing you to filter/debug tests interactively.

## Continuous Integration

Tests run automatically on:
- Every commit (via git hooks if configured)
- Pull requests
- Before deployment

Add to your CI pipeline:
```yaml
- run: npm test
```

## Troubleshooting

### "Test timed out in 5000ms"
Some tests need more time. Increase timeout:
```javascript
it('slow test', async () => {
  // test code
}, 10000) // 10 second timeout
```

### "Element not found"
Make sure to wait for async operations:
```javascript
await waitFor(() => {
  expect(screen.getByText('...')).toBeInTheDocument()
})
```

### "Cannot read property of undefined"
Ensure mocks are properly set up in `beforeEach`:
```javascript
beforeEach(() => {
  global.fetch.mockResolvedValue({
    json: async () => mockConfig
  })
})
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
