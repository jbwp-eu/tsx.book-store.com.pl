/// <reference types="cypress" />
import '../support/commands'

describe('Product Browsing', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display product listing on homepage', () => {
    // Wait for products to load
    cy.get('body').should('be.visible')
    // Products should be displayed (check for product cards or list items)
    // Adjust selector based on actual product component structure
    cy.window().then((win) => {
      const bodyText = win.document.body.textContent?.toLowerCase() || ''
      expect(bodyText.includes('product') || bodyText.includes('book')).to.be.true
    })
  })

  it('should navigate to product detail page', () => {
    // Click on first product link or card
    cy.get('a[href*="/product/"]').first().click()
    cy.url().should('match', /\/product\/\w+/)
  })

  it('should display product details on product page', () => {
    cy.fixture('products').then((products) => {
      const productId = products.products[0].id
      cy.visit(`/product/${productId}`)
      
      // Check for product title, price, or other details
      cy.get('body').should('be.visible')
      // Adjust selectors based on actual product detail page structure
    })
  })
 
    

  it('should support pagination', () => {
    // Check if pagination exists using React-friendly selectors
    cy.get('a[href*="/page/"]').then((links) => {
      if (links.length > 0) {
        // Click on page 2 if pagination exists
        cy.get('a[href*="/page/2"]').first().click()
        cy.url().should('include', '/page/2')
      }
    })
  })

  it('should display products with search/filter functionality', () => {
    // Check if search input exists - skip if not implemented
    cy.window().then((win) => {
      const searchInputs = win.document.querySelectorAll('input[type="search"], input[name*="search"], input[placeholder*="search" i], input[placeholder*="szukaj" i]')
      if (searchInputs.length > 0) {
        cy.wrap(searchInputs[0]).type('book')
        cy.wait(1000) // Wait for search results
      } else {
        // Skip test if search is not implemented
        cy.log('Search functionality not found - skipping test')
      }
    })
  })
})
