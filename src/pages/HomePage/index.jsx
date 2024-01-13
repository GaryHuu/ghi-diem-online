import BannerHome from '@/assets/images/banner-home.png'
import { ROUTES } from '@/routes/constants'
import AddIcon from '@mui/icons-material/Add'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()

  const handleStartNewGameClick = () => {
    navigate(ROUTES.CREATE_NEW_GAME)
  }

  return (
    <Stack
      justifyContent='center'
      alignItems='center'
      height='100%'
      spacing={4}
    >
      <Stack justifyContent='center' alignItems='center' spacing={1}>
        <img
          style={{
            width: '65%',
            maxWidth: '350px',
            borderRadius: '16px',
          }}
          src={BannerHome}
          alt='Home Banner'
        />
        <div className='home-text-ani'>
          <h2 className='title'>
            <span className='title-word title-word-1'>Hỗ</span>
            <span className='title-word title-word-2'>Trợ</span>
            <span className='title-word title-word-3'>Ghi</span>
            <span className='title-word title-word-4'>Điểm</span>
          </h2>
        </div>
      </Stack>
      <Stack spacing={1}>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={handleStartNewGameClick}
        >
          Bắt Đầu
        </Button>
        <Button variant='outlined' startIcon={<ArrowRightIcon />}>
          Tiếp tục
        </Button>
      </Stack>
    </Stack>
  )
}

export default HomePage
