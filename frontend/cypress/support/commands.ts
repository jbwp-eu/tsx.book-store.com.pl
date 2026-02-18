/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login a user
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string): void
      
      /**
       * Custom command to login as admin
       * @example cy.loginAsAdmin()
       */
      loginAsAdmin(): void
      /**
       * Login as admin via UI so Redux gets userInfo (for admin route access).
       * @example cy.loginAsAdminViaUI()
       */
      loginAsAdminViaUI(): void
    }
  }
}

// Cypress is a value at runtime; access via globalThis to avoid "namespace as value" type error
const CypressRuntime = (globalThis as unknown as { Cypress: { Commands: { add: (name: string, fn: (...args: unknown[]) => void) => void }; config: () => { env?: { VITE_BACKEND_URL?: string } } } }).Cypress

/**
 * Login helper command
 * Authenticates a user and stores the token in localStorage
 * @param email - User email address
 * @param password - User password
 */
CypressRuntime.Commands.add('login', (email: string, password: string) => {
  // config().env may be undefined when allowCypressEnv is false; use default
  const backendUrl = CypressRuntime.config().env?.VITE_BACKEND_URL ?? 'http://localhost:3003'
  
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
CypressRuntime.Commands.add('loginAsAdmin', () => {
  cy.fixture('users').then((users) => {
    cy.login(users.admin.email, users.admin.password)
  })
})

/**
 * Login as admin via the login form so Redux state is set (required for AdminRoute).
 */
CypressRuntime.Commands.add('loginAsAdminViaUI', () => {
  cy.fixture('users').then((users) => {
    cy.visit('/login')
    cy.get('input[name="email"], input[type="email"]').first().type(users.admin.email)
    cy.get('input[name="password"], input[type="password"]').first().type(users.admin.password)
    cy.get('button[type="submit"]').first().click()
    // Wait for redirect away from login (component navigates when userInfo is set in Redux)
    // This confirms the action completed and setCredentials was called
    cy.url().should('not.include', '/login', { timeout: 15000 })
    // Now verify localStorage is set (setCredentials sets it synchronously, so it should be there)
    // Retry until localStorage has userInfo with isAdmin set
    cy.window().should((win) => {
      const userInfo = win.localStorage.getItem('userInfo')
      if (!userInfo) {
        throw new Error('userInfo not set in localStorage')
      }
      try {
        const parsed = JSON.parse(userInfo)
        if (typeof parsed.isAdmin !== 'boolean' || !parsed.isAdmin) {
          throw new Error('userInfo.isAdmin not set or not true')
        }
      } catch (e) {
        throw new Error(`Invalid userInfo in localStorage: ${e}`)
      }
    })
  })
})

export {}
