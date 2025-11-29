import { describe, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { test, fc } from '@fast-check/vitest';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';

/**
 * Property-based tests for error handling components
 * Feature: news-media-frontpage
 */

describe('Error Handling Components Property-Based Tests', () => {
  /**
   * Feature: news-media-frontpage, Property 6: API failure fallback
   * Validates: Requirements 4.3
   * 
   * For any API request that returns an error status or throws an exception,
   * the application should display the fallback UI message without crashing
   */
  test.prop([fc.string({ minLength: 1, maxLength: 200 })], { numRuns: 100 })(
    'ErrorMessage should display any error message without crashing',
    (errorMessage) => {
      // Should not throw an error when rendering with any error message
      const { container } = render(<ErrorMessage message={errorMessage} />);
      
      // Verify the component rendered successfully
      expect(container).toBeTruthy();
      
      // Check that the error message is displayed
      const text = container.textContent || '';
      expect(text).toContain(errorMessage);
      
      // Verify error UI elements are present
      expect(text).toContain('Error');
      
      // Check for error icon (SVG)
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
    }
  );

  test.prop([fc.string({ minLength: 1, maxLength: 200 })], { numRuns: 100 })(
    'ErrorMessage with retry should display retry button and handle clicks',
    (errorMessage) => {
      const onRetry = vi.fn();
      
      const { container, getByRole } = render(
        <ErrorMessage message={errorMessage} onRetry={onRetry} />
      );
      
      try {
        // Verify the component rendered successfully
        expect(container).toBeTruthy();
        
        // Check that the error message is displayed
        const text = container.textContent || '';
        expect(text).toContain(errorMessage);
        
        // Find and verify retry button exists using the local query
        const retryButton = getByRole('button', { name: /try again/i });
        expect(retryButton).toBeTruthy();
        
        // Click the retry button
        fireEvent.click(retryButton);
        
        // Verify the retry callback was called
        expect(onRetry).toHaveBeenCalledTimes(1);
      } finally {
        // Cleanup after each property test iteration
        cleanup();
      }
    }
  );

  /**
   * Feature: news-media-frontpage, Property 7: Empty data handling
   * Validates: Requirements 4.4
   * 
   * For any API response containing zero articles, the homepage should
   * display the "No news available" message
   */
  test.prop([fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined })], { numRuns: 100 })(
    'EmptyState should display message for empty data without crashing',
    (customMessage) => {
      // Should not throw an error when rendering
      const { container } = render(
        customMessage ? <EmptyState message={customMessage} /> : <EmptyState />
      );
      
      // Verify the component rendered successfully
      expect(container).toBeTruthy();
      
      // Check that appropriate message is displayed
      const text = container.textContent || '';
      if (customMessage) {
        expect(text).toContain(customMessage);
      } else {
        expect(text).toContain('No news available');
      }
      
      // Verify empty state UI elements are present
      expect(text).toContain('No Articles Found');
      
      // Check for empty state icon (SVG)
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
    }
  );

  /**
   * Feature: news-media-frontpage, Property 8: Loading state display
   * Validates: Requirements 4.5
   * 
   * For any data fetching operation in progress, the UI should display
   * a loading indicator until the operation completes or fails
   */
  test.prop([fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined })], { numRuns: 100 })(
    'LoadingSpinner should display loading indicator without crashing',
    (customMessage) => {
      // Should not throw an error when rendering
      const { container } = render(
        customMessage ? <LoadingSpinner message={customMessage} /> : <LoadingSpinner />
      );
      
      // Verify the component rendered successfully
      expect(container).toBeTruthy();
      
      // Check that appropriate message is displayed
      const text = container.textContent || '';
      if (customMessage) {
        expect(text).toContain(customMessage);
      } else {
        expect(text).toContain('Loading...');
      }
      
      // Verify loading spinner animation elements are present
      // The spinner uses two div elements with border styling
      const spinnerDivs = container.querySelectorAll('.border-4');
      expect(spinnerDivs.length).toBeGreaterThanOrEqual(2);
      
      // Check for animation class
      const animatedElement = container.querySelector('.animate-spin');
      expect(animatedElement).toBeTruthy();
    }
  );
});
