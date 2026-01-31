import { useEffect, useState } from "react"
import LongSaverHome from "./LongSaverHome"
import { supabase } from "./supabaseClient"

export default function App() {
  const [session, setSession] = useState(null)

  // 监听登录态（关键：只要 callback 成功存了 session，这里就会变成已登录）
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null))

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  const user = session?.user ?? null

  const signIn = async () => {
    const email = prompt("输入邮箱（会发 magic link）")
    if (!email) return

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // 关键：统一走 callback
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    alert(error ? error.message : "已发送登录邮件，去邮箱点链接完成登录。")
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  // ✅ 登录后：回到你的“原 longsaver 页面”
  if (user) {
    return <LongSaverHome user={user} />
  }

  // 未登录：只显示登录入口
  return (
    <div style={{ padding: 24 }}>
      <h2>LongSaver</h2>
      <div style={{ marginBottom: 12 }}>当前状态：未登录</div>
      <button onClick={signIn}>邮箱登录</button>
      <button onClick={signOut} style={{ marginLeft: 12 }} disabled>
        登出
      </button>
    </div>
  )
}
