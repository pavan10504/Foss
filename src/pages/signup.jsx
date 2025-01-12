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
            
            navigate("/home");
        }
    }, [isSignedIn, navigate]);

    return (
        <div className="flex items-center justify-center h-screen">
            <SignedOut>
                <SignUp appearance={neobrutalism} />
            </SignedOut>
        </div>
    );
}
