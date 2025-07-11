import React from 'react';
import Chats from './Iconpage/Chats';
import ProfilePage from '../Pages/ProfilePage';
import Group from './Iconpage/Group';
import Contacts from './Iconpage/Contacts';
import Setting from './Iconpage/Setting';
import AvtarPage from '../Pages/AvtarPage'
import AllUser from './Iconpage/AllUser';
// import Language from './Iconpage/Language';


function ChatContainer({ selectUser, SetSelectUser, activePage, setUserChat, selectGroup, setSelectGroup }) {


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
            <Group
              selectGroup={selectGroup}
              setSelectGroup={setSelectGroup}
            />
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

  return <div className='bg-[#f5f7fb]'>{renderContent()}</div>;
}

export default ChatContainer;
