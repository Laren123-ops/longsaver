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
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // 你文件路径按实际改：比如 "../lib/supabaseClient"

export default function AuthCallback() {
  const [msg, setMsg] = useState("处理中...");

  useEffect(() => {
    const run = async () => {
      // 1) 解析 hash 里的 token
      const hash = window.location.hash; // 形如 "#access_token=...&refresh_token=..."
      const params = new URLSearchParams(hash.replace(/^#/, ""));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token || !refresh_token) {
        setMsg("回调里没有 token（可能不是 implicit link）");
        return;
      }

      // 2) 写入 session（关键）
      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        console.error(error);
        setMsg("setSession 失败: " + error.message);
        return;
      }

      setMsg("登录成功 ✅，准备跳转...");
      // 3) 清掉 hash，避免重复触发
      window.location.hash = "";
      // 4) 跳回首页/你想去的页面
      window.location.replace("/");
    };

    run();
  }, []);

  return <div style={{ padding: 24 }}>{msg}</div>;
}
