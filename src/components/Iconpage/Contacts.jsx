import React, { useState, useEffect, useRef } from "react";
import { RiUserAddLine } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import ContactAdd from "../../Contacts/ContactAdd";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { EllipsisVerticalIcon } from "lucide-react";
//dot icon
import { IoShareSocialOutline } from "react-icons/io5";
import { MdBlockFlipped } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

// Utility: Group users by first character
const groupContactsByLetter = (contacts) => {
  const grouped = {};

  contacts.forEach((contact) => {
    const key = contact.name
      ? contact.name.charAt(0).toUpperCase()
      : contact.email.charAt(0).toUpperCase();
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(contact);
  });

  return grouped;
};

function Contacts() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { userData: user } = useSelector((state) => state.loginuser);
  const [confirmedUsers, setConfirmedUsers] = useState([]);
  const { token } = useParams();

  //dot menu

  const [isMenuOpen, setIsMenuOpen] = useState(false); //dotmenu

  const toggleMenu = (id) => {
    // setIsMenuOpen(!isMenuOpen);
    setIsMenuOpen(prev => (prev === id ? null : id));
  };

  const dotMenu = [
    { id: 0, title: "Share", icon: <IoShareSocialOutline /> },
    { id: 1, title: "Block", icon: <MdBlockFlipped /> },
    { id: 2, title: "Remove", icon: <RiDeleteBin6Line /> },
  ];

  const dotmenuRef = useRef();

  useEffect(() => {
    const handleClickAnywhere = (event) => {
      if (isMenuOpen && dotmenuRef.current && !dotmenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);

      }
    };

    document.addEventListener('mousedown', handleClickAnywhere);
    return () => {
      document.removeEventListener('mousedown', handleClickAnywhere);
    };
  }, [isMenuOpen]);



  // Token verification (optional - for invite)
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP}/api/auth/invitedUsers-verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          toast.success("🎉 Invitation confirmed!");
        } else {
          toast.error("❌ " + data.message);
        }
      } catch (err) {
        console.error("Token verify error:", err);
      }
    };

    if (token) verifyToken();
  }, [token]);

  // Load confirmed invited users with optional name
  useEffect(() => {
    const fetchConfirmedUsers = async () => {
      const confirmed =
        user?.invitedUsers?.filter((i) => i.invited_is_Confirmed) || [];

      const result = await Promise.all(
        confirmed.map(async (inv) => {
          if (inv.user) {
            try {
              const res = await fetch(
                `${import.meta.env.VITE_REACT_APP}/api/auth/get-user/${inv.user}`
              );
              const data = await res.json();
              if (
                res.ok &&
                data.user.firstname &&
                data.user.lastname
              ) {
                return {
                  id: inv._id,
                  name: `${data.user.firstname} ${data.user.lastname}`,
                  email: inv.email,
                };
              }
            } catch (error) {
              console.error("Fetch user error:", error);
            }
          }

          // fallback: email only
          return {
            id: inv._id,
            name: null,
            email: inv.email,
          };
        })
      );

      setConfirmedUsers(result);
    };

    fetchConfirmedUsers();
  }, [user]);

  const groupedContacts = groupContactsByLetter(confirmedUsers);

  return (
    <div className="h-screen w-full p-4 bg-[#f9fbfd] relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xl font-semibold text-gray-800">Contacts</h4>
        <button
          className="text-gray-600 hover:text-gray-800 text-xl mr-4 cursor-pointer"
          onClick={() => setShowAddModal(true)}
        >
          <RiUserAddLine />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search users.."
          className="w-full pl-10 pr-4 py-2 rounded-md bg-[#e4e9f7] text-gray-700 placeholder-gray-500 focus:outline-none"
        />
      </div>

      {/* Grouped List */}
      <div className="space-y-4 overflow-y-auto h-[calc(100vh-200px)] pr-1">
        {Object.keys(groupedContacts)
          .sort()
          .map((letter) => (
            <div key={letter}>
              <div className="text-purple-600 font-semibold text-sm  mt-8">
                {letter}
              </div>
              {groupedContacts[letter].map((inv, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center px-4 py-2 rounded cursor-pointer"
                >
                  <div className="text-gray-800 font-medium">
                    {inv.name || inv.email}
                  </div>
                  <div className="relative text-gray-500 text-xl cursor-pointer">
                    {/* <button onClick={toggleMenu}> */}
                    <button onClick={() => toggleMenu(inv.id)}>
                      <EllipsisVerticalIcon size={16} />
                    </button>

                    {isMenuOpen === inv.id && (
                      <div
                        ref={dotmenuRef}
                        className="absolute right-0 mt-2 w-30 bg-white border border-blue-300 rounded-xs shadow-md z-10"
                      >
                        <ul className="">
                          {dotMenu.map(({ title, id, icon }) => (
                            <li key={id} className="flex flex-col hover:bg-gray-100">
                              <div
                                className="flex items-center p-0.5 gap-4 my-0.5 mx-2 cursor-pointer text-sm text-gray-700 justify-between  "
                              >
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
              ))}
            </div>
          ))}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && <ContactAdd onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

export default Contacts;
