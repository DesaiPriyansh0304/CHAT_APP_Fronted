import React, { useState, useEffect, useRef } from 'react';
import { RiUserAddLine, RiDeleteBin6Line } from 'react-icons/ri';
import { FaSearch } from 'react-icons/fa';
import ContactAdd from '../../All-Icon-Folder/Contacts/ContactAdd';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { EllipsisVerticalIcon } from 'lucide-react';
import { IoShareSocialOutline } from 'react-icons/io5';
import { MdBlockFlipped } from 'react-icons/md';
import { fetchInvitedUsers, resetInvitedUsersState } from '../../feature/Slice/Invited-User/InvitedUsersSlice';
import { useDebounce } from 'use-debounce';

// Group users alphabetically
const groupContactsByLetter = (contacts) => {
  const grouped = {};
  contacts.forEach((contact) => {
    const key = contact.name
      ? contact.name.charAt(0).toUpperCase()
      : contact.email?.charAt(0).toUpperCase();
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(contact);
  });
  return grouped;
};

function Contacts() {

  const [showAddModal, setShowAddModal] = useState(false);   //add contect modal
  const { token } = useParams();
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');                  //serchbar
  const [debouncedSearch] = useDebounce(search, 400);

  const [isMenuOpen, setIsMenuOpen] = useState(false);       //dot menu
  const [activeMenuId, setActiveMenuId] = useState(null);

  {/*Dot Section*/ }
  const dotmenuRef = useRef();

  //dot menu function
  const toggleMenu = (id) => {
    setIsMenuOpen((prev) => (prev && activeMenuId === id ? false : true));
    setActiveMenuId(id);
  };

  // click event
  useEffect(() => {
    const handleClickAnywhere = (event) => {
      if (isMenuOpen && dotmenuRef.current && !dotmenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickAnywhere);
    return () => {
      document.removeEventListener('mousedown', handleClickAnywhere);
    };
  }, [isMenuOpen]);

  //sot menu icon
  const dotMenu = [
    { id: 0, title: 'Share', icon: <IoShareSocialOutline /> },
    { id: 1, title: 'Block', icon: <MdBlockFlipped /> },
    { id: 2, title: 'Remove', icon: <RiDeleteBin6Line /> },
  ];

  {/*invited user Slice*/ }
  const invitedUserState = useSelector((state) => state.invitedUsers);
  const { isLoaded, loading } = invitedUserState;
  const invitedUsersArray = invitedUserState.invitedUsers || [];
  const invitedByArray = invitedUserState.invitedBy || [];

  // API Call InvitedUsers Slice
  useEffect(() => {
    if (!token && !isLoaded) {
      dispatch(fetchInvitedUsers(debouncedSearch));
    }
  }, [dispatch, debouncedSearch, token, isLoaded]);

  {/*If token from URL → verify invite*/ }
  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_REACT_APP}/api/auth/invite/invitedUsers-verify`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token }),
            }
          );
          const data = await response.json();
          if (response.ok) toast.success('🎉 Invitation confirmed!');
          else toast.error('❌ ' + data.message);
        } catch (err) {
          console.error('Token verify error:', err);
        }
      };
      verifyToken();
    }
  }, [token]);



  {/* Filter confirmed & valid users*/ }
  const confirmedInvitedUsers = invitedUsersArray
    .filter((item) => item.invited_is_Confirmed && item.user !== null)
    .map((item) => item.user);

  const allLiveUsers = [...confirmedInvitedUsers, ...invitedByArray];

  const confirmedUsers = allLiveUsers.map((user) => {
    const name = `${user.firstname || ''} ${user.lastname || ''}`.trim();
    return {
      id: user._id,
      name,
      email: user.email,
      avatar: user.profile_avatar || '',
    };
  });

  const groupedContacts = groupContactsByLetter(confirmedUsers);

  // add contect Function
  const handleModalClose = () => {
    setShowAddModal(false);
    dispatch(resetInvitedUsersState());
  };

  return (
    <>
      <div className="h-screen w-full p-4 relative">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {/*Contacts title*/}
          <div>
            <h4 className="text-xl font-semibold text-gray-800 dark:text-[var(--text-color3)]">
              Contacts
            </h4>
          </div>
          {/*icon title*/}
          <div>
            <button
              className="text-gray-600 hover:text-gray-800 dark:text-[var(--text-color1)] text-xl mr-4 cursor-pointer"
              onClick={() => setShowAddModal(true)}
            >
              <RiUserAddLine />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <div>
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div>
            <input
              type="text"
              placeholder="Search users.."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-[#e4e9f7] text-gray-700 placeholder-gray-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Loader */}
        {loading && <div className="text-center text-gray-500 my-4">Loading contacts...</div>}

        {/* Grouped Contacts List */}
        <div className="space-y-4 overflow-y-auto h-[calc(100vh-200px)] pr-1">
          {Object.keys(groupedContacts)
            .sort()
            .map((letter) => (
              <div key={letter}>
                {/*letter*/}
                <div className="text-purple-600 dark:text-[var(--text-color)] font-semibold text-sm mt-8">
                  {letter}
                </div>
                {groupedContacts[letter].map((inv, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center px-4 py-2 rounded cursor-pointer"
                  >
                    {/*user name*/}
                    <div className="text-gray-800 dark:text-[var(--text-color3)] font-medium">
                      {inv.name || inv.email}
                    </div>
                    {/*dot menu section*/}
                    <div className="relative text-gray-500 text-xl dark:text-[var(--text-color1)] cursor-pointer">
                      {/*icon*/}
                      <div>
                        <button onClick={() => toggleMenu(inv.id)}>
                          <EllipsisVerticalIcon size={16} />
                        </button>
                      </div>
                      {/*dot menu open*/}
                      <div>
                        {isMenuOpen && activeMenuId === inv.id && (
                          <div
                            ref={dotmenuRef}
                            className="absolute right-0 mt-2 w-30 bg-white border border-blue-300 rounded-xs shadow-md z-10"
                          >
                            <ul>
                              {dotMenu.map(({ title, id, icon }) => (
                                <li key={id} className="flex flex-col hover:bg-gray-100">
                                  <div className="flex items-center p-0.5 gap-4 my-0.5 mx-2 cursor-pointer text-sm text-gray-700 justify-between">
                                    <div className="text-gray-700 text-md">{title}</div>
                                    <div className="text-blue-500">{icon}</div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>

        {/* Add Contact Modal */}
        {showAddModal && <ContactAdd onClose={handleModalClose} />}
      </div>
    </>
  );
}

export default Contacts;
