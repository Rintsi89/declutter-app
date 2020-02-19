describe('Login', () => {

    before(() => {
        cy.resetDataBase()
        cy.initUser()
    })

    beforeEach(() => {
        cy.visit('/')
    })

    it('greets with log in', () => {
        cy.contains('h3', 'Log In')
    })

    it('has create account button', () => {
        cy.contains('button', 'Create account')
    })

    it('has reset password button', () => {
        cy.contains('button', 'Reset password')
    })

    it('requires username', () => {
        cy.get('[data-cy=login]').click()
        cy.get('[data-cy=negative]').should('contain', 'Username can\'t be blank')
    })

    it('requires password', () => {
        cy.get('[data-cy=username]').type('User-1{enter}')
        cy.get('[data-cy=negative]').should('contain', 'Password can\'t be blank')
    })

    it('requires valid username and password', () => {
        cy.get('[data-cy=username]').type('Wrong user')
        cy.get('[data-cy=password]').type('Wrong password{enter}')
        cy.get('[data-cy=negative]').should('contain', 'Invalid username or password')
    })

    it('navigates to /removals after successful login', () => {
        cy.get('[data-cy=username]').type('testUser')
        cy.get('[data-cy=password]').type('salasana{enter}')
        cy.url().should('eq', 'http://localhost:3000/removals')
    })

})