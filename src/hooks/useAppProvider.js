import { AppContext } from '@/components/AppProvider'
import { useContext } from 'react'

function useAppProvider() {
  return useContext(AppContext)
}

export default useAppProvider
