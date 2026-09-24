import React from "react";

interface Props { children: React.ReactNode }
interface State { hasError: boolean; message: string }

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, message: "" };
  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, message: error instanceof Error ? error.message : "خطای غیرمنتظره" };
  }
  componentDidCatch(error: unknown) {
    if (import.meta.env.DEV) console.error("Public UI error boundary:", error);
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    return <main className="error-boundary"><div className="error-boundary__card"><div className="error-boundary__icon">!</div><h1>نمایش این بخش با خطا مواجه شد</h1><p>صفحه را دوباره بارگذاری کنید. داده‌های منتشرشده و اتصال سرویس را نیز بررسی کنید.</p>{import.meta.env.DEV && <code>{this.state.message}</code>}<button className="btn btn-primary" onClick={() => window.location.reload()}>بارگذاری مجدد</button></div></main>;
  }
}
