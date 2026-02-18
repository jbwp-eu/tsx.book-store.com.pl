/// <reference types="cypress" />
import '../support/commands'

describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the homepage', () => {
    cy.url().should('include', '/')
    cy.get('body').should('be.visible')
  })

  it('should navigate to different pages', () => {
    // Test navigation to cart page
    cy.visit('/cart')
    cy.url().should('include', '/cart')
    cy.get('body').should('be.visible')

    // Navigate back to home
    cy.visit('/')
    cy.url().should('eq', 'http://localhost:5173/')

    // Navigate to login page
    cy.visit('/login')
    cy.url().should('include', '/login')
    cy.get('body').should('be.visible')
  })

  it('should navigate via header links when they exist', () => {
    cy.get('header').should('be.visible')
    
    // Try to find and click cart link if it exists
    cy.get('body').then(($body) => {
      const cartLink = $body.find('a[href="/cart"]')[0]
      if (cartLink && cartLink.offsetParent !== null) {
        cy.get('a[href="/cart"]').click()
        cy.url().should('include', '/cart')
      } else {
        // If link doesn't exist or isn't visible, skip this test
        cy.log('Cart link not found or not visible, skipping click test')
      }
    })
  })

  it('should redirect to login when accessing protected routes without authentication', () => {
    // Try to access shipping page (protected route)
    cy.visit('/shipping')
    cy.url().should('include', '/login')
  })

  it('should redirect to login when accessing admin routes without authentication', () => {
    // Ensure we're logged out
    cy.clearLocalStorage()
    
    // Try to access admin overview (protected route)
    cy.visit('/admin/overview')
    
    // Wait for page to load, then check if redirected away from admin route
    cy.get('body').should('be.visible')
    cy.wait(1000) // Wait for redirect
    cy.url().should('satisfy', (url: string) => {
      return url.includes('/login') || url === 'http://localhost:5173/' || url === 'http://localhost:5173'
    })
  })

  it('should handle 404 for non-existent routes', () => {
    cy.visit('/non-existent-page')
    // The app redirects to home for unknown routes
    cy.url().should('not.include', '/non-existent-page')
  })

  it('should display footer links', () => {
    cy.get('footer').should('be.visible')
    // Footer should contain some links or content
    cy.get('footer').within(() => {
      cy.get('a, button').should('have.length.greaterThan', 0)
    })
  })
})
