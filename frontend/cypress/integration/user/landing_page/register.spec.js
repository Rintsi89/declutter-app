describe('Register', () => {

    before(() => {
        cy.resetDataBase()
        cy.initUser()
    })

    beforeEach(() => {
        cy.visit('/')
        cy.contains('button', 'Create account').click()
    })

    it('is on the right page', () => {
        cy.contains('h3', 'Create user account')
    })

    it('has log in button', () => {
        cy.contains('button', 'Log in')
    })

    it('has reset password button', () => {
        cy.contains('button', 'Reset password')
    })

    it('requires username', () => {
        cy.get('[data-cy=register]').click()
        cy.get('[data-cy=negative]').should('contain', 'Username can\'t be blank')
    })

    it('requires email', () => {
        cy.get('[data-cy=username]').type('User-1{enter}')
        cy.get('[data-cy=negative]').should('contain', 'Email can\'t be blank')
    })

    it('requires password', () => {
        cy.get('[data-cy=username]').type('User-1')
        cy.get('[data-cy=email]').type('test@test.com{enter}')
        cy.get('[data-cy=negative]').should('contain', 'Password minimum length is 5')
    })

    it('requires password retyping to be correct', () => {
        cy.get('[data-cy=username]').type('User-1')
        cy.get('[data-cy=email]').type('test@test.com')
        cy.get('[data-cy=password]').type('password')
        cy.get('[data-cy=password2]').type('passwor{enter}')
        cy.get('[data-cy=negative]').should('contain', 'Password mismatch')
    })

    it('requires password to be at least 5 characters', () => {
        cy.get('[data-cy=username]').type('User-1')
        cy.get('[data-cy=email]').type('test@test.com')
        cy.get('[data-cy=password]').type('pass')
        cy.get('[data-cy=password2]').type('pass{enter}')
        cy.get('[data-cy=negative]').should('contain', 'Password minimum length is 5')
    })

    it('requires unique username', () => {
        cy.get('[data-cy=username]').type('testUser')
        cy.get('[data-cy=email]').type('test@test.com')
        cy.get('[data-cy=password]').type('password')
        cy.get('[data-cy=password2]').type('password{enter}')
        cy.get('[data-cy=negative]').should('contain', 'User validation failed')
    })

    it('requires unique email', () => {
        cy.get('[data-cy=username]').type('User-1')
        cy.get('[data-cy=email]').type('testUser@testUser.com')
        cy.get('[data-cy=password]').type('password')
        cy.get('[data-cy=password2]').type('password{enter}')
        cy.get('[data-cy=negative]').should('contain', 'User validation failed')
    })

    it('creates user account', () => {
        cy.get('[data-cy=username]').type('User-1')
        cy.get('[data-cy=email]').type('test@test.com')
        cy.get('[data-cy=password]').type('password')
        cy.get('[data-cy=password2]').type('password{enter}')
        cy.get('[data-cy=positive]').should('contain', 'Verification email sent')
    })

})