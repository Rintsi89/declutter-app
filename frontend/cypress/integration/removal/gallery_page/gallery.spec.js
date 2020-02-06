describe('Gallery page', () => { 

    describe('test with removed item', () => {

        beforeEach(() => {
            cy.resetDataBase()
            cy.initUser()
            cy.login()
            cy.initRemovalWithImage().as('removal')
            cy.visit('/gallery')
        })

        it('is on the right page', () => {
            cy.contains('h2', 'My gallery')
        })
    
        it('has right image', () => {
            cy.get('[data-cy=image]').should('have.attr', 'src', 'https://declutter-images.s3.eu-north-1.amazonaws.com/initial.jpg')
        })
    
        it('has right link', () => {
            cy.get('[data-cy=link]').should('have.text', 'Dictionary')
        })
    
        it('has right meta', () => {
            cy.get('[data-cy=meta]').should('have.text', 'Created 23.01.2020')
        })
    
        it('has right status', () => {
            cy.get('[data-cy=removed]').should('have.text', 'Removed')
            cy.get('[data-cy=notremoved]').should('not.exist')
        })
    
        it('opens the link', () => {
            cy.get('[data-cy=link]').click()
            cy.get('@removal').then((response) => {
                cy.url().should('eq', `http://localhost:3000/removals/${response.body.id}`)
            })
        })
    })
    
    describe('test with not removed item', () => {
        beforeEach(() => {
            cy.resetDataBase()
            cy.initUser()
            cy.login()
            cy.initRemovalWithImageNotRemoved()
            cy.visit('/gallery')
        })

        it('has right status', () => {
            cy.get('[data-cy=notremoved]').should('have.text', 'Not removed')
            cy.get('[data-cy=removed]').should('not.exist')
        })
    
    })
})