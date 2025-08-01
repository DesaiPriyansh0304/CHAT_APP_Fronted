import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

//main screen page
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import Rightsidebar from '../components/Rigthsidebar';
//tab-icon page
import AvtarPage from './AvtarPage';
import AllUser from '../components/main-Icon-page/AllUser';

function Home() {
  const { tab, token } = useParams();                 //tab and token get Approuter
  const currentTab = tab || (token ? '' : 'chats');   //chats tb open 

  const [selectedUser, setSelectedUser] = useState(null);                       //Select User
  const [selectGroup, setSelectGroup] = useState(null);                         //Select Group
  const [userchat, setUserChat] = useState('1');                                //user chat
  const [showMobileRightSidebar, setShowMobileRightSidebar] = useState(false);  //reposive open in sidebar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);            //Detect mobile screen

  //resize screen check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //user data
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectGroup(null);
    if (isMobile) setShowMobileRightSidebar(true); // Only on mobile
  };

  //group data
  const handleGroupSelect = (group) => {
    setSelectGroup(group);
    setSelectedUser(null);
    if (isMobile) setShowMobileRightSidebar(true); // Only on mobile
  };

  // Handle mobile back navigation
  const handleMobileBack = () => {
    setShowMobileRightSidebar(false);
  };

  return (
    <>
      {/*main dive*/}
      <div className="w-screen h-screen">

        {currentTab === 'alluser' ? (
          //avterpage + alluser page 
          <div className="h-full w-full grid grid-cols-[6%_94%]">

            {/* Sidebar */}
            <div className="h-full w-full overflow-hidden">
              <Sidebar
                selectUser={selectedUser}
                setSelectedUser={handleUserSelect}
                selectGroup={selectGroup}
                setSelectedGroup={handleGroupSelect}
              />
            </div>

            {/* AllUser Page */}
            <div className="h-full w-full overflow-visible">
              <AllUser />
            </div>

          </div>
        ) : currentTab === 'avtarpage' ? (
          //avterpage + sidebar 
          <div className="h-full w-full grid grid-cols-[6%_94%]">

            {/* Sidebar */}
            <div className="h-full w-full overflow-visible">
              <Sidebar
                selectUser={selectedUser}
                setSelectedUser={handleUserSelect}
                selectGroup={selectGroup}
                setSelectedGroup={handleGroupSelect}
              />
            </div>

            {/* Avtar Page */}
            <div className="h-full w-full overflow-hidden">
              <AvtarPage />
            </div>

          </div>
        ) : (
          //sidebar + chatcontainer + rigthsidebar
          <div className="h-full w-full md:grid md:grid-cols-[6%_25%_69%] flex flex-col">

            {/* Sidebar */}
            {!showMobileRightSidebar && (
              <div className="md:static fixed bottom-0 left-0 w-full h-16 md:h-full md:w-full md:order-1 order-3 z-10">
                <Sidebar
                  selectUser={selectedUser}
                  setSelectedUser={handleUserSelect}
                  selectGroup={selectGroup}
                  setSelectedGroup={handleGroupSelect}
                />
              </div>
            )}

            {/* Chat Container */}
            <div className="h-full w-full order-1 md:order-2 overflow-hidden flex-1">
              <ChatContainer
                selectUser={selectedUser}
                SetSelectUser={handleUserSelect}
                activePage={currentTab}
                setUserChat={setUserChat}
                selectGroup={selectGroup}
                setSelectGroup={handleGroupSelect}
              />
            </div>

            {/* RightSidebar */}
            <div className="h-full w-full order-2 md:order-3 overflow-hidden hidden md:block">
              <Rightsidebar
                selectUser={selectedUser}
                SetSelectUser={handleUserSelect}
                userchat={userchat}
                selectGroup={selectGroup}
                setSelectGroup={handleGroupSelect}
                isMobile={isMobile}
                onMobileBack={handleMobileBack}
              />
            </div>

            {/* RightSidebar - Mobile Overlay */}
            {showMobileRightSidebar && isMobile && (
              <div className="fixed inset-0 z-50 md:hidden overflow-y-auto bg-white">
                <Rightsidebar
                  selectUser={selectedUser}
                  SetSelectUser={handleUserSelect}
                  userchat={userchat}
                  selectGroup={selectGroup}
                  setSelectGroup={handleGroupSelect}
                  isMobile={isMobile}
                  onMobileBack={handleMobileBack}
                />
              </div>
            )}

          </div>
        )}
      </div>
    </>
  );
}

export default Home;