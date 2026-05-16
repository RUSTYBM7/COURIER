/**
 * AIRPAK EXPRESS NOVA — iOS 26 JavaScript Engine
 * Theme Engine, Language/i18n, Chat Widget, Utilities
 */

'use strict';

/* ============================================================
   CONFIG & STATE
   ============================================================ */

const CONFIG = {
  brand: {
    name: 'Airpak Express',
    tagline: 'Logistics Reimagined',
    logo: 'logo.svg'
  },
  languages: {
    en: { code: 'en', label: 'English', flag: 'EN', dir: 'ltr' },
    zh: { code: 'zh', label: '中文', flag: 'ZH', dir: 'ltr' },
    ms: { code: 'ms', label: 'Bahasa', flag: 'MY', dir: 'ltr' },
    ar: { code: 'ar', label: 'العربية', flag: 'AR', dir: 'rtl' }
  },
  translations: {},
  theme: 'system', // 'light' | 'dark' | 'system'
  currentLang: 'en',
  chatWidget: {
    position: { bottom: '32px', right: '32px' },
    size: { width: 400, height: 560 },
    trigger: { size: 64 }
  }
};

/* ============================================================
   THEME ENGINE
   ============================================================ */

const ThemeEngine = {
  STORAGE_KEY: 'airpak-theme',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.theme = saved || 'system';
    this.apply(this.theme, preferred);
    this.listen();
  },

  set(theme) {
    this.theme = theme;
    localStorage.setItem(this.STORAGE_KEY, theme);
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.apply(theme, preferred);
    this.updateToggleBtn();
  },

  apply(theme, osPreference) {
    const resolved = theme === 'system' ? osPreference : theme;
    document.documentElement.setAttribute('data-theme', resolved);
    document.body.setAttribute('data-theme', resolved);

    // Update all themed elements
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(btn => {
      btn.setAttribute('data-current', resolved);
    });
  },

  listen() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.theme === 'system') {
        this.apply('system', e.matches ? 'dark' : 'light');
      }
    });
  },

  updateToggleBtn() {
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(btn => {
      const current = document.documentElement.getAttribute('data-theme');
      btn.innerHTML = current === 'dark'
        ? '<span class="icon-sun"><i data-lucide="sun"></i></span>'
        : '<span class="icon-moon"><i data-lucide="moon"></i></span>';
    });
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.set(current === 'dark' ? 'light' : 'dark');
  }
};

/* ============================================================
   LANGUAGE / i18n ENGINE
   ============================================================ */

