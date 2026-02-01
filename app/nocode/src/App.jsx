import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import LongSaverHome from "./LongSaverHome"
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  const [user, setUser] = useState(null)
  const [sending, setSending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    let timer = null

    // 1) 初始化：拿当前 session / user
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user ?? null)

      // 2) 监听登录态变化（点完邮件链接回到 / 后，会触发这里）
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

      return () => sub?.subscription?.unsubscribe()
    }

    const unsubPromise = init()

    // cooldown 倒计时
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000)
    }

    return () => {
      unsubPromise.then((unsub) => unsub && unsub())
      if (timer) clearInterval(timer)
    }
  }, [cooldown])

  // 发 magic link（注意：回跳到 /auth/callback）
  const signIn = async () => {
    if (sending || cooldown > 0) return
    const email = prompt("输入邮箱（会发 magic link）")
    if (!email) return

    setSending(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`, // ✅ 关键
      },
    })
    setSending(false)

    if (error) {
      alert(error.message)
      if (String(error.message).toLowerCase().includes("rate limit")) {
        setCooldown(60)
      }
      return
    }

    alert("已发送登录邮件，请在同一浏览器里点链接完成登录。")
    setCooldown(20)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  // ✅ 登录后：渲染你原来的 LongSaver 主页
  if (user) {
    return <LongSaverHome user={user} onSignOut={signOut} />
  }

  // ✅ 未登录：只显示登录入口（不要再用 Test 页覆盖你的主页）
  return (
    <div style={{ padding: 24 }}>
      <h2>LongSaver</h2>
      <div style={{ marginBottom: 12 }}>当前状态：未登录</div>

      <button onClick={signIn} disabled={sending || cooldown > 0}>
        {sending ? "发送中..." : cooldown > 0 ? `请等待 ${cooldown}s` : "邮箱登录"}
      </button>
    </div>
  )
}
