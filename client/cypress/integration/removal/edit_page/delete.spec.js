describe('Edit removal page delete removal', () => { 
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
        cy.url().should('eq', 'http://localhost:3000/removals')
        cy.get('[data-cy=name]').should('not.exist')
    })
})