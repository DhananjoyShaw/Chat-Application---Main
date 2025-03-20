import { useEffect } from 'react';
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from '../redux/messageSlice';
import { URL } from '../url';

const useGetMessages = () => {
    const { selectedUser } = useSelector(store => store.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (!selectedUser?._id) return;

                axios.defaults.withCredentials = true;
                const res = await axios.get(`${URL}/api/v1/message/${selectedUser?._id}`);
                dispatch(setMessages(res.data));
            } catch (error) {
                console.log(error);
            }
        };

        fetchMessages();
    }, [selectedUser?._id, dispatch]);

    return null;
};

export default useGetMessages;