describe('My account page sale locations', () => { 

    beforeEach(() => {
        cy.resetDataBase()
        cy.initUser()
        cy.login()
        cy.visit('/myaccount')
        cy.contains('button', 'Edit sale locations').click()
    })

    it('opens edit sale locations form', () => {
        cy.contains('h3', 'Edit your sale locations')
    })

    it('closes edit sale locations form', () => {
        cy.contains('h3', 'Edit your sale locations')
        cy.contains('button', 'Cancel').click()
        cy.contains('h3', 'Edit your sale locations').should('not.exist')
    })
    
    it('has default values visible', () => {
        cy.get('[data-cy=salelocationdetail]').should('have.text',  'Huuto.net, SPR Kontti, Tori.fi')
        cy.get('[data-cy=salelocationlist] > li:nth-child(1)').should('have.text', 'Huuto.net')
        cy.get('[data-cy=salelocationlist] > li:nth-child(2)').should('have.text', 'SPR Kontti')
        cy.get('[data-cy=salelocationlist] > li:nth-child(3)').should('have.text', 'Tori.fi')
    })

    it('requires sale location name', () => {
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=negative]').should('contain', 'Sale location can\'t be blank')
    })

    it('adds sale location', () => {
        cy.get('[data-cy=salelocation]').type('Facebook')
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=salelocationdetail]').should('have.text', 'Facebook, Huuto.net, SPR Kontti, Tori.fi')
        cy.get('[data-cy=positive]').should('contain', 'Sale location Facebook added successfully')
    })

    it('deletes sale location', () => {
        cy.get('[data-cy=delete]:first').click()
        cy.get('[data-cy=salelocationdetail]').should('not.have.text', 'Huuto.net')
        cy.get('[data-cy=salelocationdetail]').should('have.text', 'SPR Kontti, Tori.fi')
        cy.get('[data-cy=positive]').should('contain', 'Sale location Huuto.net deleted successfully')
    })
})