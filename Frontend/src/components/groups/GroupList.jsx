import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedGroup } from '../../redux/groupSlice.js';
import useGetGroups from '../../hooks/useGetGroups.jsx';

const GroupList = () => {
  const { groups, selectedGroup } = useSelector(store => store.group);
  const dispatch = useDispatch();
  useGetGroups();

  if (!groups || groups.length === 0) return null;

  const handleGroupSelect = (group) => {
    dispatch(setSelectedGroup(group));
  };

  return (
    <>
      {groups.map(group => (
        <div key={group._id}>
          <div
            className={`${selectedGroup?._id === group?._id ? 'bg-zinc-200 text-black' : 'text-white'} flex gap-2 hover:text-black items-center hover:bg-zinc-200 rounded p-1 cursor-pointer`}
            onClick={() => handleGroupSelect(group)}
          >
            <div className="avatar">
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center overflow-hidden">
                {group.groupPhoto ? (
                  <img src={group.groupPhoto} alt={group.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold">{group.name.charAt(0)}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col flex-1">
              <div className="flex justify-between gap-2">
                <p>{group.name}</p>
                <span className="text-sm mr-1">Group</span>
              </div>
            </div>
          </div>
          <div className="divider my-0 py-0 h-1"></div>
        </div>
      ))}
    </>
  );
};

export default GroupList;
