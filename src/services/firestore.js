import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// ==========================================
// SUBJECTS COLLECTION
// ==========================================
const subjectsCollection = collection(db, 'subjects');

export const createSubject = async (userId, name) => {
  if (!userId) throw new Error("User ID is required");
  
  return await addDoc(subjectsCollection, {
    name,
    userId,
    createdAt: serverTimestamp()
  });
};

export const getSubjects = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  // Query only subjects belonging to this user (single index)
  const q = query(
    subjectsCollection, 
    where("userId", "==", userId)
  );
  
  const snapshot = await getDocs(q);
  const subjects = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // Sort locally by createdAt descending
  return subjects.sort((a, b) => {
    const timeA = a.createdAt?.toMillis() || 0;
    const timeB = b.createdAt?.toMillis() || 0;
    return timeB - timeA;
  });
};

export const updateSubject = async (subjectId, updatedData) => {
  if (!subjectId) throw new Error("Subject ID is required");
  
  const subjectRef = doc(db, 'subjects', subjectId);
  return await updateDoc(subjectRef, updatedData);
};

export const deleteSubject = async (subjectId) => {
  if (!subjectId) throw new Error("Subject ID is required");

  const subjectRef = doc(db, 'subjects', subjectId);
  return await deleteDoc(subjectRef);
};

// ==========================================
// TASKS COLLECTION
// ==========================================
const tasksCollection = collection(db, 'tasks');

export const createTask = async (userId, taskData) => {
  if (!userId) throw new Error("User ID is required");
  
  // Ensure required fields
  const { title, subjectId, priority, studyDate, startTime, endTime, status } = taskData;
  
  return await addDoc(tasksCollection, {
    title: title || "",
    subjectId: subjectId || "",
    userId,
    priority: priority || "Medium",
    studyDate: studyDate || "",
    startTime: startTime || "",
    endTime: endTime || "",
    status: status || "pending",
    createdAt: serverTimestamp()
  });
};

export const getTasks = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  // Query only tasks belonging to this user (single index)
  const q = query(
    tasksCollection, 
    where("userId", "==", userId)
  );
  
  const snapshot = await getDocs(q);
  const tasks = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // Sort locally by createdAt descending
  return tasks.sort((a, b) => {
    const timeA = a.createdAt?.toMillis() || 0;
    const timeB = b.createdAt?.toMillis() || 0;
    return timeB - timeA;
  });
};

export const updateTask = async (taskId, updatedData) => {
  if (!taskId) throw new Error("Task ID is required");

  const taskRef = doc(db, 'tasks', taskId);
  return await updateDoc(taskRef, updatedData);
};

export const deleteTask = async (taskId) => {
  if (!taskId) throw new Error("Task ID is required");

  const taskRef = doc(db, 'tasks', taskId);
  return await deleteDoc(taskRef);
};
