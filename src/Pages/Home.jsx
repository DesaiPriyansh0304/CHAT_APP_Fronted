import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Slidbar from '../components/Slidbar';
import Rightsidebar from '../components/Rigthsidebar';
import ChatContainer from '../components/ChatContainer';
import AvtarPage from './AvtarPage';
import AllUser from '../components/main-Icon-page/AllUser';

function Home() {

  const { tab, token } = useParams();
  const currentTab = tab || (token ? '' : 'chats');             //current tab/page
  const [selectedUser, setSelectedUser] = useState(null);       //User Data
  const [selectGroup, setSelectGroup] = useState(null);         //Group Data
  // const [activePage, setActivePage] = useState('Contacts');    //Page Data
  const [userchat, setUserChat] = useState('1');                //Chat Data

  {/*user Data*/ }
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectGroup(null);
  };
  // console.log('selectedUser --->Home', selectedUser);

  {/*Gruop Data*/ }
  const handleGroupSelect = (group) => {
    setSelectGroup(group);
    setSelectedUser(null);
  };
  // console.log('selectGroup --->Home', selectGroup);

  return (
    <>
      <div className="w-full h-screen bg-white">
        {/*All User tab*/}
        {currentTab === 'alluser' ? (
          <div className="h-full grid grid-cols-[6%_94%]">
            <div className="h-screen">
              <Slidbar
                selectUser={selectedUser}
                SetSelectUser={handleUserSelect}
                selectGroup={selectGroup}
                setSelectGroup={handleGroupSelect}
              />
            </div>
            <div className="h-screen">
              <AllUser />
            </div>
          </div>
        ) :
          //avtarpage tab
          currentTab === 'avtarpage' ? (
            <div className="h-full grid grid-cols-[6%_94%]">
              <div className="h-screen ">
                <Slidbar
                  selectUser={selectedUser}
                  SetSelectUser={handleUserSelect}
                  selectGroup={selectGroup}
                  setSelectGroup={handleGroupSelect}
                />
              </div>
              <div className="h-screen">
                <AvtarPage />
              </div>
            </div>
          ) : (
            // Default Layout (Sidebar + ChatContainer + Rightsidebar)
            <div className="h-full grid grid-cols-[6%_25%_69%] ">
              <div className="h-screen overflow-hidden   border border-amber-300">
                <Slidbar
                  selectUser={selectedUser}
                  SetSelectUser={handleUserSelect}
                  selectGroup={selectGroup}
                  setSelectGroup={handleGroupSelect}
                />
              </div>

              <div className="h-screen overflow-hidden border border-amber-700">
                <ChatContainer
                  selectUser={selectedUser}
                  SetSelectUser={handleUserSelect}
                  activePage={currentTab}
                  setUserChat={setUserChat}
                  selectGroup={selectGroup}
                  setSelectGroup={handleGroupSelect}
                />
              </div>

              <div className="h-screen border border-red-600">
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
