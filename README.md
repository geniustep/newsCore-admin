# 📰 NewsCore Admin Dashboard

<div align="center">

![NewsCore Admin](https://img.shields.io/badge/NewsCore-Admin-blue?style=for-the-badge&logo=react&logoColor=white)

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**لوحة تحكم حديثة لنظام إدارة المحتوى الإخباري NewsCore**

[العرض التجريبي](https://newscore-admin.vercel.app) • [Backend API](https://github.com/geniustep/NewsCore)

</div>

---

## ✨ المميزات

- 🎨 **واجهة حديثة** مبنية بـ React + TailwindCSS
- 🌐 **دعم كامل للعربية** مع تصميم RTL
- 📝 **إدارة المقالات** مع محرر WYSIWYG
- 📁 **إدارة التصنيفات والوسوم**
- 🖼️ **إدارة الوسائط** مع رفع الملفات
- 👥 **إدارة المستخدمين** والصلاحيات
- 🔐 **نظام مصادقة** آمن مع JWT
- 📊 **لوحة إحصائيات** شاملة
- 📱 **تصميم متجاوب** لجميع الأجهزة

---

## 🚀 التثبيت

### المتطلبات

- Node.js >= 20.x
- npm >= 10.x

### خطوات التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/geniustep/newsCore-admin.git
cd newsCore-admin

# تثبيت التبعيات
npm install

# تشغيل في وضع التطوير
npm run dev
```

---

## ⚙️ الإعداد

### متغيرات البيئة

أنشئ ملف `.env.local` في جذر المشروع:

```env
# API URL - رابط Backend API
VITE_API_URL=https://admin.sahara2797.com/api/v1
```

### للتطوير المحلي

إذا كان Backend يعمل محلياً، اترك `VITE_API_URL` فارغاً لاستخدام Proxy:

```env
VITE_API_URL=
```

---

## 🏃 التشغيل

```bash
# وضع التطوير
npm run dev

# بناء للإنتاج
npm run build

# معاينة البناء
npm run preview
```

---

## 🚢 النشر على Vercel

### 1. ربط المستودع

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اضغط "Add New Project"
3. اختر مستودع `geniustep/newsCore-admin`

### 2. إعداد المتغيرات

في إعدادات المشروع على Vercel، أضف:

| المتغير | القيمة |
|---------|--------|
| `VITE_API_URL` | `https://admin.sahara2797.com/api/v1` |

### 3. النشر

Vercel سيقوم تلقائياً بـ:
- تثبيت التبعيات
- بناء المشروع
- نشره على نطاق فرعي

---

## 📁 بنية المشروع

```
newsCore-admin/
├── 📂 src/
│   ├── 📂 components/      # المكونات المشتركة
│   │   └── Layout.tsx      # التخطيط الرئيسي
│   ├── 📂 pages/           # صفحات التطبيق
│   │   ├── Login.tsx       # تسجيل الدخول
│   │   ├── Dashboard.tsx   # لوحة التحكم
│   │   ├── Articles.tsx    # المقالات
│   │   ├── ArticleEditor.tsx
│   │   ├── Categories.tsx  # التصنيفات
│   │   ├── Tags.tsx        # الوسوم
│   │   ├── Media.tsx       # الوسائط
│   │   ├── Users.tsx       # المستخدمين
│   │   └── Settings.tsx    # الإعدادات
│   ├── 📂 lib/
│   │   └── api.ts          # API Client
│   ├── 📂 store/
│   │   └── auth.ts         # إدارة حالة المصادقة
│   ├── App.tsx             # المكون الرئيسي
│   ├── main.tsx            # نقطة الدخول
│   └── index.css           # الأنماط العامة
├── 📄 index.html
├── 📄 package.json
├── 📄 vite.config.ts
├── 📄 tailwind.config.js
├── 📄 tsconfig.json
└── 📄 vercel.json          # إعدادات Vercel
```

---

## 🔗 الروابط

- **Backend API**: [NewsCore](https://github.com/geniustep/NewsCore)
- **العرض التجريبي**: https://admin.sahara2797.com
- **توثيق API**: https://admin.sahara2797.com/api/docs

---

## 📝 بيانات الدخول التجريبية

```
البريد: admin@sahara2797.com
كلمة المرور: Admin@123456
```

---

## 📄 الترخيص

MIT License

---

<div align="center">

**صُنع بـ ❤️ للمجتمع العربي**

</div>

