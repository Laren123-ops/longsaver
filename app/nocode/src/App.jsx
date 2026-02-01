import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import AuthedApp from "./AuthedApp"; // 你刚建的那个
import LongSaverHome from "./LongSaverHome"; // 如果你还想保留占位页可删

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1) 初始化拿 user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });

    // 2) 监听登录态变化
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub?.subscription?.unsubscribe();
  }, []);

  // ✅ 注意：return 必须在组件内部
  if (user) {
    return <AuthedApp user={user} />; // 或者 <AuthedApp />
  }

  // 未登录页面
  const signIn = async () => {
    const email = prompt("输入邮箱（会发 magic link）");
    if (!email) return;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) alert(error.message);
    else alert("已发送登录邮件，请在同一浏览器点链接完成登录。");
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>LongSaver</h2>
      <div style={{ marginBottom: 12 }}>当前状态：未登录</div>
      <button onClick={signIn}>邮箱登录</button>
    </div>
  );
}
