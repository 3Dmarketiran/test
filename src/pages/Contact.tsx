import React from "react";
import { useData } from "../lib/data";
import { useSeo } from "../lib/seo";

export default function Contact() {
  const { settings } = useData();
  const platformName = settings?.platformName ?? "پلتفرم نمایشگاه محصول";
  useSeo({ title: "تماس با ما", description: `اطلاعات تماس ${platformName}` });

  return (
    <div className="container section simple-page">
      <h1>تماس با ما</h1>
      <p>
        برای پرسش درباره یک محصول خاص، لطفاً مستقیماً با فروشنده آن محصول (از طریق صفحه فروشگاه فروشنده) در
        تماس باشید. برای موضوعات مربوط به خود پلتفرم می‌توانید از راه‌های زیر با ما در ارتباط باشید.
      </p>
      <div className="contact-card">
        {settings?.contactEmail && <p>📧 ایمیل: <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></p>}
        {settings?.contactPhone && <p>📞 تلفن: <a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a></p>}
        {!settings?.contactEmail && !settings?.contactPhone && <p>اطلاعات تماس هنوز توسط مدیر پلتفرم ثبت نشده است.</p>}
        {Object.entries(settings?.socialLinks ?? {}).map(([k, v]) => (
          <p key={k}>🔗 {k}: <a href={v} target="_blank" rel="noreferrer noopener">{v}</a></p>
        ))}
      </div>
    </div>
  );
}
