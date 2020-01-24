const invalidEmail = 'notexist@notexist.com'
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG4gRG9lIiwiaWQiOiIxMjMzNDU2NiJ9.xkICFCQbfON4gXh_e02k1Nt2d91pN1Uwuqb_IVS7ozU'

const initialUser = {
  'username': 'Rintsi',
  'email': 'testi@testi.com',
  'password': 'salasana',
}

const notExistingUser = {
  'username': 'wrongUser',
  'email': 'wrong@testi.com',
  'password': 'wrong!',
}

const wrongUser = {
  'username': 'Mi',
  'password': 'Lo',
  'name': 'Unknown'
}

const newPassword = {
  password: '123456',
  password2: '123456'
}

const removal = {
  'name': 'Old sewing machine',
  'quantity': 1,
  'category': 'Household appliances',
  'cbm': 0.01,
  'weight': 20,
  'value': 80
}


module.exports = {
  initialUser,
  wrongUser,
  removal,
  newPassword,
  invalidToken,
  invalidEmail,
  notExistingUser
}