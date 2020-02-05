describe('Main page info table', () => {

    beforeEach(() => {
        cy.resetDataBase()
        cy.initUser()
        cy.login()
        cy.visit('/')
    })

    it('has username', () => {
        cy.get('[data-cy=username]').should('have.text', 'testUser')
    })

    it('has initial values of 0 if no removals', () => {
        cy.get('[data-cy=username]').should('have.text', 'testUser')
        cy.get('[data-cy=money]').should('have.text', '0.00 €')
        cy.get('[data-cy=cbm]').should('have.text', '0.00 m³')
        cy.get('[data-cy=quantitydetail]').should('have.text', '0')
        cy.get('[data-cy=totalsalequantity]').should('have.text', '0')
        cy.get('[data-cy=totaldonatedquantity]').should('have.text', '0')
        cy.get('[data-cy=weightdetail]').should('have.text', '0 kg')
        cy.get('[data-cy=example]').should('have.text', 'Volume of removed items is 0% of the volume plastic bag')
    })

    it('has values if there are removals', () => {
        cy.initRemoval()
        cy.get('[data-cy=money]').should('have.text', '144.00 €')
        cy.get('[data-cy=cbm]').should('have.text', '0.02 m³')
        cy.get('[data-cy=quantitydetail]').should('have.text', '12')
        cy.get('[data-cy=totalsalequantity]').should('have.text', '12')
        cy.get('[data-cy=totaldonatedquantity]').should('have.text', '0')
        cy.get('[data-cy=weightdetail]').should('have.text', '144 kg')
        cy.get('[data-cy=example]').should('have.text', 'Volume of removed items is 18% of the volume of Samsonite trolley bag')
    })

    it('has values of 0 if removal is not removed', () => {
        cy.initRemovalNotRemoved()
        cy.get('[data-cy=money]').should('have.text', '0.00 €')
        cy.get('[data-cy=cbm]').should('have.text', '0.00 m³')
        cy.get('[data-cy=quantitydetail]').should('have.text', '0')
        cy.get('[data-cy=totalsalequantity]').should('have.text', '0')
        cy.get('[data-cy=totaldonatedquantity]').should('have.text', '0')
        cy.get('[data-cy=weightdetail]').should('have.text', '0 kg')
        cy.get('[data-cy=example]').should('have.text', 'Volume of removed items is 0% of the volume plastic bag')
    })

    it('has one different value if removal is donated', () => {
        cy.initRemovalDonated()
        cy.get('[data-cy=money]').should('have.text', '0.00 €')
        cy.get('[data-cy=cbm]').should('have.text', '0.02 m³')
        cy.get('[data-cy=quantitydetail]').should('have.text', '12')
        cy.get('[data-cy=totalsalequantity]').should('have.text', '0')
        cy.get('[data-cy=totaldonatedquantity]').should('have.text', '12')
        cy.get('[data-cy=weightdetail]').should('have.text', '144 kg')
        cy.get('[data-cy=example]').should('have.text', 'Volume of removed items is 18% of the volume of Samsonite trolley bag')
    })

})