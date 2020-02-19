describe('Edit removal page mark removed / not removed', () => {
    beforeEach(() => {
        cy.resetDataBase()
        cy.initUser()
        cy.login()

    })

    it('closes not removed modal', () => {
        cy.initRemoval().as('removal')
        cy.get('@removal').then((response) => {
            cy.visit(`/removals/${response.body.id}`)
        })
        cy.get('[data-cy=bar]').should('exist')
        cy.get('[data-cy=notremoved]').click()
        cy.get('[data-cy=modal]').should('exist')
        cy.contains('button', 'Cancel').click()
        cy.get('[data-cy=modal]').should('not.exist')
        cy.get('[data-cy=bar]').should('exist')
    })

    it('marks item not removed', () => {
        cy.initRemoval().as('removal')
        cy.get('@removal').then((response) => {
            cy.visit(`/removals/${response.body.id}`)
        })
        cy.get('[data-cy=bar]').should('exist')
        cy.get('[data-cy=removed]').should('not.exist')
        cy.get('[data-cy=notremoved]').should('contain', 'Mark not removed')
        cy.get('[data-cy=notremoved]').click()
        cy.get('[data-cy=modal]').should('exist')
        cy.contains('button', 'Yes').click()
        cy.get('[data-cy=notremoved]').should('not.exist')
        cy.get('[data-cy=modal]').should('not.exist')
        cy.get('[data-cy=bar]').should('not.exist')
        cy.get('[data-cy=removed]').should('exist')
        cy.get('[data-cy=note]').should('contain', 'Item is not yet removed')
        cy.get('[data-cy=positive]').should('contain', 'Dictionary was updated successfully')
    })

    it('closes removed modal', () => {
        cy.initRemovalNotRemoved().as('removal')
        cy.get('@removal').then((response) => {
            cy.visit(`/removals/${response.body.id}`)
        })
        cy.get('[data-cy=note]').should('exist')
        cy.get('[data-cy=removed]').click()
        cy.get('[data-cy=salemodal]').should('exist')
        cy.contains('button', 'Cancel').click()
        cy.get('[data-cy=salemodal]').should('not.exist')
        cy.get('[data-cy=note]').should('exist')
    })

    it('marks item removed', () => {
        cy.initRemovalNotRemoved().as('removal')
        cy.get('@removal').then((response) => {
            cy.visit(`/removals/${response.body.id}`)
        })
        cy.get('[data-cy=note]').should('exist')
        cy.get('[data-cy=notremoved]').should('not.exist')
        cy.get('[data-cy=removed]').should('contain', 'Mark removed')
        cy.get('[data-cy=removed]').click()
        cy.get('[data-cy=salemodal]').should('exist')
        cy.contains('button', 'Save').click()
        cy.get('[data-cy=removed]').should('not.exist')
        cy.get('[data-cy=salemodal]').should('not.exist')
        cy.get('[data-cy=note]').should('not.exist')
        cy.get('[data-cy=bar]').should('exist')
        cy.get('[data-cy=notremoved]').should('exist')
        cy.get('[data-cy=positive]').should('contain', 'Dictionary was updated successfully')
    })
})
