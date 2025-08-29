// authContext.tsx
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateCurrentUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from "../firebaseConfig";

// Define the shape of the context
interface RegisterResult {
  success: boolean;
  data?: any;
  msg?: string;
}

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean | undefined;
  login: (email: string, password: string) => Promise<{ success: boolean; msg?: string }>;
  logout: () => Promise<{ success: boolean; msg?: string }>;
  register: (email: string, password: string, username: string) => Promise<RegisterResult>;
  updateUserProfile: (fields: { photoURL?: string; username?: string }) => Promise<void>;
}

// Provide initial context values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: undefined,
  login: async () => ({ success: false, msg: "Not implemented." }),
  logout: async () => ({ success: false, msg: "Not implemented." }),
  register: async (_email: string, _password: string, _username: string) => {
    return { success: false, msg: "Not implemented." };
  },
  updateUserProfile: async () => { throw new Error("Not implemented."); },
});

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);

  const storage = getStorage();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        updateCurrentUser(auth, user);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
    return unsub;
  }, []);

  const updateUserData = async (userId: string) => {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      setUser({
        ...user,
        username: data.username,
        userId: data.userId,
        photoURL: data.photoURL,
      });
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      await updateUserData(response.user.uid);
      return { success: true };
    } catch (e: any) {
      let msg = "An error occurred.";
      if (e?.message) {
        msg = e.message;
      }
      if (msg.includes('(auth/invalid-email)')) msg = "Invalid email address.";
      if (msg.includes('(auth/invalid-credential)')) msg = "Wrong Credentials.";
      return { success: false, msg };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, msg: "An error occurred while logging out." };
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', response.user.uid), {
        username,
        userId: response.user.uid,
      });
      return { success: true, data: response.user };
    } catch (e: any) {
      let msg = "An error occurred.";
      if (e?.message) {
        msg = e.message;
      }
      if (msg.includes('(auth/invalid-email)')) msg = "Invalid email address.";
      if (msg.includes('(auth/email-already-in-use)')) msg = "This email already in use";
      return { success: false, msg };
    }
  };

  const updateUserProfile = async (fields: { photoURL?: string; username?: string }) => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('No user logged in');

    let newPhotoURL = fields.photoURL;

    // 1️⃣  If a local URI was supplied, upload it
    if (newPhotoURL?.startsWith('file://')) {
      const response = await fetch(newPhotoURL);
      const blob = await response.blob();
      const ext = newPhotoURL.split('.').pop();
      const storageRef = ref(storage, `avatars/${uid}.${ext}`);
      await uploadBytes(storageRef, blob);
      newPhotoURL = await getDownloadURL(storageRef);
    }

    // 2️⃣  Update Firestore
    await setDoc(
      doc(db, 'users', uid),
      { photoURL: newPhotoURL, ...(fields.username && { username: fields.username }) },
      { merge: true }
    );

    // 3️⃣  Update local state immediately
    setUser((prev: any) => ({ ...prev, ...fields, photoURL: newPhotoURL }));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return value;
};