describe('Page not found page', () => {

    describe('User is logged in', () => {
        beforeEach(() => {
            cy.resetDataBase()
            cy.initUser()
            cy.login()
        })
    
        it('shows when url is not valid', () => {
            cy.visit('http://localhost:3000/notexist')
            cy.contains('h1', 'Page not found!')
        })
    
        it('shows also on removals/:id route if id is invalid', () => {
            cy.visit('http://localhost:3000/removals/1243543125')
            cy.contains('h1', 'Page not found!')
        })
    
        it('has link to removals page', () => {
            cy.visit('http://localhost:3000/notexist')
            cy.get('[data-cy=buttonlink]').click()
            cy.url().should('eq', 'http://localhost:3000/removals')
        })
    })
    
    describe('user is not logged in', () => {
        beforeEach(() => {
            cy.resetDataBase()
        })
        
        it('shows when url is not valid', () => {
            cy.visit('http://localhost:3000/notexist')
            cy.contains('h1', 'Page not found!')
        })
    })

})