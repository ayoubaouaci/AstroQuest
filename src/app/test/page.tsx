"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Ensure this matches your firebase.ts export

export default function TestPage() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        setError(null);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            console.log("User signed in:", user.displayName);
            setUser(user);
            alert(`Welcome, ${user.displayName}!`);
        } catch (err: any) {
            console.error("Sign-in error:", err);
            setError(err.message);
            alert(`Error: ${err.message}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
            <h1 className="text-2xl font-bold mb-6">Firebase Auth Test</h1>

            {!user ? (
                <button
                    onClick={handleGoogleSignIn}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                >
                    Sign in with Google
                </button>
            ) : (
                <div className="text-center space-y-4">
                    <p className="text-green-400">Signed in as:</p>
                    <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                        <p className="font-bold text-xl">{user.displayName}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                    <button
                        onClick={() => auth.signOut().then(() => setUser(null))}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded text-red-200 max-w-md text-center">
                    <p className="font-bold">Error:</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}
        </div>
    );
}
