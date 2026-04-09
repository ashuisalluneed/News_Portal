import { getAllUsers } from "@/lib/db/users";

export default async function AdminPage() {
  const users = await getAllUsers();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Stats & Actions */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-surface-low rounded-2xl p-6 border border-outline/30 shadow-lg">
          <h2 className="text-xl font-bold text-foreground mb-4 font-heading">System Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface rounded-xl p-4 border border-outline/10 text-center">
              <p className="text-sm text-foreground-muted mb-1 uppercase tracking-wider">Total Users</p>
              <p className="text-3xl font-black text-primary">{users.length}</p>
            </div>
            <div className="bg-surface rounded-xl p-4 border border-outline/10 text-center">
              <p className="text-sm text-foreground-muted mb-1 uppercase tracking-wider">Articles</p>
              <p className="text-3xl font-black text-foreground">0</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-low rounded-2xl p-6 border border-outline/30 shadow-lg">
          <h2 className="text-xl font-bold text-foreground mb-4 font-heading">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-primary hover:bg-primary-variant text-background-dark font-bold py-3 px-4 rounded-xl transition-colors shadow-sm">
              Add New Article
            </button>
            <button className="w-full bg-surface hover:bg-surface-high text-foreground-muted hover:text-foreground font-semibold py-3 px-4 rounded-xl transition-colors border border-outline/20">
              Manage Categories
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: User Management */}
      <div className="lg:col-span-2">
        <div className="bg-surface-low rounded-2xl border border-outline/30 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-outline/20 flex justify-between items-center">
            <h2 className="text-xl font-bold text-foreground font-heading">User Management</h2>
            <button className="text-sm font-semibold text-primary hover:text-primary-variant transition-colors">
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface text-foreground-muted text-sm font-bold uppercase tracking-wider">
                  <th className="p-4 rounded-tl-lg">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4 rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/10">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-surface/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-surface to-surface-high flex items-center justify-center text-foreground font-bold border border-outline/20">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{user.name}</p>
                          <p className="text-xs text-foreground-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        user.role === 'ADMIN' 
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-surface-high text-foreground-muted'
                      }`}>
                        {user.role || 'USER'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-foreground-muted">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button className="text-foreground-muted hover:text-red-400 transition-colors p-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <div className="p-8 text-center text-foreground-muted">
              No users found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
