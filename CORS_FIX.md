# إصلاح مشكلة CORS

## المشكلة
Admin Panel في Vercel يواجه مشكلة CORS عند محاولة الوصول إلى Backend API.

## الحل المطبق

### 1. Backend (NewsCore)
تم تحديث `src/main.ts` لدعم:
- ✅ Vercel deployments (جميع subdomains)
- ✅ Localhost للـ development
- ✅ Origins من environment variable

### 2. إعدادات Vercel المطلوبة

#### أ) إضافة Environment Variable في Vercel:

1. اذهب إلى Vercel Dashboard
2. اختر مشروع `newsCore-admin`
3. Settings → Environment Variables
4. أضف المتغير التالي:

```
VITE_API_URL=https://admin.sahara2797.com/api/v1
```

#### ب) إضافة CORS_ORIGINS في Backend:

في Backend (NewsCore)، تأكد من إضافة Vercel origins في `.env`:

```env
CORS_ORIGINS=https://news-core-admin.vercel.app,https://admin.sahara2797.com,http://localhost:3003
```

أو للسماح بجميع Vercel deployments:
```env
CORS_ORIGINS=*
```

### 3. إعادة بناء Backend

بعد تحديث CORS configuration، يجب إعادة بناء وتشغيل Backend:

```bash
cd NewsCore
npm run build
# أو في Docker
docker-compose restart newscore-api
```

### 4. التحقق من الإصلاح

بعد إعادة النشر:
1. افتح Admin Panel في Vercel
2. حاول تسجيل الدخول
3. يجب أن يعمل بدون أخطاء CORS

## ملاحظات

- Proxy في `vite.config.ts` يعمل فقط في development mode
- في production (Vercel)، يجب استخدام `VITE_API_URL` environment variable
- CORS configuration في Backend يدعم الآن جميع Vercel deployments تلقائياً

