import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from './Header';

/**
 * Tests for Header component
 * Requirements: 5.4, 5.5, 7.5
 */
describe('Header', () => {
  it('should render the News Portal title', () => {
    render(<Header />);
    expect(screen.getByText('News Portal')).toBeInTheDocument();
  });

  it('should render desktop navigation links', () => {
    render(<Header />);
    const homeLinks = screen.getAllByText('Home');
    const latestLinks = screen.getAllByText('Latest');
    
    // Should have both desktop and mobile versions
    expect(homeLinks.length).toBeGreaterThan(0);
    expect(latestLinks.length).toBeGreaterThan(0);
  });

  it('should toggle mobile menu when button is clicked', () => {
    render(<Header />);
    
    // Find the mobile menu button by aria-label
    const menuButton = screen.getByLabelText('Toggle navigation menu');
    expect(menuButton).toBeInTheDocument();
    
    // Initially, mobile menu should not be visible (aria-expanded should be false)
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    
    // Click to open menu
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    
    // Click to close menu
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('should have touch-friendly mobile menu button (44x44px minimum)', () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Toggle navigation menu');
    
    // Check inline styles for minimum touch target size
    const style = menuButton.getAttribute('style');
    expect(style).toContain('min-width: 44px');
    expect(style).toContain('min-height: 44px');
  });

  it('should close mobile menu when a navigation link is clicked', () => {
    render(<Header />);
    
    const menuButton = screen.getByLabelText('Toggle navigation menu');
    
    // Open the menu
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    
    // Click a navigation link in the mobile menu
    const mobileLinks = screen.getAllByText('Home');
    // Find the mobile version (should be the last one in the DOM)
    const mobileHomeLink = mobileLinks[mobileLinks.length - 1];
    fireEvent.click(mobileHomeLink);
    
    // Menu should be closed
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });
});
