import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function AuthCallback() {
  const [msg, setMsg] = useState("处理中...");

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);

        // 1) Supabase 回传错误（例如 otp_expired）
        const err = url.searchParams.get("error");
        const errDesc = url.searchParams.get("error_description");
        if (err) {
          setMsg(`登录失败：${decodeURIComponent(errDesc || err)}`);
          return;
        }

        // 2) implicit：token 在 hash 里，supabase 会自动处理（detectSessionInUrl: true）
        // 稍等一下再确认 session 是否落地
        await new Promise((r) => setTimeout(r, 200));

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data.session) throw new Error("session missing (token not stored)");

        setMsg("登录成功，正在跳转...");
        window.location.replace("/");
      } catch (e) {
        setMsg("登录失败：" + (e?.message || String(e)));
      }
    })();
  }, []);

  return <div style={{ padding: 24 }}>{msg}</div>;
}
