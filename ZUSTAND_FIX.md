# إصلاح تحذير Zustand

## المشكلة
التحذير التالي يظهر في الـ console:
```
[DEPRECATED] Default export is deprecated. Instead use `import { create } from 'zustand'`.
```

## السبب
هذا التحذير يأتي من مكتبة داخلية أو dependency تستخدم zustand بطريقة قديمة، وليس من كود المشروع مباشرة.

## الحل

### 1. تحديث dependencies
قم بتحديث جميع المكتبات:

```bash
cd /opt/NewsCore/NewsCore-admin
npm update
```

### 2. مسح cache
امسح الـ cache وأعد البناء:

```bash
rm -rf node_modules/.vite
npm run build
npm run dev
```

### 3. تحديث zustand إلى أحدث إصدار
```bash
npm install zustand@latest
```

### 4. التأكد من صحة الاستخدام في المشروع
تم التحقق من أن ملف `src/store/auth.ts` يستخدم التصدير الصحيح:

```typescript
import { create } from 'zustand'; // ✅ صحيح

export const useAuthStore = create<AuthState>()(
  persist(
    // ...
  )
);
```

## ملاحظة
إذا استمر التحذير، فهو على الأرجح من dependency خارجية (مثل `@tanstack/react-query` أو مكتبة أخرى) وليس من كود المشروع. يمكن تجاهله بأمان حتى تقوم المكتبة الخارجية بالتحديث.
