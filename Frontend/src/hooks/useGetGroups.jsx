import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setGroups } from '../redux/groupSlice';
import { URL } from '../url';

const useGetGroups = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(`${URL}/api/v1/group`);

        // console.log("Fetched groups:", res.data);

        if (Array.isArray(res.data)) {
          dispatch(setGroups(res.data));
        } else {
          console.error("API response is not an array:", res.data);
          dispatch(setGroups([]));
        }
      } catch (error) {
        console.error("Error fetching groups:", error.response ? error.response.data : error.message);
      }
    };

    fetchGroups();
  }, [dispatch]);
};

export default useGetGroups;
