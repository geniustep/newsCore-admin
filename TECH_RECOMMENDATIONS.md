# 🛠️ التوصيات التقنية - NewsCore Admin

## 📚 المكتبات والأدوات الموصى بها

---

## 1. محرر البلوكات (Block Editor)

### الخيارات المتاحة:

#### Option 1: استخدام TipTap مع Extensions مخصصة (موصى به)
✅ **المزايا:**
- بالفعل موجود في المشروع
- خفيف الوزن
- قابل للتخصيص بالكامل
- دعم React ممتاز

```bash
npm install @tiptap/extension-collaboration @tiptap/extension-collaboration-cursor
```

#### Option 2: Slate.js
⚠️ **المزايا:**
- مرن جداً
- دعم Rich Text قوي

❌ **العيوب:**
- منحنى تعلم صعب
- يحتاج وقت طويل للإعداد

#### Option 3: Draft.js
❌ **لا يُنصح به:**
- لم يعد يتلقى تحديثات نشطة
- أثقل من البدائل

### التوصية النهائية:
**استخدم TipTap الموجود + Block Extensions مخصصة**

---

## 2. Drag & Drop

### DnD Kit (موصى به بشدة)
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

✅ **المزايا:**
- خفيف الوزن (26KB)
- أداء ممتاز
- دعم Accessibility كامل
- دعم Touch screens
- لا يعتمد على DOM manipulation

**مثال الاستخدام:**
```typescript
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
```

### البدائل:
- react-beautiful-dnd (أثقل، لكن UI أجمل)
- react-dnd (معقد للمبتدئين)

---

## 3. الرسوم البيانية (Charts)

### Recharts (موصى به)
```bash
npm install recharts
```

✅ **المزايا:**
- مبني على React بالكامل
- سهل الاستخدام
- Responsive بشكل تلقائي
- أمثلة كثيرة

**مثال:**
```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

<LineChart width={600} height={300} data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="views" stroke="#8884d8" />
</LineChart>
```

### البدائل:
- **Chart.js + react-chartjs-2**: أكثر خيارات، أثقل قليلاً
- **Victory**: مرن جداً، لكن معقد
- **Tremor**: حديث وجميل، لكن محدود

---

## 4. Date/Time Picker

### React DatePicker (موصى به)
```bash
npm install react-datepicker
npm install --save-dev @types/react-datepicker
```

✅ **المزايا:**
- سهل الاستخدام
- دعم Time picker
- دعم Range selection
- Accessibility جيد

**مثال:**
```typescript
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

<DatePicker
  selected={startDate}
  onChange={(date) => setStartDate(date)}
  showTimeSelect
  dateFormat="Pp"
  locale="ar"
/>
```

### البدائل:
- **react-day-picker**: أخف وزناً
- **@mui/x-date-pickers**: إذا كنت تستخدم MUI
- **date-fns** (موجود بالفعل): للتعامل مع التواريخ فقط

---

## 5. التحقق من النماذج (Form Validation)

### Zod (موصى به بشدة)
```bash
npm install zod
npm install @hookform/resolvers
```

✅ **المزايا:**
- TypeScript-first
- خفيف الوزن
- رسائل خطأ واضحة
- يعمل مع React Hook Form (موجود بالفعل)

**مثال:**
```typescript
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const articleSchema = z.object({
  title: z.string().min(10, 'العنوان يجب أن يكون 10 أحرف على الأقل'),
  content: z.string().min(100),
  categoryId: z.string().uuid(),
  tags: z.array(z.string()).min(1).max(10),
  publishAt: z.date().optional(),
});

type ArticleForm = z.infer<typeof articleSchema>;

const { register, handleSubmit, formState: { errors } } = useForm<ArticleForm>({
  resolver: zodResolver(articleSchema),
});
```

### البدائل:
- **Yup**: شائع لكن أقل type safety
- **Joi**: قوي لكن أثقل

---

## 6. إدارة الحالة (State Management)

### الوضع الحالي ممتاز:
- ✅ **Zustand** للـ auth state
- ✅ **React Query** للـ server state
- ✅ **Context** للـ theme

### إضافات مقترحة:

#### Jotai (للحالات المعقدة)
```bash
npm install jotai
```

**متى تستخدمه:**
- حالات معقدة تحتاج تقسيم
- Derived state
- Alternative لـ Context في بعض الحالات

**مثال:**
```typescript
import { atom, useAtom } from 'jotai';

const editorStateAtom = atom({
  blocks: [],
  selectedBlockId: null,
  isDirty: false,
});

function Editor() {
  const [state, setState] = useAtom(editorStateAtom);
  // ...
}
```

---

## 7. Testing

### Unit & Integration Tests

#### Vitest (موصى به - أسرع من Jest)
```bash
npm install -D vitest @vitest/ui
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event
npm install -D happy-dom
```

**تحديث package.json:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

**مثال test:**
```typescript
// src/components/__tests__/BreakingNewsBanner.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BreakingNewsBanner from '../BreakingNews/BreakingNewsBanner';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

describe('BreakingNewsBanner', () => {
  it('should not render when no breaking news', () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <BreakingNewsBanner />
      </QueryClientProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should render breaking news', async () => {
    // Mock API response
    vi.mock('../../lib/api', () => ({
      breakingNewsApi: {
        getActive: () => Promise.resolve([
          { id: '1', title: 'عاجل: خبر مهم', url: '/news/1' }
        ])
      }
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <BreakingNewsBanner />
      </QueryClientProvider>
    );

    expect(await screen.findByText('عاجل: خبر مهم')).toBeInTheDocument();
  });
});
```

### E2E Tests

