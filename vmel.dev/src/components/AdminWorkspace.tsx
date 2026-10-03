'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createAuthClient } from 'better-auth/react';
import { useAdminWorkspace } from '../stores/admin-workspace';
import type { PublicProject } from '../lib/project-validation';

type Project = PublicProject & { status: 'draft' | 'published'; sortOrder: number };
const authClient = createAuthClient();

export default function AdminWorkspace({ initialProjects, ownerName }: { initialProjects: Project[]; ownerName: string }) {
  const [projects, setProjects] = useState(initialProjects);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { filter, editingId, setFilter, edit } = useAdminWorkspace();
  const selected = projects.find((project) => project.id === editingId);

  async function refresh() {
    const response = await fetch('/api/admin/projects', { cache: 'no-store' });
    if (!response.ok) throw new Error('Unable to load projects');
    setProjects(await response.json());
  }
  async function mutate(path: string, method: string, body?: unknown) {
    setBusy(true); setMessage(''); setError('');
    try {
      const response = await fetch(path, { method, headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
      if (!response.ok) throw new Error((await response.json()).error || 'Unable to save changes');
      await refresh();
      setMessage('Changes saved.');
      return true;
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to save changes'); return false; }
    finally { setBusy(false); }
  }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = Object.fromEntries(data.entries());
    const success = await mutate(selected ? `/api/admin/projects/${selected.id}` : '/api/admin/projects', selected ? 'PATCH' : 'POST', {
      ...values, sortOrder: Number(values.sortOrder), technologies: String(values.technologies).split(',').map((value) => value.trim()).filter(Boolean),
    });
    if (success) { edit(null); form.reset(); }
  }
  async function move(id: string, direction: number) {
    const ids = projects.map((project) => project.id);
    const current = ids.indexOf(id);
    const next = current + direction;
    if (next < 0 || next >= ids.length) return;
    [ids[current], ids[next]] = [ids[next], ids[current]];
    await mutate('/api/admin/projects/reorder', 'POST', { ids });
  }
  async function remove(project: Project) {
    if (!window.confirm(`Delete “${project.title}”?`)) return;
    if (await mutate(`/api/admin/projects/${project.id}`, 'DELETE')) edit(null);
  }
  async function signOut() {
    await authClient.signOut();
    window.location.assign('/admin/login');
  }

  return <main className="admin-shell">
    <header className="admin-header"><Link href="/" className="text-link">← Portfolio</Link><div><span>{ownerName}</span><button onClick={signOut} className="admin-button secondary">Sign out</button></div></header>
    <p className="mono admin-eyebrow">OWNER WORKSPACE</p><h1>Your work,<br /><em>in order.</em></h1>
    <p className="admin-intro">Manage commercial case studies and personal projects. Drafts stay private.</p>
    <div className="admin-stats"><span>{projects.length} projects</span><span>{projects.filter((project) => project.status === 'published').length} published</span><span>{projects.filter((project) => project.status === 'draft').length} drafts</span></div>
    <p role="status" className="admin-success">{message}</p><p role="alert" className="admin-error">{error}</p>
    <div className="admin-columns">
      <section aria-labelledby="project-list-heading">
        <div className="admin-list-heading"><h2 id="project-list-heading">Projects</h2><button className="admin-button" onClick={() => edit(null)} disabled={busy}>New project</button></div>
        <label className="admin-filter">Show<select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}><option value="all">All work</option><option value="commercial">Commercial</option><option value="personal">Personal</option></select></label>
        <ul className="admin-projects">{projects.filter((project) => filter === 'all' || project.kind === filter).map((project) => <li key={project.id}>
          <div><h3>{project.title}</h3><p>{project.kind} · {project.status}</p></div>
          <div className="admin-row-actions">
            <button onClick={() => move(project.id, -1)} disabled={busy || projects[0]?.id === project.id} aria-label={`Move ${project.title} up`}>↑</button>
            <button onClick={() => move(project.id, 1)} disabled={busy || projects.at(-1)?.id === project.id} aria-label={`Move ${project.title} down`}>↓</button>
            <button onClick={() => edit(project.id)} disabled={busy}>Edit</button>
            <button onClick={() => remove(project)} disabled={busy} aria-label={`Delete ${project.title}`}>Delete</button>
          </div>
        </li>)}</ul>
        {!projects.length && <p className="admin-intro">Start with one project. Add only the work and responsibilities you can substantiate.</p>}
      </section>
      <section aria-labelledby="project-editor-heading">
        <h2 id="project-editor-heading">{selected ? 'Edit project' : 'New project'}</h2>
        <form key={selected?.id || 'new'} className="admin-form" onSubmit={save}>
          <label>Title<input name="title" defaultValue={selected?.title} minLength={3} maxLength={100} required /></label>
          <label>Slug<input name="slug" defaultValue={selected?.slug} pattern="[a-z0-9]+(-[a-z0-9]+)*" minLength={2} maxLength={80} required /></label>
          <label>Summary<textarea name="summary" defaultValue={selected?.summary} rows={3} minLength={10} maxLength={400} required /></label>
          <label>Case study<textarea name="body" defaultValue={selected?.body} rows={8} minLength={10} maxLength={20000} required /></label>
          <p className="admin-hint">Describe the problem, your responsibilities, the decisions and verified results. Separate paragraphs with a blank line.</p>
          <label>Technologies<input name="technologies" defaultValue={selected?.technologies.join(', ')} placeholder="Next.js, PostgreSQL, Drizzle" /></label>
          <div className="admin-field-pair"><label>Type<select name="kind" defaultValue={selected?.kind || 'commercial'}><option value="commercial">Commercial</option><option value="personal">Personal</option></select></label><label>Visibility<select name="status" defaultValue={selected?.status || 'draft'}><option value="draft">Draft</option><option value="published">Published</option></select></label></div>
          <label>Order<input name="sortOrder" type="number" min={0} max={10000} defaultValue={selected?.sortOrder ?? projects.length} required /></label>
          <label>Demo URL<input name="demoUrl" type="url" defaultValue={selected?.demoUrl || ''} placeholder="https://…" /></label>
          <label>Repository URL<input name="repositoryUrl" type="url" defaultValue={selected?.repositoryUrl || ''} placeholder="https://…" /></label>
          <p className="admin-hint">Links are available for personal projects. Commercial cases remain anonymized.</p>
          <button className="admin-button" disabled={busy}>{busy ? 'Saving…' : selected ? 'Save project' : 'Create project'}</button>
        </form>
      </section>
    </div>
  </main>;
}
