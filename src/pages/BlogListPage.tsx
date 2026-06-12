import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { api } from "../lib/api";
import { BlogPost } from "../types";
import { Calendar, User } from "lucide-react";

export default function BlogListPage() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      const res = await api.get("/blog");
      return res.data;
    }
  });

  return (
    <div className="flex flex-col gap-12 max-w-7xl mx-auto w-full">
      <Helmet>
        <title>وبلاگ و مقالات آموزشی | چاپخانه</title>
        <meta name="description" content="جدیدترین مقالات، آموزش‌ها و اخبار دنیای چاپ و طراحی" />
        <meta property="og:title" content="وبلاگ و مقالات آموزشی | چاپخانه" />
        <meta property="og:type" content="blog" />
        {posts && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": posts.map((post, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `${window.location.origin}/blog/${post.slug}`,
                "name": post.title
              }))
            })}
          </script>
        )}
      </Helmet>

      {/* Header */}
      <div className="flex flex-col gap-4 text-center mt-8">
         <h1 className="text-3xl md:text-5xl font-black text-slate-800">مجله تخصصی چاپ</h1>
         <p className="text-slate-500 text-sm">آموزش‌ها، اخبار و ترفندهای دنیای چاپ و تبلیغات</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[...Array(6)].map((_, i) => (
             <div key={i} className="animate-pulse bg-slate-50 rounded-3xl aspect-square border border-slate-100" />
           ))}
        </div>
      ) : !posts || posts.length === 0 ? (
        <div className="py-24 text-center border border-slate-100 bg-slate-50 rounded-3xl">
           <span className="text-4xl opacity-50">📰</span>
           <h3 className="mt-4 font-bold text-slate-700 text-sm">مقاله‌ای یافت نشد.</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {posts.map(post => {
              const dateObj = new Date(post.createdAt);
              const formattedDate = new Intl.DateTimeFormat('fa-IR').format(dateObj);
              return (
                 <Link key={post.id} to={`/blog/${post.slug}`} className="group flex flex-col gap-4">
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 shadow-sm transition-all group-hover:-translate-y-1 group-hover:shadow-md">
                       <img src={post.coverImage || "https://placehold.co/800x600/png"} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="flex flex-col gap-2 px-2">
                       <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                           <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                           <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formattedDate}</span>
                       </div>
                       <h2 className="text-lg font-extrabold text-slate-800 line-clamp-2 leading-relaxed group-hover:text-emerald-600 transition-colors">{post.title}</h2>
                       <p className="text-xs text-slate-500 line-clamp-2 leading-loose">{post.excerpt}</p>
                    </div>
                 </Link>
              );
           })}
        </div>
      )}
      
      {/* Concept pagination */}
      {posts && posts.length > 0 && (
         <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
               <button className="w-10 h-10 rounded-xl border border-slate-200 text-slate-700 font-mono font-bold flex items-center justify-center hover:bg-slate-50 disabled:opacity-50" disabled>1</button>
               <button className="w-10 h-10 rounded-xl border border-slate-200 text-slate-700 font-mono font-bold flex items-center justify-center hover:bg-slate-50" >2</button>
               <button className="w-10 h-10 rounded-xl border border-slate-200 text-slate-700 font-mono font-bold flex items-center justify-center hover:bg-slate-50">3</button>
            </div>
         </div>
      )}
    </div>
  );
}
