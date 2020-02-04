describe('Edit removal page mark removed / not removed', () => {
    beforeEach(() => {
        cy.resetDataBase()
        cy.initUser()
        cy.login()
        cy.initRemoval().as('removal')
        cy.get('@removal').then((response) => {
            cy.visit(`/removals/${response.body.id}`)
        })
        cy.contains('button', 'Edit details').click()
    })

        it('opens edit removal form', () => {
            cy.contains('h3', 'Edit removal')
        })

        it('closes edit removal form', () => {
            cy.contains('h3', 'Edit removal')
            cy.contains('button', 'Cancel').click()
            cy.contains('h3', 'Edit details').should('not.exist')
        })

        it('has prefilled values', () => {
            cy.get('@removal').then((response) => {
                cy.get('[data-cy=type]').find('div').first().should('contain', response.body.saleItem ? 'For sale' : 'For donation')
                cy.get('[data-cy=name]').should('have.value', response.body.name)
                cy.get('[data-cy=quantity]').should('have.value', response.body.quantity.toString())
                cy.get('[data-cy=category]').find('div').first().should('contain', response.body.category)
                cy.get('[data-cy=length]').should('have.value', response.body.length.toString())
                cy.get('[data-cy=width]').should('have.value', response.body.width.toString())
                cy.get('[data-cy=height]').should('have.value', response.body.height.toString())
                cy.get('[data-cy=weight]').should('have.value', response.body.weight.toString())
                cy.get('[data-cy=value]').should('have.value', response.body.value.toString())
                cy.get('[data-cy=location]').find('div').first().should('contain', response.body.location)
                cy.get('[data-cy=sold]').find('div').first().should('contain', response.body.soldAt)
                cy.get('[data-cy=name]').should('have.value', response.body.name)
                cy.get('[data-cy=note]').should('have.value', response.body.note)
                cy.get('[data-cy=date]').should('have.value', response.body.date)
                cy.get('[data-cy=dateremoved]').should('have.value', response.body.dateRemoved)
            })
        })

        it('requires removal name', () => {
            cy.get('[data-cy=name]').clear()
            cy.get('[data-cy=save]').click()
            cy.get('[data-cy=negative]').should('contain', 'Name can\'t be blank')
        })

        it('requires quantity', () => {
            cy.get('[data-cy=quantity]').clear()
            cy.get('[data-cy=save]').click()
            cy.get('[data-cy=negative]').should('contain', 'Quantity can\'t be blank')
        })

        it('requires value', () => {
            cy.get('[data-cy=value]').clear()
            cy.get('[data-cy=save]').click()
            cy.get('[data-cy=negative]').should('contain', 'Value can\'t be blank')
        })

        it('saves edited removal', () => {
            cy.get('[data-cy=name]').clear().type('Old couch')
            cy.get('[data-cy=quantity]').clear().type(1)
            cy.get('[data-cy=category]').click().contains('span', 'Furniture').click()
            cy.get('[data-cy=length]').clear().type(200)
            cy.get('[data-cy=width]').clear().type(80)
            cy.get('[data-cy=height]').clear().type(90)
            cy.get('[data-cy=weight]').clear().type(60)
            cy.get('[data-cy=value]').clear().type(50)
            cy.get('[data-cy=location]').click().contains('span', 'Home').click()
            cy.get('[data-cy=sold]').click().contains('span', 'Tori.fi').click()
            cy.get('[data-cy=note]').clear().type('Sold to the neighbor')
            cy.get('[data-cy=date]').type('2020-01-01')
            cy.get('[data-cy=dateremoved]').type('2020-01-31')
            cy.get('[data-cy=save]').click()
            cy.get('[data-cy=positive]').should('contain', 'Old couch was updated successfully')
            cy.contains('h2', 'Old couch')
        })

        it('saves edited removal without value if donated', () => {
            cy.get('[data-cy=value]').clear()
            cy.get('[data-cy=type]').click().contains('span', 'For donation').click()
            cy.get('[data-cy=name]').clear().type('Old couch')
            cy.get('[data-cy=quantity]').clear().type(1)
            cy.get('[data-cy=category]').click().contains('span', 'Furniture').click()
            cy.get('[data-cy=length]').clear().type(200)
            cy.get('[data-cy=width]').clear().type(80)
            cy.get('[data-cy=height]').clear().type(90)
            cy.get('[data-cy=weight]').clear().type(60)
            cy.get('[data-cy=location]').click().contains('span', 'Home').click()
            cy.get('[data-cy=sold]').click().contains('span', 'Tori.fi').click()
            cy.get('[data-cy=note]').clear().type('Sold to the neighbor')
            cy.get('[data-cy=date]').type('2020-01-01')
            cy.get('[data-cy=dateremoved]').type('2020-01-31')
            cy.get('[data-cy=save]').click()
            cy.get('[data-cy=positive]').should('contain', 'Old couch was updated successfully')
            cy.contains('h2', 'Old couch')
        })
})