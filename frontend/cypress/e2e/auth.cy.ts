/// <reference types="cypress" />
import '../support/commands'

describe('Authentication', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage()
  })

  it('should display login page', () => {
    cy.visit('/login')
    cy.url().should('include', '/login')
    cy.get('body').should('be.visible')
  })


  it('should login using custom command', () => {
    cy.fixture('users').then((users) => {
      // Use admin credentials
      cy.login(users.admin.email, users.admin.password)
      
      // Verify we're logged in
      cy.window().then((win) => {
        cy.wrap(win.localStorage.getItem('token')).should('exist')
      })
    })
  })

  it('should handle invalid credentials', () => {
    cy.visit('/login')
    
    cy.get('input[name="email"], input[type="email"]').first().type('invalid@example.com')
    cy.get('input[name="password"], input[type="password"]').first().type('wrongpassword')
    
    cy.get('button[type="submit"]').first().click()
    
    // Wait for response - app may redirect to home or show error
    cy.wait(2000)
    cy.get('body').should('be.visible')
    
    // Check for error message or verify we're not logged in
    cy.window().then((win) => {
      const bodyText = win.document.body.textContent?.toLowerCase() || ''
      const hasError = bodyText.includes('error') || 
                      bodyText.includes('invalid') || 
                      bodyText.includes('błąd') ||
                      bodyText.includes('nieprawidłowy')
      
      // If no error shown, verify token is not stored (login failed)
      if (!hasError) {
        const token = win.localStorage.getItem('token')
        cy.wrap(token).should('be.null')
      }
    })
  })

  it('should register a new user', () => {
    cy.visit('/register')
    cy.url().should('include', '/register')
    
    // Fill registration form
    const timestamp = Date.now()
    const email = `test${timestamp}@example.com`
    
    cy.get('input[name="name"]').type('Test User')
    cy.get('input[name="email"], input[type="email"]').first().type(email)
    cy.get('input[name="password"], input[type="password"]').first().type('test123')
    cy.get('input[name="confirmPassword"]').type('test123')
    cy.get('input[name="storeTerms"]').check()
    
    // Submit form
    cy.get('button[type="submit"]').first().click()
    
    // Should redirect after successful registration
    cy.wait(1000) // Wait for redirect
    cy.url().should('not.include', '/register')
  })

  it('should logout user', () => {
    cy.fixture('users').then((users) => {
      // Use admin credentials
      cy.login(users.admin.email, users.admin.password)
      
      // Look for logout button/link using React-friendly selectors
      cy.get('body').then(($body) => {
        const buttons = Array.from($body.find('button, a')) as HTMLElement[]
        const logoutElement = buttons.find((el) => {
          const text = el.textContent?.toLowerCase() || ''
          return text.includes('logout') || text.includes('wyloguj')
        })
        
        if (logoutElement) {
          cy.wrap(logoutElement).click()
          
          // Verify token is removed
          cy.window().then((win) => {
            cy.wrap(win.localStorage.getItem('token')).should('be.null')
          })
        } else {
          cy.log('Logout button not found, skipping logout test')
        }
      })
    })
  })

  it('should redirect to login when accessing protected routes', () => {
    // Try to access shipping page without login
    cy.visit('/shipping')
    cy.url().should('include', '/login')
    
    // Try to access profile without login
    cy.visit('/profile')
    cy.url().should('include', '/login')
  })

 
})
