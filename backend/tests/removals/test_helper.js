const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG4gRG9lIiwiaWQiOiIxMjMzNDU2NiJ9.xkICFCQbfON4gXh_e02k1Nt2d91pN1Uwuqb_IVS7ozU'

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

const newRemoval = {
    length: 100,
    width: 20,
    height: 50,
    cbm: 0.1,
    weight: 12,
    totalWeight: 12,
    value: 150,
    totalValue: 150,
    saleItem: true,
    name: "Bicycle",
    removed: true,
    quantity: 1,
    category: "Sport equipment",
    date: "2020-01-23",
    dateRemoved: "2020-01-29",
    location: "Home",
    soldAt: "Tori.fi",
    note: "Sold to neighbor"
}

const updateRemoval = {
    name: "Sport bicycle",
    category: "Bicycles",
    value: 200,
    saleItem: false,
    removed: false
}

const updateEmptyRemoval = {
    name: "",
    category: "",
    value: "",
    saleItem: "",
    removed: ""
}

module.exports = {
    invalidToken,
    initialUser,
    initialRemoval,
    newRemoval,
    updateRemoval,
    updateEmptyRemoval
}