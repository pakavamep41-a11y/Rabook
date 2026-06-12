import React from "react";
import { CMSBlock, Product, BlogPost } from "../../types";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { Star, PlayCircle, ChevronLeft, Calendar, User, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import ProductCard from "../ui/ProductCard";

function LatestBlogs({ block }: { block: CMSBlock }) {
  const { data: posts } = useQuery<BlogPost[]>({
    queryKey: ["latestBlogs"],
    queryFn: async () => {
      const res = await api.get("/blog");
      return (res.data as BlogPost[]).slice(0, 3);
    }
  });

  return (
    <section className="flex flex-col gap-6 py-8">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
           <span className="w-2 h-8 bg-emerald-500 rounded-full inline-block"></span>
           جدیدترین مقالات وبلاگ
        </h2>
        <Link to="/blog" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group">
           مشاهده همه <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        </Link>
      </div>
      
      {!posts ? (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="animate-pulse bg-slate-100 rounded-3xl aspect-[4/3]" />
           ))}
         </div>
      ) : posts.length === 0 ? (
         <div className="p-8 text-center text-slate-400 text-sm bg-slate-50 rounded-3xl border border-slate-100">مقاله‌ای یافت نشد.</div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {posts.map(post => {
              const formattedDate = new Intl.DateTimeFormat('fa-IR').format(new Date(post.createdAt));
              return (
                 <Link key={post.id} to={`/blog/${post.slug}`} className="group flex flex-col gap-4">
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 shadow-sm border border-slate-100">
                       <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                       <div className="absolute top-4 end-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-slate-700 shadow-sm">
                          {post.tags?.[0] || 'وبلاگ'}
                       </div>
                    </div>
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-emerald-600" /> {formattedDate}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="flex items-center gap-1"><User className="w-3 h-3 text-emerald-600" /> {post.author}</span>
                       </div>
                       <h3 className="text-base font-bold text-slate-800 line-clamp-2 leading-relaxed group-hover:text-emerald-600 transition-colors">{post.title}</h3>
                       <p className="text-xs text-slate-500 line-clamp-2 leading-loose">{post.excerpt}</p>
                    </div>
                 </Link>
              );
           })}
         </div>
      )}
    </section>
  );
}

function ProductCarousel({ block }: { block: CMSBlock }) {
  const { categoryId, title } = block.props;
  
  const { data: products } = useQuery<Product[]>({
    queryKey: ["products", categoryId],
    queryFn: async () => {
      const res = await api.get("/products");
      let all = res.data.data as Product[];
      if (categoryId) {
        all = all.filter(p => p.categoryId === categoryId);
      }
      return all;
    }
  });

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-800">{title || "محصولات"}</h2>
        {categoryId && (
           <Link to={`/c/${categoryId}`} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
             مشاهده همه <ChevronLeft className="w-3.5 h-3.5" />
           </Link>
        )}
      </div>
      
      {!products ? (
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="animate-pulse bg-slate-100 rounded-2xl aspect-[3/4]" />
           ))}
         </div>
      ) : products.length === 0 ? (
         <div className="p-8 text-center text-slate-400 text-sm bg-slate-50 rounded-2xl border border-slate-100">محصولی یافت نشد.</div>
      ) : (
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
           {products.slice(0, 5).map(product => (
              <ProductCard key={product.id} product={product} />
           ))}
         </div>
      )}
    </section>
  );
}

function HeroSlider({ block }: { block: CMSBlock }) {
  const slides = block.props.slides || [];
  if (slides.length === 0) return null;
  const slide = slides[0]; 
  return (
    <section className="relative w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-sm flex items-center justify-center">
      <img src={slide.imageUrl} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
      <div className="relative z-10 text-center flex flex-col items-center gap-4 px-4">
        <h2 className="text-3xl md:text-5xl font-black text-white">{slide.title}</h2>
        {slide.linkUrl && (
          <Link to={slide.linkUrl} className="mt-4 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-900/20">
            مشاهده محصولات
          </Link>
        )}
      </div>
    </section>
  );
}

