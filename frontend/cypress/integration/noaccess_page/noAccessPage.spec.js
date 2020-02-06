describe('No Access Page', () => { 
    beforeEach(() => {
        cy.resetDataBase()
        cy.visit('/gallery')
    })
})