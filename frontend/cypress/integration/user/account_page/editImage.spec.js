describe('My account page image', () => {
    beforeEach(() => {
        cy.resetDataBase()
        cy.initUser()
        cy.login()
        cy.visit('/myaccount')
        cy.contains('button', 'Edit profile picture').click()
    })

    it('opens edit profile picture form', () => {
        cy.contains('h3', 'Edit your profile picture')
    })

    it('closes edit profile picture form', () => {
        cy.contains('h3', 'Edit your profile picture')
        cy.contains('button', 'Cancel').click()
        cy.contains('h3', 'Edit your profile picture').should('not.exist')
    })

    it('requires image', () => {
        cy.get('[data-cy=upload]').click()
        cy.get('[data-cy=negative]').should('contain', 'Select image first!')
    })

    it('does not upload image over 4mb', () => {
        cy.addLargeImage()
        cy.get('[data-cy=upload]').click()
        cy.get('[data-cy=negative]').should('contain', 'Problem during file upload. Check your file size and file type')
    })

    it('uploads image', () => {
        cy.get('[data-cy=mainimage]').should('not.have.attr', 'src')
        cy.addImage()
        cy.get('[data-cy=upload]').click()
        cy.get('[data-cy=positive]').should('contain', 'Image for testUser was updated successfully')
        cy.get('[data-cy=mainimage]').should('have.attr', 'src').should('include', 'test-image')
    })


    it('notificates if there is no image to delete', () => {
        cy.get('[data-cy=delete]').click()
        cy.get('[data-cy=negative]').should('contain', 'There is no image to delete!')
    })

    it('deletes image', () => {
        cy.addImage()
        cy.get('[data-cy=upload]').click()
        cy.get('[data-cy=mainimage]').should('have.attr', 'src').should('include', 'test-image')
        cy.contains('button', 'Edit profile picture').click()
        cy.get('[data-cy=delete]').click()
        cy.get('[data-cy=mainimage]').should('not.have.attr', 'src')
        cy.get('[data-cy=positive]').should('contain', 'Image for testUser was deleted successfully')
    })
})