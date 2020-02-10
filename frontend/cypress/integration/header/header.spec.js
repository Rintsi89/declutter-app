describe('Header', () => {
    beforeEach(() => {
        cy.resetDataBase()
        cy.initUser()
        cy.login().as('user').then((response) => {
            expect(localStorage.getItem('loggedUser')).to.eq(JSON.stringify(response.body))
        })
        cy.visit('/')
    })
    
    it('has title', () => {
        cy.get('[data-cy=maintitle]').should('have.text', 'Declutter App')
    })

    it('has signature', () => {
        cy.get('[data-cy=signature]').should('have.text', 'By Ville Rintala')
    })

    it('has working search bar', () => {
        cy.initRemoval().as('removal')
        cy.visit('/')
        cy.get('[data-cy=searchbar]').type('Dictionary')
        cy.get('.result').find('div:first').click()
        cy.get('@removal').then((response) => {
            cy.url().should('eq', `http://localhost:3000/removals/${response.body.id}`)
        })
        cy.contains('h2', 'Dictionary')
    })

    it('has working link to removals', () => {
        cy.get('[data-cy=removals]').click()
        cy.url().should('eq', 'http://localhost:3000/removals')
        cy.contains('h2', 'My removals')
    })

    it('has working link to user account', () => {
        cy.get('[data-cy=account]').click()
        cy.url().should('eq', 'http://localhost:3000/myaccount')
        cy.contains('h2', 'My account')
    })

    it('has working link to gallery', () => {
        cy.get('[data-cy=gallery]').click()
        cy.url().should('eq', 'http://localhost:3000/gallery')
        cy.contains('h2', 'My gallery')
    })

    it('logs out user', () => {
        cy.get('[data-cy=logout]').click().should(() => {
            expect(localStorage.getItem('loggedUser')).not.to.exist
        })
        cy.url().should('eq', 'http://localhost:3000/login')
        cy.contains('h3', 'Log In').should('exist')
    })
})