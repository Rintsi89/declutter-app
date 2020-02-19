export const loadUser = () => {
  try {
    const user = window.localStorage.getItem('loggedUser')
    if (user === null) {
      return undefined
    }
    return JSON.parse(user)
  } catch (error) {
    return undefined
  }
}

export const saveUser = (user) => {
  try {

    if (!user) {
      return window.localStorage.removeItem('loggedUser')
    }
    const savedUser = JSON.stringify(user)
    window.localStorage.setItem('loggedUser', savedUser)
  } catch (error) {
    console.log(error)

  }
}
