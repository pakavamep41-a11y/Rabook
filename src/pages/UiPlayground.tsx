import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input, Textarea, Select, NumberInput, Checkbox, Radio, Switch } from "../components/ui/Inputs";
import { ToastProvider, useToast } from "../components/ui/Toast";
import { Modal, Drawer, Tooltip, ConfirmDialog, Skeleton, EmptyState } from "../components/ui/Feedback";
import { Tabs, Accordion, Badge, StatusChip, Table, Pagination, Breadcrumbs, PriceText } from "../components/ui/DataDisplay";
import { FileUploadField, JalaliDatePicker } from "../components/ui/Special";

import { Box, User, Settings, AlertCircle } from "lucide-react";

export default function UiPlayground() {
  return (
    <ToastProvider>
      <PlaygroundContent />
    </ToastProvider>
  );
}

function PlaygroundContent() {
  const { toast } = useToast();
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [paginationPage, setPaginationPage] = useState(1);

  return (
    <div className="min-h-screen bg-surface-muted py-8 text-right font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-12 px-6">
        
        <div>
          <h1 className="text-3xl font-bold text-text-base mb-2">Persian RTL UI Kit Playground</h1>
          <p className="text-text-muted">A comprehensive showcase of all available Tailwind-driven UI components.</p>
        </div>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-surface-border pb-2">1. Buttons</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary">دکمه اصلی</Button>
            <Button variant="secondary">دکمه فرعی</Button>
            <Button variant="outline">حاشیه‌دار</Button>
            <Button variant="ghost">بدون پس‌زمینه</Button>
            <Button variant="danger">حذف</Button>
            <Button variant="primary" isLoading>در حال بارگزاری</Button>
          </div>
        </section>

        {/* Inputs */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-surface-border pb-2">2. Forms & Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input label="نام کامل" placeholder="مثلاً علی علوی" hint="نام خود را به فارسی وارد کنید." />
            <Input label="ایمیل" type="email" error="این ایمیل معتبر نیست." defaultValue="invalid@email" />
            <NumberInput label="تعداد سفارش" value={1450} onChange={() => {}} />
            <Select 
              label="شهر محل سکونت" 
              options={[
                { label: "تهران", value: "tehran" },
                { label: "مشهد", value: "mashhad" },
                { label: "اصفهان", value: "isfahan" }
              ]} 
            />
            <JalaliDatePicker label="تاریخ تولد" />
            <Textarea label="توضیحات تکمیلی" placeholder="متن خود را اینجا بنویسید..." />
          </div>
          <div className="flex flex-wrap gap-8 py-4">
             <Checkbox label="قوانین و مقررات را می‌پذیرم" />
             <Radio label="گزینه اول" name="radio-group" />
             <Switch label="فعال‌سازی اطلاع‌رسانی پیامکی" checked={true} onChange={() => {}} />
          </div>
          <div className="max-w-md">
            <FileUploadField 
              label="آپلود فایل طراحی"
              hint="فقط فایل‌های PDF و تصویر زیر ۵ مگابایت"
              accept="image/*,.pdf"
              onFileSelect={(f) => console.log(f)}
            />
          </div>
        </section>

        {/* Feedback */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-surface-border pb-2">3. Feedback & Overlays</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={() => setModalOpen(true)}>نمایش مودال</Button>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="اطلاعات تکمیلی">
               <p className="text-text-muted">این یک مودال نمونه برای نمایش اطلاعات یا فرم‌های موقت است.</p>
            </Modal>

            <Button variant="outline" onClick={() => setDrawerOpen(true)}>نمایش کشوی کناری</Button>
            <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} title="تنظیمات">
               <p className="text-text-muted">این یک کشو (Drawer) است که از سمت راست باز می‌شود.</p>
            </Drawer>

            <Button variant="danger" onClick={() => setConfirmOpen(true)}>نمایش دیالوگ تایید</Button>
            <ConfirmDialog 
              isOpen={isConfirmOpen} 
              onClose={() => setConfirmOpen(false)} 
              title="حذف حساب کاربری" 
              description="آیا از حذف حساب کاربری خود اطمینان دارید؟ این عمل غیرقابل بازگشت است."
              onConfirm={() => { toast("حساب حذف شد", "error"); setConfirmOpen(false); }} 
            />

            <Button onClick={() => toast("عملیات با موفقیت انجام شد!", "success")}>تست Toast (موفق)</Button>
            
            <Tooltip content="راهنمای سریع برای کاربران">
              <span className="inline-flex items-center gap-1 text-primary-600 font-medium cursor-help">
                <AlertCircle className="w-4 h-4" />
                تولتیپ چیست؟
              </span>
            </Tooltip>
          </div>
        </section>

        {/* Data Display */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-surface-border pb-2">4. Data Display</h2>
          
          <div className="flex gap-4">
             <StatusChip status="pending" />
             <StatusChip status="processing" />
             <StatusChip status="completed" />
             <StatusChip status="cancelled" />
             <Badge variant="default">برچسب ساده</Badge>
          </div>

          <div className="py-2">
            <PriceText amount={24500000} className="text-xl text-primary-600" />
          </div>

          <Breadcrumbs items={[
             { label: "فروشگاه", href: "/products" },
             { label: "کارت ویزیت", href: "/category/business-cards" },
             { label: "کارت ویزیت گلاسه" },
          ]} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-surface-base p-6 rounded-xl border border-surface-border">
              <Tabs 
                tabs={[
                  { id: "tab1", label: "اطلاعات پایه", content: "محتوای تب اطلاعات پایه..." },
                  { id: "tab2", label: "مشخصات فنی", content: "محتوای مشخصات فنی محصول..." }
                ]}
              />
            </div>
            <div>
              <Accordion 
                items={[
                  { id: "q1", title: "زمان تحویل چقدر است؟", content: "برای محصولات عادی بین ۳ تا ۵ روز کاری زمان لازم است." },
                  { id: "q2", title: "آیا امکان لغو سفارش وجود دارد؟", content: "در صورتی که سفارش وارد مرحله چاپ نشده باشد..." }
                ]}
              />
            </div>
          </div>

          <div className="mt-8">
            <Table 
              columns={[
                { key: "id", title: "شناسه" },
                { key: "customer", title: "مشتری" },
                { key: "total", title: "مبلغ نهایی", render: (val) => <PriceText amount={val} /> },
                { key: "status", title: "وضعیت", render: (val) => <StatusChip status={val} /> },
              ]}
              data={[
                { id: "1024", customer: "علی حسینی", total: 1500000, status: "completed" },
                { id: "1025", customer: "مریم رضایی", total: 450000, status: "processing" },
              ]}
            />
            <Pagination currentPage={paginationPage} totalPages={5} onPageChange={setPaginationPage} />
          </div>
        </section>

        {/* Empty States & Skeletons */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-surface-border pb-2">5. Loading & Empty States</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-3">
               <Skeleton className="w-3/4 h-8" />
               <Skeleton className="w-full h-4" />
               <Skeleton className="w-full h-4" />
               <Skeleton className="w-1/2 h-4" />
             </div>
             <EmptyState 
               icon={Box} 
               title="سبد خرید خالی است" 
               description="شما هنوز محصولی به سبد خرید خود اضافه نکرده‌اید." 
               action={<Button variant="outline" className="mt-4">مشاهده محصولات</Button>}
             />
          </div>
        </section>

      </div>
    </div>
  );
}
