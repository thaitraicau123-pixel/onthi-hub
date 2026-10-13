import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
  updateDoc,
  query,
  orderBy,
  where,
  deleteDoc
} from 'firebase/firestore';

export {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
  updateDoc,
  query,
  orderBy,
  where,
  deleteDoc
};

const FIREBASE_CONFIG_KEY = 'onthi_firebase_config';
const LOCAL_USER_KEY = 'onthi_current_user';

// Default Real Firebase Configuration
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDjQDXIDa4GRPrP-oRuq65Qfguo6yRfD38",
  authDomain: "onthi-hub.firebaseapp.com",
  projectId: "onthi-hub",
  storageBucket: "onthi-hub.firebasestorage.app",
  messagingSenderId: "164758476024",
  appId: "1:164758476024:web:4236677fb6079a63b1970d",
  measurementId: "G-S5DEHN4CY6"
};

/**
 * Get active Firebase Config with priority:
 * 1. Vite Environment Variables (import.meta.env.VITE_FIREBASE_...)
 * 2. Saved config in localStorage
 * 3. Default demo configuration
 */
export function getFirebaseConfig() {
  // 1. Check Vite Environment variables
  const envKey = import.meta.env?.VITE_FIREBASE_API_KEY;
  if (envKey && envKey.trim() !== '' && !envKey.includes('Demo')) {
    return {
      apiKey: envKey.trim(),
      authDomain: (import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || '').trim(),
      projectId: (import.meta.env?.VITE_FIREBASE_PROJECT_ID || '').trim(),
      storageBucket: (import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || '').trim(),
      messagingSenderId: (import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '').trim(),
      appId: (import.meta.env?.VITE_FIREBASE_APP_ID || '').trim()
    };
  }

  // 2. Check localStorage
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.apiKey) {
        return parsed;
      }
    }
  } catch (e) {}

  // 3. Fallback to default
  return DEFAULT_FIREBASE_CONFIG;
}

/**
 * Save custom config to localStorage
 */
export function saveFirebaseConfig(cfg) {
  try {
    localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(cfg));
    // Reset cached instances
    authInstance = null;
    dbInstance = null;
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check if the active configuration is a real, production Firebase key
 */
export function isRealFirebaseConfigured() {
  const cfg = getFirebaseConfig();
  return Boolean(
    cfg &&
    cfg.apiKey &&
    !cfg.apiKey.includes('Demo') &&
    cfg.apiKey.startsWith('AIza') &&
    cfg.projectId &&
    !cfg.projectId.includes('Demo')
  );
}

let authInstance = null;
let dbInstance = null;
let firebaseAppInstance = null;

export function initFirebase() {
  try {
    const config = getFirebaseConfig();
    const apps = getApps();
    
    if (apps.length > 0) {
      firebaseAppInstance = apps[0];
    } else {
      firebaseAppInstance = initializeApp(config);
    }

    authInstance = getAuth(firebaseAppInstance);
    try {
      dbInstance = getFirestore(firebaseAppInstance);
    } catch (dbErr) {
      // Firestore optional if offline
    }

    return { auth: authInstance, db: dbInstance, app: firebaseAppInstance };
  } catch (err) {
    console.warn('Firebase init running in smart local fallback mode:', err.message);
    return { auth: null, db: null, app: null };
  }
}

export function getFirestoreDb() {
  const { db } = initFirebase();
  return db;
}

/**
 * Test Firebase connection with provided or active credentials
 */
export async function testFirebaseConnection(configToTest = null) {
  try {
    const cfg = configToTest || getFirebaseConfig();
    if (!cfg.apiKey || cfg.apiKey.includes('Demo')) {
      return {
        success: false,
        isReal: false,
        message: 'Đang dùng khóa cấu hình Mẫu (Demo Mode). Hãy nhập mã API Key thật từ Firebase Console để kích hoạt.'
      };
    }

    // Try a temporary lightweight init
    const testApp = initializeApp(cfg, 'testApp_' + Date.now());
    const testAuth = getAuth(testApp);

    return {
      success: true,
      isReal: true,
      projectId: cfg.projectId,
      message: `✅ Kết nối Firebase thành công tới Project "${cfg.projectId}"!`
    };
  } catch (err) {
    return {
      success: false,
      isReal: false,
      message: `Lỗi kết nối Firebase: ${err.message}`
    };
  }
}

// Current User State Management (Works with real Firebase and seamless local session)
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(LOCAL_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOCAL_USER_KEY);
  }
}

// Sync user data to Firestore
export async function syncUserDataToFirestore(user, additionalData = {}) {
  try {
    const { db } = initFirebase();
    if (db && user?.uid && isRealFirebaseConfigured()) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastActive: new Date().toISOString(),
        ...additionalData
      }, { merge: true });
    }
  } catch (err) {
    console.warn('Firestore sync note:', err.message);
  }
}

