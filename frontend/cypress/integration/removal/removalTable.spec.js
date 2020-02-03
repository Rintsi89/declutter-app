describe('Removal table functionalities', () => {
    beforeEach(() => {
        cy.resetDataBase()
        cy.initUser()
        cy.login()
        cy.initRemoval()
        cy.visit('/')
    })

    it('finds one removal', () => {
        cy.get('[data-cy=name]').should('contain', 'Dictionary')
    })
})