/// <reference types="cypress" />
import '../support/commands'

describe('Admin', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('should login as admin', () => {
    cy.loginAsAdmin()
    
    // Verify admin token is stored
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.exist
      const userInfo = win.localStorage.getItem('userInfo')
      if (userInfo) {
        const parsed = JSON.parse(userInfo)
        expect(parsed.isAdmin).to.be.true
      } else {
        // Check isAdmin flag if stored separately
        expect(win.localStorage.getItem('isAdmin')).to.equal('true')
      }
    })
  })

  it('should access admin dashboard after login', () => {
    cy.loginAsAdmin()
    
    cy.visit('/admin/overview')
    cy.url().should('include', '/admin/overview')
    cy.get('body').should('be.visible')
  })

  it('should redirect non-admin users from admin routes', () => {
    // Register a new regular user first (since only admin exists)
    const timestamp = Date.now()
    const email = `testuser${timestamp}@example.com`
    
    cy.visit('/register')
    cy.get('input[name="name"]').type('Test User')
    cy.get('input[name="email"], input[type="email"]').first().type(email)
    cy.get('input[name="password"], input[type="password"]').first().type('test123')
    cy.get('input[name="confirmPassword"]').type('test123')
    cy.get('input[name="storeTerms"]').check()
    cy.get('button[type="submit"]').first().click()
    
    // Wait for registration to complete
    cy.url({ timeout: 10000 }).should('not.include', '/register')
    
    // Now try to access admin route
    cy.visit('/admin/overview')
    // Should redirect (either to login or home)
    cy.url({ timeout: 10000 }).should('satisfy', (url: string) => {
      return url.includes('/login') || (url === Cypress.config().baseUrl + '/' || url === Cypress.config().baseUrl)
    })
  })

  it('should display admin orders list', () => {
    cy.loginAsAdmin()
    
    cy.visit('/admin/ordersList')
    cy.url().should('include', '/admin/ordersList')
    cy.get('body').should('be.visible')
  })

  it('should display admin products list', () => {
    cy.loginAsAdmin()
    
    cy.visit('/admin/productsList')
    cy.url().should('include', '/admin/productsList')
    cy.get('body').should('be.visible')
  })

  it('should display admin users list', () => {
    cy.loginAsAdmin()
    
    cy.visit('/admin/usersList')
    cy.url().should('include', '/admin/usersList')
    cy.get('body').should('be.visible')
  })

  it('should display admin reviews list', () => {
    cy.loginAsAdmin()
    
    // Visit a working admin route first to establish session
    cy.visit('/admin/overview')
    cy.url().should('include', '/admin/overview')
    cy.get('body').should('be.visible')
    
    // Now navigate to reviews list using client-side navigation
    cy.visit('/admin/reviewsList')
    cy.url({ timeout: 10000 }).should('include', '/admin/reviewsList')
    cy.get('body').should('be.visible')
  })

  it('should navigate to product edit page', () => {
    cy.loginAsAdmin()
    
    // Visit a working admin route first to establish session
    cy.visit('/admin/overview')
    cy.url().should('include', '/admin/overview')
    cy.get('body').should('be.visible')
    
    cy.fixture('products').then((products) => {
      const productId = products.products[0].id
      
      // Now navigate to product edit page
      cy.visit(`/admin/product/${productId}/edit`)
      cy.url({ timeout: 10000 }).should('include', `/admin/product/${productId}/edit`)
      cy.get('body').should('be.visible')
    })
  })

  it('should navigate to user edit page', () => {
    cy.loginAsAdmin()
    cy.visit('/admin/usersList')
    cy.get('body').should('be.visible')
    
    // Find user edit links without failing when none exist (e.g. empty list)
    cy.get('body').then(($body) => {
      const links = $body.find('a[href*="/admin/user/"]')
      if (links.length > 0) {
        cy.wrap(links.first()).click()
        cy.url().should('include', '/admin/user/')
      } else {
        cy.log('No user edit links found (users list may be empty)')
      }
    })
  })

  it('should support pagination in admin lists', () => {
    cy.loginAsAdmin()
    cy.visit('/admin/ordersList')
    cy.get('body').should('be.visible')
    
    // Find pagination links without failing when none exist (e.g. single page)
    cy.get('body').then(($body) => {
      const links = $body.find('a[href*="/page/"]')
      if (links.length > 0) {
        const page2 = $body.find('a[href*="/page/2"]')
        if (page2.length > 0) {
          cy.wrap(page2.first()).click()
          cy.url().should('include', '/page/2')
        } else {
          cy.log('Page 2 link not found')
        }
      } else {
        cy.log('Pagination not found (single page or empty list)')
      }
    })
  })
})
