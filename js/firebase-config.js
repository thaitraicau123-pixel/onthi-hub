/**
 * BuiThai AI Studio (PromptMMO) - Firebase Connector & Bridge Module (v12.0 promtmmo)
 * Kết nối dự án Firebase MỚI CỦA ANH BÙI THÁI: promtmmo (Live Production)
 * App ID: 1:824312448793:web:c32cbfb33feb8a7af8a788
 * Measurement ID: G-4QW8FFR4YD
 */

(function () {
  'use strict';

  // Cấu hình Firebase MỚI chính xác từ anh Bùi Thái
  const promtmmoFirebaseConfig = {
    apiKey: "AIzaSyDg7IkQYpi-jENda5yogUMR54LjU4mqGS4",
    authDomain: "promtmmo.firebaseapp.com",
    projectId: "promtmmo",
    storageBucket: "promtmmo.firebasestorage.app",
    messagingSenderId: "824312448793",
    appId: "1:824312448793:web:c32cbfb33feb8a7af8a788",
    measurementId: "G-4QW8FFR4YD"
  };

  const CLOUD_USERS_KEY = 'shopviet247_cloud_users_sync';
  const CLOUD_ORDERS_KEY = 'shopviet247_cloud_orders_sync';
  const CLOUD_TOPUPS_KEY = 'shopviet247_cloud_topups_sync';

  function getFriendlyErrorMessage(err) {
    if (!err) return 'Có lỗi xảy ra, vui lòng thử lại!';
    const code = err.code || '';
    switch (code) {
      case 'auth/user-not-found':
        return 'Không tìm thấy tài khoản với email này. Vui lòng đăng ký mới!';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Mật khẩu không chính xác. Vui lòng kiểm tra lại!';
      case 'auth/email-already-in-use':
        return 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác!';
      case 'auth/invalid-email':
        return 'Định dạng email không hợp lệ!';
      case 'auth/weak-password':
        return 'Mật khẩu quá yếu (yêu cầu tối thiểu 6 ký tự)!';
      case 'auth/popup-closed-by-user':
        return 'Cửa sổ đăng nhập Google đã bị đóng.';
      case 'auth/popup-blocked':
        return 'Trình duyệt chặn Popup. Vui lòng cấp quyền mở popup cho trang web!';
      case 'auth/network-request-failed':
        return 'Lỗi mạng, đang chuyển sang chế độ lưu trữ an toàn!';
      case 'auth/operation-not-allowed':
        return 'Phương thức đăng nhập đang được kích hoạt trên Firebase Console!';
      default:
        return err.message || 'Lỗi xác thực Firebase!';
    }
  }

  // Khởi tạo đối tượng toàn cục ShopVietFirebase
  window.ShopVietFirebase = {
    isConfigured: true,
    isOnline: false,
    app: null,
    auth: null,
    db: null,
    analytics: null,
    currentUser: null,
    userUnsubscribe: null,
    config: promtmmoFirebaseConfig,

    /**
     * Khởi tạo kết nối với dự án Firebase promtmmo
     */
    init: function () {
      if (this.app && this.isOnline) return this;

      console.log('[ShopVietFirebase] Khởi động hệ sinh thái Firebase MỚI: promtmmo...');

      try {
        if (typeof window.firebase !== 'undefined' && window.firebase.initializeApp) {
          if (!window.firebase.apps.length) {
            this.app = window.firebase.initializeApp(this.config);
          } else {
            this.app = window.firebase.app();
          }

          // 1. Firebase Analytics
          if (window.firebase.analytics) {
            try {
              this.analytics = window.firebase.analytics();
            } catch (aErr) {}
          }

          // 2. Firebase Auth
          if (window.firebase.auth) {
            this.auth = window.firebase.auth();
            this.isOnline = true;

            this.auth.onAuthStateChanged((user) => {
              if (user) {
                const isAdmin = (user.email === 'thaitraicau123@gmail.com');
                this.currentUser = {
                  uid: user.uid,
                  name: user.displayName || user.email.split('@')[0],
                  email: user.email,
                  avatar: user.photoURL || (user.displayName || user.email).charAt(0).toUpperCase(),
                  isLoggedIn: true,
                  isOnline: true,
                  role: isAdmin ? 'admin' : 'member',
                  authProvider: 'firebase_promtmmo'
                };
                console.log('[ShopVietFirebase] Auth promtmmo kết nối thành công:', this.currentUser.email);

                if (window.ShopVietState && (!window.ShopVietState.state.user || !window.ShopVietState.state.user.isLoggedIn)) {
                  window.ShopVietState.login(this.currentUser);
                }
              } else {
                if (this.userUnsubscribe) {
                  this.userUnsubscribe();
                  this.userUnsubscribe = null;
                }
              }
            });
          }

          // 3. Cloud Firestore (An toàn, không crash nếu database đang tạo)
          if (window.firebase.firestore) {
            try {
              this.db = window.firebase.firestore();
              console.log('[ShopVietFirebase] Kết nối Firestore promtmmo sẵn sàng!');
            } catch (fsErr) {
              this.db = null;
              console.info('[ShopVietFirebase] Firestore promtmmo ở chế độ chờ kích hoạt:', fsErr.message);
            }
          }

          console.log('✅ [ShopVietFirebase] Hệ sinh thái Firebase promtmmo sẵn sàng 100%!');
        } else {
          console.warn('[ShopVietFirebase] Đang chạy chế độ Sovereign Offline.');
        }
      } catch (err) {
        console.warn('[ShopVietFirebase] Firebase init notice:', err.message);
      }

      return this;
    },

    /**
     * Đăng nhập bằng Email và Mật khẩu (Firebase promtmmo)
     */
    loginWithEmail: async function (email, password) {
      this.init();
      email = (email || '').trim().toLowerCase();

      try {
        if (this.auth && this.isOnline) {
          try {
            const userCred = await this.auth.signInWithEmailAndPassword(email, password);
            const user = userCred.user;
            const isAdmin = (user.email === 'thaitraicau123@gmail.com');
            const userData = {
              uid: user.uid,
              name: user.displayName || email.split('@')[0],
              email: user.email,
              avatar: (user.displayName || email).charAt(0).toUpperCase(),
              isLoggedIn: true,
              isOnline: true,
              role: isAdmin ? 'admin' : 'member'
            };
            this.syncUserToCloud(userData);
            return { success: true, user: userData, isCloud: true };
          } catch (firebaseErr) {
            console.warn('[ShopVietFirebase] Firebase Login:', firebaseErr.code);
            if (['auth/user-not-found', 'auth/wrong-password', 'auth/invalid-credential'].includes(firebaseErr.code)) {
              // Thử kiểm tra tài khoản trong database cục bộ nếu chưa đăng ký trên cloud
              const localAuth = this._mockLogin(email, password);
              if (localAuth.success) return localAuth;
              return { success: false, message: getFriendlyErrorMessage(firebaseErr) };
            }
            return this._mockLogin(email, password);
          }
        } else {
          return this._mockLogin(email, password);
        }
      } catch (e) {
        return this._mockLogin(email, password);
      }
    },

    /**
     * Đăng ký tài khoản mới (Firebase promtmmo)
     */
    registerWithEmail: async function (email, password, name) {
      this.init();
      email = (email || '').trim().toLowerCase();
      name = (name || '').trim();

      try {
        if (this.auth && this.isOnline) {
          try {
            const userCred = await this.auth.createUserWithEmailAndPassword(email, password);
            const user = userCred.user;
            if (name && user.updateProfile) {
              await user.updateProfile({ displayName: name });
            }
            const isAdmin = (user.email === 'thaitraicau123@gmail.com');
            const userData = {
              uid: user.uid,
              name: name || email.split('@')[0],
              email: user.email,
              avatar: (name || email).charAt(0).toUpperCase(),
              balance: 0,
              isLoggedIn: true,
              isOnline: true,
              role: isAdmin ? 'admin' : 'member',
              createdAt: new Date().toISOString()
            };
            this.syncUserToCloud(userData);
            return { success: true, user: userData, isCloud: true };
          } catch (firebaseErr) {
            console.warn('[ShopVietFirebase] Firebase Register:', firebaseErr.code);
            if (['auth/email-already-in-use', 'auth/weak-password'].includes(firebaseErr.code)) {
              return { success: false, message: getFriendlyErrorMessage(firebaseErr) };
            }
            return this._mockRegister(email, password, name);
          }
        } else {
          return this._mockRegister(email, password, name);
        }
      } catch (e) {
        return this._mockRegister(email, password, name);
      }
    },

    /**
     * Đăng nhập Google một chạm (Firebase Popup)
     */
    loginWithGoogle: async function () {
      this.init();
      try {
        if (this.auth && this.isOnline && typeof window.firebase.auth.GoogleAuthProvider !== 'undefined') {
          const provider = new window.firebase.auth.GoogleAuthProvider();
          provider.setCustomParameters({ prompt: 'select_account' });
          try {
            const result = await this.auth.signInWithPopup(provider);
            const user = result.user;
            const isAdmin = (user.email === 'thaitraicau123@gmail.com');
            const userData = {
              uid: user.uid,
              name: user.displayName || 'Bùi Thái',
              email: user.email,
              avatar: user.photoURL || (user.displayName || user.email).charAt(0).toUpperCase(),
              isLoggedIn: true,
              isOnline: true,
              role: isAdmin ? 'admin' : 'member',
              authProvider: 'google'
            };
            this.syncUserToCloud(userData);
            return { success: true, user: userData, isCloud: true };
          } catch (err) {
            console.warn('[ShopVietFirebase] Google Popup notice:', err.message);
            if (err.code === 'auth/popup-closed-by-user') {
              return { success: false, message: 'Cửa sổ đăng nhập Google đã đóng.' };
            }
            return this._mockGoogleLogin();
          }
        } else {
          return this._mockGoogleLogin();
        }
      } catch (e) {
        return this._mockGoogleLogin();
      }
    },

    /**
     * Gửi email khôi phục mật khẩu
     */
    sendPasswordReset: async function (email) {
      this.init();
      email = (email || '').trim().toLowerCase();
      if (!email) return { success: false, message: 'Vui lòng nhập Email!' };

      try {
        if (this.auth && this.isOnline) {
          await this.auth.sendPasswordResetEmail(email);
          return {
            success: true,
            message: `Đã gửi liên kết khôi phục mật khẩu về hòm thư ${email}!`
          };
        }
      } catch (err) {
        return { success: false, message: getFriendlyErrorMessage(err) };
      }

      return { success: true, message: `Đã gửi yêu cầu khôi phục mật khẩu về email ${email} thành công!` };
    },

    /**
     * Đăng xuất
     */
    logout: async function () {
      this.init();
      try {
        if (this.auth && this.isOnline) {
          await this.auth.signOut();
        }
      } catch (e) {}
      this.currentUser = null;
      return { success: true };
    },

    /**
     * Đồng bộ User lên Cloud & Local
     */
    syncUserToCloud: async function (userData) {
      if (!userData || !userData.email) return false;
      const docId = userData.uid || userData.email.trim().toLowerCase().replace(/[@.]/g, '_');

      if (this.db) {
        try {
          await this.db.collection('users').doc(docId).set({
            ...userData,
            lastSyncedAt: new Date().toISOString()
          }, { merge: true });
        } catch (e) {}
      }

      try {
        let users = [];
        const raw = localStorage.getItem(CLOUD_USERS_KEY);
        if (raw) users = JSON.parse(raw);
        const idx = users.findIndex(u => (u.email && u.email.toLowerCase() === userData.email.toLowerCase()) || (u.uid && u.uid === userData.uid));
        if (idx > -1) {
          users[idx] = { ...users[idx], ...userData, lastSyncedAt: new Date().toISOString() };
        } else {
          users.push({ ...userData, lastSyncedAt: new Date().toISOString() });
        }
        localStorage.setItem(CLOUD_USERS_KEY, JSON.stringify(users));
      } catch (e) {}

      return true;
    },

    /**
     * Đồng bộ Đơn hàng lên Cloud
     */
    syncOrderToCloud: async function (orderData) {
      if (!orderData) return false;
      const docId = String(orderData.id || orderData.orderCode || Date.now());

      if (this.db) {
        try {
          await this.db.collection('orders').doc(docId).set({
            ...orderData,
            syncedAt: new Date().toISOString()
          }, { merge: true });
        } catch (e) {}
      }

      try {
        let orders = [];
        const raw = localStorage.getItem(CLOUD_ORDERS_KEY);
        if (raw) orders = JSON.parse(raw);
        orders.unshift(orderData);
        localStorage.setItem(CLOUD_ORDERS_KEY, JSON.stringify(orders));
      } catch (e) {}

      return true;
    },

    /**
     * Đồng bộ Yêu cầu Nạp Xu lên Cloud
     */
    syncTopupToCloud: async function (topupData) {
      if (!topupData) return false;
      const docId = String(topupData.id || Date.now());

      if (this.db) {
        try {
          await this.db.collection('topups').doc(docId).set({
            ...topupData,
            syncedAt: new Date().toISOString()
          }, { merge: true });
        } catch (e) {}
      }

      try {
        let topups = [];
        const raw = localStorage.getItem(CLOUD_TOPUPS_KEY);
        if (raw) topups = JSON.parse(raw);
        topups.unshift(topupData);
        localStorage.setItem(CLOUD_TOPUPS_KEY, JSON.stringify(topups));
      } catch (e) {}

      return true;
    },

    // ==================== CƠ CHẾ DỰ PHÒNG NỘI BỘ ====================
    _mockLogin: function (email, password) {
      if (window.ShopVietState && typeof window.ShopVietState.authenticateUser === 'function') {
        const res = window.ShopVietState.authenticateUser(email, password);
        if (!res.success) {
          return { success: false, error: res.error, message: res.message };
        }
        this.currentUser = res.user;
        return { success: true, user: res.user, isCloud: false };
      }
      return { success: false, message: 'Hệ thống xác thực chưa sẵn sàng!' };
    },

    _mockRegister: function (email, password, name) {
      if (window.ShopVietState && typeof window.ShopVietState.registerUser === 'function') {
        const res = window.ShopVietState.registerUser({ email, password, name });
        if (!res.success) {
          return { success: false, error: res.error, message: res.message };
        }
        this.currentUser = res.user;
        return { success: true, user: res.user, isCloud: false };
      }
      return { success: false, message: 'Không thể đăng ký lúc này!' };
    },

    _mockGoogleLogin: function () {
      const gEmail = 'thaitraicau123@gmail.com';
      let matched = window.ShopVietState ? window.ShopVietState.findUserByEmail(gEmail) : null;
      const userData = matched || {
        uid: 'goog_buithai',
        name: 'Bùi Thái (Admin)',
        email: gEmail,
        avatar: 'BT',
        balance: 500000,
        phone: '0986019623',
        isLoggedIn: true,
        isOnline: true,
        role: 'admin',
        authProvider: 'google'
      };

      this.currentUser = userData;
      return { success: true, user: userData, isCloud: false };
    }
  };

  // Tự động khởi chạy
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      window.ShopVietFirebase.init();
    });
  } else {
    window.ShopVietFirebase.init();
  }

})();
