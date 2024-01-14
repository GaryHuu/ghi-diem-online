import dayjs from 'dayjs'

const MY_IDS_OF_MATCHES = 'MY_IDS_OF_MATCHES'

export const createNewMatch = (name = '') => {
  try {
    const newId = dayjs().valueOf()
    const newMatch = {
      id: newId,
      name,
    }

    const myCurrentMatches =
      JSON.parse(localStorage.getItem(MY_IDS_OF_MATCHES)) || []

    localStorage.setItem(
      MY_IDS_OF_MATCHES,
      JSON.stringify([newMatch, ...myCurrentMatches])
    )

    return newMatch
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getAllMatches = () => {
  try {
    const myCurrentMatches =
      JSON.parse(localStorage.getItem(MY_IDS_OF_MATCHES)) || []

    return myCurrentMatches
  } catch (error) {
    console.error(error)
    return []
  }
}

export const deleteTheMatch = (id) => {
  try {
    const myCurrentMatches =
      JSON.parse(localStorage.getItem(MY_IDS_OF_MATCHES)) || []
    const newMatches = myCurrentMatches.filter((match) => match.id !== id)

    localStorage.setItem(MY_IDS_OF_MATCHES, JSON.stringify(newMatches))

    return newMatches
  } catch (error) {
    console.error(error)
    return []
  }
}
