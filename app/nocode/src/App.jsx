import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import LongSaverHome from "./LongSaverHome" // ✅ 你的原页面组件，见下方 D

export default function App() {
  const [user, setUser] = useState(null)
  const [sending, setSending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  // ✅ 进站时：读取 session（Supabase 会自动从 #access_token 里解析并持久化）
  useEffect(() => {
    let timer = null
    const init = async () => {
      // 1) 读 session / user
      const { data: sessionData } = await supabase.auth.getSession()
      setUser(sessionData?.session?.user ?? null)

      // 2) 监听登录态变化
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

      // 3) 清理 URL hash（避免你刷新时反复看到一长串 token）
      if (window.location.hash && window.location.hash.includes("access_token")) {
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
      }

      return () => sub?.subscription?.unsubscribe()
    }

    const cleanupPromise = init()

    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
      // eslint-disable-next-line no-unused-vars
      cleanupPromise?.then((cleanup) => cleanup && cleanup())
    }
  }, [cooldown])

  // ✅ 发 magic link（implicit flow：emailRedirectTo 回到同域根路径）
  const signIn = async () => {
    if (sending || cooldown > 0) return
    const email = prompt("输入邮箱（会发 magic link）")
    if (!email) return

    setSending(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin, // ✅ 回到 https://longsaver-xftw.vercel.app
      },
    })
    setSending(false)

    if (error) {
      alert(error.message)
      if (String(error.message).toLowerCase().includes("rate limit")) setCooldown(60)
      return
    }

    alert("已发送登录邮件，去邮箱点链接完成登录。")
    setCooldown(20)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  // ✅ 你现在要的效果：登录后直接进入 LongSaver 原页面
  if (user) {
    return <LongSaverHome user={user} />
  }

  // 未登录：只显示登录入口（不要再用测试页挡住你的产品）
  return (
    <div style={{ padding: 24 }}>
      <h2>LongSaver</h2>
      <p>当前状态：未登录</p>

      <button onClick={signIn} disabled={sending || cooldown > 0}>
        {sending ? "发送中..." : cooldown > 0 ? `请等待 ${cooldown}s` : "邮箱登录"}
      </button>

      <button onClick={signOut} style={{ marginLeft: 12 }} disabled>
        登出
      </button>
    </div>
  )
}
