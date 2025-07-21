import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Slidbar from '../components/Slidbar';
import Rightsidebar from '../components/Rigthsidebar';
import ChatContainer from '../components/ChatContainer';
import AvtarPage from './AvtarPage';
import AllUser from '../components/Iconpage/AllUser';

function Home() {
  const { tab, token } = useParams();
  const currentTab = tab || (token ? '' : 'chats');
  const [selectedUser, setSelectedUser] = useState(null);   //User Data
  const [selectGroup, setSelectGroup] = useState(null);     //Group Data
  // const [activePage, setActivePage] = useState('Contacts');    //Page Data
  const [userchat, setUserChat] = useState("1")             //Chat Data

  //user Data
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectGroup(null);
  };
  // console.log('✌️selectedUser --->', selectedUser);

  //Gruop Data
  const handleGroupSelect = (group) => {
    setSelectGroup(group);
    setSelectedUser(null);
  };
  // console.log('✌️selectGroup --->', selectGroup);

  return (
    <>
      <div className='w-full h-screen bg-white'>

        {currentTab === 'alluser' ? (
          <div className='h-full grid grid-cols-[6%_94%]'>
            <div className='h-screen'>
              <Slidbar
                selectUser={selectedUser}
                SetSelectUser={handleUserSelect}
                selectGroup={selectGroup}
                setSelectGroup={handleGroupSelect}
              />
            </div>
            <div className='h-screen'>
              <AllUser />
            </div>
          </div>
        ) : currentTab === 'avtarpage' ? (
          <div className='h-full grid grid-cols-[6%_94%]'>
            <div className='h-screen'>
              <Slidbar
                selectUser={selectedUser}
                SetSelectUser={handleUserSelect}
                selectGroup={selectGroup}
                setSelectGroup={handleGroupSelect}
              />
            </div>
            <div className='h-screen'>
              <AvtarPage />
            </div>
          </div>
        ) : (
          // Default Layout (Sidebar + ChatContainer + Rightsidebar)
          <div className='h-full grid grid-cols-[6%_25%_69%] '>
            <div className='h-screen overflow-hidden'>
              <Slidbar
                selectUser={selectedUser}
                SetSelectUser={handleUserSelect}
                selectGroup={selectGroup}
                setSelectGroup={handleGroupSelect}
              />
            </div>

            <div className='h-screen overflow-hidden'>
              <ChatContainer
                selectUser={selectedUser}
                SetSelectUser={handleUserSelect}
                activePage={currentTab}
                setUserChat={setUserChat}
                selectGroup={selectGroup}
                setSelectGroup={handleGroupSelect}
              />
            </div>

            <div className='h-screen'>
              <Rightsidebar
                selectUser={selectedUser}
                SetSelectUser={handleUserSelect}
                userchat={userchat}
                selectGroup={selectGroup}
                setSelectGroup={handleGroupSelect}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
