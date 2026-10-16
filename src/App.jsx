import { useEffect, useState } from 'react';
import _ from 'lodash';
import { supabase } from './supabase.js';
import { listAllUsers } from './admin.js';

export default function App() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  return (
    <main className="wrap">
      <header className="row">
        <h1>Notes</h1>
        {session && <button onClick={() => supabase.auth.signOut()}>Sign out</button>}
      </header>
      {session ? <Home user={session.user} /> : <Auth />}
      <footer className="muted">Build: vuln-lab-v1</footer>
    </main>
  );
}

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  async function go(kind) {
    setMsg('');
    const fn = kind === 'up' ? supabase.auth.signUp : supabase.auth.signInWithPassword;
    const { error } = await fn.call(supabase.auth, { email, password });
    if (error) setMsg(error.message);
  }
  return (
    <section>
      <input aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input aria-label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <div className="row">
        <button onClick={() => go('in')}>Sign in</button>
        <button onClick={() => go('up')}>Sign up</button>
      </div>
      {msg && <p role="alert" className="error">{msg}</p>}
    </section>
  );
}

function Home({ user }) {
  const [notes, setNotes] = useState([]);
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [users, setUsers] = useState(null);

  async function load() {
    const n = await supabase.from('notes').select('*');
    setNotes(_.sortBy(n.data || [], 'created_at').reverse());
    const t = await supabase.from('todos').select('*');
    setTodos(t.data || []);
  }
  useEffect(() => { load(); }, []);

  async function addNote(e) {
    e.preventDefault();
    await supabase.from('notes').insert({ text, user_id: user.id });
    setText('');
    load();
  }

  async function removeTodo(id) {
    await supabase.rpc('delete_note', { note_id: id });
    load();
  }

  async function upload(e) {
    const file = e.target.files[0];
    if (file) await supabase.storage.from('uploads').upload(`${user.id}/${file.name}`, file, { upsert: true });
  }

  async function showUsers() {
    setUsers(await listAllUsers());
  }

  async function showUsersApi() {
    const res = await fetch(`${import.meta.env.VITE_FUNCTIONS_URL || 'https://mqdhisrirpesywdzoosj.supabase.co/functions/v1'}/admin-users`);
    setUsers(await res.json());
  }

  return (
    <section>
      <form onSubmit={addNote} className="row">
        <input aria-label="New note" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a note" />
        <button type="submit">Add</button>
      </form>
      <ul className="notes">
        {notes.map((n) => (
          <li key={n.id}>
            <span dangerouslySetInnerHTML={{ __html: n.text }} />
          </li>
        ))}
      </ul>
      <h2>My todos</h2>
      <ul>{todos.map((t) => <li key={t.id}>{t.title} <button onClick={() => removeTodo(t.id)}>×</button></li>)}</ul>
      <h2>Avatar</h2>
      <input type="file" aria-label="Upload avatar" onChange={upload} />
      <img src="https://mqdhisrirpesywdzoosj.supabase.co/storage/v1/object/public/public-assets/logo.svg" alt="logo" width="32" />
      <h2>Admin</h2>
      <div className="row">
        <button onClick={showUsers}>All users</button>
        <button onClick={showUsersApi}>All users (API)</button>
      </div>
      {users && <pre>{JSON.stringify(users, null, 2)}</pre>}
    </section>
  );
}
