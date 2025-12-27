import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

interface AuthContextType {
    user: User | null;
    credits: number;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [credits, setCredits] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log('Auth state changed:', firebaseUser?.email || 'No user');
            setUser(firebaseUser);

            if (firebaseUser) {
                // Listen to user's credit balance in real-time
                const userDocRef = doc(db, 'users', firebaseUser.uid);
                const unsubscribeCredits = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const userCredits = docSnap.data().credits || 0;
                        console.log('Credits updated:', userCredits);
                        setCredits(userCredits);
                    } else {
                        console.log('User document does not exist yet');
                        setCredits(0);
                    }
                    setLoading(false);
                });

                return () => unsubscribeCredits();
            } else {
                setCredits(0);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            console.log('Attempting popup sign-in...');
            const result = await signInWithPopup(auth, googleProvider);
            console.log('Sign-in successful:', result.user.email);
        } catch (error: any) {
            console.error('Error signing in with Google:', error);
            if (error.code === 'auth/popup-blocked') {
                alert('Popup was blocked! Please allow popups for this site or disable your ad blocker.');
            }
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, credits, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
