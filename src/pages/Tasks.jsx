function Tasks() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          + Add Task
        </button>
      </div>

      {/* Placeholder message — Firestore integration in Phase 4 */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-400 text-lg mb-2">✅ No tasks yet</p>
        <p className="text-gray-400 text-sm">
          Task management (add, edit, delete) with priority, schedule, and
          status will be built in Phase 4.
        </p>
      </div>
    </div>
  )
}

export default Tasks
