import CreatingPlayerDialog from '@/components/CreatingPlayerDialog'
import InputScore from '@/components/InputScore'
import db from '@/db'
import AddIcon from '@mui/icons-material/Add'
import ArrowDownwardSharpIcon from '@mui/icons-material/ArrowDownwardSharp'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { MIN_PLAYERS_OF_MATCH } from '@/routes/constants'
import ConfirmModal from '@/components/ConfirmModal'

const Header = ({
  match,
  currentGameNumber,
  onContinuePlay = () => {},
  onPreviousPreview = () => {},
  onNextPreview = () => {},
}) => {
  const isEnableFinish = useMemo(() => {
    return db.getCurrentGameNumber(match.id) === currentGameNumber
  }, [currentGameNumber, match.id])

  const isEnablePreviewNext = useMemo(() => {
    return db.getCurrentGameNumber(match.id) > currentGameNumber
  }, [currentGameNumber, match.id])

  const isEnableContinue = useMemo(() => {
    return db.getCurrentGameNumber(match.id) === currentGameNumber
  }, [currentGameNumber, match.id])

  return (
    <Stack
      justifyContent='space-between'
      direction='row'
      sx={{
        padding: '12px 1rem',
        borderBottom: '2px solid #CCC',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        zIndex: 2,
      }}
    >
      <Stack gap='2px'>
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: '15px',
          }}
        >
          Trận: {match?.name}
        </Typography>
        <Stack direction='row' alignItems='center' gap='2px'>
          {currentGameNumber !== 1 && (
            <IconButton sx={{ padding: 0 }} onClick={onPreviousPreview}>
              <KeyboardArrowLeftIcon color='primary' />
            </IconButton>
          )}
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Ván: {currentGameNumber}
          </Typography>
          {isEnablePreviewNext && (
            <IconButton sx={{ padding: 0 }} onClick={onNextPreview}>
              <KeyboardArrowRightIcon color='primary' />
            </IconButton>
          )}
        </Stack>
      </Stack>
      <Stack alignItems='center' direction='row' gap='0.5rem'>
        {isEnableContinue && (
          <Button variant='outlined' onClick={onContinuePlay}>
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 'bold',
              }}
            >
              Chơi tiếp
            </Typography>
          </Button>
        )}

        {isEnableFinish && (
          <Button variant='contained'>
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 'bold',
              }}
            >
              Kết thúc
            </Typography>
          </Button>
        )}
      </Stack>
    </Stack>
  )
}

Header.propTypes = {
  currentGameNumber: PropTypes.number,
  match: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
  }),
  onContinuePlay: PropTypes.func,
  onNextPreview: PropTypes.func,
  onPreviousPreview: PropTypes.func,
}

const Player = ({
  name = '',
  onRename = () => {},
  scores = [],
  currentGameNumber = 0,
  onScoreChange = () => {},
  onAutoFill = () => {},
}) => {
  const handleScoreChange = (newValue) => {
    onScoreChange(newValue)
  }

  const total = scores.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  )

  const increasingTrendValue = scores[currentGameNumber - 2] || 0

  return (
    <Stack
      direction='row'
      justifyContent='space-between'
      sx={{
        padding: '12px',
        border: `1.5px solid #1976d2`,
        borderRadius: '0.5rem',
      }}
    >
      <Stack gap='0.5rem'>
        <Typography
          sx={{
            whiteSpace: 'nowrap',
            fontWeight: 'bold',
            fontSize: '15px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={onRename}
        >
          {name}
        </Typography>
        <Stack direction='row' gap='0.25rem'>
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: '14px',
              color:
                total >= 0 ? (total === 0 ? '#1976D2' : '#008000') : '#D32F2F',
            }}
          >
            Điểm: {total}
          </Typography>
          {currentGameNumber !== 1 && (
            <Stack
              direction='row'
              alignItems='center'
              sx={{
                color: increasingTrendValue >= 0 ? '#008000' : '#D32F2F',
                fontSize: '14px',
              }}
            >
              <Box>{`(`}</Box>
              {increasingTrendValue >= 0 && (
                <ArrowUpwardIcon sx={{ height: '16px', marginLeft: '-4px' }} />
              )}
              {increasingTrendValue < 0 && (
                <ArrowDownwardSharpIcon
                  sx={{ height: '16px', marginLeft: '-4px' }}
                />
              )}
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                {increasingTrendValue}
              </Typography>
              <Box>{`)`}</Box>
            </Stack>
          )}
        </Stack>
      </Stack>
      <Stack gap='0.25rem'>
        <InputScore
          value={scores[currentGameNumber - 1]}
          onChange={handleScoreChange}
        />
        <Typography
          onClick={onAutoFill}
          sx={{
            fontSize: '14px',
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Tự đồng điền
        </Typography>
      </Stack>
    </Stack>
  )
}

Player.propTypes = {
  name: PropTypes.string,
  onRename: PropTypes.func,
  scores: PropTypes.arrayOf(PropTypes.number),
  currentGameNumber: PropTypes.number,
  onScoreChange: PropTypes.func,
  onAutoFill: PropTypes.func,
}

const Players = ({
  players = [],
  onCreateNewPlayer = () => {},
  currentGameNumber,
  onScorePlayerChange = () => {},
}) => {
  const location = useLocation()
  const creatingPlayerDialog = useRef(null)

  const handleCreateNewPlayer = (name, playerID) => {
    onCreateNewPlayer(name, playerID)
  }

  const handleRenamePlayer = (player) => () => {
    creatingPlayerDialog.current?.editPlayerName(player)
  }

  const handleScorePlayerChange = (playerID) => (newValue) => {
    onScorePlayerChange(playerID, newValue)
  }

  const handleAutoFill = (playerID) => () => {
    let total = 0
    players.forEach((player) => {
      if (player.id !== playerID) {
        total = total + player.scores[currentGameNumber - 1]
      }
    })

    onScorePlayerChange(playerID, -total)
  }

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [location.pathname])

  return (
    <Stack pt='71.5px'>
      <Stack
        gap='1rem'
        sx={{
          padding: '1rem',
        }}
      >
        {players.length === 0 && (
          <Typography
            textAlign='center'
            p={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <SentimentVeryDissatisfiedIcon />
            Bạn chưa bất kỳ người chơi nào. <br /> Vui lòng tạo bằng cách ấn nút
            bên dưới
          </Typography>
        )}
        {players.map((player) => (
          <Player
            key={player.id}
            name={player.name}
            scores={player.scores}
            currentGameNumber={currentGameNumber}
            onRename={handleRenamePlayer(player)}
            onScoreChange={handleScorePlayerChange(player.id)}
            onAutoFill={handleAutoFill(player.id)}
          />
        ))}
        <CreatingPlayerDialog
          ref={creatingPlayerDialog}
          onSubmit={handleCreateNewPlayer}
        >
          <Button variant='contained' size='small' startIcon={<AddIcon />}>
            Thêm người chơi
          </Button>
        </CreatingPlayerDialog>
      </Stack>
    </Stack>
  )
}

Players.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number,
    })
  ),
  onCreateNewPlayer: PropTypes.func,
  currentGameNumber: PropTypes.number,
  onScorePlayerChange: PropTypes.func,
}

