describe('Main page removal table', () => {
    beforeEach(() => {
        cy.resetDataBase()
        cy.initUser()
        cy.login()
    })

    it('finds one removal', () => {
        cy.initRemoval()
        cy.visit('/')
        cy.get('[data-cy=name]').should('contain', 'Dictionary')
    })

    it('opens the edit page', () => {
        cy.initRemoval().as('removal')
        cy.visit('/')
        cy.get('[data-cy=edit]').click()
        cy.get('@removal').then((response) => {
            cy.url().should('eq', `http://localhost:3000/removals/${response.body.id}`)
        })
        cy.contains('h2', 'Dictionary')
    })

    it('closes not removed modal', () => {
        cy.initRemoval()
        cy.visit('/')
        cy.get('[data-cy=checkmark]').should('contain', 'Yes')
        cy.get('[data-cy=notremoved]').click()
        cy.get('[data-cy=modal]').should('exist')
        cy.contains('button', 'Cancel').click()
        cy.get('[data-cy=modal]').should('not.exist')
        cy.get('[data-cy=checkmark]').should('contain', 'Yes')
    })

    it('marks item not removed', () => {
        cy.initRemoval()
        cy.visit('/')
        cy.get('[data-cy=checkmark]').should('contain', 'Yes')
        cy.get('[data-cy=removed]').should('not.exist')
        cy.get('[data-cy=notremoved]').should('contain', 'Mark not removed')
        cy.get('[data-cy=notremoved]').click()
        cy.get('[data-cy=modal]').should('exist')
        cy.contains('button', 'Yes').click()
        cy.get('[data-cy=notremoved]').should('not.exist')
        cy.get('[data-cy=modal]').should('not.exist')
        cy.get('[data-cy=removed]').should('exist')
        cy.get('[data-cy=positive]').should('contain', 'Dictionary was updated successfully')
        cy.get('[data-cy=checkmark]').should('contain', 'No')
    })

    it('closes removed modal', () => {
        cy.initRemovalNotRemoved()
        cy.visit('/')
        cy.get('[data-cy=checkmark]').should('contain', 'No')
        cy.get('[data-cy=removed]').click()
        cy.get('[data-cy=salemodal]').should('exist')
        cy.contains('button', 'Cancel').click()
        cy.get('[data-cy=salemodal]').should('not.exist')
        cy.get('[data-cy=checkmark]').should('contain', 'No')
    })

    it('marks item removed', () => {
        cy.initRemovalNotRemoved()
        cy.visit('/')
        cy.get('[data-cy=checkmark]').should('contain', 'No')
        cy.get('[data-cy=notremoved]').should('not.exist')
        cy.get('[data-cy=removed]').should('contain', 'Mark removed')
        cy.get('[data-cy=removed]').click()
        cy.get('[data-cy=salemodal]').should('exist')
        cy.contains('button', 'Save').click()
        cy.get('[data-cy=removed]').should('not.exist')
        cy.get('[data-cy=salemodal]').should('not.exist')
        cy.get('[data-cy=notremoved]').should('exist')
        cy.get('[data-cy=positive]').should('contain', 'Dictionary was updated successfully')
        cy.get('[data-cy=checkmark]').should('contain', 'Yes')
    })
    
    it('closes delete modal', () => {
        cy.initRemoval()
        cy.visit('/')
        cy.get('[data-cy=delete]').click()
        cy.get('[data-cy=deletemodal]').should('exist')
        cy.contains('button', 'Cancel').click()
        cy.get('[data-cy=deletemodal]').should('not.exist')
        cy.get('[data-cy=name]').should('contain', 'Dictionary')
    })

    it('deletes removal', () => {
        cy.initRemoval()
        cy.visit('/')
        cy.get('[data-cy=delete]').click()
        cy.get('[data-cy=deletemodal]').should('exist')
        cy.contains('button', 'Yes').click()
        cy.get('[data-cy=deletemodal]').should('not.exist')
        cy.get('[data-cy=positive]').should('contain', 'Dictionary was deleted successfully')
        cy.get('[data-cy=name]').should('not.exist')
    })
})