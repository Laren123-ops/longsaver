// app/nocode/src/LongSaverHome.jsx
export default function LongSaverHome({ user }) {
  return (
    <div style={{ padding: 24 }}>
      <h1>LongSaver</h1>
      <p>当前状态：{user ? `已登录：${user.email}` : "未登录"}</p>
    </div>
  );
}
