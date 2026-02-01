import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function AuthCallback() {
  const [msg, setMsg] = useState("处理中...");

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code"); // PKCE 会带 ?code=...

        if (code) {
          // PKCE: 需要用 code 换 session
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          // Implicit: token 在 hash 里，detectSessionInUrl 会自动吃掉
          // 这里主动读一下，确保 session 落地
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          if (!data.session) {
            throw new Error("Auth session missing (no session after callback).");
          }
        }

        setMsg("登录成功，正在跳转...");
        window.location.replace("/"); // 回到你的主页面
      } catch (e) {
        console.error(e);
        setMsg("登录失败：" + (e?.message || String(e)));
      }
    })();
  }, []);

  return <div style={{ padding: 24 }}>{msg}</div>;
}
