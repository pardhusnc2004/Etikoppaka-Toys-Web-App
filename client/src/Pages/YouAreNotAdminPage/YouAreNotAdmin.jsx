import React from "react";
import { useNavigate } from "react-router-dom";

const YouAreNotAdmin = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-text-center text-center">
            <h1 className="text-4xl font-bold text-red-700">Access Denied</h1>
            <p className="mt-2 text-slate-400">You do not have the necessary admin privileges to access this page.</p>
            <button
                className="mt-4 px-6 py-2 bg-blue-600 text-slate-300 rounded-lg hover:bg-blue-700 transition"
                onClick={() => navigate("/")}
            >
                Go Back to Home
            </button>
        </div>
    );
}

export default YouAreNotAdmin;
