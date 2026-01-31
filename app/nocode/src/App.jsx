import { supabase } from './supabaseClient'

export default function App() {
  const signIn = async () => {
    const email = prompt('输入邮箱（会发 magic link）')
    if (!email) return

    const { error } = await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: window.location.origin, // ← 回到根域名，最稳
  },
})


    alert(error ? error.message : '已发送登录邮件，去邮箱点链接登录')
  }

  const insertOne = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) return alert(userError.message)
    if (!user) return alert('你还没登录，先点“邮箱登录”')

    const { error } = await supabase.from('expenses').insert({
      user_id: user.id,
      amount: 12.34,
      category: 'food',
      note: 'test from longsaver',
      spent_at: new Date().toISOString(),
    })

    alert(error ? error.message : '插入成功！去 Supabase Table Editor 看 expenses 表')
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>LongSaver Supabase Test</h1>
      <button onClick={signIn}>1) 邮箱登录</button>
      <button onClick={insertOne} style={{ marginLeft: 12 }}>
        2) 插入一条记账
      </button>
    </div>
  )
}
