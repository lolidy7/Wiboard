import React from 'react'
import { useDarkMode } from '../../context/ThemeContext'

const DarkModeToggler = () => {

  const {darkMode, setDarkMode} = useDarkMode()

  return (
    <>
      <button 
        onClick={() => {
          setDarkMode(!darkMode);
        }}
        className='text-black dark:text-white transition-all'
      >
        <img
          src={darkMode ? "./images/light.png" : "./images/dark.png"}
          alt={darkMode ? "Light mode" : "Dark mode"}
          className="w-5 h-5 sm:w-5 sm:h-5 object-contain"
        />
      </button>
    </>
  )
}
export default DarkModeToggler;