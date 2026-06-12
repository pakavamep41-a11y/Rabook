import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";
import { api } from "../lib/api";
import { BlogPost } from "../types";
import { Calendar, User, ChevronRight } from "lucide-react";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ["blogPost", slug],
    queryFn: async () => {
      const res = await api.get(`/blog/${slug}`);
      return res.data;
    },
    enabled: !!slug
  });

  const { data: relatedPosts } = useQuery<BlogPost[]>({
    queryKey: ["relatedPosts"],
    queryFn: async () => {
      const res = await api.get(`/blog`);
      return (res.data as BlogPost[]).filter(p => p.slug !== slug).slice(0, 3);
    },
    enabled: !!post
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-500 font-bold">در حال بارگزاری مقاله...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-24 flex flex-col items-center gap-4">
         <span className="text-4xl text-slate-300">📰</span>
         <h2 className="text-xl font-bold text-slate-800">مقاله‌ای با این آدرس پیدا نشد.</h2>
         <Link to="/blog" className="text-emerald-600 font-bold hover:underline">بازگشت به وبلاگ</Link>
      </div>
    );
  }

  const cleanHTML = DOMPurify.sanitize(post.contentHtml || "");
  const formattedDate = new Intl.DateTimeFormat('fa-IR').format(new Date(post.createdAt));

  return (
    <div className="flex flex-col gap-12 w-full max-w-4xl mx-auto">
      <Helmet>
        <title>{post.title} | وبلاگ چاپخانه</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
        <Link to="/" className="hover:text-emerald-600 transition-colors">خانه</Link>
        <ChevronRight className="w-3 h-3 rotate-180" />
        <Link to="/blog" className="hover:text-emerald-600 transition-colors">وبلاگ</Link>
        <ChevronRight className="w-3 h-3 rotate-180" />
        <span className="text-slate-800 line-clamp-1">{post.title}</span>
      </div>

      <article className="flex flex-col gap-8">
         <header className="flex flex-col gap-6 text-center">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">{post.title}</h1>
            <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> نوشته‌ی {post.author}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formattedDate}</span>
            </div>
            {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                   {post.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold">
                         {tag}
                      </span>
                   ))}
                </div>
            )}
         </header>

         {post.coverImage && (
            <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50">
               <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
         )}
         
         <div className="prose prose-emerald prose-lg max-w-none text-slate-700 leading-loose prose-img:rounded-2xl" dangerouslySetInnerHTML={{ __html: cleanHTML }} />
      </article>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
         <div className="mt-16 pt-16 border-t border-slate-100 flex flex-col gap-8">
            <h3 className="text-2xl font-black text-slate-800">مقالات مرتبط</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {relatedPosts.map(rp => (
                  <Link key={rp.id} to={`/blog/${rp.slug}`} className="group flex flex-col gap-3">
                     <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                        <img src={rp.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     </div>
                     <h4 className="font-bold text-sm text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-relaxed">{rp.title}</h4>
                  </Link>
               ))}
            </div>
         </div>
      )}
    </div>
  );
}
