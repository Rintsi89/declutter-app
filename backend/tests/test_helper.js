const initialUser = {
  'username': 'Rintsu',
  'password': 'salasana',
  'name': 'Ville Rintala'
}

const dataBaseUser = [{
  'username': 'User-1',
  'password': 'salasana',
  'name': 'User'
}]

const wrongUser = {
  'username': 'Mi',
  'password': 'Lo',
  'name': 'Unknown'
}

const removal = {
  'name': 'Old sewing machine',
  'quantity': 1,
  'category': 'Household appliances',
  'cbm': 0.01,
  'weight': 20,
  'value': 80
}

const nameAndLocation = {
  'name': 'New name for testing',
  'location': 'Summer cabin',
  'action': 'push'
}

const nameAndLocationPull = {
  'name': 'New name for testing',
  'location': 'Summer cabin',
  'action': 'pull'
}

module.exports = {
  initialUser,
  wrongUser,
  dataBaseUser,
  removal,
  nameAndLocation,
  nameAndLocationPull
}