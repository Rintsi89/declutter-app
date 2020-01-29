const initialUser = {
    confirmed: true,
    active: true,
    username: 'testUser',
    password: 'salasana',
    passwordHash: '$2b$10$reU/XL.nd9Gf210ycVd4tO/omuRJXa.ZpAkAJF9bZdX1yxXQn4fr.', // This is 'salasana'
    email: 'testUser@testUser.com'
}

const initialRemoval = {
    length: 12,
    width: 12,
    height: 12,
    cbm: 0.02,
    weight: 12,
    totalWeight: 144,
    value: 12,
    totalValue: 144,
    saleItem: true,
    name: "1212",
    removed: true,
    quantity: 12,
    category: "Books",
    date: "2020-01-23",
    dateRemoved: "2020-01-23",
    location: "Home",
    soldAt: "Huuto.net",
    note: "This was expensive"
}

module.exports = {
    initialUser,
    initialRemoval
}