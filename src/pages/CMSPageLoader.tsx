import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { api } from "../lib/api";
import { CMSPage } from "../types";
import BlockRenderer from "../components/cms/BlockRenderer";

export default function CMSPageLoader({ defaultSlug }: { defaultSlug?: string }) {
  const { slug: paramsSlug } = useParams<{ slug: string }>();
  const activeSlug = defaultSlug || paramsSlug;

  const { data: page, isLoading, isError } = useQuery<CMSPage>({
    queryKey: ["cmsPage", activeSlug],
    queryFn: async () => {
      if (!activeSlug) throw new Error("No slug provided");
      const res = await api.get(`/cms/pages/${activeSlug}`);
      return res.data;
    },
    enabled: !!activeSlug
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-500 font-bold">در حال بارگزاری صفحه...</span>
      </div>
    );
  }

  if (isError || !page) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <Helmet>
          <title>صفحه یافت نشد | چاپخانه نقش و نگار</title>
        </Helmet>
        <span className="text-slate-200 text-6xl font-black font-mono">404</span>
        <h1 className="text-2xl font-extrabold text-slate-800">صفحه‌ای که به دنبال آن بودید یافت نشد!</h1>
        <p className="text-slate-500 text-sm">ممکن است آدرس را اشتباه وارد کرده باشید یا این صفحه حذف شده باشد.</p>
        <Link to="/" className="mt-4 px-6 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 font-bold rounded-xl transition-all shadow-md">
          بازگشت به صفحه اصلی
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <Helmet>
        <title>{page.seo?.title || `${page.title} | چاپخانه نقش و نگار`}</title>
        {page.seo?.description && <meta name="description" content={page.seo.description} />}
      </Helmet>
      
      <BlockRenderer blocks={page.blocks} />
    </div>
  );
}
