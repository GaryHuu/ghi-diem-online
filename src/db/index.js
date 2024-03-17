import dayjs from 'dayjs'

const MY_IDS_OF_MATCHES = 'MY_IDS_OF_MATCHES'

const createNewMatch = (name = '') => {
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

    // Set Default Players
    localStorage.setItem(newId, JSON.stringify([]))

    return newMatch
  } catch (error) {
    console.error(error)
    return null
  }
}

const getAllMatches = () => {
  try {
    const myCurrentMatches =
      JSON.parse(localStorage.getItem(MY_IDS_OF_MATCHES)) || []

    return myCurrentMatches
  } catch (error) {
    console.error(error)
    return []
  }
}

const getMatchByID = (id) => {
  try {
    const myCurrentMatches =
      JSON.parse(localStorage.getItem(MY_IDS_OF_MATCHES)) || []

    return myCurrentMatches.find((item) => item.id === +id)
  } catch (error) {
    console.error(error)
    return []
  }
}

const deleteTheMatch = (id) => {
  try {
    const myCurrentMatches =
      JSON.parse(localStorage.getItem(MY_IDS_OF_MATCHES)) || []
    const newMatches = myCurrentMatches.filter((match) => match.id !== id)

    localStorage.setItem(MY_IDS_OF_MATCHES, JSON.stringify(newMatches))

    localStorage.removeItem(id)

    return newMatches
  } catch (error) {
    console.error(error)
    return []
  }
}

const getPlayersOfMatch = (id) => {
  try {
    const players = JSON.parse(localStorage.getItem(id)) || []
    return players
  } catch (error) {
    console.error(error)
    return []
  }
}

const createNewPlayerOfMatch = (matchID, name = '') => {
  try {
    const newId = dayjs().valueOf()
    const newPlayer = {
      id: newId,
      name,
    }
    const currentPlayers = JSON.parse(localStorage.getItem(matchID)) || []

    const existPlayerName = !!currentPlayers.find(
      (player) => player.name === name
    )

    if (existPlayerName) {
      return null
    }

    let numberGamesPlayed = 1

    if (currentPlayers?.length !== 0) {
      numberGamesPlayed = currentPlayers?.[0]?.scores?.length
    }

    newPlayer.scores = new Array(numberGamesPlayed).fill(0)

    localStorage.setItem(
      matchID,
      JSON.stringify([...currentPlayers, newPlayer])
    )

    return newPlayer
  } catch (error) {
    console.error(error)
    return null
  }
}

const renamePlayerOfMatch = (matchID, playerID, name = '') => {
  try {
    const currentPlayers = JSON.parse(localStorage.getItem(matchID)) || []
    const existPlayerName = !!currentPlayers.find(
      (player) => player.name === name && player.id !== playerID
    )

    if (existPlayerName) {
      return null
    }

    const index = currentPlayers.findIndex((player) => player.id === playerID)

    currentPlayers[index].name = name

    localStorage.setItem(matchID, JSON.stringify(currentPlayers))

    return currentPlayers
  } catch (error) {
    console.error(error)
    return null
  }
}

const getCurrentGameNumber = (matchID) => {
  try {
    const currentPlayers = JSON.parse(localStorage.getItem(matchID)) || []

    if (currentPlayers?.length !== 0) {
      return currentPlayers?.[0]?.scores?.length
    }

    return 1
  } catch (error) {
    console.error(error)
    return 1
  }
}

const changeScorePlayerOfMatch = (matchID, playerID, gameNumber, score) => {
  try {
    const currentPlayers = JSON.parse(localStorage.getItem(matchID)) || []

    const index = currentPlayers.findIndex((player) => player.id === playerID)

    currentPlayers[index].scores[gameNumber - 1] = score

    localStorage.setItem(matchID, JSON.stringify(currentPlayers))

    return currentPlayers
  } catch (error) {
    console.error(error)
    return null
  }
}

const calculateTotalScoreValid = (matchID, gameNumber) => {
  try {
    const currentPlayers = JSON.parse(localStorage.getItem(matchID)) || []
    const scores = []

    currentPlayers.forEach((player) => {
      scores.push(player?.scores?.[gameNumber - 1])
    })

    const total = scores.reduce((accumulator, currentValue) => {
      return accumulator + currentValue
    }, 0)

    return total === 0
  } catch (error) {
    return false
  }
}

const createANewGameNumber = (matchID) => {
  try {
    const currentPlayers = JSON.parse(localStorage.getItem(matchID)) || []

    currentPlayers.forEach((player) => {
      player.scores.push(0)
    })

    localStorage.setItem(matchID, JSON.stringify(currentPlayers))
  } catch (error) {
    return []
  }
}

const calculateTotalScoreValidToFinish = (matchID) => {
  try {
    const currentPlayers = JSON.parse(localStorage.getItem(matchID)) || []
    const totalGameNumber = getCurrentGameNumber(matchID)
    const gameNumbersInvalid = []

    for (let gameNumber = 1; gameNumber <= totalGameNumber; gameNumber++) {
      const scores = []
      currentPlayers.forEach((player) => {
        scores.push(player?.scores?.[gameNumber - 1])
      })
      const total = scores.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
      }, 0)

      if (total !== 0) {
        gameNumbersInvalid.push(gameNumber)
      }
    }

    return {
      isValid: gameNumbersInvalid.length === 0,
      gameNumbersInvalid: gameNumbersInvalid,
    }
  } catch (error) {
    return null
  }
}

const finishTheMatch = (matchID) => {
  try {
    const myCurrentMatches =
      JSON.parse(localStorage.getItem(MY_IDS_OF_MATCHES)) || []

    const index = myCurrentMatches.findIndex((m) => m.id === matchID)

    myCurrentMatches[index].isFinished = true

    localStorage.setItem(MY_IDS_OF_MATCHES, JSON.stringify(myCurrentMatches))

    return true
  } catch (error) {
    console.error(error)
    return null
  }
}

export default {
  createNewMatch,
  getAllMatches,
  getMatchByID,
  deleteTheMatch,
  getPlayersOfMatch,
  createNewPlayerOfMatch,
  renamePlayerOfMatch,
  getCurrentGameNumber,
  changeScorePlayerOfMatch,
  calculateTotalScoreValid,
  createANewGameNumber,
  calculateTotalScoreValidToFinish,
  finishTheMatch,
}
