import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

export default function App() {
  const [user, setUser] = useState(null)
  const [sending, setSending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  // 1) 吃掉 magic link 回来的 hash token，并存 session
  useEffect(() => {
    let unsub = null
    let timer = null

    const init = async () => {
      // 关键：如果 URL 带 #access_token=... 这里会把 session 存起来
      const { data, error } = await supabase.auth.getSessionFromUrl({
        storeSession: true,
      })

      if (error) {
        // 常见：链接过期 / 不是有效的 magic link
        console.log("getSessionFromUrl error:", error.message)
      }

      // 清理 URL（去掉 #access_token...），避免刷新重复处理
      if (window.location.hash && window.location.hash.includes("access_token")) {
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
      }

      // 取当前用户
      const { data: userData } = await supabase.auth.getUser()
      setUser(userData?.user ?? null)

      // 监听后续登录/登出变化
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })
      unsub = sub?.subscription
    }

    init()

    // cooldown 倒计时（防止你短时间狂点又被限流）
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000)
    }

    return () => {
      unsub?.unsubscribe()
      if (timer) clearInterval(timer)
    }
  }, [cooldown])

  // 2) 发 magic link（加防连点 & 限流提示）
  const signIn = async () => {
    if (sending || cooldown > 0) return

    const email = prompt("输入邮箱（会发 magic link）")
    if (!email) return

    setSending(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // 最稳：回到同一个域名根路径，由 App 自己吃 token
        emailRedirectTo: window.location.origin,
      },
    })

    setSending(false)

    if (error) {
      alert(error.message)

      // 如果是限流，给个更明确的提示 + 强制冷却
      if (String(error.message).toLowerCase().includes("rate limit")) {
        setCooldown(60) // 60 秒后再试（你也可以改成 120）
      }
      return
    }

    alert("已发送登录邮件，去邮箱点链接完成登录。")
    setCooldown(20) // 正常也冷却 20 秒，防止误点
  }

  // 3) 插入一条记录（需要你已登录 + RLS 正常）
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

  return (
    <div style={{ padding: 24 }}>
      <h2>LongSaver Supabase Test</h2>

      <div style={{ marginBottom: 12 }}>
        当前状态：{user ? `已登录：${user.email}` : "未登录"}
      </div>

      <button onClick={signIn} disabled={sending || cooldown > 0}>
        {sending ? "发送中..." : cooldown > 0 ? `请等待 ${cooldown}s` : "1) 邮箱登录"}
      </button>

      <button onClick={insertOne} style={{ marginLeft: 12 }}>
        2) 插入一条记账
      </button>

      <button onClick={signOut} style={{ marginLeft: 12 }} disabled={!user}>
        登出
      </button>
    </div>
  )
}
