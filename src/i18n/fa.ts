// Basic i18n setup for Persian

export const fa = {
  common: {
    loading: "در حال بارگذاری...",
    error: "خطایی رخ داد.",
    retry: "تلاش دوباره",
    save: "ذخیره",
    cancel: "لغو",
    delete: "حذف",
    edit: "ویرایش",
    confirm: "تایید",
    back: "بازگشت",
    search: "جستجو...",
    offline: "شما آفلاین هستید. لطفاً اتصال اینترنت خود را بررسی کنید.",
    online: "ارتباط برقرار شد.",
  },
  auth: {
    login: "ورود به حساب",
    register: "ثبت‌نام",
    email: "آدرس ایمیل",
    password: "رمز عبور",
    name: "نام و نام خانوادگی",
    phone: "شماره تماس",
    logout: "خروج",
  },
  cart: {
    title: "سبد خرید",
    empty: "سبد خرید شما خالی است.",
    checkout: "تکمیل سفارش",
    total: "جمع کل",
  },
  errors: {
    notFound: "صفحه مورد نظر یافت نشد.",
    unauthorized: "برای مشاهده این بخش باید وارد شوید.",
  }
};

export type I18nKeys = typeof fa;

let currentCatalog = fa;

// Basic translation function
// Supports dot notation e.g. t('common.save')
export function t(path: string): string {
  try {
    const keys = path.split('.');
    let value: any = currentCatalog;
    for (const key of keys) {
      if (value[key] === undefined) return path;
      value = value[key];
    }
    return value as string;
  } catch (error) {
    return path;
  }
}
