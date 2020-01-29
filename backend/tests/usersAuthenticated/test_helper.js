const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG4gRG9lIiwiaWQiOiIxMjMzNDU2NiJ9.xkICFCQbfON4gXh_e02k1Nt2d91pN1Uwuqb_IVS7ozU'

const initialUser = {
    confirmed: true,
    active: true,
    username: 'testUser',
    password: 'salasana',
    passwordHash: '$2b$10$reU/XL.nd9Gf210ycVd4tO/omuRJXa.ZpAkAJF9bZdX1yxXQn4fr.', // This is 'salasana'
    email: 'testUser@testUser.com'
}

const editedDetails = {
    username: 'testUser-2',
    name: 'TestUser-2',
    email: 'testUser-2@testUser.com',
    description: 'I am a test user here!'
}

const editedDetailsEmpty = {
    username: '',
    name: '',
    email: '',
    description: 'New description here'
}

const defaultLocation = {
    location: 'Home'
}

const location = {
    location: 'Summer house'
}

const defaultSaleLocation = {
    saleLocation: 'Tori.fi'
}

const saleLocation = {
    key: 'Second hand store',
    text: 'Second hand store',
    value: 'Second hand store'
}

const defaultCategory = {
    category: 'Clothes'
}

const category = {
    key: 'Paintings',
    text: 'Paintings',
    value: 'Paintings'
}

const passwordForChange = {
    password: 'salasana',
    newPassword:'uusisalasana',
    newPassword2: 'uusisalasana'
}

const invalidPasswordForChange = {
    password: '!salasana',
    newPassword:'uusisalasana',
    newPassword2: 'uusisalasana'
}

const shortPasswordForChange = {
    password: 'salasana',
    newPassword:'uusi',
    newPassword2: 'uusi'
}

const passwordForChangeRetypeInvalid = {
    password: 'salasana',
    newPassword:'uusisalasan',
    newPassword2: 'uusisalasana'
}

const wrongPassword = {
    password: 'salasana123'
}

module.exports = {
    invalidToken,
    initialUser,
    editedDetails,
    editedDetailsEmpty,
    location,
    defaultLocation,
    saleLocation,
    defaultSaleLocation,
    category,
    defaultCategory,
    passwordForChange,
    invalidPasswordForChange,
    shortPasswordForChange,
    passwordForChangeRetypeInvalid,
    wrongPassword 
}