# FlavorWorld Testing Guide

## Overview

This document outlines the comprehensive testing strategy for the FlavorWorld recipe discovery application.

## Test Structure

```
src/test/
  setup.js                 # Test configuration and mocks
  integration/
    system.test.jsx         # Full system integration tests
    api.test.jsx           # API integration tests
    components.test.jsx    # Component interaction tests
    stores.test.jsx        # State management tests
    utils.test.jsx         # Utility function tests
    e2e.test.jsx          # End-to-end user journey tests
```

## Running Tests

### All Tests
```bash
npm test
```

### Integration Tests Only
```bash
npm run test:integration
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Test UI
```bash
npm run test:ui
```

## Test Categories

### 1. System Integration Tests (`system.test.jsx`)
- **Purpose**: Test the entire application as a cohesive system
- **Coverage**: API integration, component interactions, state management
- **Key Scenarios**:
  - API error handling
  - Component integration
  - State management persistence
  - Responsive design
  - Error recovery

### 2. API Integration Tests (`api.test.jsx`)
- **Purpose**: Test TheMealDB API integration
- **Coverage**: All API endpoints, error handling, data parsing
- **Key Scenarios**:
  - Search by name, letter, category, area, ingredient
  - Random meal generation
  - Data parsing helpers
  - Network error handling
  - URL encoding

### 3. Component Integration Tests (`components.test.jsx`)
- **Purpose**: Test component interactions and user flows
- **Coverage**: SearchBar, RecipeCard, and their integration
- **Key Scenarios**:
  - Search functionality
  - Recipe card interactions
  - Navigation flows
  - User input handling
  - Component state management

### 4. State Management Tests (`stores.test.jsx`)
- **Purpose**: Test Zustand store functionality
- **Coverage**: Filter store, Planner store
- **Key Scenarios**:
  - State persistence
  - Actions and mutations
  - Computed values
  - Cross-store integration
  - Data integrity

### 5. Utility Function Tests (`utils.test.jsx`)
- **Purpose**: Test utility functions and helpers
- **Coverage**: Calorie calculations, PDF export
- **Key Scenarios**:
  - Calorie lookups
  - Macro calculations
  - PDF generation
  - Data categorization
  - Error handling

### 6. End-to-End Tests (`e2e.test.jsx`)
- **Purpose**: Test complete user journeys
- **Coverage**: Full application flows
- **Key Scenarios**:
  - Recipe discovery flow
  - Search and navigation
  - Error handling flows
  - Responsive design
  - Performance scenarios

## Test Configuration

### Vitest Configuration (`vitest.config.js`)
- **Environment**: jsdom for DOM testing
- **Setup**: Global test configuration in `setup.js`
- **Coverage**: HTML, JSON, and text reports
- **Aliases**: `@/` mapped to `src/`

### Test Setup (`setup.js`)
- **Mocks**: fetch, localStorage, window.location
- **Libraries**: jsPDF, html2canvas, ResizeObserver
- **Globals**: Testing utilities and custom matchers

## Mocking Strategy

### API Mocking
- **fetch**: Global mock for all HTTP requests
- **Responses**: Realistic API response structures
- **Error Scenarios**: Network errors, malformed data

### Component Mocking
- **React Router**: Navigation mocking
- **React Query**: Query client configuration
- **State Stores**: Zustand store mocking

### Utility Mocking
- **jsPDF**: PDF generation mocking
- **html2canvas**: Canvas rendering mocking
- **localStorage**: Storage persistence mocking

## Coverage Targets

### Critical Areas (100% coverage)
- API integration functions
- State management actions
- Utility functions
- Error handling paths

### Important Areas (90%+ coverage)
- Component interactions
- User flows
- Data transformation

### Nice-to-Have Areas (70%+ coverage)
- UI rendering
- Accessibility features
- Performance optimizations

## Test Data

### Mock Recipes
- **Structure**: Matches TheMealDB API format
- **Variety**: Different cuisines, categories, dietary needs
- **Edge Cases**: Missing data, special characters

### Mock API Responses
- **Success**: Realistic meal data
- **Empty**: No results scenarios
- **Error**: Network failures, malformed data

## Continuous Integration

### Pre-commit Hooks
- **Linting**: Code quality checks
- **Type Checking**: TypeScript validation (if applicable)
- **Unit Tests**: Fast feedback on changes

### CI Pipeline
- **All Tests**: Full test suite execution
- **Coverage**: Minimum coverage thresholds
- **Performance**: Bundle size and performance metrics

## Best Practices

### Test Organization
- **Describe blocks**: Logical grouping of tests
- **Clear naming**: Descriptive test names
- **Arrange-Act-Assert**: Consistent test structure

### Test Isolation
- **Independent tests**: No shared state between tests
- **Cleanup**: Proper test teardown
- **Deterministic**: Consistent test results

### Error Testing
- **Happy paths**: Expected functionality
- **Edge cases**: Boundary conditions
- **Error scenarios**: Failure modes

### Performance Testing
- **Async handling**: Proper async/await usage
- **Timing**: Debouncing and throttling
- **Memory**: No memory leaks

## Debugging Tests

### Common Issues
- **Mock failures**: Incorrect mock setup
- **Async timing**: Race conditions
- **DOM updates**: Waiting for state changes

### Debug Tools
- **console.log**: Temporary debugging
- **screen.debug**: DOM inspection
- **waitFor**: Async state debugging

## Future Enhancements

### Visual Testing
- **Screenshot comparison**: Visual regression testing
- **Cross-browser testing**: Browser compatibility

### Performance Testing
- **Load testing**: API performance
- **Bundle analysis**: Size optimization

### Accessibility Testing
- **Screen readers**: ARIA compliance
- **Keyboard navigation**: Accessibility features

## Conclusion

This comprehensive testing strategy ensures the FlavorWorld application is reliable, maintainable, and provides an excellent user experience across all scenarios.
