import { Suspense } from "react";
import { getCurrentUser } from "@/lib/database/users";
import { getTasks } from "@/lib/database/tasks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

async function DashboardStats() {
  const [user, tasksResult] = await Promise.all([
    getCurrentUser(),
    getTasks(),
  ]);

  const { tasks } = tasksResult;
  
  // Calculate stats
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;
  
  const overdueTasks = tasks.filter(task => 
    task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'
  ).length;
  
  // Recent tasks (last 3)
  const recentTasks = tasks
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return (
    <div>
      <div className="content-header">
        <div className="title-section">
          <h1>Good morning, {user?.full_name || 'Eran'}! ⛅</h1>
        </div>
      </div>

      <div className="dashboard-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <Card style={{
          backgroundColor: 'var(--bg-content)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px'
        }}>
          <CardHeader>
            <CardTitle style={{color: 'var(--text-primary)'}}>Tasks Overview</CardTitle>
            <CardDescription style={{color: 'var(--text-secondary)'}}>
              Your task summary for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
              <span style={{color: 'var(--text-secondary)'}}>Completed</span>
              <span style={{color: 'var(--today-green)', fontWeight: '500'}}>{completedTasks}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
              <span style={{color: 'var(--text-secondary)'}}>In Progress</span>
              <span style={{color: 'var(--primary-blue)', fontWeight: '500'}}>{inProgressTasks}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
              <span style={{color: 'var(--text-secondary)'}}>Overdue</span>
              <span style={{color: 'var(--urgent-red)', fontWeight: '500'}}>{overdueTasks}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
              <span style={{color: 'var(--text-secondary)'}}>To Do</span>
              <span style={{color: 'var(--text-primary)', fontWeight: '500'}}>{todoTasks}</span>
            </div>
          </CardContent>
        </Card>

        <Card style={{
          backgroundColor: 'var(--bg-content)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px'
        }}>
          <CardHeader>
            <CardTitle style={{color: 'var(--text-primary)'}}>Recent Activity</CardTitle>
            <CardDescription style={{color: 'var(--text-secondary)'}}>
              Latest updates from your tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div key={task.id} style={{marginBottom: '15px'}}>
                  <div style={{color: 'var(--text-primary)', fontWeight: '500', marginBottom: '5px'}}>
                    <Link href={`/dashboard/tasks`} style={{color: 'inherit', textDecoration: 'none'}}>
                      {task.title}
                    </Link>
                  </div>
                  <div style={{color: 'var(--text-secondary)', fontSize: '12px'}}>
                    {task.status === 'done' ? 'Completed' : 
                     task.status === 'in_progress' ? 'In Progress' : 'To Do'}
                  </div>
                </div>
              ))
            ) : (
              <div style={{color: 'var(--text-secondary)'}}>No recent tasks</div>
            )}
          </CardContent>
        </Card>

        <Card style={{
          backgroundColor: 'var(--bg-content)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px'
        }}>
          <CardHeader>
            <CardTitle style={{color: 'var(--text-primary)'}}>Quick Actions</CardTitle>
            <CardDescription style={{color: 'var(--text-secondary)'}}>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <Link href="/dashboard/tasks/new" style={{textDecoration: 'none'}}>
                <button className="new-item-btn" style={{width: '100%', textAlign: 'left'}}>
                  ➕ Create New Task
                </button>
              </Link>
              <Link href="/dashboard/projects" style={{textDecoration: 'none'}}>
                <button className="new-item-btn" style={{
                  width: '100%', 
                  textAlign: 'left',
                  backgroundColor: 'var(--bg-sidebar)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)'
                }}>
                  📁 View Projects
                </button>
              </Link>
              <Link href="/dashboard/tasks" style={{textDecoration: 'none'}}>
                <button className="new-item-btn" style={{
                  width: '100%', 
                  textAlign: 'left',
                  backgroundColor: 'var(--bg-sidebar)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)'
                }}>
                  📋 View All Tasks
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div style={{marginTop: '30px'}}>
        <h2 style={{
          fontSize: '20px', 
          fontWeight: '500', 
          marginBottom: '20px',
          color: 'var(--text-primary)'
        }}>
          Today&apos;s Priority Tasks
        </h2>
        
        <div style={{
          backgroundColor: 'var(--bg-content)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          padding: '20px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '15px',
            padding: '10px',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '15px'
          }}>
            <div style={{color: 'var(--text-secondary)', fontWeight: '500'}}>Task</div>
            <div style={{color: 'var(--text-secondary)', fontWeight: '500'}}>Status</div>
            <div style={{color: 'var(--text-secondary)', fontWeight: '500'}}>Priority</div>
            <div style={{color: 'var(--text-secondary)', fontWeight: '500'}}>Due Date</div>
          </div>
          
          {tasks.slice(0, 3).map((task, index) => (
            <div key={task.id} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              gap: '15px',
              padding: '10px',
              marginBottom: index < 2 ? '10px' : '0'
            }}>
              <div style={{color: 'var(--text-primary)'}}>{task.title}</div>
              <div>
                <span className={`status ${
                  task.status === 'done' ? 'priority-3' : 
                  task.priority === 4 ? 'urgent' : 'priority-3'
                }`}>
                  {task.status === 'done' ? 'Done' :
                   task.status === 'in_progress' ? 'In Progress' : 'To Do'}
                </span>
              </div>
              <div style={{
                color: task.priority === 4 ? 'var(--urgent-red)' : 
                       task.priority === 3 ? 'var(--primary-blue)' : 'var(--today-green)',
                fontWeight: '500'
              }}>
                {task.priority === 4 ? 'Urgent' : 
                 task.priority === 3 ? 'High' : 
                 task.priority === 2 ? 'Medium' : 'Low'}
              </div>
              <div style={{color: 'var(--text-secondary)'}}>
                {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
              </div>
            </div>
          ))}
          
          {tasks.length === 0 && (
            <div style={{
              color: 'var(--text-secondary)',
              textAlign: 'center',
              padding: '20px'
            }}>
              No tasks yet. <Link href="/dashboard/tasks/new" style={{color: 'var(--primary-blue)'}}>Create your first task!</Link>
            </div>
          )}
        </div>
      </div>

      {/* Help Button */}
      <button className="help-button">
        ❓ Help
      </button>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{color: 'var(--text-secondary)'}}>Loading...</div>}>
      <DashboardStats />
    </Suspense>
  );
} 