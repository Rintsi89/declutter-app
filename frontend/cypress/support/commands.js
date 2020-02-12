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

Cypress.Commands.add('clearStorage', () => {
    window.localStorage.removeItem('loggedUser')
})

Cypress.Commands.add('resetDataBase', () => {
    cy.request('POST', '/api/testing/reset')
})

Cypress.Commands.add('initUser', () => {
    cy.request('POST', '/api/testing/initUser')
})

Cypress.Commands.add('initSecondUser', () => {
    cy.request('POST', '/api/testing/initSecondUser')
})

Cypress.Commands.add('initRemovalWithImage', () => {

    const user = JSON.parse(window.localStorage.getItem('loggedUser'))
    const token = user.token

    cy.fixture('/removal_with_image/removal').then((removal) => {
        cy.request({
            method: 'POST',
            url: '/api/testing/initRemovals',
            headers: {
                Authorization: `bearer ${token}`
            },
            body: removal
        })
    })
})

Cypress.Commands.add('initRemovalWithImageNotRemoved', () => {

    const user = JSON.parse(window.localStorage.getItem('loggedUser'))
    const token = user.token

    cy.fixture('/removal_with_image/removalNotRemoved').then((removal) => {
        cy.request({
            method: 'POST',
            url: '/api/testing/initRemovals',
            headers: {
                Authorization: `bearer ${token}`
            },
            body: removal
        })
    })
})

Cypress.Commands.add('initRemoval', () => {

    const user = JSON.parse(window.localStorage.getItem('loggedUser'))
    const token = user.token
    
    cy.fixture('removal').then((removal) => {
        cy.request({
            method: 'POST',
            url: '/api/removals',
            headers: {
                Authorization: `bearer ${token}`
            },
            body: removal
        })
    })

})

Cypress.Commands.add('initRemovalNotRemoved', () => {

    const user = JSON.parse(window.localStorage.getItem('loggedUser'))
    const token = user.token

    cy.fixture('removalNotRemoved').then((removal) => {
        cy.request({
            method: 'POST',
            url: '/api/removals',
            headers: {
                Authorization: `bearer ${token}`
            },
            body: removal
        })
    })

})

Cypress.Commands.add('initRemovalDonated', () => {

    const user = JSON.parse(window.localStorage.getItem('loggedUser'))
    const token = user.token

    cy.fixture('removalDonated').then((removal) => {
        cy.request({
            method: 'POST',
            url: '/api/removals',
            headers: {
                Authorization: `bearer ${token}`
            },
            body: removal
        })
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