#### Playwright (موصى به)
```bash
npm install -D @playwright/test
npx playwright install
```

**مثال:**
```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('should login successfully', async ({ page }) => {
  await page.goto('/login');

  await page.fill('input[name="email"]', 'admin@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('لوحة التحكم');
});
```

---

## 8. الأمان (Security)

### DOMPurify (لتنظيف HTML)
```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

**مثال:**
```typescript
import DOMPurify from 'dompurify';

function ArticleContent({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

### helmet (لـ Security Headers في Express Backend)
```bash
npm install helmet
```

---

## 9. التحليلات (Analytics)

### خيارات محترمة للخصوصية:

#### Plausible Analytics (موصى به)
```bash
npm install plausible-tracker
```

**مثال:**
```typescript
import Plausible from 'plausible-tracker';

const plausible = Plausible({
  domain: 'yourdomain.com',
  trackLocalhost: false,
});

// Track pageview
plausible.trackPageview();

// Track custom event
plausible.trackEvent('Article Published', {
  props: { category: 'Technology' }
});
```

### البدائل:
- **Umami**: مفتوح المصدر، self-hosted
- **Fathom**: مدفوع، privacy-focused
- **Matomo**: قوي، self-hosted

---

## 10. الإشعارات (Push Notifications)

### Firebase Cloud Messaging (موصى به)
```bash
npm install firebase
```

**إعداد:**
```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });
    return token;
  }
  return null;
}

export function listenForMessages(callback: (payload: any) => void) {
  onMessage(messaging, callback);
}
```

---

## 11. البحث (Search)

### Algolia (للبحث السريع)
```bash
npm install algoliasearch react-instantsearch
```

**مثال:**
```typescript
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch';

const searchClient = algoliasearch(
  'YOUR_APP_ID',
  'YOUR_SEARCH_API_KEY'
);

function ArticleSearch() {
  return (
    <InstantSearch searchClient={searchClient} indexName="articles">
      <SearchBox placeholder="ابحث في المقالات..." />
      <Hits hitComponent={ArticleHit} />
    </InstantSearch>
  );
}
```

### البدائل:
- **Meilisearch**: مفتوح المصدر، self-hosted
- **Typesense**: سريع، self-hosted
- **ElasticSearch**: قوي لكن معقد

---

## 12. تحسين الصور (Image Optimization)

### sharp (في الـ Backend)
```bash
npm install sharp
```

**مثال:**
```typescript
import sharp from 'sharp';

async function optimizeImage(buffer: Buffer) {
  return await sharp(buffer)
    .resize(1200, 800, { fit: 'cover' })
    .webp({ quality: 85 })
    .toBuffer();
}
```

### react-image-crop (في الـ Frontend)
```bash
npm install react-image-crop
```

---

## 13. Code Quality

### ESLint + Prettier
```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
npm install -D eslint-plugin-react eslint-plugin-react-hooks
```

**.eslintrc.json:**
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react", "react-hooks"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

**.prettierrc:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### Husky (Pre-commit hooks)
```bash
npm install -D husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

**package.json:**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

---

## 14. Error Tracking

### Sentry (موصى به)
```bash
npm install @sentry/react
```

**إعداد:**
```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Wrap app with Sentry
<Sentry.ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</Sentry.ErrorBoundary>
```

---

## 15. Performance Monitoring

### web-vitals
```bash
npm install web-vitals
```

**مثال:**
```typescript
// src/lib/vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // إرسال إلى Analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

## 16. الترجمة (i18n)

### react-i18next (إذا احتجت دعم متعدد اللغات للـ UI)
```bash
npm install react-i18next i18next
```

**ملاحظة:** المشروع حالياً عربي بالكامل، لكن إذا احتجت دعم لغات أخرى للواجهة:

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: { /* ... */ } },
    en: { translation: { /* ... */ } },
  },
  lng: 'ar',
  fallbackLng: 'ar',
  interpolation: { escapeValue: false },
});
```

---

## 17. CI/CD

### GitHub Actions (موصى به)

**`.github/workflows/ci.yml`:**
```yaml
name: CI

on:
  push:
    branches: [main, claude/*]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm run test:coverage

      - name: Build
        run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## 📊 الملخص التنفيذي

### أولوية عالية (افعل الآن):
1. ✅ **Vitest** - للاختبارات
2. ✅ **Zod** - للتحقق من النماذج
3. ✅ **DOMPurify** - للأمان
4. ✅ **ESLint + Prettier** - لجودة الكود
5. ✅ **Sentry** - لتتبع الأخطاء

### أولوية متوسطة (الشهر القادم):
1. ✅ **@dnd-kit** - للـ drag & drop
2. ✅ **Recharts** - للرسوم البيانية
3. ✅ **Playwright** - للـ E2E tests
4. ✅ **Firebase** - للإشعارات
5. ✅ **GitHub Actions** - للـ CI/CD

### أولوية منخفضة (مستقبلاً):
1. ✅ **Algolia/Meilisearch** - للبحث المتقدم
2. ✅ **Plausible** - للتحليلات
3. ✅ **sharp** - لتحسين الصور

---

## 💰 التكاليف المتوقعة (للخدمات المدفوعة)

### مجاني (Free Tier يكفي للبداية):
- ✅ Sentry: 5K errors/month
- ✅ Vercel: Unlimited deployments
- ✅ Firebase: 10K notifications/month
- ✅ Plausible: $9/month (10K pageviews)

### مدفوع (عند النمو):
- Algolia: من $0.50 لكل 1000 request
- Cloudflare: مجاني للأساسيات
- Sendgrid: مجاني حتى 100 email/day

---

**آخر تحديث**: 2025-12-04
**الإصدار**: 1.0
