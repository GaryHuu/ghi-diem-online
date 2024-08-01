import db, { defaultSettingValues } from '@/db'
import PropTypes from 'prop-types'
import { createContext, useState } from 'react'

export const AppContext = createContext(defaultSettingValues)

function AppProvider({ children }) {
  const [settingValue, setSettingValue] = useState(db.getSetting())

  const handleSettingChange = (newValue) => {
    setSettingValue(newValue)
    db.saveSetting(newValue)
  }

  return (
    <AppContext.Provider
      value={{
        value: settingValue,
        onChange: handleSettingChange,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

AppProvider.propTypes = {
  children: PropTypes.node,
}

export default AppProvider
