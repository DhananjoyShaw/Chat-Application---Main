import React from 'react'
import OtherUser from './OtherUser';
import useGetOtherUsers from '../../hooks/useGetOtherUsers';
import { useSelector } from "react-redux";

const OtherUsers = ({ onUserSelect }) => {
    // my custom hook
    useGetOtherUsers();
    const { otherUsers } = useSelector(store => store.user);

    // early return in react
    if (!otherUsers) return;

    return (
        <>
            {
                otherUsers?.map((user) => {
                    return (
                        <OtherUser key={user._id} user={user} onUserSelect={onUserSelect} />
                    )
                })
            }
        </>
    )
}

export default OtherUsers;
