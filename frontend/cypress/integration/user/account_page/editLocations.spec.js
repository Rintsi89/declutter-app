describe('My account page locations', () => { 

    beforeEach(() => {
        cy.resetDataBase()
        cy.initUser()
        cy.login()
        cy.visit('/myaccount')
        cy.contains('button', 'Edit locations').click()
    })

    it('opens edit locations form', () => {
        cy.contains('h3', 'Edit your locations')
    })

    it('closes edit locations form', () => {
        cy.contains('h3', 'Edit your locations')
        cy.contains('button', 'Cancel').click()
        cy.contains('h3', 'Edit your locations').should('not.exist')
    })
    
    it('has default values visible', () => {
        cy.get('[data-cy=locationdetail]').should('have.text', 'Home')
        cy.get('[data-cy=locationlist]').should('have.text', 'Home')
    })

    it('requires location name', () => {
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=negative]').should('contain', 'Location can\'t be blank')
    })

    it('adds location', () => {
        cy.get('[data-cy=location]').type('Garage')
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=locationdetail]').should('have.text', 'Garage, Home')
        cy.get('[data-cy=positive]').should('contain', 'Location Garage added successfully')
    })

    it('deletes location', () => {
        cy.get('[data-cy=delete]').click()
        cy.get('[data-cy=locationdetail]').should('not.have.text', 'Home')
        cy.get('[data-cy=positive]').should('contain', 'Location Home deleted successfully')
    })
})