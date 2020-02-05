describe('My account page categories', () => { 

    beforeEach(() => {
        cy.resetDataBase()
        cy.initUser()
        cy.login()
        cy.visit('/myaccount')
        cy.contains('button', 'Edit categories').click()
    })

    it('opens edit categories form', () => {
        cy.contains('h3', 'Edit your categories')
    })

    it('closes edit categories form', () => {
        cy.contains('h3', 'Edit your categories')
        cy.contains('button', 'Cancel').click()
        cy.contains('h3', 'Edit your categories').should('not.exist')
    })
    
    it('has default values visible', () => {
        cy.get('[data-cy=categorydetail]').should('have.text',  'Books, Clothes, Dishes, Documents, Electric appliances, Furniture, Sentimental items, Sport equipment')
        cy.get('[data-cy=categorylist] > li:nth-child(1)').should('have.text', 'Books')
        cy.get('[data-cy=categorylist] > li:nth-child(2)').should('have.text', 'Clothes')
        cy.get('[data-cy=categorylist] > li:nth-child(3)').should('have.text', 'Dishes')
        cy.get('[data-cy=categorylist] > li:nth-child(4)').should('have.text', 'Documents')
        cy.get('[data-cy=categorylist] > li:nth-child(5)').should('have.text', 'Electric appliances')
        cy.get('[data-cy=categorylist] > li:nth-child(6)').should('have.text', 'Furniture')
        cy.get('[data-cy=categorylist] > li:nth-child(7)').should('have.text', 'Sentimental items')
        cy.get('[data-cy=categorylist] > li:nth-child(8)').should('have.text', 'Sport equipment')
    })

    it('requires sale location name', () => {
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=negative]').should('contain', 'Category can\'t be blank')
    })

    it('adds category', () => {
        cy.get('[data-cy=category]').type('Photos')
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=categorydetail]').should('have.text', 'Books, Clothes, Dishes, Documents, Electric appliances, Furniture, Photos, Sentimental items, Sport equipment')
        cy.get('[data-cy=positive]').should('contain', 'Category Photos added successfully')
    })

    it('deletes category', () => {
        cy.get('[data-cy=delete]:first').click()
        cy.get('[data-cy=categorydetail]').should('not.have.text', 'Books')
        cy.get('[data-cy=categorydetail]').should('have.text', 'Clothes, Dishes, Documents, Electric appliances, Furniture, Sentimental items, Sport equipment')
        cy.get('[data-cy=positive]').should('contain', 'Category Books deleted successfully')
    })
})