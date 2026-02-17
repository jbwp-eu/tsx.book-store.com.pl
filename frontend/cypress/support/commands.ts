/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login a user
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>
      
      /**
       * Custom command to login as admin
       * @example cy.loginAsAdmin()
       */
      loginAsAdmin(): Chainable<void>
    }
  }
}

/**
 * Login helper command
 * Authenticates a user and stores the token in localStorage
 * @param email - User email address
 * @param password - User password
 */
Cypress.Commands.add('login', (email: string, password: string) => {
  // Cypress.config().env may be undefined when allowCypressEnv is false; use default
  const backendUrl = Cypress.config().env?.VITE_BACKEND_URL ?? 'http://localhost:3003'
  
  cy.request({
    method: 'POST',
    url: `${backendUrl}/api/users/login`,
    body: { email, password },
    headers: {
      'Content-Type': 'application/json',
    },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200 && response.body.token) {
      // Visit baseUrl to ensure we have a window context for localStorage
      cy.visit('/', { log: false })
      
      // Store token in localStorage (matching the app's storage key)
      cy.window().then((win) => {
        win.localStorage.setItem('token', response.body.token)
        
        // Store expiration (60 minutes from now, matching app behavior)
        const expiration = new Date()
        expiration.setMinutes(expiration.getMinutes() + 60)
        win.localStorage.setItem('expiration', expiration.toString())
        
        // Store user info as JSON (matching Redux state structure)
        const userInfo = {
          name: response.body.name || '',
          email: response.body.email || email,
          isAdmin: response.body.isAdmin || false,
        }
        win.localStorage.setItem('userInfo', JSON.stringify(userInfo))
        
        // Also store individual fields for backward compatibility
        if (response.body.name) {
          win.localStorage.setItem('userName', response.body.name)
        }
        if (response.body.email) {
          win.localStorage.setItem('userEmail', response.body.email)
        }
        if (response.body.isAdmin !== undefined) {
          win.localStorage.setItem('isAdmin', String(response.body.isAdmin))
        }
      })
    } else {
      throw new Error(`Login failed: ${response.body?.message || 'Unknown error'}`)
    }
  })
})

/**
 * Admin login helper command
 * Logs in using admin credentials from fixtures
 */
Cypress.Commands.add('loginAsAdmin', () => {
  cy.fixture('users').then((users) => {
    cy.login(users.admin.email, users.admin.password)
  })
})

export {}
