describe('My account page edit details', () => {
    beforeEach(() => {
        cy.resetDataBase()
        cy.initUser()
        cy.login().as('user')
        cy.visit('/myaccount')
        cy.contains('button', 'Edit details').click()
    })

    it('opens edit details form', () => {
        cy.contains('h3', 'Edit your details')
    })

    it('closes edit details form', () => {
        cy.contains('h3', 'Edit your details')
        cy.contains('button', 'Cancel').click()
        cy.contains('h3', 'Edit your details').should('not.exist')
    })

    it('has prefilled name and email', () => {
        cy.get('@user').then((response) => {
            cy.get('[data-cy=username]').should('have.value', response.body.username)
            cy.get('[data-cy=name]').should('be.empty')
            cy.get('[data-cy=email]').should('have.value', response.body.email)
            cy.get('[data-cy=description]').should('be.empty')
            cy.get('[data-cy=usernamedetail]').should('contain', response.body.username)
            cy.get('[data-cy=namedetail]').should('be.empty')
            cy.get('[data-cy=emaildetail]').should('contain', response.body.email)
            cy.get('[data-cy=descriptiondetail]').should('be.empty')
        })
    })

    it('requires username', () => {
        cy.get('[data-cy=username]').clear()
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=negative]').should('contain', 'Username can\'t be blank')
    })

    it('requires email', () => {
        cy.get('[data-cy=email]').clear()
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=negative]').should('contain', 'Email can\'t be blank')
    })

    it('requires unique username', () => {
        cy.initSecondUser().as('user-2')
        cy.get('@user-2').then((response) => {
            cy.get('[data-cy=username]').clear().type(response.body.username)
            cy.get('[data-cy=email]').clear().type('unique@unique.com')
            cy.get('[data-cy=save]').click()
            cy.get('[data-cy=negative]').should('contain', `Username ${response.body.username} is already taken`)
        })
    })

    it('requires unique email', () => {
        cy.initSecondUser().as('user-2')
        cy.get('@user-2').then((response) => {
            cy.get('[data-cy=username]').clear().type('New username')
            cy.get('[data-cy=email]').clear().type(response.body.email)
            cy.get('[data-cy=save]').click()
            cy.get('[data-cy=negative]').should('contain', `Email ${response.body.email} is already taken`)
        })
    })

    it('updates user', () => {
        cy.get('[data-cy=username]').clear().type('New username')
        cy.get('[data-cy=name]').clear().type('User')
        cy.get('[data-cy=email]').clear().type('newEmail@newEmail.com')
        cy.get('[data-cy=description]').clear().type('I am very nice guy!')
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=usernamedetail]').should('contain', 'New username')
        cy.get('[data-cy=namedetail]').should('contain', 'User')
        cy.get('[data-cy=emaildetail]').should('contain', 'newEmail@newEmail.com')
        cy.get('[data-cy=descriptiondetail]').should('contain', 'I am very nice guy!')
        cy.get('[data-cy=positive]').should('contain', 'New username was updated successfully')
    })
})