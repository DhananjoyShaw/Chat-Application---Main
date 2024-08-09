import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const { authUser } = useSelector(store => store.user);
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 640);

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, [authUser, navigate])


  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])


  useEffect(() => {
    if (isSmallScreen) {
      const handlePopState = () => {
        if (selectedUser) {
          setSelectedUser(null);
          setIsSidebarVisible(true);
        }
      }
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [isSmallScreen, selectedUser])


  const handleUserSelect = (user) => {
    if (isSmallScreen) {
      setIsSidebarVisible(false);
    }
    setSelectedUser(user);
    if (isSmallScreen) {
      window.history.pushState({}, '', window.location.href);
    }
  }

  return (
    <div className="flex md:w-auto md:flex-row md:h-[85vh] rounded-lg overflow-hidden bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      {isSidebarVisible && (
        <Sidebar onUserSelect={handleUserSelect} />
      )}
      {(!isSmallScreen || selectedUser) && (
        <MessageContainer />
      )}
    </div>
  )
}

export default HomePage;