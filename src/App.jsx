import React from "react";
import { neobrutalism } from "@clerk/themes";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ClerkProvider,SignedIn, SignedOut } from "@clerk/clerk-react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Games from "./pages/Games";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import SignInPage from "./pages/signin";
import SignedOutHeader from "./pages/signedout";
import SignUpPage from "./pages/signup";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk publishable key. Add VITE_CLERK_PUBLISHABLE_KEY to your .env file.");
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey} appearance={neobrutalism}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/signed-out/*" element={<SignedOutHeader />} />
          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <SignedIn>
                <Layout>
                  <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/quiz" element={<Quiz />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/analytics" element={<Analytics />} />
                  </Routes>
                </Layout>
              </SignedIn>
            }
          />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;
