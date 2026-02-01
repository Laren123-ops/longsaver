import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import LongSaverHome from "./LongSaverHome" // 你的原主页组件（确保文件存在）

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 进来先读 session（如果你已经登录过，会直接有）
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user ?? null)
      setLoading(false)
    }

    init()

    // 监听登录/登出
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => sub?.subscription?.unsubscribe()
  }, [])

  const signIn = async () => {
    const email = prompt("输入邮箱（会发 magic link）")
    if (!email) return

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // 关键：跳到 /auth/callback（我们下面会写这个页面来换 session）
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    alert(error ? error.message : "已发送登录邮件，去邮箱点链接完成登录。")
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) return <div style={{ padding: 24 }}>加载中…</div>

  // ✅ 登录后回到你原来的页面
  if (user) return <LongSaverHome user={user} onSignOut={signOut} />

  // 未登录就显示一个简单登录入口（你可以换成你自己更漂亮的 UI）
  return (
    <div style={{ padding: 24 }}>
      <h1>LongSaver</h1>
      <p>当前状态：未登录</p>
      <button onClick={signIn}>邮箱登录</button>
    </div>
  )
}
