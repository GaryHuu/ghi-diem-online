import InputScore from '@/components/InputScore'
import { getMatchByID } from '@/db'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { Box, Stack, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

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
        Bàn: {match?.name}
      </Typography>
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
        Ván: 12
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

const Player = ({ name = '' }) => {
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
          }}
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
}

const Players = () => {
  return (
    <Stack
      gap='1rem'
      sx={{
        padding: '1rem',
      }}
    >
      <Player name='Will Smith' />
      <Player name='Michelle Obama' />
      <Player name='Leonardo DiCaprio' />
    </Stack>
  )
}

function PlayingPage() {
  const { id } = useParams()
  const match = getMatchByID(id)

  return (
    <Box
      sx={{
        color: '#1976d2',
      }}
    >
      <Header match={match} />
      <Players />
    </Box>
  )
}

export default PlayingPage
