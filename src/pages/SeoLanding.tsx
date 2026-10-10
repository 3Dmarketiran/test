import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSeo } from "../lib/seo";

const SITE = "https://3dmarketiran.ir";

type LandingSection = { title: string; body: string };
type LandingPage = {
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  sections: LandingSection[];
  terms: string[];
};

const PAGES: Record<string, LandingPage> = {
  "/3d-marketplace": {
    path: "/3d-marketplace/",
    title: "مارکت سه‌بعدی ایران | ویترین محصولات با 3D و AR",
    description: "در 3DMarketIran با فروشگاه‌ها و محصولات دارای نمایش سه‌بعدی آشنا شوید؛ ویترینی دیجیتال برای بررسی تعاملی محصول و تجربه واقعیت افزوده (AR).",
    eyebrow: "3D MARKETPLACE · IRAN",
    heading: "مارکت سه‌بعدی برای معرفی بهتر محصولات",
    intro: "3DMarketIran به فروشگاه‌ها کمک می‌کند محصولات خود را با تصاویر، مدل سه‌بعدی و تجربه واقعیت افزوده معرفی کنند؛ مشتری هم پیش از تماس با فروشنده، جزئیات محصول را بهتر بررسی می‌کند.",
    sections: [
      { title: "فروشگاه و محصول را در یک ویترین دیجیتال ببینید", body: "در فهرست فروشگاه‌ها بگردید، صفحه‌ی فروشنده را باز کنید و اطلاعات هر محصول را از یک مسیر روشن بررسی کنید. تجربه‌ی سه‌بعدی برای محصولاتی که مدل سازگار دارند در دسترس قرار می‌گیرد." },
      { title: "نمایش تعاملی 3D و تجربه‌ی AR", body: "مدل سه‌بعدی به مخاطب امکان می‌دهد محصول را از زاویه‌های مختلف ببیند. در دستگاه‌ها و محصول‌های سازگار، تجربه‌ی واقعیت افزوده می‌تواند نمایش مدل را به فضای اطراف کاربر نزدیک‌تر کند." },
      { title: "مناسب فروشگاه‌هایی که می‌خواهند محصول را بهتر معرفی کنند", body: "فروشگاه‌داران می‌توانند برای محصولات منتشرشده، صفحه‌ای اختصاصی با توضیحات و رسانه‌های محصول داشته باشند و مشتری را برای اطلاعات بیشتر به ارتباط مستقیم با فروشنده هدایت کنند." },
    ],
    terms: ["مارکت سه‌بعدی ایران", "فروشگاه سه‌بعدی", "3D marketplace", "ویترین محصولات 3D", "فروشگاه محصولات با AR"],
  },
  "/3d-product-viewer": {
    path: "/3d-product-viewer/",
    title: "نمایشگر سه‌بعدی محصول | مشاهده آنلاین مدل 3D",
    description: "نمایشگر محصول سه‌بعدی در 3DMarketIran به مشتری کمک می‌کند مدل‌های سازگار را تعاملی مشاهده کند، تصاویر محصول را بررسی کند و جزئیات خرید را از فروشگاه بگیرد.",
    eyebrow: "INTERACTIVE PRODUCT VIEWER",
    heading: "نمایشگر سه‌بعدی محصول برای تجربه‌ای واضح‌تر",
    intro: "با نمایش سه‌بعدی محصول، مخاطب فقط به یک تصویر ثابت محدود نیست. در 3DMarketIran می‌تواند تصاویر محصول را ببیند و برای موارد دارای مدل سازگار، نمای تعاملی 3D را باز کند.",
    sections: [
      { title: "مشاهده‌ی مدل از زاویه‌های مختلف", body: "نمایشگر 3D امکان چرخاندن و بررسی مدل را در مرورگرهای پشتیبانی‌شده فراهم می‌کند. کیفیت تجربه به فایل مدل، دستگاه و مرورگر وابسته است." },
      { title: "تصویر محصول بدون حذف جزئیات", body: "گالری عکس مکمل مدل سه‌بعدی است و برای مشاهده‌ی جزئیات ظاهری و مقایسه‌ی چند تصویر در صفحه‌ی محصول قرار دارد." },
      { title: "از مشاهده‌ی محصول تا تماس با فروشگاه", body: "پس از بررسی محصول، مشتری می‌تواند مشخصات ثبت‌شده و راه‌های ارتباطی فروشگاه را بررسی کند. قیمت و اطلاعات هر محصول بر اساس داده‌های همان فروشنده نمایش داده می‌شود." },
    ],
    terms: ["نمایشگر سه‌بعدی محصول", "نمایش محصول سه‌بعدی", "3D product viewer", "مشاهده آنلاین مدل 3D", "گالری محصول سه‌بعدی"],
  },
  "/augmented-reality-products": {
    path: "/augmented-reality-products/",
    title: "واقعیت افزوده محصولات | نمایش AR در 3DMarketIran",
    description: "با تجربه‌ی واقعیت افزوده (AR) محصولات در 3DMarketIran آشنا شوید؛ مدل‌های سازگار را روی دستگاه پشتیبانی‌شده بررسی کنید و قبل از خرید دید دقیق‌تری بگیرید.",
    eyebrow: "AUGMENTED REALITY · AR",
    heading: "واقعیت افزوده برای دیدن محصول در فضای واقعی‌تر",
    intro: "واقعیت افزوده می‌تواند نمایش دیجیتال یک محصول را با محیط اطراف کاربر ترکیب کند. در 3DMarketIran، دسترسی به AR به وجود فایل مناسب و پشتیبانی دستگاه و مرورگر بستگی دارد.",
    sections: [
      { title: "AR محصول چیست؟", body: "در تجربه‌ی واقعیت افزوده، مدل سه‌بعدی روی تصویر دوربین یا در محیط سازگار دستگاه نمایش داده می‌شود. این قابلیت برای همه‌ی محصولات یا همه‌ی دستگاه‌ها تضمین‌شده نیست." },
      { title: "چرا مدل و مشخصات محصول اهمیت دارد؟", body: "مدل مناسب، تصاویر واضح و ابعاد دقیق به مخاطب کمک می‌کنند برداشت بهتری از ظاهر محصول داشته باشد. تجربه‌ی AR جایگزین بررسی مشخصات، شرایط فروش و گفت‌وگو با فروشنده نیست." },
      { title: "مشاهده‌ی محصولات سازگار", body: "صفحه‌ی هر محصول را باز کنید و در صورت وجود گزینه‌های 3D یا AR، دستورالعمل نمایش روی همان صفحه را دنبال کنید. اگر این گزینه موجود نیست، تصاویر و مشخصات ثبت‌شده همچنان قابل بررسی‌اند." },
    ],
    terms: ["واقعیت افزوده محصولات", "نمایش AR محصول", "AR product visualization", "محصول با واقعیت افزوده", "3D و AR برای فروشگاه"],
  },
};

