import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useData } from "../lib/data";
import ProductCard from "../components/ProductCard";
import { useSeo } from "../lib/seo";
import { track } from "../lib/analytics";

function Icon({ name }: { name: "store" | "phone" | "mail" | "pin" }) {
  const body = {
    store: <><path d="M4 10.5V20h16v-9.5"/><path d="M3 10.5h18L19 4H5l-2 6.5Z"/><path d="M8 20v-5h8v5"/></>,
    phone: <path d="M7.5 3.5 5 4.8c-.8.4-1.1 1.3-.8 2.2 1.8 5.7 6.3 10.2 12 12 .9.3 1.8 0 2.2-.8l1.3-2.5-3.4-2.1-1.7 1.7c-2.2-.9-4.4-3.1-5.3-5.3L11 8.3 8.9 4.9 7.5 3.5Z"/>,
    mail: <><rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="m5 7 7 5 7-5"/></>,
    pin: <><path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.3"/></>,
  };
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{body[name]}</svg>;
}

function StoreSkeleton() {
  return <div className="container section"><div className="skeleton" style={{height:270,borderRadius:26,marginBottom:24}}/><div className="grid grid-4 seller-product-grid">{Array.from({length:4}).map((_,i)=><div key={i} className="skeleton" style={{height:330,borderRadius:18}}/>)}</div></div>;
}

export default function SellerStore() {
  const { slug } = useParams();
  const { sellers, products, loading } = useData();
  const seller = sellers.find((item) => item.slug === slug);
  const sellerProducts = seller ? products.filter((product) => product.seller.slug === seller.slug) : [];

  useSeo({title: seller ? `${seller.storeName} | فروشگاه` : "فروشگاه پیدا نشد", description: seller?.description ?? "مشاهده فروشگاه و محصولات منتشرشده فروشنده", canonicalPath: `/sellers/${slug}`});
  useEffect(() => { if (seller) track("SELLER_PAGE_VIEW", { sellerId: undefined, metadata: { sellerSlug: seller.slug } }); }, [seller]);
  if (loading) return <StoreSkeleton />;
  if (!seller) return <div className="container section"><div className="empty-state" style={{minHeight:360,display:"grid",placeItems:"center",textAlign:"center",padding:32}}><div><Icon name="store"/><h1>فروشگاه پیدا نشد</h1><p>این فروشگاه یافت نشد یا در حال حاضر در دسترس نیست.</p><Link to="/products" className="btn btn-primary">مشاهده فروشگاه‌ها</Link></div></div></div>;

  return (
    <div className="container section seller-public-page">
      <section className="seller-public-hero fade-in-up">
        <div className="seller-public-avatar">
          {seller.logoUrl ? <img src={seller.logoUrl} alt={seller.storeName} onError={(e)=>{e.currentTarget.style.display="none";}}/> : <Icon name="store"/>}
        </div>
        <div className="seller-public-main">
          <div className="seller-public-kicker"><Icon name="store"/> فروشگاه رسمی</div>
          <h1>{seller.storeName}</h1>
          <div className="seller-public-handle">@{seller.slug}</div>
          {seller.description && <p className="seller-public-bio">{seller.description}</p>}
          {seller.category && <span className="seller-public-category">{seller.category.name}</span>}
        </div>
        <div className="seller-public-actions">
          {seller.contactPhone && <a href={`tel:${seller.contactPhone}`} className="btn btn-dark-public"><Icon name="phone"/> تماس با فروشگاه</a>}
          {seller.contactEmail && <a href={`mailto:${seller.contactEmail}`} className="btn btn-outline-public"><Icon name="mail"/> ایمیل</a>}
        </div>
      </section>

      <section className="seller-info-strip">
        <div className="seller-stat"><strong>{sellerProducts.length}</strong><span>محصول منتشرشده</span></div>
        {seller.contactPhone && <div className="seller-contact-item"><Icon name="phone"/><div><small>شماره تماس</small><a href={`tel:${seller.contactPhone}`}>{seller.contactPhone}</a></div></div>}
        {seller.contactEmail && <div className="seller-contact-item"><Icon name="mail"/><div><small>ایمیل</small><a href={`mailto:${seller.contactEmail}`}>{seller.contactEmail}</a></div></div>}
        {seller.address && <div className="seller-contact-item seller-address"><Icon name="pin"/><div><small>آدرس فروشگاه</small><span>{seller.address}</span></div></div>}
      </section>

      <div className="section-head seller-products-heading"><div><span className="seller-public-kicker">کالکشن فروشگاه</span><h2>محصولات این فروشگاه</h2><p>{sellerProducts.length} محصول برای مشاهده و بررسی</p></div></div>
      {sellerProducts.length === 0 ? <div className="empty-state seller-empty"><Icon name="store"/><h3>هنوز محصولی منتشر نشده است</h3><p>محصولات این فروشگاه پس از انتشار در این بخش نمایش داده می‌شوند.</p></div> : <div className="grid grid-4 seller-product-grid">{sellerProducts.map((product,index)=><div key={product.id} className="fade-in-up" style={{animationDelay:`${Math.min(index,8)*.05}s`}}><ProductCard product={product}/></div>)}</div>}
    </div>
  );
}
