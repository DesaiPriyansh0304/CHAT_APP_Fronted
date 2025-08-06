import React from 'react';
//Top Icon Page
import ProfilePage from './main-Icon-page/ProfilePage';
import Chats from './main-Icon-page/Chats';
import Group from './main-Icon-page/Group';
import Contacts from './main-Icon-page/Contacts';
import Setting from './main-Icon-page/Setting';
//Bottom Icon Pages
import AvtarPage from '../Pages/AvtarPage';
import AllUser from './main-Icon-page/AllUser';


function ChatContainer({
  selectUser,
  SetSelectUser,
  activePage,
  setUserChat,
  selectGroup,
  setSelectGroup,
}) {


  const renderContent = () => {
    switch (activePage) {
      case 'profile':
        return (
          <>
            <ProfilePage />
          </>
        );
      case 'chats':
        return (
          <div>
            <Chats
              selectUser={selectUser}
              SetSelectUser={SetSelectUser}
              setUserChat={setUserChat}
            />
          </div>
        );
      case 'group':
        return (
          <div>
            <Group selectGroup={selectGroup} setSelectGroup={setSelectGroup} />
          </div>
        );
      case 'contact':
        return (
          <>
            <Contacts />
          </>
        );
      case 'setting':
        return (
          <div>
            <Setting />
          </div>
        );
      case 'avtarpage':
        return (
          <div>
            <AvtarPage />
          </div>
        );
      case 'alluser':
        return (
          <div>
            <AllUser />
          </div>
        );
      default:
    }
  };

  return (
    <>
      <div className={`min-h-screen bg-[#F5F7FB] dark:bg-[var(--chatcontainer-bg)] `}>{renderContent()}</div>
    </>
  );
}

export default ChatContainer;
