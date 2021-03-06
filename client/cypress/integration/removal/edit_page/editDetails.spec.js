describe('Edit removal page details', () => {
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

                cy.get('[data-cy=namedetail]').should('contain', response.body.name)
                cy.get('[data-cy=quantitydetail]').should('contain', response.body.quantity)
                cy.get('[data-cy=locationdetail]').should('contain', response.body.location)
                cy.get('[data-cy=categorydetail]').should('contain', response.body.category)
                cy.get('[data-cy=valuedetail]').should('contain', response.body.value)
                cy.get('[data-cy=totalvaluedetail]').should('contain', response.body.totalValue)
                cy.get('[data-cy=typedetail]').should('contain', response.body.saleItem ? 'sell' : 'donate')
                cy.get('[data-cy=solddetail]').should('contain', response.body.soldAt)
                cy.get('[data-cy=lengthdetail]').should('contain', response.body.length)
                cy.get('[data-cy=widthdetail]').should('contain', response.body.width)
                cy.get('[data-cy=heightdetail]').should('contain', response.body.height)
                cy.get('[data-cy=volumedetail]').should('contain', response.body.cbm)
                cy.get('[data-cy=weightdetail]').should('contain', response.body.weight)
                cy.get('[data-cy=totalweightdetail]').should('contain', response.body.totalWeight)
                cy.get('[data-cy=notedetail]').should('contain', response.body.note)
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

            cy.contains('h2', 'Old couch')
            cy.get('[data-cy=namedetail]').should('contain', 'Old couch')
            cy.get('[data-cy=quantitydetail]').should('contain', 1)
            cy.get('[data-cy=locationdetail]').should('contain', 'Home')
            cy.get('[data-cy=categorydetail]').should('contain', 'Furniture')
            cy.get('[data-cy=valuedetail]').should('contain', 50)
            cy.get('[data-cy=totalvaluedetail]').should('contain', 50)
            cy.get('[data-cy=typedetail]').should('contain', 'sell')
            cy.get('[data-cy=solddetail]').should('contain', 'Tori.fi')
            cy.get('[data-cy=lengthdetail]').should('contain', 200)
            cy.get('[data-cy=widthdetail]').should('contain', 80)
            cy.get('[data-cy=heightdetail]').should('contain', 90)
            cy.get('[data-cy=volumedetail]').should('contain', (200 * 80 * 90 / 1000000).toFixed(2))
            cy.get('[data-cy=weightdetail]').should('contain', 60)
            cy.get('[data-cy=totalweightdetail]').should('contain', 60)
            cy.get('[data-cy=notedetail]').should('contain', 'Sold to the neighbor')
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
            cy.get('[data-cy=namedetail]').should('contain', 'Old couch')
            cy.get('[data-cy=quantitydetail]').should('contain', 1)
            cy.get('[data-cy=locationdetail]').should('contain', 'Home')
            cy.get('[data-cy=categorydetail]').should('contain', 'Furniture')
            cy.get('[data-cy=valuedetail]').should('contain', 0)
            cy.get('[data-cy=totalvaluedetail]').should('contain', 0)
            cy.get('[data-cy=typedetail]').should('contain', 'donate')
            cy.get('[data-cy=solddetail]').should('contain', 'Tori.fi')
            cy.get('[data-cy=lengthdetail]').should('contain', 200)
            cy.get('[data-cy=widthdetail]').should('contain', 80)
            cy.get('[data-cy=heightdetail]').should('contain', 90)
            cy.get('[data-cy=volumedetail]').should('contain', (200 * 80 * 90 / 1000000).toFixed(2))
            cy.get('[data-cy=weightdetail]').should('contain', 60)
            cy.get('[data-cy=totalweightdetail]').should('contain', 60)
            cy.get('[data-cy=notedetail]').should('contain', 'Sold to the neighbor')
        })
})