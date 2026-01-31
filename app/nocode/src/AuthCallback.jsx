import { useEffect } from "react";
import { supabase } from "../supabaseClient"; // 按你实际路径改

export default function AuthCallback() {
  useEffect(() => {
    (async () => {
      // 关键：把 ?code=... 换成 session
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (error) console.error("exchangeCodeForSession error:", error);

      // 登录成功后跳回首页
      window.location.replace("/");
    })();
  }, []);

  return <div>Signing you in...</div>;
}
