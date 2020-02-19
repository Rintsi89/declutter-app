describe('My account page change password', () => {
    beforeEach(() => {
        cy.resetDataBase()
        cy.initUser()
        cy.login()
        cy.visit('/myaccount')
        cy.contains('button', 'Change password').click()
    })

    it('opens change password form', () => {
        cy.contains('h3', 'Change your password')
    })

    it('closes change password form', () => {
        cy.contains('h3', 'Change your password')
        cy.contains('button', 'Cancel').click()
        cy.contains('h3', 'Change your password').should('not.exist')
    })

    it('requires old password', () => {
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=negative]').should('contain', 'Password can\'t be blank')
    })

    it('requires new password', () => {
        cy.get('[data-cy=password]').type('salasana')
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=negative]').should('contain', 'New password can\'t be blank')
    })

    it('requires new password again', () => {
        cy.get('[data-cy=password]').type('salasana')
        cy.get('[data-cy=newpassword]').type('uusisalasana')
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=negative]').should('contain', 'New password must be typed again')
    })

    it('requires password retyping to be correct', () => {
        cy.get('[data-cy=password]').type('salasana')
        cy.get('[data-cy=newpassword]').type('uusisalasana')
        cy.get('[data-cy=newpasswordre]').type('uusisalasanaaa')
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=negative]').should('contain', 'New password does not match! Please type again')
    })

    it('requires valid password', () => {
        cy.get('[data-cy=password]').type('salasan')
        cy.get('[data-cy=newpassword]').type('uusisalasana')
        cy.get('[data-cy=newpasswordre]').type('uusisalasana')
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=negative]').should('contain', 'Invalid token, id or password')
    })

    it('requires new password to be at least 5 characters', () => {
        cy.get('[data-cy=password]').type('salasana')
        cy.get('[data-cy=newpassword]').type('uusi')
        cy.get('[data-cy=newpasswordre]').type('uusi')
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=negative]').should('contain', 'Password minimum length is 5')
    })

    it('changes password', () => {
        cy.get('[data-cy=password]').type('salasana')
        cy.get('[data-cy=newpassword]').type('uusisalasana')
        cy.get('[data-cy=newpasswordre]').type('uusisalasana')
        cy.get('[data-cy=save]').click()
        cy.get('[data-cy=positive]').should('contain', 'Password was updated successfully')
    })

})