function CategoryGrid({ block }: { block: CMSBlock }) {
   return (
      <section className="flex flex-col gap-6">
         <h2 className="text-xl font-extrabold text-slate-800">{block.props.title || "دسته‌بندی‌ها"}</h2>
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/catalog" className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col items-center gap-3 hover:-translate-y-1 transition-all">
                <div className="w-16 h-16 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-[10px]">Image Placeholder</div>
                <span className="font-bold text-slate-700 text-sm">کارت ویزیت</span>
            </Link>
            <Link to="/catalog" className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col items-center gap-3 hover:-translate-y-1 transition-all">
                <div className="w-16 h-16 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-[10px]">Image Placeholder</div>
                <span className="font-bold text-slate-700 text-sm">سربرگ و پاکت</span>
            </Link>
            <Link to="/catalog" className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col items-center gap-3 hover:-translate-y-1 transition-all">
                <div className="w-16 h-16 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-[10px]">Image Placeholder</div>
                <span className="font-bold text-slate-700 text-sm">تراکت و بروشور</span>
            </Link>
            <Link to="/catalog" className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col items-center gap-3 hover:-translate-y-1 transition-all">
                <div className="w-16 h-16 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-[10px]">Image Placeholder</div>
                <span className="font-bold text-slate-700 text-sm">لیبل و برچسب</span>
            </Link>
         </div>
      </section>
   );
}

function RichText({ block }: { block: CMSBlock }) {
  const sanitizedContent = DOMPurify.sanitize(block.props.html || "");
  return (
    <section className="prose prose-emerald max-w-none text-slate-700 my-8">
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </section>
  );
}

function BannerRow({ block }: { block: CMSBlock }) {
  const banners = block.props.banners || [];
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {banners.map((b: any, i: number) => (
         <div key={i} className="relative h-48 rounded-3xl overflow-hidden shadow-sm group">
            <img src={b.imageUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-slate-900/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
               <h3 className="text-white font-extrabold text-2xl drop-shadow-md">{b.title}</h3>
               {b.linkUrl && (
                  <Link to={b.linkUrl} className="mt-2 text-white bg-white/20 backdrop-blur border border-white/40 px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-white/40 transition-colors">
                     سفارش دهید
                  </Link>
               )}
            </div>
         </div>
      ))}
    </section>
  );
}

function FeatureList({ block }: { block: CMSBlock }) {
   const features = block.props.features || [];
   return (
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
         {features.map((f: any, i: number) => (
            <div key={i} className="flex flex-col items-center text-center gap-3 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
               <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                  <Star className="w-5 h-5" />
               </div>
               <h4 className="font-bold text-slate-800">{f.title}</h4>
               <p className="text-xs text-slate-500 leading-relaxed">{f.description}</p>
            </div>
         ))}
      </section>
   );
}

function CustomHTML({ block }: { block: CMSBlock }) {
  const cleanHTML = DOMPurify.sanitize(block.props.html || "");
  return <section dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
}

export default function BlockRenderer({ blocks }: { blocks: CMSBlock[] }) {
  if (!blocks || blocks.length === 0) return null;

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-16 w-full">
      {sortedBlocks.map(block => {
        switch (block.type) {
          case "latest_blogs":
             return <LatestBlogs key={block.id} block={block} />;
          case "hero_slider":
            return <HeroSlider key={block.id} block={block} />;
          case "category_grid":
            return <CategoryGrid key={block.id} block={block} />;
          case "rich_text":
            return <RichText key={block.id} block={block} />;
          case "banner_row":
            return <BannerRow key={block.id} block={block} />;
          case "feature_list":
            return <FeatureList key={block.id} block={block} />;
          case "product_carousel":
            return <ProductCarousel key={block.id} block={block} />;
          case "faq_accordion":
             return <div key={block.id} className="p-8 border border-slate-100 rounded-3xl bg-slate-50 text-center text-slate-400 text-xs font-mono">FAQ Accordion Area</div>;
          case "testimonials":
             return <div key={block.id} className="p-8 border border-slate-100 rounded-3xl bg-slate-50 text-center text-slate-400 text-xs font-mono">Testimonials Area</div>;
          case "video_embed":
             return <div key={block.id} className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-center text-white cursor-pointer"><PlayCircle className="w-16 h-16 opacity-50" /><span className="absolute mt-24 text-xs font-mono opacity-50">Video Embed: {block.props.url}</span></div>;
          case "custom_html":
            return <CustomHTML key={block.id} block={block} />;
          default:
            console.warn("Unknown block type", block.type);
            return null; // forward compatible
        }
      })}
    </div>
  );
}
