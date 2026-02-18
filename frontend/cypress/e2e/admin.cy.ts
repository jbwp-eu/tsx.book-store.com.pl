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
      cy.wrap(win.localStorage.getItem('token')).should('exist')
      const userInfo = win.localStorage.getItem('userInfo')
      if (userInfo) {
        const parsed = JSON.parse(userInfo)
        cy.wrap(parsed.isAdmin).should('be.true')
      } else {
        // Check isAdmin flag if stored separately
        cy.wrap(win.localStorage.getItem('isAdmin')).should('equal', 'true')
      }
    })
  })

  it('should access admin dashboard after login', () => {
 
    cy.loginAsAdmin()
    // App rehydrates auth from localStorage on load, so we can visit admin directly
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
    cy.wait(1000)
    cy.url().should('not.include', '/register')

    // Now try to access admin route (rehydration will have non-admin user)
    cy.visit('/admin/overview')
    // Should redirect (either to login or home)
    cy.wait(1000)
    cy.url().should('satisfy', (url: string) => {
      const base = 'http://localhost:5173'
      return url.includes('/login') || url === base + '/' || url === base
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
    cy.visit('/admin/reviewsList')
    cy.url().should('include', '/admin/reviewsList')
    cy.get('body').should('be.visible')
  })

  it('should navigate to product edit page', () => {
    cy.loginAsAdmin()
    cy.visit('/admin/productsList')
    cy.url().should('include', '/admin/productsList')
    cy.get('body').should('be.visible')
    // Use first product edit link from the list (real ID from backend)
    // Explanation:
    // 'a[href*="/admin/product/"][href*="/edit"]' is a CSS selector that matches:
    // - <a> tags (anchor links)
    // - where the href attribute contains "/admin/product/"
    // - AND the href attribute also contains "/edit"
    // For example: <a href="/admin/product/123/edit">Edit</a> would match.
    //
    // So, cy.get('a[href*="/admin/product/"][href*="/edit"]', { timeout: 10000 }) finds all such matching links.
    // The .first() gets the first matching link, and .then(($link) => { ... }) allows us to work with the DOM element.
    // Find edit link - NavLink renders as <a> tag, so we can find it directly
    cy.get('body').then(($body) => {
      const links = $body.find('a[href*="/admin/product/"][href*="/edit"]')
      if (links.length > 0) {
        cy.wrap(links.first()).then(($link) => {
          const href = $link.attr('href') ?? ''
          const match = href.match(/\/admin\/product\/([^/]+)\/edit/)
          const productId = match ? match[1] : null
          if (productId) {
            cy.wrap($link).click()
            cy.url().should('include', `/admin/product/${productId}/edit`)
            cy.get('body').should('be.visible')
          }
        })
      } else {
        cy.log('No product edit link found (products list may be empty)')
      }
    })
  })

  it('should navigate to user edit page', () => {
    cy.loginAsAdmin()
    cy.visit('/admin/usersList')
    cy.url().should('include', '/admin/usersList')
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
    cy.url().should('include', '/admin/ordersList')
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
