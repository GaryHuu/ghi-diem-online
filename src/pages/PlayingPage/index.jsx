import ConfirmModal from '@/components/ConfirmModal'
import CreatingPlayerDialog from '@/components/CreatingPlayerDialog'
import InputScore from '@/components/InputScore'
import db from '@/db'
import { MIN_PLAYERS_OF_MATCH } from '@/routes/constants'
import AddIcon from '@mui/icons-material/Add'
import ArrowDownwardSharpIcon from '@mui/icons-material/ArrowDownwardSharp'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import CloseIcon from '@mui/icons-material/Close'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import SportsScoreRoundedIcon from '@mui/icons-material/SportsScoreRounded'
import { stringAvatar } from '@/helper'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Dialog,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Slide,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import PropTypes from 'prop-types'
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const LeaderBoard = ({ players, isOpen = false, onClose = () => {} }) => {
  const listLeader = useMemo(() => {
    const items = []

    players.forEach((player) => {
      items.push({
        id: player.id,
        name: player.name,
        total: player.scores.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        ),
      })
    })

    return items.sort((a, b) => -a.total + b.total)
  }, [players])

  return (
    <Dialog
      onClose={onClose}
      open={isOpen}
      TransitionComponent={Transition}
      scroll='paper'
      fullScreen
    >
      <AppBar sx={{ position: 'fixed' }}>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            onClick={onClose}
            aria-label='close'
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
            Bảng xếp hạng
          </Typography>
        </Toolbar>
      </AppBar>
      <List sx={{ padding: '1rem', pt: 'calc(56px + 1rem)' }}>
        {listLeader.map((player, index) => (
          <ListItem
            disablePadding
            key={player.id}
            sx={{
              mb: '1rem',
            }}
          >
            <Typography sx={{ mr: '1rem', fontWeight: 'bold' }}>
              Top {index + 1}:
            </Typography>
            <ListItemAvatar>
              <Avatar {...stringAvatar(player.name)} />
            </ListItemAvatar>
            <ListItemText
              sx={{
                m: '0',
                '.MuiListItemText-primary': {
                  fontWeight: 'bold',
                },
                '.MuiListItemText-secondary': {
                  fontWeight: 'bold',
                },
              }}
              primary={player.name}
              secondary={`Tổng: ${player.total}`}
            />
          </ListItem>
        ))}
      </List>
    </Dialog>
  )
}

LeaderBoard.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number,
    })
  ),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
}

const Header = ({
  match,
  currentGameNumber,
  onContinuePlay = () => {},
  onPreviousPreview = () => {},
  onNextPreview = () => {},
  onFinish = () => {},
  onShowResult = () => {},
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
        {isEnableContinue && !match.isFinished && (
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

        {isEnableFinish && !match.isFinished && (
          <Button variant='contained' onClick={onFinish}>
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
        {match.isFinished && (
          <Button
            variant='outlined'
            onClick={onShowResult}
            startIcon={<SportsScoreRoundedIcon />}
          >
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 'bold',
              }}
            >
              Kết quả
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
    isFinished: PropTypes.bool,
  }),
  onContinuePlay: PropTypes.func,
  onNextPreview: PropTypes.func,
  onPreviousPreview: PropTypes.func,
  onFinish: PropTypes.func,
  onShowResult: PropTypes.func,
}

const Player = ({
  name = '',
  onRename = () => {},
  scores = [],
  currentGameNumber = 0,
  onScoreChange = () => {},
  onAutoFill = () => {},
  isFinished = false,
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
          disabled={isFinished}
          value={scores[currentGameNumber - 1]}
          onChange={handleScoreChange}
        />
        {!isFinished && (
          <Typography
            onClick={onAutoFill}
            sx={{
              fontSize: '14px',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            Tự động điền
          </Typography>
        )}
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
  isFinished: PropTypes.bool,
}

const Players = ({
  match,
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
    if (match.isFinished) return

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
            isFinished={match.isFinished}
          />
        ))}
        {!match.isFinished && (
          <CreatingPlayerDialog
            ref={creatingPlayerDialog}
            onSubmit={handleCreateNewPlayer}
          >
            <Button variant='contained' size='small' startIcon={<AddIcon />}>
              Thêm người chơi
            </Button>
          </CreatingPlayerDialog>
        )}
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
  match: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    isFinished: PropTypes.bool,
  }),
  onCreateNewPlayer: PropTypes.func,
  currentGameNumber: PropTypes.number,
  onScorePlayerChange: PropTypes.func,
}

function PlayingPage() {
  const [isShowLeaderBoard, setIsShowLeaderBoard] = useState(false)
  const confirmActionRef = useRef(null)
  const { id } = useParams()
  const [players, setPlayers] = useState(db.getPlayersOfMatch(id))
  const [match, setMatch] = useState(db.getMatchByID(id))
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

  const handleFinishMatch = () => {
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

    const response = db.calculateTotalScoreValidToFinish(match.id)

    if (!response) {
      toast.error('Something went wrong!')
      return
    }

    const { isValid: isValidTotal, gameNumbersInvalid } = response

    if (!isValidTotal) {
      toast.error(
        `Tổng số điểm của ván ${gameNumbersInvalid.join(', ')} phải bằng 0`
      )

      return
    }

    confirmActionRef.current.confirm(() => {
      setIsShowLeaderBoard(true)
      db.finishTheMatch(match.id)
      setMatch(db.getMatchByID(match.id))
    })
  }

  const handleLeaderBoardClose = () => {
    setIsShowLeaderBoard(false)
  }

  const handleShowResult = () => {
    setIsShowLeaderBoard(true)
  }

  useEffect(() => {
    setIsShowLeaderBoard(match.isFinished)
  }, [match.isFinished])

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
        onFinish={handleFinishMatch}
        onShowResult={handleShowResult}
      />
      <Players
        match={match}
        players={players}
        onCreateNewPlayer={handleCreateNewPlayer}
        currentGameNumber={currentGameNumber}
        onScorePlayerChange={handleScorePlayerChange}
      />
      <ConfirmModal ref={confirmActionRef} />
      <LeaderBoard
        players={players}
        isOpen={isShowLeaderBoard}
        onClose={handleLeaderBoardClose}
      />
    </Box>
  )
}

export default PlayingPage
