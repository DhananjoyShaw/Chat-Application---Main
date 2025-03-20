import { useEffect } from 'react';
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from '../redux/messageSlice';
import { URL } from '../url';

const useGetGroupMessages = () => {
  const { selectedGroup } = useSelector(store => store.group);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchGroupMessages = async () => {
      try {
        if (!selectedGroup?._id) return;

        axios.defaults.withCredentials = true;
        const res = await axios.get(`${URL}/api/v1/group/getmessages/${selectedGroup._id}`);
        dispatch(setMessages(res.data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchGroupMessages();
  }, [selectedGroup?._id, dispatch]);

  return null;
};

export default useGetGroupMessages;