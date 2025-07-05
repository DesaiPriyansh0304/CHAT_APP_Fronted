import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Slidbar from '../components/Slidbar';
import Rightsidebar from '../components/Rigthsidebar';
import ChatContainer from '../components/ChatContainer';

function Home() {
  const { tab, token } = useParams();
  const currentTab = tab || (token ? 'contact' : 'chats');
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
        <div className=' h-full relative grid grid-cols-[6%_25%_69%]'>

          {/* Sidebar */}
          <div className='h-screen'>
            <Slidbar
              selectUser={selectedUser}
              SetSelectUser={handleUserSelect}
              // setActivePage={setActivePage}
              selectGroup={selectGroup}
              setSelectGroup={handleGroupSelect}
            />
          </div>

          {/* Chat Container */}
          <div className='h-screen overflow-hidden'>
            <ChatContainer
              selectUser={selectedUser}
              SetSelectUser={handleUserSelect}
              // activePage={activePage}
              // activePage={tab} // Route thi active page
              activePage={currentTab}
              setUserChat={setUserChat}
              selectGroup={selectGroup}
              setSelectGroup={handleGroupSelect}
            />
          </div>

          {/* Right Sidebar */}
          <div className='h-screen'>
            <Rightsidebar
              selectUser={selectedUser}
              SetSelectUser={handleUserSelect}
              // activePage={activePage}
              userchat={userchat}
              selectGroup={selectGroup}
              setSelectGroup={handleGroupSelect}
            />
          </div>

        </div>
      </div>
    </>
  );
}

export default Home;