export default function SeoLanding() {
  const location = useLocation();
  const page = useMemo(() => PAGES[location.pathname.replace(/\/+$/, "")] ?? PAGES["/3d-marketplace"], [location.pathname]);
  const canonical = `${SITE}${page.path}`;
  const schema = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical, name: page.title, description: page.description, inLanguage: "fa-IR", isPartOf: { "@id": `${SITE}/#website` } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "خانه", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "فروشگاه‌ها", item: `${SITE}/products/` },
        { "@type": "ListItem", position: 3, name: page.heading, item: canonical },
      ] },
    ],
  }), [canonical, page]);

  useSeo({ title: page.title, description: page.description, canonicalPath: page.path, structuredData: schema });

  return (
    <main className="container section seo-landing-page">
      <nav className="seo-landing-breadcrumb" aria-label="مسیر صفحه"><Link to="/">خانه</Link><span aria-hidden="true">/</span><Link to="/products/">فروشگاه‌ها</Link><span aria-hidden="true">/</span><span>{page.heading}</span></nav>
      <header className="seo-landing-hero">
        <span className="seo-landing-eyebrow">{page.eyebrow}</span>
        <h1>{page.heading}</h1>
        <p>{page.intro}</p>
        <div className="seo-landing-actions"><Link to="/products/" className="btn btn-primary">مشاهده فروشگاه‌ها</Link><Link to="/plans/" className="btn btn-outline">پلن فروشندگان</Link></div>
      </header>
      <div className="seo-landing-sections">
        {page.sections.map((section, index) => <section className="seo-landing-card" key={section.title}><span className="seo-landing-index">{String(index + 1).padStart(2, "0")}</span><div><h2>{section.title}</h2><p>{section.body}</p></div></section>)}
      </div>
      <section className="seo-landing-bottom"><div><h2>از کجا شروع کنید؟</h2><p>محصول‌ها و فروشگاه‌های منتشرشده را بررسی کنید و برای جزئیات بیشتر با فروشنده در ارتباط باشید.</p></div><Link to="/products/" className="btn btn-primary">ورود به فهرست فروشگاه‌ها</Link></section>
      <div className="seo-landing-related" aria-label="موضوعات مرتبط">{page.terms.map((term) => <span key={term}>{term}</span>)}</div>
    </main>
  );
}