function PlayingPage() {
  const confirmActionRef = useRef(null)
  const { id } = useParams()
  const [players, setPlayers] = useState(db.getPlayersOfMatch(id))
  const match = useMemo(() => db.getMatchByID(id), [id])
  const [currentGameNumber, setCurrentGameNumber] = useState(
    db.getCurrentGameNumber(id)
  )

  const handleContinuePlay = () => {
    if (players?.length < MIN_PLAYERS_OF_MATCH) {
      toast.error(
        `Số lượng người chơi phải ít nhất ${MIN_PLAYERS_OF_MATCH} người`
      )
      return
    }

    const isValid = db.calculateTotalScoreValid(
      match.id,
      db.getCurrentGameNumber(id)
    )

    if (!isValid) {
      toast.error('Tổng số điểm của 1 ván phải bằng 0')
      return
    }

    confirmActionRef.current.confirm(() => {
      db.createANewGameNumber(match.id)
      setPlayers(db.getPlayersOfMatch(match.id))
      setCurrentGameNumber(db.getCurrentGameNumber(id))
    })
  }

  const handleCreateNewPlayer = (name, playerID) => {
    let response
    const isRename = !!playerID

    if (isRename) {
      response = db.renamePlayerOfMatch(match.id, playerID, name)
    } else {
      response = db.createNewPlayerOfMatch(match.id, name)
    }

    if (!response) {
      toast.error('Tên người chơi đã tồn tại')
    }

    setPlayers(db.getPlayersOfMatch(match.id))
  }

  const handleScorePlayerChange = (playerID, score) => {
    db.changeScorePlayerOfMatch(id, playerID, currentGameNumber, score)
    setPlayers(db.getPlayersOfMatch(match.id))
  }

  const handleChangeCurrentGameNumber = (newValue) => () => {
    const isValid = db.calculateTotalScoreValid(match.id, currentGameNumber)

    if (!isValid) {
      toast.error('Tổng số điểm của 1 ván phải bằng 0')
      return
    }

    setCurrentGameNumber(newValue)
  }

  return (
    <Box
      sx={{
        color: '#1976d2',
      }}
    >
      <Header
        match={match}
        currentGameNumber={currentGameNumber}
        onContinuePlay={handleContinuePlay}
        onPreviousPreview={handleChangeCurrentGameNumber(currentGameNumber - 1)}
        onNextPreview={handleChangeCurrentGameNumber(currentGameNumber + 1)}
      />
      <Players
        players={players}
        onCreateNewPlayer={handleCreateNewPlayer}
        currentGameNumber={currentGameNumber}
        onScorePlayerChange={handleScorePlayerChange}
      />
      <ConfirmModal ref={confirmActionRef} />
    </Box>
  )
}

export default PlayingPage