const i18n = {
  init(lang) {
    this.loadTranslations();
    this.setLang(lang || localStorage.getItem('airpak-lang') || 'en');
  },

  loadTranslations() {
    CONFIG.translations = {
      en: {
        nav: {
          home: 'Home', services: 'Services', tracking: 'Tracking',
          pricing: 'Pricing', faq: 'FAQ', contact: 'Contact',
          signin: 'Sign In', getStarted: 'Get Started'
        },
        hero: {
          badge: 'New: AI-Powered Logistics',
          title: 'Global Logistics,\nSeamless Delivery',
          subtitle: 'From Wales to the world — we handle your packages with precision, speed, and care. Real-time tracking, instant quotes, and 24/7 support.',
          cta: 'Get a Quote', cta2: 'Track Package',
          stats: [
            { value: '2M+', label: 'Packages Delivered' },
            { value: '190+', label: 'Countries Served' },
            { value: '99.8%', label: 'On-Time Rate' },
            { value: '24/7', label: 'Support Available' }
          ]
        },
        features: {
          badge: 'Why Choose Us',
          title: 'Everything You Need,\nNothing You Don\'t',
          subtitle: 'We built Airpak Express for businesses and individuals who demand more from their logistics partner.',
          items: [
            { icon: 'truck', title: 'Real-Time Tracking', desc: 'Monitor every package from pickup to delivery with our advanced GPS system.' },
            { icon: 'zap', title: 'Express Delivery', desc: 'Same-day and next-day delivery options across our global network.' },
            { icon: 'shield', title: 'Secure Handling', desc: 'Insurance options and tamper-proof packaging for peace of mind.' },
            { icon: 'globe', title: 'Global Reach', desc: 'Coverage in 190+ countries with local expertise in every region.' },
            { icon: 'smartphone', title: 'Mobile App', desc: 'Manage shipments, track packages, and get notifications on the go.' },
            { icon: 'message-circle', title: '24/7 Support', desc: 'Our multilingual team is available around the clock to help you.' }
          ]
        },
        services: {
          badge: 'Our Services',
          title: 'Solutions for Every Need',
          subtitle: 'Whether you\'re shipping a startup MVP or enterprise freight, we have you covered.',
          items: [
            { icon: 'box', title: 'Package Delivery', desc: 'Small to medium parcels with real-time tracking', price: 'From £4.99' },
            { icon: 'rocket', title: 'Express Shipping', desc: 'Priority handling with 24-48h delivery', price: 'From £12.99' },
            { icon: 'building', title: 'Business Solutions', desc: 'Volume rates and dedicated account management', price: 'Custom' },
            { icon: 'globe', title: 'International', desc: 'Worldwide coverage with customs clearance', price: 'From £8.99' }
          ]
        },
        cta: {
          title: 'Ready to Ship?',
          desc: 'Join 50,000+ businesses who trust Airpak Express for their logistics needs.',
          btn: 'Get Started Free', btn2: 'Contact Sales'
        },
        footer: {
          tagline: 'Global logistics, reimagined. From Wales to the world.',
          sections: {
            company: { title: 'Company', links: ['About', 'Careers', 'Press', 'Blog'] },
            services: { title: 'Services', links: ['Package Delivery', 'Express Shipping', 'Business Solutions', 'International'] },
            support: { title: 'Support', links: ['Help Center', 'Contact Us', 'FAQs', 'Tracking'] }
          },
          rights: '© 2026 Airpak Express. All rights reserved.',
          legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy']
        },
        tracking: {
          placeholder: 'Enter tracking number',
          btn: 'Track',
          address: 'Unit 7, Wales International Hub, Cardiff Bay, Wales CF10 5AL, United Kingdom',
          steps: ['Order Placed', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered']
        },
        common: {
          loading: 'Loading...',
          error: 'Something went wrong',
          success: 'Success!',
          cancel: 'Cancel',
          confirm: 'Confirm',
          save: 'Save',
          close: 'Close',
          next: 'Next',
          back: 'Back',
          search: 'Search...',
          noResults: 'No results found'
        },
        chat: {
          title: 'Airpak Assistant',
          online: 'Online • Ready to help',
          placeholder: 'Type a message...',
          quickActions: ['Track a package', 'Get a quote', 'File a claim', 'Contact support'],
          welcome: 'Hi there! How can I help you today?'
        },
        auth: {
          signinTitle: 'Welcome Back',
          signinSubtitle: 'Sign in to manage your shipments',
          signupTitle: 'Create Account',
          signupSubtitle: 'Join 50,000+ businesses shipping with Airpak',
          email: 'Email address',
          password: 'Password',
          forgot: 'Forgot password?',
          submit: 'Sign In',
          submitSignup: 'Create Account',
          divider: 'or continue with',
          noAccount: "Don't have an account?",
          hasAccount: 'Already have an account?',
          signupLink: 'Sign up',
          signinLink: 'Sign in'
        },
        settings: {
          profile: { title: 'Profile', name: 'Name', email: 'Email', phone: 'Phone', avatar: 'Avatar' },
          notifications: { title: 'Notifications', email: 'Email notifications', push: 'Push notifications', sms: 'SMS updates' },
          privacy: { title: 'Privacy & Security', twofactor: 'Two-factor authentication', sessions: 'Active sessions', password: 'Change password' },
          appearance: { title: 'Appearance', theme: 'Theme', themeLight: 'Light', themeDark: 'Dark', themeSystem: 'System' },
          language: { title: 'Language & Region', language: 'Language', region: 'Region', currency: 'Currency' }
        },
        dashboard: {
          welcome: 'Welcome back',
          stats: {
            packages: 'Total Packages',
            delivered: 'Delivered',
            inTransit: 'In Transit',
            revenue: 'Revenue'
          },
          tabs: ['All', 'In Transit', 'Delivered', 'Pending']
        },
        admin: {
          title: 'Admin Panel',
          subtitle: 'User management and analytics',
          stats: {
            users: 'Total Users',
            active: 'Active Today',
            new: 'New This Week',
            admins: 'Administrators'
          },
          table: {
            user: 'User', email: 'Email', role: 'Role', status: 'Status',
            joined: 'Joined', actions: 'Actions'
          }
        }
      },

      zh: {
        nav: {
          home: '首页', services: '服务', tracking: '追踪',
          pricing: '价格', faq: '常见问题', contact: '联系我们',
          signin: '登录', getStarted: '立即开始'
        },
        hero: {
          badge: '新功能：AI驱动物流',
          title: '全球物流，\n无缝配送',
          subtitle: '从威尔士到全世界 — 我们以精准、速度和关怀处理您的包裹。实时追踪、即时报价、24/7客服。',
          cta: '获取报价', cta2: '追踪包裹',
          stats: [
            { value: '2000万+', label: '已配送包裹' },
            { value: '190+', label: '服务国家' },
            { value: '99.8%', label: '准时率' },
            { value: '24/7', label: '全天候支持' }
          ]
        },
        features: {
          badge: '为什么选择我们',
          title: '所需即所得，\n简约不简单',
          subtitle: '我们为追求更高物流体验的企业和个人打造了Airpak Express。',
          items: [
            { icon: 'truck', title: '实时追踪', desc: '通过先进GPS系统监控每个包裹从取件到配送的全过程。' },
            { icon: 'zap', title: '急速配送', desc: '全球网络内的当日达和次日达选项。' },
            { icon: 'shield', title: '安全处理', desc: '保险选项和防篡改包装让您安心。' },
            { icon: 'globe', title: '全球覆盖', desc: '190+国家全覆盖，各地均有本地专业知识。' },
            { icon: 'smartphone', title: '移动应用', desc: '随时管理货件、追踪包裹、接收通知。' },
            { icon: 'message-circle', title: '24/7客服', desc: '多语言团队全天候为您提供帮助。' }
          ]
        },
        services: {
          badge: '我们的服务',
          title: '满足各类需求',
          subtitle: '无论您是运送初创产品还是企业货运，我们都能满足。',
          items: [
            { icon: 'box', title: '包裹配送', desc: '带实时追踪的小型至中型包裹', price: '起价 £4.99' },
            { icon: 'rocket', title: '特快专递', desc: '24-48小时配送的优先处理', price: '起价 £12.99' },
            { icon: 'building', title: '企业方案', desc: '批量优惠和专属客户经理', price: '定制' },
            { icon: 'globe', title: '国际快递', desc: '含清关的全球覆盖', price: '起价 £8.99' }
          ]
        },
        cta: {
          title: '准备发货了吗？',
          desc: '加入50,000+信任Airpak Express物流服务的企业。',
          btn: '免费开始', btn2: '联系销售'
        },
        footer: {
          tagline: '全球物流，重新想象。从威尔士到世界。',
          sections: {
            company: { title: '公司', links: ['关于我们', '招聘', '新闻', '博客'] },
            services: { title: '服务', links: ['包裹配送', '特快专递', '企业方案', '国际快递'] },
            support: { title: '支持', links: ['帮助中心', '联系我们', '常见问题', '包裹追踪'] }
          },
          rights: '© 2026 Airpak Express. 保留所有权利。',
          legal: ['隐私政策', '服务条款', 'Cookie政策']
        },
        tracking: {
          placeholder: '输入追踪号',
          btn: '追踪',
          address: '英国威尔士卡迪夫湾威尔士国际中心7号单元 CF10 5AL',
          steps: ['订单已创建', '已取件', '运输中', '派送中', '已签收']
        },
        common: {
          loading: '加载中...',
          error: '出错了',
          success: '成功！',
          cancel: '取消',
          confirm: '确认',
          save: '保存',
          close: '关闭',
          next: '下一步',
          back: '返回',
          search: '搜索...',
          noResults: '未找到结果'
        },
        chat: {
          title: 'Airpak助手',
          online: '在线 • 随时帮您',
          placeholder: '输入消息...',
          quickActions: ['追踪包裹', '获取报价', '提交索赔', '联系客服'],
          welcome: '您好！今天有什么可以帮您的？'
        },
        auth: {
          signinTitle: '欢迎回来',
          signinSubtitle: '登录管理您的货件',
          signupTitle: '创建账户',
          signupSubtitle: '加入50,000+使用Airpak发货的企业',
          email: '电子邮箱',
          password: '密码',
          forgot: '忘记密码？',
          submit: '登录',
          submitSignup: '创建账户',
          divider: '或通过以下方式继续',
          noAccount: '还没有账户？',
          hasAccount: '已有账户？',
          signupLink: '注册',
          signinLink: '登录'
        },
        settings: {
          profile: { title: '个人资料', name: '姓名', email: '邮箱', phone: '电话', avatar: '头像' },
          notifications: { title: '通知', email: '邮件通知', push: '推送通知', sms: '短信更新' },
          privacy: { title: '隐私与安全', twofactor: '双因素认证', sessions: '活跃会话', password: '修改密码' },
          appearance: { title: '外观', theme: '主题', themeLight: '浅色', themeDark: '深色', themeSystem: '跟随系统' },
          language: { title: '语言与地区', language: '语言', region: '地区', currency: '货币' }
        },
        dashboard: {
          welcome: '欢迎回来',
          stats: {
            packages: '总包裹数',
            delivered: '已送达',
            inTransit: '运输中',
            revenue: '收入'
          },
          tabs: ['全部', '运输中', '已送达', '待处理']
        },
        admin: {
          title: '管理面板',
          subtitle: '用户管理与分析',
          stats: {
            users: '总用户数',
            active: '今日活跃',
            new: '本周新增',
            admins: '管理员'
          },
          table: {
            user: '用户', email: '邮箱', role: '角色', status: '状态',
            joined: '注册时间', actions: '操作'
          }
        }
      },

      ms: {
        nav: {
          home: 'Laman Utama', services: 'Perkhidmatan', tracking: 'Pengesanan',
          pricing: 'Harga', faq: 'Soalan Lazim', contact: 'Hubungi Kami',
          signin: 'Log Masuk', getStarted: 'Mula Sekarang'
        },
        hero: {
          badge: 'Baharu: Logistik Berbantukan AI',
          title: 'Logistik Global,\nPenghantaran Tanpa Penantian',
          subtitle: 'Dari Wales ke seluruh dunia — kami mengendalikan pakej anda dengan tepat, laju, dan penuh perhatian. Pengesanan masa nyata, sebut harga segera, dan sokongan 24/7.',
          cta: 'Dapatkan Sebut Harga', cta2: 'Jejak Pakej',
          stats: [
            { value: '2Juta+', label: 'Pakej Dihantar' },
            { value: '190+', label: 'Negara Diliputi' },
            { value: '99.8%', label: 'Kadar Tepat Waktu' },
            { value: '24/7', label: 'Sokongan Available' }
          ]
        },
        features: {
          badge: 'Mengapa Pilih Kami',
          title: 'Semua yang Anda Perlukan,\nTiada yang Tidak Diperlukan',
          subtitle: 'Kami membina Airpak Express untuk perniagaan dan individu yang menuntut lebih daripada rakan kongsi logistik.',
          items: [
            { icon: 'truck', title: 'Pengesanan Masa Nyata', desc: 'Pantau setiap pakej dari pengambilan hingga penghantaran dengan sistem GPS canggih kami.' },
            { icon: 'zap', title: 'Penghantaran Ekspres', desc: 'Pilihan penghantaran hari sama dan hari berikutnya merentasi rangkaian global kami.' },
            { icon: 'shield', title: 'Pengendalian Selamat', desc: 'Pilihan insurans dan pembungkusan kalis gangguan untuk ketenangan fikiran.' },
            { icon: 'globe', title: 'Jangkauan Global', desc: 'Liputan di 190+ negara dengan kepakaran tempatan di setiap kawasan.' },
            { icon: 'smartphone', title: 'Aplikasi Mudah Alih', desc: 'Urus penghantaran, jejak pakej, dan terima pemberitahuan dalam perjalanan.' },
            { icon: 'message-circle', title: 'Sokongan 24/7', desc: 'Pasukan pelbagai bahasa kami sedia membantu pada bila-bila masa.' }
          ]
        },
        services: {
          badge: 'Perkhidmatan Kami',
          title: 'Penyelesaian untuk Setiap Keperluan',
          subtitle: 'Sama ada anda menghantar MVP Permalink atau kargo perusahaan, kami melindungi anda.',
          items: [
            { icon: 'box', title: 'Penghantaran Pakej', desc: 'Pakej kecil hingga sederhana dengan penjejakan masa nyata', price: 'Dari £4.99' },
            { icon: 'rocket', title: 'Penghantaran Ekspres', desc: 'Pengendalian prioriti dengan penghantaran 24-48j', price: 'Dari £12.99' },
            { icon: 'building', title: 'Penyelesaian Perniagaan', desc: 'Kadar volum dan pengurusan akaun khusus', price: 'Custom' },
            { icon: 'globe', title: ' Antarabangsa', desc: 'Liputan global dengan clearance kastam', price: 'Dari £8.99' }
          ]
        },
        cta: {
          title: 'Bersedia untuk Menghantar?',
          desc: ' Sertai 50,000+ perniagaan yang mempercayai Airpak Express untuk keperluan logistik mereka.',
          btn: 'Mula Percuma', btn2: 'Hubungi Sales'
        },
        footer: {
          tagline: 'Logistik global, dibaik hipotesis. Dari Wales ke dunia.',
          sections: {
            company: { title: 'Syarikat', links: ['Tentang', 'Kerjaya', 'Media', 'Blog'] },
            services: { title: 'Perkhidmatan', links: ['Penghantaran Pakej', 'Penghantaran Ekspres', 'Penyelesaian Perniagaan', 'Antarabangsa'] },
            support: { title: ' Sokongan', links: ['Pusat Bantuan', 'Hubungi Kami', 'Soalan Lazim', 'Pengesanan'] }
          },
          rights: '© 2026 Airpak Express. Hak cipta terpelihara.',
          legal: ['Dasar Privasi', 'Syarat Perkhidmatan', 'Dasar Cookie']
        },
        tracking: {
          placeholder: 'Masukkan nombor penjejakan',
          btn: 'Jejak',
          address: 'Unit 7, Wales International Hub, Cardiff Bay, Wales CF10 5AL, United Kingdom',
          steps: ['Pesanan Dibuat', 'Diambil', 'Dalam Transit', 'Dalam Penghantaran', 'Dihantar']
        },
        common: {
          loading: 'Memuatkan...',
          error: 'Sesuatu tidak kena',
          success: 'Berjaya!',
          cancel: 'Batal',
          confirm: 'Sahkan',
          save: 'Simpan',
          close: 'Tutup',
          next: 'Seterusnya',
          back: 'Kembali',
          search: 'Cari...',
          noResults: 'Tiada keputusan'
        },
        chat: {
          title: 'Pembantu Airpak',
          online: 'Online • Sedia membantu',
          placeholder: 'Taip mesej...',
          quickActions: ['Jejak pakej', 'Dapatkan sebut harga', 'Failkan tuntutan', 'Hubungi sokongan'],
          welcome: 'Hai! Bagaimana saya boleh membantu anda hari ini?'
        },
        auth: {
          signinTitle: 'Selamat Kembali',
          signinSubtitle: 'Log masuk untuk urus penghantaran anda',
          signupTitle: 'Cipta Akaun',
          signupSubtitle: ' Sertai 50,000+ perniagaan yang menghantar dengan Airpak',
          email: 'Alamat emel',
          password: 'Kata laluan',
          forgot: 'Lupa kata laluan?',
          submit: 'Log Masuk',
          submitSignup: 'Cipta Akaun',
          divider: 'atau teruskan dengan',
          noAccount: 'Belum ada akaun?',
          hasAccount: 'Sudah ada akaun?',
          signupLink: 'Daftar',
          signinLink: 'Log masuk'
        },
        settings: {
          profile: { title: 'Profil', name: 'Nama', email: 'Emel', phone: 'Telefon', avatar: 'Avatar' },
          notifications: { title: 'Pemberitahuan', email: 'Pemberitahuan emel', push: 'Pemberitahuan push', sms: 'Kemas kini SMS' },
          privacy: { title: 'Privasi & Keselamatan', twofactor: 'Pengesahan dua faktor', sessions: 'Sesi aktif', password: 'Tukar kata laluan' },
          appearance: { title: 'Penampilan', theme: 'Tema', themeLight: 'Cerah', themeDark: 'Gelap', themeSystem: 'Sistem' },
          language: { title: 'Bahasa & Wilayah', language: 'Bahasa', region: 'Wilayah', currency: 'Mata wang' }
        },
        dashboard: {
          welcome: 'Selamat kembali',
          stats: {
            packages: 'Jumlah Pakej',
            delivered: 'Dihantar',
            inTransit: 'Dalam Transit',
            revenue: 'Hasil'
          },
          tabs: ['Semua', 'Dalam Transit', 'Dihantar', 'Terenceg']
        },
        admin: {
          title: 'Panel Admin',
          subtitle: 'Pengurusan pengguna dan analitik',
          stats: {
            users: 'Jumlah Pengguna',
            active: 'Aktif Hari Ini',
            new: 'Baharu Minggu Ini',
            admins: 'Pentadbir'
          },
          table: {
            user: 'Pengguna', email: 'Emel', role: 'Peranan', status: 'Status',
            joined: 'Bergabung', actions: 'Tindakan'
          }
        }
      },

      ar: {
        nav: {
          home: 'الرئيسية', services: 'الخدمات', tracking: 'تتبع',
          pricing: 'الأسعار', faq: 'الأسئلة الشائعة', contact: 'اتصل بنا',
          signin: 'تسجيل الدخول', getStarted: 'ابدأ الآن'
        },
        hero: {
          badge: 'جديد: لوجستيات مدعومة بالذكاء الاصطناعي',
          title: 'لوجستيات عالمية،\nتوصيل سلس',
          subtitle: 'من ويلز إلى العالم — نتعامل مع طرودك بدقة وسرعة وعناية. تتبع في الوقت الحقيقي، عروض أسعار فورية، ودعم على مدار الساعة.',
          cta: 'احصل على عرض سعر', cta2: 'تتبع الطرد',
          stats: [
            { value: '+2 مليون', label: 'طرد تم تسليمه' },
            { value: '+190', label: 'دولة مغطاة' },
            { value: '99.8%', label: 'معدل الالتزام بالمواعيد' },
            { value: '24/7', label: 'دعم متاح' }
          ]
        },
        features: {
          badge: 'لماذا تختارنا',
          title: 'كل ما تحتاجه،\nبدون ما لا تحتاجه',
          subtitle: 'أنشأنا Airpak Express للشركات والأفراد الذين يطلبون المزيد من شريكهم اللوجستي.',
          items: [
            { icon: 'truck', title: 'تتبع في الوقت الحقيقي', desc: 'راقب كل طرد من الاستلام حتى التسليم باستخدام نظام GPS المتقدم.' },
            { icon: 'zap', title: 'توصيل سريع', desc: 'خيارات التسليم في نفس اليوم أو اليوم التالي عبر شبكتنا العالمية.' },
            { icon: 'shield', title: 'مناولة آمنة', desc: 'خيارات التأمين والتغليف المضاد للتلاعب لراحة البال.' },
            { icon: 'globe', title: 'تغطية عالمية', desc: 'تغطية في أكثر من 190 دولة مع خبرة محلية في كل منطقة.' },
            { icon: 'smartphone', title: 'تطبيق جوال', desc: 'إدارة الشحنات وتتبع الطرود والحصول على الإشعارات أثناء التنقل.' },
            { icon: 'message-circle', title: 'دعم على مدار الساعة', desc: 'فريقنا متعدد اللغات متاح في أي وقت لمساعدتك.' }
          ]
        },
        services: {
          badge: 'خدماتنا',
          title: 'حلول لكل احتياج',
          subtitle: 'سواء كنت تشحن منتجًا ناشئًا أو شحنة مؤسسية، نحن نوفر لك.',
          items: [
            { icon: 'box', title: 'توصيل الطرود', desc: 'طرود صغيرة إلى متوسطة مع تتبع في الوقت الحقيقي', price: 'يبدأ من £4.99' },
            { icon: 'rocket', title: 'شحن سريع', desc: 'مناولة ذات أولوية مع تسليم خلال 24-48 ساعة', price: 'يبدأ من £12.99' },
            { icon: 'building', title: 'حلول الأعمال', desc: 'أسعار بالجملة وإدارة حسابات مخصصة', price: 'مخصص' },
            { icon: 'globe', title: 'دولي', desc: 'تغطية عالمية مع التخليص الجمركي', price: 'يبدأ من £8.99' }
          ]
        },
        cta: {
          title: 'مستعد للشحن؟',
          desc: 'انضم إلى أكثر من 50,000 شركة تثق بـ Airpak Express لاحتياجاتها اللوجستية.',
          btn: 'ابدأ مجانًا', btn2: 'تواصل مع المبيعات'
        },
        footer: {
          tagline: 'لوجستيات عالمية، أعيدت تصورها. من ويلز إلى العالم.',
          sections: {
            company: { title: 'الشركة', links: ['عن الشركة', 'الوظائف', 'الصحافة', 'المدونة'] },
            services: { title: 'الخدمات', links: ['توصيل الطرود', 'الشحن السريع', 'حلول الأعمال', 'الدولي'] },
            support: { title: 'الدعم', links: ['مركز المساعدة', 'اتصل بنا', 'الأسئلة الشائعة', 'التتبع'] }
          },
          rights: '© 2026 Airpak Express. جميع الحقوق محفوظة.',
          legal: ['سياسة الخصوصية', 'شروط الخدمة', 'سياسة ملفات تعريف الارتباط']
        },
        tracking: {
          placeholder: 'أدخل رقم التتبع',
          btn: 'تتبع',
          address: 'وحدة 7، مركز ويلز الدولي، خليج كارديف، ويلز CF10 5AL، المملكة المتحدة',
          steps: ['تم إنشاء الطلب', 'تم الاستلام', 'في الطريق', 'قيد التوصيل', 'تم التسليم']
        },
        common: {
          loading: 'جارٍ التحميل...',
          error: 'حدث خطأ ما',
          success: 'نجاح!',
          cancel: 'إلغاء',
          confirm: 'تأكيد',
          save: 'حفظ',
          close: 'إغلاق',
          next: 'التالي',
          back: 'رجوع',
          search: 'بحث...',
          noResults: 'لم يتم العثور على نتائج'
        },
        chat: {
          title: 'مساعد Airpak',
          online: 'متصل • مستعد للمساعدة',
          placeholder: 'اكتب رسالة...',
          quickActions: ['تتبع طرد', 'احصل على عرض سعر', 'تقديم مطالبة', 'تواصل مع الدعم'],
          welcome: 'مرحبًا! كيف يمكنني مساعدتك اليوم؟'
        },
        auth: {
          signinTitle: 'مرحبًا بعودتك',
          signinSubtitle: 'سجل الدخول لإدارة شحناتك',
          signupTitle: 'إنشاء حساب',
          signupSubtitle: 'انضم إلى أكثر من 50,000 شركة تشحن مع Airpak',
          email: 'البريد الإلكتروني',
          password: 'كلمة المرور',
          forgot: 'نسيت كلمة المرور؟',
          submit: 'تسجيل الدخول',
          submitSignup: 'إنشاء حساب',
          divider: 'أو المتابعة بـ',
          noAccount: 'ليس لديك حساب؟',
          hasAccount: 'لديك حساب بالفعل؟',
          signupLink: 'سجل',
          signinLink: 'تسجيل الدخول'
        },
        settings: {
          profile: { title: 'الملف الشخصي', name: 'الاسم', email: 'البريد الإلكتروني', phone: 'الهاتف', avatar: 'الصورة الشخصية' },
          notifications: { title: 'الإشعارات', email: 'إشعارات البريد الإلكتروني', push: 'إشعارات الدفع', sms: 'تحديثات الرسائل النصية' },
          privacy: { title: 'الخصوصية والأمان', twofactor: 'المصادقة بعاملين', sessions: 'الجلسات النشطة', password: 'تغيير كلمة المرور' },
          appearance: { title: 'المظهر', theme: 'السمة', themeLight: 'فاتح', themeDark: 'داكن', themeSystem: 'النظام' },
          language: { title: 'اللغة والمنطقة', language: 'اللغة', region: 'المنطقة', currency: 'العملة' }
        },
        dashboard: {
          welcome: 'مرحبًا بعودتك',
          stats: {
            packages: 'إجمالي الطرود',
            delivered: 'تم التسليم',
            inTransit: 'في الطريق',
            revenue: 'الإيرادات'
          },
          tabs: ['الكل', 'في الطريق', 'تم التسليم', 'معلق']
        },
        admin: {
          title: 'لوحة الإدارة',
          subtitle: 'إدارة المستخدمين والتحليلات',
          stats: {
            users: 'إجمالي المستخدمين',
            active: 'نشطون اليوم',
            new: 'جدد هذا الأسبوع',
            admins: 'المسؤولون'
          },
          table: {
            user: 'المستخدم', email: 'البريد الإلكتروني', role: 'الدور', status: 'الحالة',
            joined: 'تاريخ الانضمام', actions: 'الإجراءات'
          }
        }
      }
    };
  },

  setLang(lang) {
    if (!CONFIG.languages[lang]) lang = 'en';
    CONFIG.currentLang = lang;
    localStorage.setItem('airpak-lang', lang);

    // Set direction for RTL languages
    document.documentElement.setAttribute('dir', CONFIG.languages[lang].dir);
    document.documentElement.setAttribute('lang', lang);

    // Update language pill
    this.updateLangPill();

    // Translate all data-i18n elements
    this.translate();
  },

  t(key) {
    const keys = key.split('.');
    let val = CONFIG.translations[CONFIG.currentLang];
    for (const k of keys) {
      if (val && typeof val === 'object') val = val[k];
      else return key;
    }
    return val || key;
  },

  translate() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.textContent = text;
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      el.innerHTML = this.t(key);
    });
  },

  updateLangPill() {
    const pills = document.querySelectorAll('.lang-pill');
    const lang = CONFIG.currentLang;
    const langConfig = CONFIG.languages[lang];
    pills.forEach(pill => {
      pill.innerHTML = `<span class="flag">${langConfig.flag}</span> ${langConfig.label}`;
    });
  }
};

