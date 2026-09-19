import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSubjects, createSubject, updateSubject, deleteSubject } from '../services/firestore';

function Subjects() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editSubjectName, setEditSubjectName] = useState('');

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getSubjects(user.uid);
      setSubjects(data);
    } catch (err) {
      setError('Failed to load subjects.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadSubjects();
    }
  }, [user]);

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    
    try {
      await createSubject(user.uid, newSubjectName.trim());
      setNewSubjectName('');
      setIsAdding(false);
      loadSubjects(); // refresh
    } catch (err) {
      setError(`Failed to add subject. Error: ${err.message}`);
      console.error(err);
    }
  };

  const handleEditSubject = async (e) => {
    e.preventDefault();
    if (!editSubjectName.trim()) return;
    
    try {
      await updateSubject(editingId, { name: editSubjectName.trim() });
      setEditingId(null);
      setEditSubjectName('');
      loadSubjects(); // refresh
    } catch (err) {
      setError('Failed to update subject.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    
    try {
      await deleteSubject(id);
      loadSubjects(); // refresh
    } catch (err) {
      setError('Failed to delete subject.');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Subjects</h1>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Add Subject
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Subject</h2>
          <form onSubmit={handleAddSubject} className="flex gap-4">
            <input
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="e.g. Mathematics"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
              Save
            </button>
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading subjects...</p>
        </div>
      ) : subjects.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-400 text-lg mb-2">📚 No subjects yet</p>
          <p className="text-gray-400 text-sm">
            Click the "Add Subject" button above to create your first subject.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map(subject => (
            <div key={subject.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              {editingId === subject.id ? (
                <form onSubmit={handleEditSubject} className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={editSubjectName}
                    onChange={(e) => setEditSubjectName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-blue-600 text-white py-1.5 rounded text-sm hover:bg-blue-700">Save</button>
                    <button type="button" onClick={() => setEditingId(null)} className="flex-1 bg-gray-200 text-gray-700 py-1.5 rounded text-sm hover:bg-gray-300">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{subject.name}</h3>
                  <div className="flex gap-3 mt-4 pt-4 border-t border-gray-50">
                    <button 
                      onClick={() => {
                        setEditingId(subject.id);
                        setEditSubjectName(subject.name);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(subject.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Subjects;
