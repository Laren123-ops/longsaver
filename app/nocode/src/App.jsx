import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
// import LongSaverHome from "./LongSaverHome"  // 等你主页组件准备好再打开

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    let unsub

    const init = async () => {
      const href = window.location.href

      // ✅ 兼容 1：magic link 回来是 #access_token=...
      if (href.includes("#access_token=") || href.includes("refresh_token=")) {
        const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true })
        if (error) alert(error.message)

        // 清理 URL hash，避免刷新重复处理
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
      }

      // ✅ 兼容 2：如果你之后改成 PKCE，回来是 ?code=...
      if (href.includes("code=")) {
        const { error } = await supabase.auth.exchangeCodeForSession(href)
        if (error) alert(error.message)
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
      }

      // ✅ 读取 session（如果上面成功，这里就能拿到）
      const { data } = await supabase.auth.getSession()
      setSession(data.session ?? null)

      // ✅ 监听后续变化
      const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession ?? null)
      })
      unsub = sub.subscription
    }

    init()

    return () => unsub?.unsubscribe()
  }, [])

  const user = session?.user ?? null

  const signIn = async () => {
    const email = prompt("输入邮箱（会发 magic link）")
    if (!email) return

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // ✅ 现在先用根路径，让 App.jsx 自己吃掉 #access_token
        emailRedirectTo: window.location.origin,
      },
    })

    alert(error ? error.message : "已发送登录邮件，去邮箱点链接完成登录。")
  }

  const insertOne = async () => {
    // ✅ 直接用 session 判断是否登录
    if (!user) return alert("你还没登录成功，请先点邮箱登录，并从邮件链接打开回来。")

    const { error } = await supabase.from("expenses").insert({
      user_id: user.id,
      amount: 12.34,
      category: "food",
      note: "test from longsaver",
    })

    alert(error ? error.message : "插入成功 ✅")
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  // ✅ 登录后你想进原来的 longsaver 页面，就在这里切回去：
  // if (user) return <LongSaverHome user={user} />

  return (
    <div style={{ padding: 24 }}>
      <h2>LongSaver Supabase Test</h2>
      <div style={{ marginBottom: 12 }}>当前状态：{user ? `已登录：${user.email}` : "未登录"}</div>

      <button onClick={signIn}>1) 邮箱登录</button>
      <button onClick={insertOne} style={{ marginLeft: 12 }}>
        2) 插入一条记账
      </button>
      <button onClick={signOut} style={{ marginLeft: 12 }} disabled={!user}>
        登出
      </button>
    </div>
  )
}
