import { SignIn } from "@clerk/clerk-react";
import { neobrutalism } from "@clerk/themes";

export default function SignInPage() {
    return (
        <div className="flex items-center justify-center h-screen">
            <SignIn appearance={neobrutalism}/>
        </div>
    );
}