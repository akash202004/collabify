import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { useKanban } from "./hooks/useKanban";
import { LoginPage } from "./components/LoginPage";
import { Header } from "./components/Header";
import { KanbanBoard } from "./components/KanbanBoard";
import { ActivityLog } from "./components/ActivityLog";
import { ConflictModal } from "./components/ConflictModal";

function App() {
  const { user, login, register, logout, isLoading } = useAuth();
  const kanban = useKanban(user);
  const [showActivity, setShowActivity] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={login} onRegister={register} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        user={user}
        onLogout={logout}
        onShowActivity={() => setShowActivity(true)}
        userCount={kanban.users.length}
      />

      <KanbanBoard
        tasks={kanban.tasks}
        users={kanban.users}
        onCreateTask={kanban.createTask}
        onUpdateTask={kanban.updateTask}
        onMoveTask={kanban.moveTask}
        onDeleteTask={kanban.deleteTask}
        onSmartAssign={kanban.smartAssign}
      />

      <ActivityLog
        activityLog={kanban.activityLog}
        isOpen={showActivity}
        onClose={() => setShowActivity(false)}
      />

      <ConflictModal
        conflicts={kanban.conflicts}
        onResolve={kanban.resolveConflict}
      />
    </div>
  );
}

export default App;