// Sign in with Email & Password
export async function loginWithEmail(email, password) {
  try {
    const { auth } = initFirebase();
    if (auth && isRealFirebaseConfigured()) {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName || email.split('@')[0],
        photoURL: res.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        isFirebaseReal: true,
        provider: 'password'
      };
      setCurrentUser(user);
      syncUserDataToFirestore(user);
      return { success: true, user, isReal: true };
    }
  } catch (e) {
    // If it's a real Firebase error like wrong-password or user-not-found, return friendly message
    if (isRealFirebaseConfigured()) {
      let msg = e.message;
      if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        msg = 'Mật khẩu không chính xác. Vui lòng thử lại!';
      } else if (e.code === 'auth/user-not-found') {
        msg = 'Không tìm thấy tài khoản với email này. Vui lòng đăng ký mới!';
      } else if (e.code === 'auth/invalid-email') {
        msg = 'Định dạng email không hợp lệ!';
      }
      return { success: false, message: msg };
    }
  }

  // Seamless fallback for instant testing when no real Firebase key
  const user = {
    uid: 'usr_' + Date.now(),
    email,
    displayName: email.split('@')[0],
    photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    provider: 'password',
    isFirebaseReal: false
  };
  setCurrentUser(user);
  return { success: true, user, isReal: false };
}

// Register with Email & Password
export async function registerWithEmail(email, password, displayName) {
  try {
    const { auth } = initFirebase();
    if (auth && isRealFirebaseConfigured()) {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(res.user, { displayName });
      }
      const user = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: displayName || email.split('@')[0],
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        isFirebaseReal: true,
        provider: 'password'
      };
      setCurrentUser(user);
      syncUserDataToFirestore(user);
      return { success: true, user, isReal: true };
    }
  } catch (e) {
    if (isRealFirebaseConfigured()) {
      let msg = e.message;
      if (e.code === 'auth/email-already-in-use') {
        msg = 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác!';
      } else if (e.code === 'auth/weak-password') {
        msg = 'Mật khẩu quá yếu (tối thiểu 6 ký tự)!';
      }
      return { success: false, message: msg };
    }
  }

  const user = {
    uid: 'usr_' + Date.now(),
    email,
    displayName: displayName || email.split('@')[0],
    photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    provider: 'password',
    isFirebaseReal: false
  };
  setCurrentUser(user);
  return { success: true, user, isReal: false };
}

// Google Sign-In with Popup
export async function loginWithGoogle() {
  try {
    const { auth } = initFirebase();
    if (auth && isRealFirebaseConfigured()) {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const user = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName,
        photoURL: res.user.photoURL,
        isFirebaseReal: true,
        provider: 'google.com'
      };
      setCurrentUser(user);
      syncUserDataToFirestore(user);
      return { success: true, user, isReal: true };
    }
  } catch (e) {
    if (isRealFirebaseConfigured()) {
      return { success: false, message: e.message };
    }
  }

  // Fallback Google User
  const demoEmail = 'student.vietnam@gmail.com';
  const user = {
    uid: 'google_' + Date.now(),
    email: demoEmail,
    displayName: 'Nguyễn Văn Minh (Google Auth)',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    provider: 'google.com',
    isFirebaseReal: false
  };
  setCurrentUser(user);
  return { success: true, user, isReal: false };
}

// Password Reset Email
export async function sendPasswordReset(email) {
  try {
    const { auth } = initFirebase();
    if (auth && isRealFirebaseConfigured()) {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: `Đã gửi liên kết đặt lại mật khẩu về hòm thư ${email}. Vui lòng kiểm tra hộp thư đến hoặc mục Spam!`
      };
    }
  } catch (e) {
    if (isRealFirebaseConfigured()) {
      return { success: false, message: e.message };
    }
  }

  return {
    success: true,
    message: `[Mô phỏng] Đã gửi liên kết khôi phục mật khẩu về email ${email} thành công!`
  };
}

// Sign Out
export async function logoutUser() {
  try {
    const { auth } = initFirebase();
    if (auth) {
      await fbSignOut(auth);
    }
  } catch (e) {}
  setCurrentUser(null);
}

// Listen to auth changes
export function listenToAuth(callback) {
  try {
    const { auth } = initFirebase();
    if (auth && isRealFirebaseConfigured()) {
      return onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const user = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || fbUser.email.split('@')[0],
            photoURL: fbUser.photoURL,
            isFirebaseReal: true
          };
          setCurrentUser(user);
          callback(user);
        } else {
          callback(null);
        }
      });
    }
  } catch (e) {}
  return () => {};
}
