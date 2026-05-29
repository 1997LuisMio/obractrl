import { useState } from "react";

const initialProjects = [
  { id: 1, name: "Torre Residencial Norte", location: "Monterrey, NL", progress: 68, status: "active", team: 12, due: "2026-09-15" },
  { id: 2, name: "Puente Vehicular Km 47", location: "Guadalajara, JAL", progress: 42, status: "active", team: 8, due: "2026-12-01" },
  { id: 3, name: "Centro Comercial Sur", location: "CDMX", progress: 91, status: "finishing", team: 6, due: "2026-06-30" },
];

const initialTasks = [
  { id: 1, projectId: 1, title: "Colada de losa nivel 8", assignee: "Carlos Méndez", priority: "high", status: "in-progress", due: "2026-06-02", category: "Estructura" },
  { id: 2, projectId: 1, title: "Instalación eléctrica pisos 4-6", assignee: "Ana Torres", priority: "medium", status: "pending", due: "2026-06-10", category: "Instalaciones" },
  { id: 3, projectId: 1, title: "Revisión de planos hidráulicos", assignee: "Luis Ramírez", priority: "low", status: "done", due: "2026-05-28", category: "Planos" },
  { id: 4, projectId: 2, title: "Cimentación tramo B", assignee: "María Gómez", priority: "high", status: "in-progress", due: "2026-06-05", category: "Estructura" },
  { id: 5, projectId: 2, title: "Topografía zona este", assignee: "Pedro Sosa", priority: "medium", status: "pending", due: "2026-06-08", category: "Topografía" },
  { id: 6, projectId: 3, title: "Acabados lobby principal", assignee: "Rosa Vidal", priority: "high", status: "in-progress", due: "2026-06-01", category: "Acabados" },
];

const initialDocs = [
  { id: 1, projectId: 1, name: "Plano Arquitectónico Rev.3", type: "plano", size: "4.2 MB", date: "2026-05-20", uploader: "Carlos M." },
  { id: 2, projectId: 1, name: "Memoria de Cálculo Estructural", type: "doc", size: "1.8 MB", date: "2026-05-15", uploader: "Ana T." },
  { id: 3, projectId: 2, name: "Plano de Cimentación", type: "plano", size: "3.1 MB", date: "2026-05-18", uploader: "María G." },
  { id: 4, projectId: 3, name: "Especificaciones de Acabados", type: "doc", size: "0.9 MB", date: "2026-05-22", uploader: "Rosa V." },
];

const initialTeam = [
  { id: 1, name: "Carlos Méndez", role: "Residente de Obra", project: 1, avatar: "CM", tasks: 8 },
  { id: 2, name: "Ana Torres", role: "Ing. Instalaciones", project: 1, avatar: "AT", tasks: 5 },
  { id: 3, name: "Luis Ramírez", role: "Arquitecto", project: 1, avatar: "LR", tasks: 3 },
  { id: 4, name: "María Gómez", role: "Ing. Civil", project: 2, avatar: "MG", tasks: 7 },
  { id: 5, name: "Pedro Sosa", role: "Topógrafo", project: 2, avatar: "PS", tasks: 4 },
  { id: 6, name: "Rosa Vidal", role: "Diseñadora", project: 3, avatar: "RV", tasks: 6 },
];

const statusColors = { "in-progress": "#F59E0B", pending: "#6B7280", done: "#10B981" };
const statusLabels = { "in-progress": "En Progreso", pending: "Pendiente", done: "Completada" };
const priorityColors = { high: "#EF4444", medium: "#F59E0B", low: "#10B981" };
const priorityLabels = { high: "Alta", medium: "Media", low: "Baja" };
const memberColors = ["#F59E0B", "#3B82F6", "#10B981", "#8B5CF6", "#EF4444", "#EC4899"];

