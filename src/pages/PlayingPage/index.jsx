import CreatingPlayerDialog from '@/components/CreatingPlayerDialog'
import InputScore from '@/components/InputScore'
import { createNewPlayerOfMatch, getMatchByID, getPlayersOfMatch } from '@/db'
import AddIcon from '@mui/icons-material/Add'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import { Box, Button, Stack, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { renamePlayerOfMatch } from '@/db'
import { toast } from 'react-toastify'

const Header = ({ match }) => {
  return (
    <Stack
      alignItems='center'
      justifyContent='space-between'
      direction='row'
      sx={{
        padding: '1rem',
        borderBottom: '2px solid #CCC',
      }}
    >
      <Typography
        sx={{
          fontWeight: 'bold',
        }}
      >
        Trận đấu: {match?.name}
      </Typography>
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
        Ván: 1
      </Typography>
    </Stack>
  )
}

Header.propTypes = {
  match: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
  }),
}

const Player = ({ name = '', onRename = () => {} }) => {
  return (
    <Stack
      direction='row'
      justifyContent='space-between'
      sx={{
        padding: '1rem',
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
          <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
            Điểm: 12
          </Typography>
          <Stack
            direction='row'
            alignItems='center'
            sx={{
              color: '#008000',
              fontSize: '14px',
            }}
          >
            <Box>{`(`}</Box>
            <ArrowUpwardIcon sx={{ height: '16px', marginLeft: '-4px' }} />
            <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
              3
            </Typography>
            <Box>{`)`}</Box>
          </Stack>
        </Stack>
      </Stack>
      <InputScore />
    </Stack>
  )
}

Player.propTypes = {
  name: PropTypes.string,
  onRename: PropTypes.func,
}

const Players = ({ players = [], onCreateNewPlayer = () => {} }) => {
  const creatingPlayerDialog = useRef(null)

  const handleCreateNewPlayer = (name, playerID) => {
    onCreateNewPlayer(name, playerID)
  }

  const handleRenamePlayer = (player) => () => {
    creatingPlayerDialog.current?.editPlayerName(player)
  }

  return (
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
          onRename={handleRenamePlayer(player)}
        />
      ))}
      <CreatingPlayerDialog
        ref={creatingPlayerDialog}
        onSubmit={handleCreateNewPlayer}
      >
        <Button variant='contained' size='small'>
          <AddIcon />
        </Button>
      </CreatingPlayerDialog>
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
}

function PlayingPage() {
  const { id } = useParams()
  const [players, setPlayers] = useState(getPlayersOfMatch(id))
  const match = useMemo(() => getMatchByID(id), [id])

  const handleCreateNewPlayer = (name, playerID) => {
    let response
    const isRename = !!playerID

    if (isRename) {
      response = renamePlayerOfMatch(match.id, playerID, name)
    } else {
      response = createNewPlayerOfMatch(match.id, name)
    }

    if (!response) {
      toast.error('Tên người chơi đã tồn tại')
    }

    setPlayers(getPlayersOfMatch(match.id))
  }

  return (
    <Box
      sx={{
        color: '#1976d2',
      }}
    >
      <Header match={match} />
      <Players players={players} onCreateNewPlayer={handleCreateNewPlayer} />
    </Box>
  )
}

export default PlayingPage
