import React, { useEffect, useState } from 'react';
import Sidebar from './sidebar/Sidebar';
import MessageContainer from './messagebar/MessageContainer';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedUser } from '../redux/userSlice';
import { setSelectedGroup } from '../redux/groupSlice';

const HomePage = () => {
  const { authUser, selectedUser } = useSelector(store => store.user);
  const { selectedGroup } = useSelector(store => store.group);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 640);

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, [authUser, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isSmallScreen) {
      const handlePopState = () => {
        dispatch(setSelectedUser(null));
        dispatch(setSelectedGroup(null));
        setIsSidebarVisible(true);
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [isSmallScreen, dispatch]);

  useEffect(() => {
    if (selectedGroup && isSmallScreen) {
      setIsSidebarVisible(false);
      window.history.pushState({}, '', window.location.href);
    }
  }, [selectedGroup, isSmallScreen]);

  const handleUserSelect = (user) => {
    dispatch(setSelectedUser(user));
    if (isSmallScreen) {
      setIsSidebarVisible(false);
      window.history.pushState({}, '', window.location.href);
    }
  };

  return (
    <div className="flex md:w-auto md:flex-row md:h-[85vh] rounded-lg overflow-hidden bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      {isSidebarVisible && (
        <Sidebar onUserSelect={handleUserSelect} />
      )}
      {(!isSidebarVisible && (selectedUser || selectedGroup)) && (
        <MessageContainer />
      )}
    </div>
  );
};

export default HomePage;