const emptyTask = { title: "", assignee: "", priority: "medium", category: "Estructura", due: "", status: "pending" };
const emptyProject = { name: "", location: "", progress: 0, status: "active", team: 1, due: "" };
const emptyMember = { name: "", role: "", tasks: 0 };
const emptyDoc = { name: "", type: "plano", size: "—", date: "", uploader: "" };

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000088", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#161922", border: "1px solid #374151", borderRadius: 14, padding: 28, minWidth: 420, maxWidth: 520, width: "90%", boxShadow: "0 24px 60px #00000099" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000099", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#161922", border: "1px solid #EF444444", borderRadius: 14, padding: 28, maxWidth: 380, width: "90%", textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
        <div style={{ fontSize: 14, color: "#D1D5DB", marginBottom: 20, lineHeight: 1.6 }}>{message}</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onConfirm} style={{ background: "#EF4444", color: "#fff", border: "none", padding: "9px 22px", borderRadius: 8, fontFamily: "inherit", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Eliminar</button>
          <button onClick={onCancel} style={{ background: "none", border: "1px solid #374151", color: "#9CA3AF", padding: "9px 22px", borderRadius: 8, fontFamily: "inherit", cursor: "pointer", fontSize: 13 }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default function ObraControl() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProject, setSelectedProject] = useState(1);
  const [tasks, setTasks] = useState(initialTasks);
  const [docs, setDocs] = useState(initialDocs);
  const [teamMembers, setTeamMembers] = useState(initialTeam);
  const [filterStatus, setFilterStatus] = useState("all");

  // Modals
  const [taskModal, setTaskModal] = useState(null); // null | { mode: 'new'|'edit', data }
  const [projectModal, setProjectModal] = useState(null);
  const [memberModal, setMemberModal] = useState(null);
  const [docModal, setDocModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // { type, id, label }

  const project = projects.find(p => p.id === selectedProject) || projects[0];
  const projectTasks = tasks.filter(t => t.projectId === selectedProject);
  const projectDocs = docs.filter(d => d.projectId === selectedProject);
  const projectTeam = teamMembers.filter(m => m.project === selectedProject);
  const filteredTasks = filterStatus === "all" ? projectTasks : projectTasks.filter(t => t.status === filterStatus);
  const doneTasks = projectTasks.filter(t => t.status === "done").length;
  const inProgressTasks = projectTasks.filter(t => t.status === "in-progress").length;
  const highPriority = projectTasks.filter(t => t.priority === "high" && t.status !== "done").length;

  // --- Task CRUD ---
  const saveTask = (data) => {
    if (!data.title) return;
    if (taskModal.mode === "new") {
      setTasks([...tasks, { ...data, id: Date.now(), projectId: selectedProject }]);
    } else {
      setTasks(tasks.map(t => t.id === data.id ? data : t));
    }
    setTaskModal(null);
  };
  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  const toggleTaskStatus = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === "done" ? "pending" : "done" } : t));

  // --- Project CRUD ---
  const saveProject = (data) => {
    if (!data.name) return;
    if (projectModal.mode === "new") {
      const np = { ...data, id: Date.now(), progress: Number(data.progress), team: Number(data.team) };
      setProjects([...projects, np]);
      setSelectedProject(np.id);
    } else {
      setProjects(projects.map(p => p.id === data.id ? { ...data, progress: Number(data.progress), team: Number(data.team) } : p));
    }
    setProjectModal(null);
  };
  const deleteProject = (id) => {
    const remaining = projects.filter(p => p.id !== id);
    setProjects(remaining);
    setTasks(tasks.filter(t => t.projectId !== id));
    setDocs(docs.filter(d => d.projectId !== id));
    setTeamMembers(teamMembers.filter(m => m.project !== id));
    setSelectedProject(remaining[0]?.id || null);
  };

  // --- Member CRUD ---
  const saveMember = (data) => {
    if (!data.name) return;
    if (memberModal.mode === "new") {
      setTeamMembers([...teamMembers, { ...data, id: Date.now(), project: selectedProject, tasks: Number(data.tasks) || 0, avatar: data.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() }]);
    } else {
      setTeamMembers(teamMembers.map(m => m.id === data.id ? { ...data, tasks: Number(data.tasks) } : m));
    }
    setMemberModal(null);
  };
  const deleteMember = (id) => setTeamMembers(teamMembers.filter(m => m.id !== id));

  // --- Doc CRUD ---
  const saveDoc = (data) => {
    if (!data.name) return;
    if (docModal.mode === "new") {
      setDocs([...docs, { ...data, id: Date.now(), projectId: selectedProject, date: data.date || new Date().toISOString().slice(0, 10) }]);
    } else {
      setDocs(docs.map(d => d.id === data.id ? data : d));
    }
    setDocModal(null);
  };
  const deleteDoc = (id) => setDocs(docs.filter(d => d.id !== id));

  // Confirm delete dispatcher
  const handleConfirmDelete = () => {
    if (!confirmDelete) return;
    const { type, id } = confirmDelete;
    if (type === "task") deleteTask(id);
    if (type === "project") deleteProject(id);
    if (type === "member") deleteMember(id);
    if (type === "doc") deleteDoc(id);
    setConfirmDelete(null);
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "⬡" },
    { id: "tasks", label: "Tareas", icon: "✓" },
    { id: "docs", label: "Planos", icon: "⊞" },
    { id: "team", label: "Equipo", icon: "◎" },
    { id: "report", label: "Reporte", icon: "▣" },
  ];

  const InputRow = ({ label, children }) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#0F1117", minHeight: "100vh", color: "#E5E7EB", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #1A1D27; } ::-webkit-scrollbar-thumb { background: #374151; border-radius: 2px; }
        .tab-btn { background: none; border: none; cursor: pointer; padding: 10px 18px; border-radius: 8px; font-family: inherit; font-size: 13px; font-weight: 500; transition: all 0.2s; display: flex; align-items: center; gap: 7px; color: #6B7280; }
        .tab-btn:hover { background: #1E2130; color: #D1D5DB; }
        .tab-btn.active { background: #F59E0B; color: #0F1117; font-weight: 700; }
        .proj-card { background: #161922; border: 1px solid #1E2130; border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.2s; }
        .proj-card:hover, .proj-card.active { border-color: #F59E0B; background: #1A1D27; }
        .stat-card { background: #161922; border: 1px solid #1E2130; border-radius: 12px; padding: 20px; flex: 1; }
        .task-row { background: #161922; border: 1px solid #1E2130; border-radius: 10px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; margin-bottom: 8px; transition: all 0.15s; }
        .task-row:hover { border-color: #374151; }
        .badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .btn-primary { background: #F59E0B; color: #0F1117; border: none; padding: 9px 18px; border-radius: 8px; font-family: inherit; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: #FBBF24; }
        .btn-ghost { background: none; border: 1px solid #374151; color: #9CA3AF; padding: 9px 18px; border-radius: 8px; font-family: inherit; font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .btn-ghost:hover { border-color: #6B7280; color: #E5E7EB; }
        .btn-danger { background: none; border: none; color: #EF4444; cursor: pointer; padding: 6px 8px; border-radius: 6px; font-size: 14px; transition: background 0.15s; }
        .btn-danger:hover { background: #EF444422; }
        .btn-edit { background: none; border: none; color: #6B7280; cursor: pointer; padding: 6px 8px; border-radius: 6px; font-size: 14px; transition: all 0.15s; }
        .btn-edit:hover { background: #1E2130; color: #F59E0B; }
        input, select, textarea { background: #1A1D27; border: 1px solid #374151; color: #E5E7EB; padding: 9px 12px; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; transition: border 0.2s; width: 100%; }
        input:focus, select:focus, textarea:focus { border-color: #F59E0B; }
        .filter-btn { background: none; border: 1px solid #1E2130; color: #6B7280; padding: 6px 14px; border-radius: 20px; font-family: inherit; font-size: 12px; cursor: pointer; transition: all 0.15s; }
        .filter-btn.active { background: #F59E0B22; border-color: #F59E0B; color: #F59E0B; }
        .doc-row { background: #161922; border: 1px solid #1E2130; border-radius: 10px; padding: 14px 16px; display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
        .member-card { background: #161922; border: 1px solid #1E2130; border-radius: 12px; padding: 18px; display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
        .avatar { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; font-family: 'Space Mono', monospace; flex-shrink: 0; }
        .progress-bar-bg { background: #1E2130; border-radius: 4px; height: 6px; overflow: hidden; }
        .progress-bar { height: 100%; border-radius: 4px; background: linear-gradient(90deg, #F59E0B, #FBBF24); transition: width 0.6s ease; }
        .action-btns { display: flex; gap: 2px; opacity: 0; transition: opacity 0.15s; }
        .task-row:hover .action-btns, .doc-row:hover .action-btns, .member-card:hover .action-btns { opacity: 1; }
      `}</style>

      {/* Modals */}
      {confirmDelete && (
        <ConfirmModal
          message={`¿Eliminar "${confirmDelete.label}"? Esta acción no se puede deshacer.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {taskModal && (
        <TaskModal data={taskModal.data} mode={taskModal.mode} onSave={saveTask} onClose={() => setTaskModal(null)} InputRow={InputRow} />
      )}
      {projectModal && (
        <ProjectModal data={projectModal.data} mode={projectModal.mode} onSave={saveProject} onClose={() => setProjectModal(null)} InputRow={InputRow} />
      )}
      {memberModal && (
        <MemberModal data={memberModal.data} mode={memberModal.mode} onSave={saveMember} onClose={() => setMemberModal(null)} InputRow={InputRow} projects={projects} />
      )}
      {docModal && (
        <DocModal data={docModal.data} mode={docModal.mode} onSave={saveDoc} onClose={() => setDocModal(null)} InputRow={InputRow} />
      )}

      {/* Header */}
      <div style={{ background: "#161922", borderBottom: "1px solid #1E2130", padding: "0 24px", display: "flex", alignItems: "center", gap: "24px", height: "56px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 28, height: 28, background: "#F59E0B", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#0F1117", fontFamily: "'Space Mono', monospace" }}>⬡</div>
          <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 15, letterSpacing: "-0.5px" }}>OBRA<span style={{ color: "#F59E0B" }}>CTRL</span></span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: "4px" }}>
          {tabs.map(t => (
            <button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 240, background: "#161922", borderRight: "1px solid #1E2130", padding: "16px", overflowY: "auto", flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#4B5563", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>Proyectos</div>
          {projects.map(p => (
            <div key={p.id} style={{ position: "relative", marginBottom: 8 }}>
              <div className={`proj-card ${selectedProject === p.id ? "active" : ""}`} onClick={() => setSelectedProject(p.id)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, paddingRight: 36 }}>{p.name}</div>
                </div>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 10 }}>📍 {p.location}</div>
                <div className="progress-bar-bg">
                  <div className="progress-bar" style={{ width: `${p.progress}%` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "#9CA3AF" }}>
                  <span>{p.progress}%</span>
                  <span style={{ color: p.status === "finishing" ? "#10B981" : "#F59E0B", fontWeight: 600 }}>{p.status === "finishing" ? "Finalizando" : "Activo"}</span>
                </div>
              </div>
              <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 2 }}>
                <button className="btn-edit" style={{ padding: "3px 5px", fontSize: 11 }} onClick={e => { e.stopPropagation(); setProjectModal({ mode: "edit", data: { ...p } }); }}>✏️</button>
                <button className="btn-danger" style={{ padding: "3px 5px", fontSize: 11 }} onClick={e => { e.stopPropagation(); setConfirmDelete({ type: "project", id: p.id, label: p.name }); }}>🗑</button>
              </div>
            </div>
          ))}
          <div onClick={() => setProjectModal({ mode: "new", data: { ...emptyProject } })} style={{ marginTop: 8, padding: "12px", background: "#0F1117", borderRadius: 10, border: "1px dashed #374151", textAlign: "center", cursor: "pointer", color: "#6B7280", fontSize: 12, transition: "border-color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#F59E0B"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#374151"}>
            + Nuevo Proyecto
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {!project ? (
            <div style={{ textAlign: "center", color: "#4B5563", paddingTop: 80 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <div>Crea un proyecto para comenzar</div>
            </div>
          ) : (
            <>
              {/* DASHBOARD */}
              {activeTab === "dashboard" && (
                <div>
                  <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{project.name}</h1>
                      <div style={{ color: "#6B7280", fontSize: 13 }}>📍 {project.location} · Entrega: {project.due} · {project.team} personas</div>
                    </div>
                    <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setProjectModal({ mode: "edit", data: { ...project } })}>✏️ Editar Proyecto</button>
                  </div>
                  <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
                    {[
                      { label: "Progreso General", value: `${project.progress}%`, sub: "de la obra completada", color: "#F59E0B" },
                      { label: "Tareas Totales", value: projectTasks.length, sub: `${doneTasks} completadas`, color: "#10B981" },
                      { label: "En Progreso", value: inProgressTasks, sub: "tareas activas", color: "#3B82F6" },
                      { label: "Prioridad Alta", value: highPriority, sub: "sin completar", color: "#EF4444" },
                    ].map((s, i) => (
                      <div key={i} className="stat-card" style={{ minWidth: 140 }}>
                        <div style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8, fontWeight: 600 }}>{s.label}</div>
                        <div style={{ fontSize: 32, fontWeight: 700, color: s.color, fontFamily: "'Space Mono', monospace", lineHeight: 1 }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: "#4B5563", marginTop: 4 }}>{s.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#161922", border: "1px solid #1E2130", borderRadius: 12, padding: 20, marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>Avance de Obra</span>
                      <span style={{ fontFamily: "'Space Mono', monospace", color: "#F59E0B", fontWeight: 700 }}>{project.progress}%</span>
                    </div>
                    <div style={{ background: "#0F1117", borderRadius: 8, height: 18, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${project.progress}%`, background: "linear-gradient(90deg, #B45309, #F59E0B, #FDE68A)", borderRadius: 8, transition: "width 0.8s ease", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>
                        {project.progress > 10 && <span style={{ fontSize: 10, fontWeight: 700, color: "#0F1117" }}>{project.progress}%</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ background: "#161922", border: "1px solid #1E2130", borderRadius: 12, padding: 20 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Tareas Recientes</div>
                    {projectTasks.slice(0, 3).map(t => (
                      <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #1E2130" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColors[t.status], flexShrink: 0 }} />
                        <div style={{ flex: 1, fontSize: 13 }}>{t.title}</div>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>{t.assignee}</div>
                        <span className="badge" style={{ background: `${priorityColors[t.priority]}22`, color: priorityColors[t.priority] }}>{priorityLabels[t.priority]}</span>
                      </div>
                    ))}
                    <button className="btn-ghost" style={{ marginTop: 14, width: "100%", fontSize: 12 }} onClick={() => setActiveTab("tasks")}>Ver todas las tareas →</button>
                  </div>
                </div>
              )}

              {/* TASKS */}
              {activeTab === "tasks" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700 }}>Tareas — {project.name}</h2>
                    <button className="btn-primary" onClick={() => setTaskModal({ mode: "new", data: { ...emptyTask } })}>+ Nueva Tarea</button>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                    {["all", "pending", "in-progress", "done"].map(s => (
                      <button key={s} className={`filter-btn ${filterStatus === s ? "active" : ""}`} onClick={() => setFilterStatus(s)}>
                        {s === "all" ? "Todas" : statusLabels[s]}
                      </button>
                    ))}
                  </div>
                  {filteredTasks.length === 0 && <div style={{ textAlign: "center", color: "#4B5563", padding: 40 }}>No hay tareas en esta categoría</div>}
                  {filteredTasks.map(t => (
                    <div key={t.id} className="task-row" style={{ opacity: t.status === "done" ? 0.65 : 1 }}>
                      <div onClick={() => toggleTaskStatus(t.id)} style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${t.status === "done" ? "#10B981" : "#374151"}`, background: t.status === "done" ? "#10B981" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, fontSize: 11, color: "#0F1117", fontWeight: 700, transition: "all 0.2s" }}>
                        {t.status === "done" ? "✓" : ""}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, textDecoration: t.status === "done" ? "line-through" : "none" }}>{t.title}</div>
                        <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{t.category} · Vence: {t.due || "—"}</div>
                      </div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", minWidth: 110, textAlign: "right" }}>{t.assignee}</div>
                      <span className="badge" style={{ background: `${priorityColors[t.priority]}22`, color: priorityColors[t.priority], minWidth: 52, textAlign: "center" }}>{priorityLabels[t.priority]}</span>
                      <span className="badge" style={{ background: `${statusColors[t.status]}22`, color: statusColors[t.status], minWidth: 80, textAlign: "center" }}>{statusLabels[t.status]}</span>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => setTaskModal({ mode: "edit", data: { ...t } })}>✏️</button>
                        <button className="btn-danger" onClick={() => setConfirmDelete({ type: "task", id: t.id, label: t.title })}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* DOCS */}
              {activeTab === "docs" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700 }}>Planos y Documentos</h2>
                    <button className="btn-primary" onClick={() => setDocModal({ mode: "new", data: { ...emptyDoc } })}>+ Subir Archivo</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                    {[
                      { label: "Total Archivos", val: projectDocs.length, icon: "⊞", color: "#3B82F6" },
                      { label: "Planos", val: projectDocs.filter(d => d.type === "plano").length, icon: "⊟", color: "#F59E0B" },
                      { label: "Documentos", val: projectDocs.filter(d => d.type === "doc").length, icon: "▣", color: "#10B981" },
                      { label: "Última Actualización", val: "Hoy", icon: "◷", color: "#8B5CF6" },
                    ].map((s, i) => (
                      <div key={i} className="stat-card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: s.color }}>{s.icon}</div>
                        <div>
                          <div style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.8px" }}>{s.label}</div>
                          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: s.color }}>{s.val}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {projectDocs.map(d => (
                    <div key={d.id} className="doc-row">
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: d.type === "plano" ? "#F59E0B22" : "#3B82F622", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: d.type === "plano" ? "#F59E0B" : "#3B82F6", flexShrink: 0 }}>{d.type === "plano" ? "⊟" : "▣"}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</div>
                        <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>Subido por {d.uploader} · {d.date}</div>
                      </div>
                      <div style={{ fontSize: 12, color: "#4B5563" }}>{d.size}</div>
                      <span className="badge" style={{ background: d.type === "plano" ? "#F59E0B22" : "#3B82F622", color: d.type === "plano" ? "#F59E0B" : "#3B82F6" }}>{d.type === "plano" ? "PLANO" : "DOC"}</span>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => setDocModal({ mode: "edit", data: { ...d } })}>✏️</button>
                        <button className="btn-danger" onClick={() => setConfirmDelete({ type: "doc", id: d.id, label: d.name })}>🗑</button>
                      </div>
                    </div>
                  ))}
                  {projectDocs.length === 0 && <div style={{ textAlign: "center", color: "#4B5563", padding: 40 }}>No hay archivos en este proyecto</div>}
                </div>
              )}

              {/* TEAM */}
              {activeTab === "team" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700 }}>Equipo — {project.name}</h2>
                    <button className="btn-primary" onClick={() => setMemberModal({ mode: "new", data: { ...emptyMember } })}>+ Agregar Miembro</button>
                  </div>
                  {projectTeam.length === 0 && <div style={{ textAlign: "center", color: "#4B5563", padding: 40 }}>No hay miembros en este proyecto</div>}
                  {projectTeam.map((m, i) => {
                    const c = memberColors[i % memberColors.length];
                    return (
                      <div key={m.id} className="member-card">
                        <div className="avatar" style={{ background: `${c}22`, color: c }}>{m.avatar}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
                          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{m.role}</div>
                        </div>
                        <div style={{ textAlign: "right", marginRight: 12 }}>
                          <div style={{ fontSize: 11, color: "#6B7280" }}>Tareas asignadas</div>
                          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: c }}>{m.tasks}</div>
                        </div>
                        <div style={{ width: 70 }}>
                          <div className="progress-bar-bg">
                            <div className="progress-bar" style={{ width: `${Math.min((m.tasks / 10) * 100, 100)}%`, background: c }} />
                          </div>
                        </div>
                        <div className="action-btns" style={{ marginLeft: 8 }}>
                          <button className="btn-edit" onClick={() => setMemberModal({ mode: "edit", data: { ...m } })}>✏️</button>
                          <button className="btn-danger" onClick={() => setConfirmDelete({ type: "member", id: m.id, label: m.name })}>🗑</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* REPORT */}
              {activeTab === "report" && (
                <div>
                  <div style={{ marginBottom: 20 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Reporte de Obra</h2>
                    <div style={{ fontSize: 13, color: "#6B7280" }}>Generado el {new Date().toLocaleDateString("es-MX", { dateStyle: "long" })}</div>
                  </div>
                  <div style={{ background: "#161922", border: "1px solid #1E2130", borderRadius: 12, padding: 24, marginBottom: 16 }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#F59E0B", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>// Resumen Ejecutivo</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                      {[
                        { label: "Proyecto", val: project.name },
                        { label: "Ubicación", val: project.location },
                        { label: "Fecha de entrega", val: project.due || "—" },
                        { label: "Avance general", val: `${project.progress}%` },
                        { label: "Personal en obra", val: `${project.team} personas` },
                        { label: "Estatus", val: project.status === "finishing" ? "Finalizando" : "En Ejecución" },
                      ].map((r, i) => (
                        <div key={i}>
                          <div style={{ fontSize: 11, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>{r.label}</div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{r.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: "#161922", border: "1px solid #1E2130", borderRadius: 12, padding: 24, marginBottom: 16 }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#3B82F6", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>// Estado de Tareas</div>
                    <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
                      {[
                        { label: "Completadas", val: doneTasks, color: "#10B981" },
                        { label: "En progreso", val: inProgressTasks, color: "#F59E0B" },
                        { label: "Pendientes", val: projectTasks.filter(t => t.status === "pending").length, color: "#6B7280" },
                        { label: "Alta prioridad", val: highPriority, color: "#EF4444" },
                      ].map((s, i) => (
                        <div key={i} style={{ flex: 1, minWidth: 100, background: `${s.color}11`, border: `1px solid ${s.color}33`, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: s.color }}>{s.val}</div>
                          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: 14 }}>⬇ Exportar Reporte PDF</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Sub-modals ----

function TaskModal({ data, mode, onSave, onClose, InputRow }) {
  const [form, setForm] = useState(data);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal title={mode === "new" ? "Nueva Tarea" : "Editar Tarea"} onClose={onClose}>
      <InputRow label="Título"><input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Título de la tarea" /></InputRow>
      <InputRow label="Responsable"><input value={form.assignee} onChange={e => set("assignee", e.target.value)} placeholder="Nombre del responsable" /></InputRow>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <InputRow label="Prioridad">
          <select value={form.priority} onChange={e => set("priority", e.target.value)}>
            <option value="high">Alta</option><option value="medium">Media</option><option value="low">Baja</option>
          </select>
        </InputRow>
        <InputRow label="Estatus">
          <select value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="pending">Pendiente</option><option value="in-progress">En Progreso</option><option value="done">Completada</option>
          </select>
        </InputRow>
        <InputRow label="Categoría">
          <select value={form.category} onChange={e => set("category", e.target.value)}>
            {["Estructura", "Instalaciones", "Acabados", "Planos", "Topografía", "Seguridad"].map(c => <option key={c}>{c}</option>)}
          </select>
        </InputRow>
        <InputRow label="Fecha límite"><input type="date" value={form.due} onChange={e => set("due", e.target.value)} /></InputRow>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button className="btn-primary" onClick={() => onSave(form)}>Guardar</button>
        <button className="btn-ghost" onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}

function ProjectModal({ data, mode, onSave, onClose, InputRow }) {
  const [form, setForm] = useState(data);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal title={mode === "new" ? "Nuevo Proyecto" : "Editar Proyecto"} onClose={onClose}>
      <InputRow label="Nombre del proyecto"><input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ej. Torre Residencial Norte" /></InputRow>
      <InputRow label="Ubicación"><input value={form.location} onChange={e => set("location", e.target.value)} placeholder="Ciudad, Estado" /></InputRow>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <InputRow label="Progreso (%)"><input type="number" min="0" max="100" value={form.progress} onChange={e => set("progress", e.target.value)} /></InputRow>
        <InputRow label="Personas en obra"><input type="number" min="1" value={form.team} onChange={e => set("team", e.target.value)} /></InputRow>
        <InputRow label="Fecha de entrega"><input type="date" value={form.due} onChange={e => set("due", e.target.value)} /></InputRow>
        <InputRow label="Estatus">
          <select value={form.status} onChange={e => set("status", e.target.value)}>
            <option value="active">Activo</option><option value="finishing">Finalizando</option><option value="paused">Pausado</option>
          </select>
        </InputRow>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button className="btn-primary" onClick={() => onSave(form)}>Guardar</button>
        <button className="btn-ghost" onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}

function MemberModal({ data, mode, onSave, onClose, InputRow }) {
  const [form, setForm] = useState(data);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal title={mode === "new" ? "Agregar Miembro" : "Editar Miembro"} onClose={onClose}>
      <InputRow label="Nombre completo"><input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Nombre Apellido" /></InputRow>
      <InputRow label="Rol / Cargo"><input value={form.role} onChange={e => set("role", e.target.value)} placeholder="Ej. Residente de Obra" /></InputRow>
      <InputRow label="Tareas asignadas"><input type="number" min="0" value={form.tasks} onChange={e => set("tasks", e.target.value)} /></InputRow>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button className="btn-primary" onClick={() => onSave(form)}>Guardar</button>
        <button className="btn-ghost" onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}

function DocModal({ data, mode, onSave, onClose, InputRow }) {
  const [form, setForm] = useState(data);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal title={mode === "new" ? "Agregar Archivo" : "Editar Archivo"} onClose={onClose}>
      <InputRow label="Nombre del archivo"><input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ej. Plano Arquitectónico Rev.4" /></InputRow>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <InputRow label="Tipo">
          <select value={form.type} onChange={e => set("type", e.target.value)}>
            <option value="plano">Plano</option><option value="doc">Documento</option>
          </select>
        </InputRow>
        <InputRow label="Tamaño"><input value={form.size} onChange={e => set("size", e.target.value)} placeholder="Ej. 3.2 MB" /></InputRow>
        <InputRow label="Subido por"><input value={form.uploader} onChange={e => set("uploader", e.target.value)} placeholder="Nombre" /></InputRow>
        <InputRow label="Fecha"><input type="date" value={form.date} onChange={e => set("date", e.target.value)} /></InputRow>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button className="btn-primary" onClick={() => onSave(form)}>Guardar</button>
        <button className="btn-ghost" onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}
