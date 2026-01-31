import LongSaverHome from "./LongSaverHome"
import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

export default function App() {
  const [user, setUser] = useState(null)
  const [sending, setSending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    let unsub = null
    let timer = null

    const init = async () => {
      // 1) 吃 magic link 回来的 token，并把 session 存起来
      const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true })
      if (error) console.log("getSessionFromUrl error:", error.message)

      // 2) 清理 URL 的 hash（避免刷新反复处理）
      if (window.location.hash && window.location.hash.includes("access_token")) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname + window.location.search
        )
      }

      // 3) 读一次当前 user
      const { data: userData } = await supabase.auth.getUser()
      setUser(userData?.user ?? null)

      // 4) 监听登录/登出变化
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })
      unsub = sub?.subscription
    }

    init()

    // cooldown 倒计时
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000)
    }

    return () => {
      unsub?.unsubscribe()
      if (timer) clearInterval(timer)
    }
  }, [cooldown])

  const signIn = async () => {
    if (sending || cooldown > 0) return
    const email = prompt("输入邮箱（会发 magic link）")
    if (!email) return

    setSending(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // ✅ 关键：Vercel 上用 origin 就行（不用 /auth/callback）
        emailRedirectTo: window.location.origin,
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

  const insertOne = async () => {
    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr) return alert(userErr.message)
    if (!userData?.user) return alert("你还没登录，请先点“邮箱登录”。")

    const u = userData.user

    const { error } = await supabase.from("expenses").insert({
      user_id: u.id,
      amount: 12.34,
      category: "food",
      note: "test from longsaver",
    })

    alert(error ? error.message : "插入成功 ✅")
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    alert("已登出")
  }

  // ✅✅✅ 关键改动：登录后直接渲染 LongSaverHome
  if (user) {
    return <LongSaverHome user={user} />
  }

  // 未登录：继续显示你现在这个测试页面
  return (
    <div style={{ padding: 24 }}>
      <h2>LongSaver Supabase Test</h2>

      <div style={{ marginBottom: 12 }}>
        当前状态：{user ? `已登录：${user.email}` : "未登录"}
      </div>

      <button onClick={signIn} disabled={sending || cooldown > 0}>
        {sen
