import React, { useEffect } from "react";
import { SignUp } from "@clerk/clerk-react";
import { neobrutalism } from "@clerk/themes";
import {SignedOut, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
    const navigate = useNavigate();
    const { isSignedIn } = useAuth();

    useEffect(() => {
        if (isSignedIn) {
            // Redirect signed-in users
            navigate("/home");
        }
    }, [isSignedIn, navigate]);

    return (
        <div className="flex items-center justify-center h-screen">
            {/* If the user is signed out, show the SignUp form */}
            <SignedOut>
                <SignUp appearance={neobrutalism} />
            </SignedOut>
        </div>
    );
}
