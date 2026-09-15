function StudySchedule() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Study Schedule</h1>

      {/* Placeholder message — will show scheduled tasks from Firestore */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-400 text-lg mb-2">📅 No scheduled sessions yet</p>
        <p className="text-gray-400 text-sm">
          Your study schedule will appear here once you add tasks with dates
          and times in Phase 4.
        </p>
      </div>
    </div>
  )
}

export default StudySchedule
