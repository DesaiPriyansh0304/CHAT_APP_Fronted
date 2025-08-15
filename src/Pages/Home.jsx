import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

//main screen page (sidebar + chatcontainer + rigthsidebar)
import Sidebar from '../Dashboard-Page/Sidebar';
import ChatContainer from '../Dashboard-Page/ChatContainer';
import Rightsidebar from '../Dashboard-Page/Rigthsidebar';
//tab-icon page (AvtarPage + AllUser)
import AvtarPage from '../Icon-Page/AvtarPage';
import AllUser from '../Icon-Page/AllUser';
import DraggableChatbot from '../Chatbot/DraggableChatbot';

function Home() {

  const { tab, token } = useParams();                        //tab and token get Approuter
  const currentTab = tab || (token ? 'contact' : 'chats');   //chats tb open 

  const [selectedUser, setSelectedUser] = useState(null);                        //Select User
  const [selectGroup, setSelectGroup] = useState(null);                          //Select Group
  // const [userchat, setUserChat] = useState('1');                                 //user chat
  const [showMobileRightSidebar, setShowMobileRightSidebar] = useState(false);   //reposive open in Rigthsidebar show
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);             //Detect mobile screen

  //resize screen check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
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
    if (isMobile) setShowMobileRightSidebar(true);
  };

  // Handle mobile back navigation
  const handleMobileBack = () => {
    setShowMobileRightSidebar(false);
  };

  return (
    <>
      {/*main dive*/}
      <div className="md:w-screen md:h-screen">

        {currentTab === 'alluser' ? (
          //avterpage + alluser page 
          <div className="h-full w-full md:grid md:grid-cols-[6%_94%] flex flex-col">
            {/* Sidebar */}
            {!showMobileRightSidebar && (
              <div className="md:static fixed bottom-0 left-0 w-full h-16 md:h-full md:w-full md:order-1 order-2 z-10">
                <Sidebar
                  selectUser={selectedUser}
                  setSelectedUser={handleUserSelect}
                  selectGroup={selectGroup}
                  setSelectedGroup={handleGroupSelect}
                  isMobile={isMobile}
                />
              </div>
            )}

            {/* AllUser Page */}
            <div className="order-1 md:order-2 overflow-hidden flex-1">
              <AllUser />
            </div>
          </div>
        ) : currentTab === 'avtarpage' ? (
          // AvtarPage + Sidebar
          <div className="h-full w-full md:grid md:grid-cols-[6%_94%] flex flex-col">
            {/* Sidebar */}
            {!showMobileRightSidebar && (
              <div className="md:static fixed bottom-0 left-0 w-full h-16 md:h-full md:w-full md:order-1 order-2 z-10">
                <Sidebar
                  selectUser={selectedUser}
                  setSelectedUser={handleUserSelect}
                  selectGroup={selectGroup}
                  setSelectedGroup={handleGroupSelect}
                  isMobile={isMobile}
                />
              </div>
            )}

            {/* Avtar Page */}
            <div className="order-1 md:order-2 overflow-hidden flex-1">
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
                  isMobile={isMobile}
                />
              </div>
            )}

            {/* Chat Container */}
            <div className="order-1 md:order-2 overflow-hidden flex-1">
              <ChatContainer
                selectUser={selectedUser}
                setSelectUser={handleUserSelect}
                activePage={currentTab}
                selectGroup={selectGroup}
                setSelectGroup={handleGroupSelect}
              />
            </div>

            {/* RightSidebar */}
            <div className="order-2 md:order-3 overflow-hidden hidden md:block">
              <Rightsidebar
                selectUser={selectedUser}
                SetSelectUser={handleUserSelect}
                selectGroup={selectGroup}
                setSelectGroup={handleGroupSelect}
                isMobile={isMobile}
                onMobileBack={handleMobileBack}
              />
            </div>

            {/* RightSidebar - Mobile Overlay */}
            {showMobileRightSidebar && isMobile && (
              <div className="fixed inset-0 z-50 md:hidden overflow-y-auto">
                <Rightsidebar
                  selectUser={selectedUser}
                  setSelectUser={handleUserSelect}
                  selectGroup={selectGroup}
                  setSelectGroup={handleGroupSelect}
                  isMobile={isMobile}
                  onMobileBack={handleMobileBack}
                />
              </div>
            )}

          </div>
        )}

        <DraggableChatbot />
      </div>
    </>
  );
}

export default Home;