describe('Edit removal delete removal', () => { 
    beforeEach(() => {
        cy.resetDataBase()
        cy.initUser()
        cy.login()
        cy.initRemoval().as('removal')
        cy.get('@removal').then((response) => {
            cy.visit(`/removals/${response.body.id}`)
        })
    })

    it('deletes removal', () => {
        cy.contains('button', 'Delete removal').click()
        cy.get('[data-cy=positive]').should('contain', 'Dictionary was deleted successfully')
        cy.url().should('eq', 'http://localhost:3000/removals')
    })
})