/* ============================================================
   NAVIGATION
   ============================================================ */

const Navigation = {
  init() {
    this.setupMobileMenu();
    this.setupScrollBehavior();
    this.setupActiveLinks();
  },

  setupMobileMenu() {
    const hamburger = document.querySelector('.nav-hamburger');
    const sidebar = document.querySelector('.sidebar');
    if (!hamburger || !sidebar) return;

    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      const isOpen = sidebar.classList.contains('mobile-open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
      }
    });
  },

  setupScrollBehavior() {
    const nav = document.querySelector('.nav-bar');
    if (!nav) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const current = window.scrollY;
      if (current > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      lastScroll = current;
    });
  },

  setupActiveLinks() {
    const path = window.location.pathname;
    document.querySelectorAll('.nav-link, .sidebar-nav-item').forEach(link => {
      const href = link.getAttribute('href');
      if (href === path || (path === '/' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
};

/* ============================================================
   CHAT WIDGET
   ============================================================ */

const ChatWidget = {
  isOpen: false,
  messages: [],

  init() {
    const trigger = document.querySelector('.chat-widget-trigger');
    const panel = document.querySelector('.chat-widget-panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => this.toggle());
    document.querySelector('.chat-widget-close')?.addEventListener('click', () => this.close());

    // Quick actions
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        this.handleQuickAction(action);
      });
    });

    // Send message
    const input = document.querySelector('.chat-widget-input');
    const sendBtn = document.querySelector('.chat-widget-send');
    if (input && sendBtn) {
      sendBtn.addEventListener('click', () => this.sendMessage(input));
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendMessage(input);
      });
    }

    // Initial welcome message
    this.addMessage({
      type: 'received',
      text: i18n.t('chat.welcome'),
      time: this.getTime()
    });
  },

  toggle() {
    this.isOpen = !this.isOpen;
    const trigger = document.querySelector('.chat-widget-trigger');
    const panel = document.querySelector('.chat-widget-panel');
    if (trigger) trigger.classList.toggle('open', this.isOpen);
    if (panel) panel.classList.toggle('open', this.isOpen);
  },

  close() {
    this.isOpen = false;
    document.querySelector('.chat-widget-trigger')?.classList.remove('open');
    document.querySelector('.chat-widget-panel')?.classList.remove('open');
  },

  handleQuickAction(action) {
    const input = document.querySelector('.chat-widget-input');
    if (!input) return;

    switch (action) {
      case 'track':
        input.value = 'I want to track a package';
        break;
      case 'quote':
        input.value = 'I need a shipping quote';
        break;
      case 'claim':
        input.value = 'I want to file a claim';
        break;
      case 'support':
        input.value = 'I need customer support';
        break;
    }
    input.focus();
  },

  sendMessage(input) {
    const text = input.value.trim();
    if (!text) return;

    this.addMessage({ type: 'sent', text, time: this.getTime() });
    input.value = '';

    // Simulate typing + response
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      const responses = [
        'Thanks for reaching out! Our team will get back to you shortly.',
        'I understand. Let me look into that for you.',
        'Great question! You can track your package using the tracking number on your receipt.',
        'I\'d be happy to help with that. Could you provide your tracking number?'
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      this.addMessage({ type: 'received', text: response, time: this.getTime() });
    }, 1500);
  },

  addMessage({ type, text, time }) {
    const body = document.querySelector('.chat-widget-body');
    if (!body) return;

    const msgEl = document.createElement('div');
    msgEl.className = `message ${type}`;
    msgEl.innerHTML = `
      <div class="message-bubble">${text}</div>
      <span class="message-time">${time}</span>
    `;
    body.appendChild(msgEl);
    body.scrollTop = body.scrollHeight;
    this.messages.push({ type, text, time });
  },

  showTyping() {
    const body = document.querySelector('.chat-widget-body');
    if (!body) return;
    const typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.id = 'typing-indicator';
    typing.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;
  },

  hideTyping() {
    document.getElementById('typing-indicator')?.remove();
  },

  getTime() {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
};

