import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
//Home page
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import Rightsidebar from '../components/Rigthsidebar';
//tab page
import AvtarPage from './AvtarPage';
import AllUser from '../components/main-Icon-page/AllUser';

function Home() {

  const { tab, token } = useParams();
  const currentTab = tab || (token ? '' : 'chats');             //current tab/page
  const [selectedUser, setSelectedUser] = useState(null);       //User Data
  const [selectGroup, setSelectedGroup] = useState(null);         //Group Data
  const [userchat, setUserChat] = useState('1');                //Chat Data

  // For showing RightSidebar in mobile
  const [showMobileRightSidebar, setShowMobileRightSidebar] = useState(false);

  // Handle selecting a user
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectedGroup(null);
    setShowMobileRightSidebar(true);
  };
  // console.log('selectedUser --->Homepage', selectedUser);

  // Handle selecting a group
  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setSelectedUser(null);
    setShowMobileRightSidebar(true);
  };
  // console.log('selectGroup --->Homepage', selectGroup);

  return (
    <>
      {/*All User tab*/}
      <div className="w-screen h-screen bg-white">
        {currentTab === 'alluser' ? (
          //avtarpage tab(Sidebar + All User)
          <div className="h-full w-full grid grid-cols-[6%_94%]">

            {/*Sidebar*/}
            <div className='h-full w-full overflow-hidden '>
              <Sidebar
                selectUser={selectedUser}
                setSelectedUser={handleUserSelect}
                selectGroup={selectGroup}
                setSelectedGroup={handleGroupSelect}
              />
            </div>

            {/*tab page-All User*/}
            <div className='h-full w-full overflow-hidden'>
              <AllUser />
            </div>
          </div>
        ) :
          //avtarpage tab(Sidebar + AvtarPage)
          currentTab === 'avtarpage' ? (
            <div className="h-full w-full grid grid-cols-[6%_94%]">

              {/*Sidebar*/}
              <div className="h-full w-full overflow-hidden border md:border-amber-300">
                <Sidebar
                  selectUser={selectedUser}
                  setSelectedUser={handleUserSelect}
                  selectGroup={selectGroup}
                  setSelectedGroup={handleGroupSelect}
                />
              </div>

              {/*tab page-AvtarPage*/}
              <div className='h-full w-full overflow-hidden'>
                <AvtarPage />
              </div>
            </div>
          ) : (
            // Default Layout (Sidebar + ChatContainer + Rightsidebar)
            <div className="h-full w-full  md:grid md:grid-cols-[6%_25%_69%] flex flex-col">

              {/*Sidebar*/}

              {!showMobileRightSidebar && (
                <div className="md:static fixed bottom-0 left-0 w-full h-16 md:h-full md:w-full md:order-1 order-3 bg-white border-t border-gray-300 md:border md:border-amber-300 z-10">
                  <Sidebar
                    selectUser={selectedUser}
                    setSelectedUser={handleUserSelect}
                    selectGroup={selectGroup}
                    setSelectedGroup={handleGroupSelect}
                  />
                </div>
              )}

              {/*ChatContainer*/}
              <div className="order-1 md:order-2 h-full w-full overflow-hidden border md:border-amber-700 border-b border-gray-300 flex-1">
                <ChatContainer
                  selectUser={selectedUser}
                  SetSelectUser={handleUserSelect}
                  activePage={currentTab}
                  setUserChat={setUserChat}
                  selectGroup={selectGroup}
                  setSelectGroup={handleGroupSelect}
                />
              </div>

              {/*Rightsidebar*/}
              <div className="order-2 md:order-3 h-full w-full overflow-hidden border border-red-600 hidden md:block">
                <Rightsidebar
                  selectUser={selectedUser}
                  SetSelectUser={handleUserSelect}
                  userchat={userchat}
                  selectGroup={selectGroup}
                  setSelectGroup={handleGroupSelect}
                />
              </div>
              {showMobileRightSidebar && (
                <div className="fixed inset-0 z-50 bg-white md:hidden overflow-y-auto shadow-lg border-l">
                  <Rightsidebar
                    selectUser={selectedUser}
                    SetSelectUser={handleUserSelect}
                    userchat={userchat}
                    selectGroup={selectGroup}
                    setSelectGroup={handleGroupSelect}
                  />
                  <div className="text-center py-2">
                    <button
                      className="px-4 py-1 bg-red-500 text-white rounded"
                      onClick={() => setShowMobileRightSidebar(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
    </>
  );
}

export default Home;  
