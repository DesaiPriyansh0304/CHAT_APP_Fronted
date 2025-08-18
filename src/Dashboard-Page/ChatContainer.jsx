import React from 'react';
//Top Icon Page(Prifile + chats + group + contact + setting)
import ProfilePage from '../Icon-Page/ProfilePage';
import Chats from '../Icon-Page/Chats';
import Group from '../Icon-Page/Group';
import Contacts from '../Icon-Page/Contacts';
import Setting from '../Icon-Page/Setting';
//Bottom Icon Pages(AvtarPage + Alluser)
import AvtarPage from '../Icon-Page/AvtarPage';
import AllUser from '../Icon-Page/AllUser';


function ChatContainer({
  selectUser,
  setSelectUser,
  activePage,
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
          <>
            <Chats
              selectUser={selectUser}
              setSelectUser={setSelectUser}
            />
          </>
        );
      case 'group':
        return (
          <>
            <Group
              selectGroup={selectGroup}
              setSelectGroup={setSelectGroup}
            />
          </>
        );
      case 'contact':
        return (
          <>
            <Contacts />
          </>
        );
      case 'setting':
        return (
          <>
            <Setting />
          </>
        );
      case 'avtarpage':
        return (
          <>
            <AvtarPage />
          </>
        );
      case 'alluser':
        return (
          <>
            <AllUser />
          </>
        );
      default:
    }
  };

  return (
    <>
      <div className={`bg-[#F5F7FB] dark:bg-[var(--chatcontainer-bg)] shadow-2xl`}>
        {renderContent()}
      </div>
    </>
  );
}

export default ChatContainer;