/* ============================================================
   ACCORDION
   ============================================================ */

const Accordion = {
  init() {
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        const item = e.currentTarget.closest('.accordion-item');
        const isOpen = item.classList.contains('open');
        item.classList.toggle('open');
      });
    });
  }
};

/* ============================================================
   TABS
   ============================================================ */

const Tabs = {
  init() {
    document.querySelectorAll('.tabs').forEach(tabGroup => {
      tabGroup.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
          const target = e.currentTarget.getAttribute('data-tab');
          tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          e.currentTarget.classList.add('active');

          const panels = tabGroup.parentElement.querySelectorAll('.tab-panel');
          panels.forEach(panel => {
            panel.style.display = panel.getAttribute('data-panel') === target ? 'block' : 'none';
          });
        });
      });
    });
  }
};

/* ============================================================
   TOAST SYSTEM
   ============================================================ */

const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', duration = 4000) {
    this.init();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: 'check', error: 'x', warning: 'alert-triangle', info: 'info' };
    toast.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-content">
        <div class="toast-message">${message}</div>
      </div>
      <button class="alert-close" onclick="this.parentElement.remove()">×</button>
    `;
    this.container.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  },

  success(message) { this.show(message, 'success'); },
  error(message) { this.show(message, 'error'); },
  warning(message) { this.show(message, 'warning'); },
  info(message) { this.show(message, 'info'); }
};

/* ============================================================
   MODAL SYSTEM
   ============================================================ */

const Modal = {
  open(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  },

  close(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  init() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });
  }
};

/* ============================================================
   FORM VALIDATION
   ============================================================ */

const FormValidation = {
  init() {
    document.querySelectorAll('.input, .textarea, .select').forEach(field => {
      field.addEventListener('blur', () => this.validate(field));
      field.addEventListener('input', () => this.clearError(field));
    });
  },

  validate(field) {
    const value = field.value.trim();
    const rules = JSON.parse(field.getAttribute('data-rules') || '{}');
    let error = null;

    if (rules.required && !value) error = 'This field is required';
    if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email';
    if (rules.min && value.length < rules.min) error = `Minimum ${rules.min} characters`;
    if (rules.max && value.length > rules.max) error = `Maximum ${rules.max} characters`;

    if (error) {
      this.showError(field, error);
      return false;
    }
    return true;
  },

  showError(field, message) {
    field.classList.add('error');
    let errorEl = field.parentElement.querySelector('.field-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'field-error';
      field.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
  },

  clearError(field) {
    field.classList.remove('error');
    const errorEl = field.parentElement.querySelector('.field-error');
    if (errorEl) errorEl.remove();
  },

  validateAll(form) {
    let valid = true;
    form.querySelectorAll('.input, .textarea, .select').forEach(field => {
      if (!this.validate(field)) valid = false;
    });
    return valid;
  }
};

/* ============================================================
   PROGRESS BAR ANIMATION
   ============================================================ */

const ProgressAnim = {
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector('.progress-bar-fill');
          if (fill) {
            const target = fill.getAttribute('data-progress');
            fill.style.width = target + '%';
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.progress-container').forEach(el => observer.observe(el));
  }
};

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */

const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
};

/* ============================================================
   COPY TO CLIPBOARD
   ============================================================ */

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    Toast.success('Copied to clipboard!');
  }).catch(() => {
    Toast.error('Failed to copy');
  });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */

const ScrollReveal = {
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
};

/* ============================================================
   LAZY LOADING
   ============================================================ */

const LazyLoad = {
  init() {
    if ('loading' in HTMLImageElement.prototype) {
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
      });
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            observer.unobserve(img);
          }
        });
      });
      document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
    }
  }
};

/* ============================================================
   LANGUAGE SWITCHER DROPDOWN
   ============================================================ */

const LangSwitcher = {
  init() {
    const pill = document.querySelector('.lang-pill');
    if (!pill) return;

    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = document.querySelector('.lang-dropdown');
      if (dropdown) {
        dropdown.classList.toggle('open');
        e.currentTarget.setAttribute('aria-expanded', dropdown.classList.contains('open'));
      }
    });

    document.addEventListener('click', () => {
      const dropdown = document.querySelector('.lang-dropdown');
      if (dropdown) dropdown.classList.remove('open');
    });
  },

  switch(lang) {
    i18n.setLang(lang);
    Toast.success(`Language changed to ${CONFIG.languages[lang].label}`);
  }
};

/* ============================================================
   COUNTRY FLAGS (Tracking)
   ============================================================ */

function formatTrackingNumber(input) {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/* ============================================================
   SEARCH FUNCTIONALITY
   ============================================================ */

const Search = {
  init() {
    const searchInput = document.querySelector('.search-input-full input');
    const resultsContainer = document.querySelector('.search-results');
    if (!searchInput || !resultsContainer) return;

    let timeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length < 2) {
          resultsContainer.classList.remove('show');
          return;
        }
        // Show results (placeholder - can connect to real search)
        resultsContainer.classList.add('show');
      }, 300);
    });

    searchInput.addEventListener('blur', () => {
      setTimeout(() => resultsContainer.classList.remove('show'), 200);
    });
  }
};

/* ============================================================
   COOKIE BANNER
   ============================================================ */

const CookieBanner = {
  init() {
    const banner = document.querySelector('.cookie-banner');
    if (!banner) return;
    if (localStorage.getItem('airpak-cookies-accepted')) return;

    banner.style.display = 'flex';
    banner.querySelector('.accept-btn')?.addEventListener('click', () => {
      localStorage.setItem('airpak-cookies-accepted', 'true');
      banner.style.display = 'none';
    });
    banner.querySelector('.decline-btn')?.addEventListener('click', () => {
      localStorage.setItem('airpak-cookies-accepted', 'false');
      banner.style.display = 'none';
    });
  }
};

/* ============================================================
   THEME TOGGLE HANDLER
   ============================================================ */

/* ============================================================
   SIDEBAR ACTIVE STATE
   ============================================================ */

const SidebarState = {
  init() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Match against href of sidebar items
    document.querySelectorAll('.sidebar-nav-item, .ls-nav-item, .admin-nav-item, .settings-nav-item, .dashboard-sidebar-item').forEach(item => {
      const href = item.getAttribute('href');
      const isActive = (href === currentPage) || (currentPage === '' && href === 'index.html') || (currentPage === 'index.html' && href === 'index.html');
      if (isActive) {
        item.classList.add('active');
      }
    });
  }
};

/* ============================================================
   LUCIDE ICONS INITIALIZER
   ============================================================ */

const LucideIcons = {
  init() {
    // Load Lucide from CDN if not already loaded
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
};

/* ============================================================
   INIT SEQUENCE
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Init theme
  ThemeEngine.init();

  // Init i18n
  i18n.init();

  // Init all modules
  ThemeEngine.init();
  i18n.init();
  Navigation.init();
  ChatWidget.init();
  Accordion.init();
  Tabs.init();
  Modal.init();
  FormValidation.init();
  ProgressAnim.init();
  SmoothScroll.init();
  ScrollReveal.init();
  LazyLoad.init();
  LangSwitcher.init();
  Search.init();
  CookieBanner.init();
  SidebarState.init();
  LucideIcons.init();

  // Lucide icons CDN (lazy load if not present)
  if (!window.lucide) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/lucide@latest';
    script.onload = () => window.lucide && window.lucide.createIcons();
    document.body.appendChild(script);
  }

  // Theme toggle click
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => ThemeEngine.toggle());
  });

  // Lazy init
  requestIdleCallback(() => {
    document.body.classList.add('loaded');
  });
});

// Expose globally
window.AIRPAK = {
  Theme: ThemeEngine,
  i18n,
  Chat: ChatWidget,
  Toast,
  Modal,
  Form: FormValidation,
  Sidebar: SidebarState,
  Lucide: LucideIcons,
  copyToClipboard,
  LangSwitcher
};