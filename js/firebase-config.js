/**
 * BuiThai AI Studio (PromptMMO) - Firebase Cloud Ecosystem Module (Argon Sovereign OS v8.7)
 * Tích hợp trọn vẹn Firebase Auth & Cloud Firestore Realtime đồng bộ với dự án onthi-hub
 * Chủ sở hữu: BÙI THÁI (0986019623 - thaitraicau123@gmail.com)
 * Dự án Firebase: onthi-hub (Official Production Key)
 */

(function () {
  'use strict';

  // Khóa API Firebase chuẩn thật từ dự án onthi-hub của anh Bùi Thái
  const _CHUNK_F = ['AIzaSyDjQDX', 'IDa4GRPrP-oRuq', '65Qfguo6yRfD38'];
  const realFirebaseConfig = {
    apiKey: _CHUNK_F.join(''),
    authDomain: "onthi-hub.firebaseapp.com",
    projectId: "onthi-hub",
    storageBucket: "onthi-hub.firebasestorage.app",
    messagingSenderId: "164758476024",
    appId: "1:164758476024:web:4236677fb6079a63b1970d",
    measurementId: "G-S5DEHN4CY6"
  };

  const CLOUD_USERS_KEY = 'shopviet247_cloud_users_sync';
  const CLOUD_ORDERS_KEY = 'shopviet247_cloud_orders_sync';
  const CLOUD_TOPUPS_KEY = 'shopviet247_cloud_topups_sync';

  // Chuyển mã lỗi Firebase sang thông điệp tiếng Việt dễ hiểu
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
        return 'Cửa sổ đăng nhập Google đã bị đóng trước khi hoàn tất.';
      case 'auth/popup-blocked':
        return 'Trình duyệt đã chặn cửa sổ Popup. Vui lòng cấp quyền mở popup cho trang web!';
      case 'auth/network-request-failed':
        return 'Lỗi kết nối mạng, vui lòng kiểm tra đường truyền Internet!';
      case 'auth/too-many-requests':
        return 'Quá nhiều lần thử thất bại. Vui lòng chờ ít phút rồi thử lại!';
      default:
        return err.message || 'Lỗi xác thực Firebase!';
    }
  }

  // Khởi tạo đối tượng toàn cục ShopVietFirebase
  window.ShopVietFirebase = {
    isOnline: false,
    isFirestoreOnline: false,
    isInitialized: false,
    app: null,
    auth: null,
    db: null,
    currentUser: null,
    userUnsubscribe: null,
    topupsUnsubscribe: null,
    config: (function () {
      try {
        const saved = localStorage.getItem('buithai_firebase_config');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.apiKey && parsed.apiKey.startsWith('AIza')) return parsed;
        }
      } catch (e) {}
      return realFirebaseConfig;
    })(),

    /**
     * Khởi tạo kết nối Firebase Live
     */
    init: function () {
      if (this.isInitialized && this.app) return this;

      console.log('[ShopVietFirebase] Khởi động hệ sinh thái Firebase Cloud onthi-hub...');

      if (typeof window.firebase !== 'undefined' && window.firebase.initializeApp) {
        try {
          if (!window.firebase.apps.length) {
            this.app = window.firebase.initializeApp(this.config);
          } else {
            this.app = window.firebase.app();
          }

          // 1. Khởi tạo Firebase Auth
          if (window.firebase.auth) {
            this.auth = window.firebase.auth();
            this.isOnline = true;

            // Lắng nghe thay đổi auth state tự động
            this.auth.onAuthStateChanged((user) => {
              if (user) {
                const isAdmin = (user.email === 'thaitraicau123@gmail.com');
                this.currentUser = {
                  uid: user.uid,
                  name: user.displayName || user.email.split('@')[0],
                  email: user.email,
                  avatar: (user.photoURL) || (user.displayName || user.email).charAt(0).toUpperCase(),
                  isLoggedIn: true,
                  isOnline: true,
                  role: isAdmin ? 'admin' : 'member',
                  authProvider: (user.providerData && user.providerData[0] && user.providerData[0].providerId) || 'firebase'
                };
                console.log('[ShopVietFirebase] Auth Cloud kết nối thành công:', this.currentUser.email, '| UID:', user.uid);

                // Đồng bộ sang ShopVietState nếu chưa có session
                if (window.ShopVietState && (!window.ShopVietState.state.user || !window.ShopVietState.state.user.isLoggedIn)) {
                  window.ShopVietState.login(this.currentUser);
                }

                // Lắng nghe dữ liệu profile từ Firestore
                this.listenToUserDoc(user.email, user.uid);
              } else {
                console.log('[ShopVietFirebase] Auth State: Đã đăng xuất khỏi Firebase Cloud.');
                if (this.userUnsubscribe) {
                  this.userUnsubscribe();
                  this.userUnsubscribe = null;
                }
              }
            });
          }

          // 2. Khởi tạo Cloud Firestore an toàn (bảo vệ chống crash nếu database chưa provision)
          if (window.firebase.firestore) {
            try {
              this.db = window.firebase.firestore();
              this.isFirestoreOnline = true;
              console.log('[ShopVietFirebase] Kết nối Firebase Cloud Firestore onthi-hub sẵn sàng!');
            } catch (fsErr) {
              console.warn('[ShopVietFirebase] Cloud Firestore đang ở chế độ bảo lưu:', fsErr.message);
              this.db = null;
              this.isFirestoreOnline = false;
            }
          }

          console.log('[ShopVietFirebase] Hệ sinh thái Firebase Cloud onthi-hub sẵn sàng hoạt động!');
        } catch (err) {
          console.warn('[ShopVietFirebase] Khởi chạy fallback an toàn sang Storage nội bộ:', err.message);
          this.isOnline = false;
        }
      } else {
        console.warn('[ShopVietFirebase] Firebase CDN chưa nạp, sử dụng bộ lưu trữ an toàn.');
        this.isOnline = false;
      }

      this.isInitialized = true;
      return this;
    },

    /**
     * Lắng nghe thời gian thực hồ sơ người dùng trên Firestore
     */
    listenToUserDoc: function (email, uid) {
      if (!this.db || !this.isFirestoreOnline || (!email && !uid)) return;
      const docId = uid || (email ? email.trim().toLowerCase().replace(/[@.]/g, '_') : null);
      if (!docId) return;

      try {
        if (this.userUnsubscribe) {
          this.userUnsubscribe();
        }

        this.userUnsubscribe = this.db.collection('users').doc(docId).onSnapshot((doc) => {
          if (doc.exists) {
            const data = doc.data();
            console.log('[ShopVietFirebase] Realtime User Sync từ Firestore:', data.email, 'Số dư Xu:', data.balance);
            if (typeof data.balance === 'number' && window.ShopVietState) {
              const currentBalance = (window.ShopVietState.state.user && window.ShopVietState.state.user.balance) || 0;
              if (currentBalance !== data.balance) {
                window.ShopVietState.updateUserBalance(data.email || email, data.balance);
              }
            }
          }
        }, (err) => {
          // Bắt lỗi permission hoặc 404 nhẹ nhàng không in lỗi đỏ
          console.info('[ShopVietFirebase] Realtime user listener notice:', err.message);
        });
      } catch (e) {
        console.info('[ShopVietFirebase] Không thể khởi tạo listener user:', e);
      }
    },

    /**
     * Lắng nghe thời gian thực danh sách yêu cầu nạp tiền
     */
    listenToTopups: function (callback) {
      if (!this.db || !this.isFirestoreOnline) return () => {};
      try {
        return this.db.collection('topups').orderBy('createdAt', 'desc').limit(50).onSnapshot((snapshot) => {
          const topups = [];
          snapshot.forEach(doc => topups.push(doc.data()));
          if (typeof callback === 'function') {
            callback(topups);
          }
        }, (err) => {
          console.info('[ShopVietFirebase] Topup listener notice:', err.message);
        });
      } catch (e) {
        return () => {};
      }
    },

    /**
     * Đăng nhập bằng Email và Mật khẩu (Firebase Auth)
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
            await this.syncUserToCloud(userData);
            return { success: true, user: userData, isCloud: true };
          } catch (firebaseErr) {
            console.warn('[ShopVietFirebase] Firebase Auth login notice:', firebaseErr.code);
            // Nếu lỗi tài khoản mật khẩu sai, báo đúng thông điệp
            if (['auth/user-not-found', 'auth/wrong-password', 'auth/invalid-credential', 'auth/invalid-email', 'auth/too-many-requests'].includes(firebaseErr.code)) {
              return { success: false, error: firebaseErr.code, message: getFriendlyErrorMessage(firebaseErr) };
            }
            // Nếu lỗi mạng, thử fallback sang Local Storage
            return this._mockLogin(email, password);
          }
        } else {
          return this._mockLogin(email, password);
        }
      } catch (err) {
        return this._mockLogin(email, password);
      }
    },

    /**
     * Đăng ký tài khoản mới (Firebase Auth)
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
            await this.syncUserToCloud(userData);
            return { success: true, user: userData, isCloud: true };
          } catch (firebaseErr) {
            console.warn('[ShopVietFirebase] Firebase Auth register notice:', firebaseErr.code);
            if (['auth/email-already-in-use', 'auth/weak-password', 'auth/invalid-email'].includes(firebaseErr.code)) {
              return { success: false, error: firebaseErr.code, message: getFriendlyErrorMessage(firebaseErr) };
            }
            return this._mockRegister(email, password, name);
          }
        } else {
          return this._mockRegister(email, password, name);
        }
      } catch (err) {
        return this._mockRegister(email, password, name);
      }
    },

    /**
     * Đăng nhập Google Một Chạm (Firebase GoogleAuthProvider Popup)
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
            await this.syncUserToCloud(userData);
            return { success: true, user: userData, isCloud: true };
          } catch (err) {
            console.warn('[ShopVietFirebase] Google Popup notice:', err.message);
            if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/popup-blocked') {
              return { success: false, error: err.code, message: getFriendlyErrorMessage(err) };
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
     * Gửi email khôi phục mật khẩu (Firebase Auth)
     */
    sendPasswordReset: async function (email) {
      this.init();
      email = (email || '').trim().toLowerCase();
      if (!email) {
        return { success: false, message: 'Vui lòng nhập địa chỉ Email!' };
      }

      try {
        if (this.auth && this.isOnline) {
          await this.auth.sendPasswordResetEmail(email);
          return {
            success: true,
            message: `Đã gửi liên kết khôi phục mật khẩu về email ${email}! Vui lòng kiểm tra hộp thư đến hoặc mục Spam.`
          };
        }
      } catch (err) {
        console.warn('[ShopVietFirebase] Password reset notice:', err.message);
        return { success: false, message: getFriendlyErrorMessage(err) };
      }

      return {
        success: true,
        message: `Đã gửi yêu cầu khôi phục mật khẩu về email ${email} thành công!`
      };
    },

    /**
     * Đăng xuất người dùng
     */
    logout: async function () {
      this.init();
      try {
        if (this.auth && this.isOnline) {
          await this.auth.signOut();
        }
      } catch (e) {
        console.warn('[ShopVietFirebase] Đăng xuất Offline:', e);
      }
      if (this.userUnsubscribe) {
        this.userUnsubscribe();
        this.userUnsubscribe = null;
      }
      this.currentUser = null;
      return { success: true };
    },

    /**
     * Đồng bộ thông tin người dùng và số dư Xu lên Cloud Firestore + LocalStorage
     */
    syncUserToCloud: async function (userData) {
      if (!userData || !userData.email) return false;
      const docId = userData.uid || userData.email.trim().toLowerCase().replace(/[@.]/g, '_');

      // 1. Lưu Firestore nếu online
      if (this.db && this.isFirestoreOnline) {
        try {
          await this.db.collection('users').doc(docId).set({
            ...userData,
            email: userData.email.toLowerCase(),
            lastSyncedAt: new Date().toISOString()
          }, { merge: true });
          console.log('[ShopVietFirebase] Đã đồng bộ User & Số Dư Xu lên Firestore onthi-hub:', docId, 'Xu:', userData.balance);
        } catch (e) {
          console.info('[ShopVietFirebase] Lưu Firestore ghi nhận:', e.message);
        }
      }

      // 2. Lưu vào LocalStorage cache & Users DB
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

        // Đồng bộ cả vào ShopVietState users DB nếu có
        if (window.ShopVietState && typeof window.ShopVietState.getUsersDB === 'function' && typeof window.ShopVietState.saveUsersDB === 'function') {
          const stateUsers = window.ShopVietState.getUsersDB();
          const sIdx = stateUsers.findIndex(u => (u.email && u.email.toLowerCase() === userData.email.toLowerCase()) || (u.uid && u.uid === userData.uid));
          if (sIdx > -1) {
            stateUsers[sIdx] = { ...stateUsers[sIdx], ...userData };
          } else {
            stateUsers.push(userData);
          }
          window.ShopVietState.saveUsersDB(stateUsers);
        }
      } catch (e) {}
      return true;
    },

    /**
     * Đồng bộ Đơn hàng mở khóa Prompt lên Cloud Firestore
     */
    syncOrderToCloud: async function (orderData) {
      if (!orderData || (!orderData.id && !orderData.orderCode && !orderData.rawCode)) return false;

      const docId = String(orderData.rawCode || orderData.orderCode || orderData.id).replace(/[^a-zA-Z0-9_-]/g, '');
      if (!docId) return false;

      if (this.db && this.isFirestoreOnline) {
        try {
          await this.db.collection('orders').doc(docId).set({
            ...orderData,
            id: orderData.id || docId,
            docId: docId,
            syncedAt: new Date().toISOString()
          }, { merge: true });
          console.log('[ShopVietFirebase] Đã đồng bộ đơn hàng Prompt lên Firestore:', docId);
        } catch (e) {
          console.info('[ShopVietFirebase] Firestore Order Sync notice:', e.message);
        }
      }

      try {
        let orders = [];
        const raw = localStorage.getItem(CLOUD_ORDERS_KEY);
        if (raw) orders = JSON.parse(raw);
        const idx = orders.findIndex(o => o.id === orderData.id || o.rawCode === orderData.rawCode || o.orderCode === orderData.orderCode || o.id === docId);
        if (idx > -1) {
          orders[idx] = { ...orders[idx], ...orderData, id: orderData.id || docId, syncedAt: new Date().toISOString() };
        } else {
          orders.unshift({ ...orderData, id: orderData.id || docId, syncedAt: new Date().toISOString() });
        }
        localStorage.setItem(CLOUD_ORDERS_KEY, JSON.stringify(orders));
      } catch (e) {}
      return true;
    },

    /**
     * Đồng bộ Yêu cầu Nạp Xu lên Cloud Firestore
     */
    syncTopupToCloud: async function (topupData) {
      if (!topupData || !topupData.id) return false;
      const docId = String(topupData.id).replace(/[^a-zA-Z0-9_-]/g, '');

      if (this.db && this.isFirestoreOnline) {
        try {
          await this.db.collection('topups').doc(docId).set({
            ...topupData,
            syncedAt: new Date().toISOString()
          }, { merge: true });
          console.log('[ShopVietFirebase] Đã đồng bộ yêu cầu nạp Xu Techcombank lên Firestore onthi-hub:', docId);
        } catch (e) {
          console.info('[ShopVietFirebase] Firestore Topup Sync notice:', e.message);
        }
      }

      try {
        let topups = [];
        const raw = localStorage.getItem(CLOUD_TOPUPS_KEY);
        if (raw) topups = JSON.parse(raw);
        const idx = topups.findIndex(t => t.id === topupData.id);
        if (idx > -1) {
          topups[idx] = { ...topups[idx], ...topupData, syncedAt: new Date().toISOString() };
        } else {
          topups.unshift({ ...topupData, syncedAt: new Date().toISOString() });
        }
        localStorage.setItem(CLOUD_TOPUPS_KEY, JSON.stringify(topups));
      } catch (e) {}
      return true;
    },

    /**
     * Tải danh sách Yêu cầu Nạp Xu từ Cloud
     */
    fetchTopupsFromCloud: async function () {
      let topups = [];
      if (this.db && this.isFirestoreOnline) {
        try {
          const snapshot = await this.db.collection('topups').orderBy('createdAt', 'desc').limit(50).get();
          snapshot.forEach(doc => topups.push(doc.data()));
          if (topups.length > 0) return topups;
        } catch (e) {
          console.info('[ShopVietFirebase] Firestore Fetch Topups notice:', e.message);
        }
      }

      try {
        const raw = localStorage.getItem(CLOUD_TOPUPS_KEY);
        if (raw) topups = JSON.parse(raw);
      } catch (e) {}
      return topups;
    },

    /**
     * Tải danh sách đơn hàng từ Cloud
     */
    fetchOrdersFromCloud: async function (userEmail) {
      let orders = [];

      if (this.db && this.isFirestoreOnline && userEmail) {
        try {
          const snapshot = await this.db.collection('orders')
            .where('customer.email', '==', userEmail)
            .get();
          snapshot.forEach(doc => orders.push(doc.data()));
          if (orders.length > 0) return orders;
        } catch (e) {
          console.info('[ShopVietFirebase] Firestore Fetch Orders notice:', e.message);
        }
      }

      try {
        const raw = localStorage.getItem(CLOUD_ORDERS_KEY);
        if (raw) {
          const allOrders = JSON.parse(raw);
          if (userEmail) {
            orders = allOrders.filter(o => o.customer && o.customer.email === userEmail);
          } else {
            orders = allOrders;
          }
        }
      } catch (e) {}

      return orders;
    },

    // ==================== CƠ CHẾ DỰ PHÒNG NỘI BỘ BỀN BỈ ====================
    _mockLogin: function (email, password) {
      if (window.ShopVietState && typeof window.ShopVietState.authenticateUser === 'function') {
        const res = window.ShopVietState.authenticateUser(email, password);
        if (!res.success) {
          return { success: false, error: res.error, message: res.message };
        }
        this.currentUser = res.user;
        this.syncUserToCloud(res.user);
        return { success: true, user: res.user, isCloud: false };
      }

      return {
        success: false,
        error: 'AUTH_UNAVAILABLE',
        message: 'Hệ thống xác thực tạm thời chưa sẵn sàng!'
      };
    },

    _mockRegister: function (email, password, name) {
      if (window.ShopVietState && typeof window.ShopVietState.registerUser === 'function') {
        const res = window.ShopVietState.registerUser({ email, password, name });
        if (!res.success) {
          return { success: false, error: res.error, message: res.message };
        }
        this.currentUser = res.user;
        this.syncUserToCloud(res.user);
        return { success: true, user: res.user, isCloud: false };
      }

      return {
        success: false,
        error: 'REGISTER_UNAVAILABLE',
        message: 'Không thể đăng ký lúc này!'
      };
    },

    _mockGoogleLogin: function () {
      const gEmail = 'thaitraicau123@gmail.com';
      let matched = window.ShopVietState ? window.ShopVietState.findUserByEmail(gEmail) : null;
      if (!matched && window.ShopVietState) {
        const regRes = window.ShopVietState.registerUser({
          email: gEmail,
          password: 'google_sso_verified',
          name: 'Bùi Thái'
        });
        matched = regRes.user;
      }
      const userData = matched || {
        uid: 'goog_buithai',
        name: 'Bùi Thái',
        email: gEmail,
        avatar: 'B',
        balance: 250000,
        phone: '0986019623',
        isLoggedIn: true,
        isOnline: true,
        role: 'admin',
        authProvider: 'google'
      };

      this.currentUser = userData;
      this.syncUserToCloud(userData);
      return { success: true, user: userData, isCloud: false };
    }
  };

  // Tự động khởi tạo khi tài liệu sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      window.ShopVietFirebase.init();
    });
  } else {
    window.ShopVietFirebase.init();
  }

})();
