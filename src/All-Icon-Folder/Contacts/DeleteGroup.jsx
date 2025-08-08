import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { deleteGroup } from "../../feature/Slice/Group/DeleteGroup";

export const DeleteGroupButton = ({ groupId, onClose }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",  // Blue
            cancelButtonColor: "#d33",      // Red
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteGroup(groupId))
                    .unwrap()
                    .then((res) => {
                        Swal.fire({
                            title: "Deleted!",
                            text: res.message || "Group has been deleted.",
                            icon: "success",
                        });
                        onClose(); // Close popup and refresh group list
                    })
                    .catch((err) => {
                        Swal.fire({
                            title: "Error!",
                            text: err.message || "Something went wrong.",
                            icon: "error",
                        });
                        onClose(); // Close anyway
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: "Cancelled",
                    text: "Your group is safe :)",
                    icon: "error",
                });
                onClose();
            }
        });
    }, [dispatch, groupId, onClose]);

    return null;
};
