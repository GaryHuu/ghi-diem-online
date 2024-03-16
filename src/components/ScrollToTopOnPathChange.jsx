import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTopOnPathChange = () => {
  const location = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [location.pathname])

  return null
}

export default ScrollToTopOnPathChange
