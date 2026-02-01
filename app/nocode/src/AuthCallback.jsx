import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function AuthCallback() {
  const [msg, setMsg] = useState("处理中...");

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);

        // ✅ 先处理 Supabase 回传的错误
        const err = url.searchParams.get("error");
        const errDesc = url.searchParams.get("error_description");
        if (err) {
          setMsg(`登录失败：${decodeURIComponent(errDesc || err)}`);
          return;
        }

        // ✅ PKCE：用 code 换 session
        const code = url.searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        // ✅ 确认 session 已落地
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data.session) throw new Error("session missing");

        setMsg("登录成功，正在跳转...");
        window.location.replace("/");
      } catch (e) {
        setMsg("登录失败：" + (e?.message || String(e)));
      }
    })();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Auth Callback</h2>
      <p>{msg}</p>
      <button onClick={() => window.location.replace("/")}>回到首页</button>
    </div>
  );
}
