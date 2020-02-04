describe('Edit removal page image', () => {
    beforeEach(() => {
        cy.resetDataBase()
        cy.initUser()
        cy.login()
        cy.initRemoval().as('removal')
        cy.get('@removal').then((response) => {
            cy.visit(`/removals/${response.body.id}`)
        })
        cy.contains('button', 'Edit image').click()
    })

    it('opens edit image form', () => {
        cy.contains('h3', 'Edit removal image')
    })

    it('closes edit image form', () => {
        cy.contains('h3', 'Edit removal')
        cy.contains('button', 'Cancel').click()
        cy.contains('h3', 'Edit removal').should('not.exist')
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
        cy.get('[data-cy=positive]').should('contain', 'Image for Dictionary was updated successfully')
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
        cy.contains('button', 'Edit image').click()
        cy.get('[data-cy=delete]').click()
        cy.get('[data-cy=mainimage]').should('not.have.attr', 'src')
        cy.get('[data-cy=positive]').should('contain', 'Image for Dictionary was deleted successfully')
    })
})