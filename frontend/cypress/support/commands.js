import 'cypress-file-upload'

Cypress.Commands.add('login', () => {
    cy.request({
        method: 'POST',
        url: '/api/login',
        body: {
        username: 'testUser',
        password: 'salasana'
    }}).then((response) => {
        window.localStorage.setItem('loggedUser', JSON.stringify(response.body))
    })
})

Cypress.Commands.add('resetDataBase', () => {
    cy.request('POST', '/api/testing/reset')
})

Cypress.Commands.add('initUser', () => {
    cy.request('POST', '/api/testing/initUser')
})

Cypress.Commands.add('initRemoval', () => {

    const user = JSON.parse(window.localStorage.getItem('loggedUser'))
    const token = user.token
    
    cy.request({
        method: 'POST',
        url: '/api/removals',
        headers: {
            Authorization: `bearer ${token}`
        },
        body: {
            length: 12,
            width: 12,
            height: 12,
            cbm: 0.02,
            weight: 12,
            totalWeight: 144,
            value: 12,
            totalValue: 144,
            saleItem: true,
            name: "Dictionary",
            removed: true,
            quantity: 12,
            category: "Books",
            date: "2020-01-23",
            dateRemoved: "2020-01-23",
            location: "Home",
            soldAt: "Huuto.net",
            note: "This was expensive"
        }
    })
})

Cypress.Commands.add('addImage', () => {
    cy.fixture('test-image.jpg').then(fileContent => {
        cy.get('[data-cy=image]').upload({ fileContent, fileName: 'test-image.jpg', mimeType: 'image/jpeg' })})
})

Cypress.Commands.add('addLargeImage', () => {
    cy.fixture('test-image-too-large.jpg').then(fileContent => {
        cy.get('[data-cy=image]').upload({ fileContent, fileName: 'test-image-too-large.jpg', mimeType: 'image/jpeg' })})
})


