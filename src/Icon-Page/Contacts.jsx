import React, { useState, useEffect, useRef } from 'react';
import { RiUserAddLine, RiDeleteBin6Line } from 'react-icons/ri';
import { TbListSearch } from "react-icons/tb";
import ContactAdd from '../Chat-contatainer/Contacts/ContactAdd';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { EllipsisVerticalIcon } from 'lucide-react';
import { IoShareSocialOutline } from 'react-icons/io5';
import { MdBlockFlipped } from 'react-icons/md';
import { fetchInvitedUsers, resetInvitedUsersState } from '../feature/Slice/Invited-User/InvitedUsersSlice';
import { useDebounce } from 'use-debounce';
import { RxCross2 } from 'react-icons/rx';
import "../Chat-contatainer/Contacts/css/contect.css"

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
  const dispatch = useDispatch();
  const { token } = useParams();

  const [showAddModal, setShowAddModal] = useState(false);   //add contact modal
  const [search, setSearch] = useState('');                  //searchbar
  const [debouncedSearch] = useDebounce(search, 400);
  const [isMenuOpen, setIsMenuOpen] = useState(false);       //dot menu
  console.log('✌️isMenuOpen --->', isMenuOpen);
  const [activeMenuId, setActiveMenuId] = useState(null);    //Active Menu ID

  // Refs for outside click detection
  const dotmenuRef = useRef();
  const modalRef = useRef(); // Modal ref

  //dot menu function 
  const toggleMenu = (id) => {
    if (isMenuOpen && activeMenuId === id) {
      // setIsMenuOpen(false);
      // setActiveMenuId(null);
      setIsMenuOpen(!isMenuOpen);
    } else {
      setIsMenuOpen(true);
      setActiveMenuId(id);
    }
  };

  // Dot menu outside click handler
  // Dot menu outside click handler
  useEffect(() => {
    const handleClickAnywhere = (event) => {
      if (
        isMenuOpen &&
        dotmenuRef.current &&
        !dotmenuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
        setActiveMenuId(null);
      }
    };

    document.addEventListener("click", handleClickAnywhere);
    return () => {
      document.removeEventListener("click", handleClickAnywhere);
    };
  }, [isMenuOpen]);


  // Modal outside click handler
  useEffect(() => {
    const handleModalOutsideClick = (event) => {
      if (showAddModal && modalRef.current && !modalRef.current.contains(event.target)) {
        handleModalClose();
      }
    };

    if (showAddModal) {
      document.addEventListener('mousedown', handleModalOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleModalOutsideClick);
    };
  }, [showAddModal]);

  //dot menu icons
  const dotMenu = [
    { id: 0, title: 'Share', icon: <IoShareSocialOutline /> },
    { id: 1, title: 'Block', icon: <MdBlockFlipped /> },
    { id: 2, title: 'Remove', icon: <RiDeleteBin6Line /> },
  ];

  {/*invited user Slice*/ }
  //all user (Invited User & invited by)
  const invitedUserState = useSelector((state) => state.invitedUsers || {});
  // console.log('invitedUserState --->Contact.jsx', invitedUserState);
  const { loading } = invitedUserState;

  //invited User
  const invitedUsersArray = invitedUserState.invitedUsers || [];
  // console.log('invitedUsersArray --->Contact.jsx', invitedUsersArray);
  //Invited By User
  const invitedByArray = invitedUserState.invitedBy || [];
  // console.log('invitedByArray --->Contact.jsx', invitedByArray);

  // API Call InvitedUsers Slice 
  useEffect(() => {
    if (!token) {
      dispatch(fetchInvitedUsers(debouncedSearch));
    }
  }, [dispatch, debouncedSearch, token]);

  {/*If token from URL → verify invite User*/ }
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
          if (response.ok) {
            toast.success('🎉 Invitation confirmed! You can now register.');
          } else {
            toast.error('❌ ' + data.message);
          }
        } catch (error) {
          console.log('Token verify error:', error);
          toast.error('❌ Token verification failed.');
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

  // FIXED - Apply search filter to contacts
  const filteredContacts = confirmedUsers.filter((contact) => {
    if (!debouncedSearch.trim()) return true;

    const searchTerm = debouncedSearch.toLowerCase();
    const name = contact.name?.toLowerCase() || '';
    const email = contact.email?.toLowerCase() || '';

    return name.includes(searchTerm) || email.includes(searchTerm);
  });

  // Group filtered contacts
  const groupedContacts = groupContactsByLetter(filteredContacts);

  // add contact Function - FIXED to refresh data
  const handleModalClose = () => {
    setShowAddModal(false);
    dispatch(resetInvitedUsersState());
  };

  // Function to handle contact addition
  const handleContactAdded = () => {
    dispatch(resetInvitedUsersState());
    setShowAddModal(false);
    setTimeout(() => {
      dispatch(fetchInvitedUsers(debouncedSearch));
    }, 100);
  };

  return (
    <>
      <div className="h-screen w-full p-4 relative">

        {/* Header */}
        <div className="flex items-center justify-between mx-3.5 mb-6 mt-6">
          {/*Contacts title*/}
          <div>
            <h4 className="libertinus-sans-regular text-[26px] font-semibold text-gray-800 dark:text-[var(--text-color3)]">
              Contacts
            </h4>
          </div>
          {/*icon title*/}
          <div>
            <button
              className="text-cyan-400 hover:text-blue-500 dark:text-[var(--text-color1)] text-xl mr-4 cursor-pointer tilt-animation"
              onClick={() => setShowAddModal(true)}
            >
              <RiUserAddLine />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div>
            <TbListSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-cyan-900" size={18} />
          </div>
          <div>
            <input
              type="text"
              placeholder="Search Users.."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gradient-to-r from-cyan-200 to-blue-100 border-2 border-cyan-500 text-gray-800 placeholder-gray-500 focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute top-1/2 right-3 text-lg transform -translate-y-1/2 text-gray-600 hover:text-red-600 cursor-pointer"
              >
                <RxCross2 />
              </button>
            )}
          </div>
        </div>

        {/* Loader */}
        {loading && <div className="flex justify-center items-center py-8">
          <div className="w-5 h-5 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-cyan-400">Loading contact...</span>
        </div>}

        {/* Grouped Contacts List */}
        <div className="space-y-4 overflow-y-auto h-full pr-1 overflow-auto">
          {Object.keys(groupedContacts).length === 0 && !loading ? (
            <div className="text-center text-gray-500 mt-8">
              {debouncedSearch.trim() ? `No contacts found for "${debouncedSearch}"` : "No contacts found. Invite someone to get started!"}
            </div>
          ) : (
            Object.keys(groupedContacts)
              .sort()
              .map((letter) => (
                <div key={letter}>
                  {/*letter*/}
                  <div className="text-cyan-600 dark:text-[var(--text-color)] font-semibold text-sm mt-8">
                    {letter}
                  </div>
                  {groupedContacts[letter].map((inv, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center px-4 py-2 rounded cursor-pointer hover:bg-cyan-100 dark:hover:bg-gray-800"
                    >
                      {/*user name*/}
                      <div className="text-gray-800 dark:text-[var(--text-color3)] font-medium">
                        {inv.name || inv.email}
                      </div>

                      {/*dot menu section*/}
                      <div className="relative text-gray-500 text-xl dark:text-[var(--text-color1)]">
                        {/*dot icon*/}
                        <div>
                          <button
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMenu(inv.id);
                            }}
                          >
                            <EllipsisVerticalIcon size={16} />
                          </button>
                        </div>
                        {/*dot menu open*/}
                        <div>
                          {isMenuOpen && activeMenuId === inv.id && (
                            <div
                              ref={dotmenuRef}
                              className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-xl  z-10 dark:bg-gray-800 dark:border-gray-600"
                            >
                              <ul>
                                {dotMenu.map(({ title, id, icon }) => (
                                  <div key={id} className='hover:bg-gray-100 dark:hover:bg-gray-700'
                                    onClick={() => {
                                      // console.log(`👉 ${title} clicked`); 
                                      setIsMenuOpen(false);
                                      setActiveMenuId(null);
                                    }}>
                                    <li className="flex flex-col mx-2 ">
                                      <div className="flex items-center p-0.5 gap-4 my-0.5 mx-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300 justify-between">
                                        <div className="text-gray-700 dark:text-gray-300 text-md">{title}</div>
                                        <div className="text-cyan-500">{icon}</div>
                                      </div>
                                    </li>
                                  </div>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
          )}
        </div>

        {/* Add Contact Modal - handle callback */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div ref={modalRef}>
              <ContactAdd
                onClose={handleModalClose}
                onContactAdded={handleContactAdded}
              />
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default Contacts;