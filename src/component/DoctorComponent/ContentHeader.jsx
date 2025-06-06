import React from 'react'
import { BiNotification, BiSearch } from 'react-icons/bi';

const ContentHeader = () => {
  return (
    <div className='content--header'>
      <h1 className='header--title text-xl'>DashBoard</h1>
      <div className='header--activity'>
        <div className='search-box'>
          <input type="text" placeholder='Search...' />
          <BiSearch className='icon text-2xl' />
        </div>
        <div className='notify'>
          <BiNotification className='icon' />
        </div>
      </div>
    </div>
  )
}

export default ContentHeader