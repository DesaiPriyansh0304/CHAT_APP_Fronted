import React from "react";
import { BsFiletypePdf, BsFiletypeTxt } from "react-icons/bs";
import { FaRegFileWord, FaRegFileExcel, FaRegFilePowerpoint } from "react-icons/fa";
import { GoFileZip } from "react-icons/go";
import { LuFileText } from "react-icons/lu";

const fileTypeConfig = {
    pdf: {
        icon: <BsFiletypePdf className="text-red-500 text-2xl" />,
        bg: "bg-red-100",
    },
    doc: {
        icon: <FaRegFileWord className="text-blue-500 text-2xl" />,
        bg: "bg-blue-100",
    },
    docx: {
        icon: <FaRegFileWord className="text-blue-500 text-2xl" />,
        bg: "bg-blue-100",
    },
    xls: {
        icon: <FaRegFileExcel className="text-green-600 text-2xl" />,
        bg: "bg-green-100",
    },
    xlsx: {
        icon: <FaRegFileExcel className="text-green-600 text-2xl" />,
        bg: "bg-green-100",
    },
    ppt: {
        icon: <FaRegFilePowerpoint className="text-orange-500 text-2xl" />,
        bg: "bg-orange-100",
    },
    pptx: {
        icon: <FaRegFilePowerpoint className="text-orange-500 text-2xl" />,
        bg: "bg-orange-100",
    },
    ppsx: {
        icon: <FaRegFilePowerpoint className="text-orange-500 text-2xl" />,
        bg: "bg-orange-100",
    },
    zip: {
        icon: <GoFileZip className="text-yellow-600 text-2xl" />,
        bg: "bg-yellow-100",
    },
    txt: {
        icon: <BsFiletypeTxt className="text-gray-600 text-2xl" />,
        bg: "bg-gray-200",
    },
};

const FileTypeIcon = ({ fileName }) => {
    if (!fileName) {
        return (
            <div className="w-11 h-11 bg-purple-100 flex items-center justify-center rounded-lg">
                <LuFileText className="text-purple-500 text-2xl" />
            </div>
        );
    }

    const ext = fileName.split(".").pop().toLowerCase();
    const fileConfig = fileTypeConfig[ext];

    return (
        <div
            className={`w-11 h-11 flex items-center justify-center rounded-lg ${fileConfig?.bg || "bg-purple-100"
                }`}
        >
            {fileConfig?.icon || <LuFileText className="text-purple-500 text-2xl" />}
        </div>
    );
};

export default FileTypeIcon;
