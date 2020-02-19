// User is not logged in

describe('Protected route', () => {

    describe('User is not logged in', () => {
        beforeEach(() => {
            cy.resetDataBase()
        })
    
        it('Redirects from /', () => {
            cy.visit('http://localhost:3000/')
            cy.url().should('eq', 'http://localhost:3000/login')
        })
    
        it('Redirects from /myaccount', () => {
            cy.visit('http://localhost:3000/myaccount')
            cy.url().should('eq', 'http://localhost:3000/login')
        })
    
        it('Redirects from /removals', () => {
            cy.visit('http://localhost:3000/removals')
            cy.url().should('eq', 'http://localhost:3000/login')
        })
    
        it('Redirects from /removals/:id', () => {
            cy.visit('http://localhost:3000/removals/12232112')
            cy.url().should('eq', 'http://localhost:3000/login')
        })
    
        it('Redirects from /gallery', () => {
            cy.visit('http://localhost:3000/gallery')
            cy.url().should('eq', 'http://localhost:3000/login')
        })
    })

    describe('User is logged in', () => {
        beforeEach(() => {
            cy.resetDataBase()
            cy.initUser()
            cy.login()
        })

        it('Redirects / to /removals page', () => {
            cy.visit('http://localhost:3000/')
            cy.url().should('eq', 'http://localhost:3000/removals')
            cy.contains('h2', 'My removals')
        })

        it('Shows /myaccount page', () => {
            cy.visit('http://localhost:3000/myaccount')
            cy.url().should('eq', 'http://localhost:3000/myaccount')
            cy.contains('h2', 'My account')
            
        })

        it('Shows /removals page', () => {
            cy.visit('http://localhost:3000/removals')
            cy.url().should('eq', 'http://localhost:3000/removals')
            cy.contains('h2', 'My removals')
            
        })

        it('Shows /removals/:id page', () => {
            cy.initRemoval().as('removal')
            cy.get('@removal').then((response) => {
                cy.visit(`/removals/${response.body.id}`)
                cy.url().should('eq', `http://localhost:3000/removals/${response.body.id}`)
                cy.contains('h2', `${response.body.name}`)
            })
        })

        it('Shows /gallery page', () => {
            cy.visit('http://localhost:3000/gallery')
            cy.url().should('eq', 'http://localhost:3000/gallery')
            cy.contains('h2', 'My gallery')
            
        })
        
    })
})