import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setOtherUsers } from '../redux/userSlice.js';
import { URL } from '../url.js';

const useGetOtherUsers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Configure axios globally
        axios.defaults.withCredentials = true;

        const fetchOtherUsers = async () => {
            try {
                const res = await axios.get(`${URL}/api/v1/user`);
                // console.log("Other users ->", res.data);
                dispatch(setOtherUsers(res.data));
            } catch (error) {
                console.error("Error fetching other users:", error.response ? error.response.data : error.message);
            }
        };

        fetchOtherUsers();
    }, [dispatch]); 
};

export default useGetOtherUsers;
