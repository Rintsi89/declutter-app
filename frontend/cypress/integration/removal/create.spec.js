// This tests uses support/command.js file for log in.

describe('Create removal', () => {

    beforeEach(() => {
        cy.resetDataBase()
        cy.initUser()
        cy.login()
        cy.visit('/')
    })

    it('is on the main removals page', () => {
        cy.contains('h2', 'My removals')
    })

    it('has add new button', () => {
        cy.contains('button', 'Add new')
    })

    it('opens create new form', () => {
        cy.contains('button', 'Add new').click()
        cy.contains('h3', 'Create a new removal')
    })

    it('closes create new form', () => {
        cy.contains('button', 'Add new').click()
        cy.contains('h3', 'Create a new removal')
        cy.contains('button', 'Cancel').click()
        cy.contains('h3', 'Create a new removal').should('not.exist')
    })

    it('requires removal name', () => {
        cy.contains('button', 'Add new').click()
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=negative]').should('contain', 'Name can\'t be blank')
    })

    it('requires quantity', () => {
        cy.contains('button', 'Add new').click()
        cy.get('[data-cy=name]').type('Name for removal')
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=negative]').should('contain', 'Quantity can\'t be blank')
    })

    it('requires value', () => {
        cy.contains('button', 'Add new').click()
        cy.get('[data-cy=name]').type('Name for removal')
        cy.get('[data-cy=quantity]').type(1)
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=negative]').should('contain', 'Value can\'t be blank')
    })

    it('does not save removal with image over 4 mb', () => {
        cy.contains('button', 'Add new').click()
        cy.contains('h3', 'Create a new removal')
        cy.get('[data-cy=name]').type('Old couch')
        cy.get('[data-cy=quantity]').type(1)
        cy.get('[data-cy=category]').click().contains('span', 'Furniture').click()
        cy.get('[data-cy=length]').type(200)
        cy.get('[data-cy=width]').type(80)
        cy.get('[data-cy=height]').type(90)
        cy.get('[data-cy=weight]').type(60)
        cy.get('[data-cy=value]').type(50)
        cy.get('[data-cy=location]').click().contains('span', 'Home').click()
        cy.get('[data-cy=sold]').click().contains('span', 'Tori.fi').click()
        cy.get('[data-cy=note]').type('Sold to the neighbor')
        cy.addLargeImage()
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=negative]').should('contain', 'Problem during file upload. Check your file size and file type')
    })

    it('saves removal', () => {
        cy.contains('button', 'Add new').click()
        cy.contains('h3', 'Create a new removal')
        cy.get('[data-cy=name]').type('Old couch')
        cy.get('[data-cy=quantity]').type(1)
        cy.get('[data-cy=category]').click().contains('span', 'Furniture').click()
        cy.get('[data-cy=length]').type(200)
        cy.get('[data-cy=width]').type(80)
        cy.get('[data-cy=height]').type(90)
        cy.get('[data-cy=weight]').type(60)
        cy.get('[data-cy=value]').type(50)
        cy.get('[data-cy=location]').click().contains('span', 'Home').click()
        cy.get('[data-cy=sold]').click().contains('span', 'Tori.fi').click()
        cy.get('[data-cy=note]').type('Sold to the neighbor')
        cy.addImage()
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=positive]').should('contain', 'Old couch was created successfully')
        cy.contains('h3', 'Create a new removal').should('not.exist')
    })

    it('saves removal without value if donated', () => {
        cy.contains('button', 'Add new').click()
        cy.contains('h3', 'Create a new removal')
        cy.get('[data-cy=type]').click().contains('span', 'For donation').click()
        cy.get('[data-cy=name]').type('Old couch')
        cy.get('[data-cy=quantity]').type(1)
        cy.get('[data-cy=category]').click().contains('span', 'Furniture').click()
        cy.get('[data-cy=length]').type(200)
        cy.get('[data-cy=width]').type(80)
        cy.get('[data-cy=height]').type(90)
        cy.get('[data-cy=weight]').type(60)
        cy.get('[data-cy=location]').click().contains('span', 'Home').click()
        cy.get('[data-cy=sold]').click().contains('span', 'Tori.fi').click()
        cy.get('[data-cy=note]').type('Sold to the neighbor')
        cy.addImage()
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=positive]').should('contain', 'Old couch was created successfully')
        cy.contains('h3', 'Create a new removal').should('not.exist')
    })
})