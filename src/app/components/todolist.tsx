'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';


const win98Style = `
  .window {
    border: 2px solid #000;
    background: #c0c0c0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    box-shadow: inset -2px -2px #fff, inset 2px 2px #404040;
    padding: 0;
  }

  .title-bar {
    background: linear-gradient(to right, #000080, #0000cd);
    color: white;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
  }

  .title-bar-text {
    font-weight: bold;
  }

  .title-bar-controls {
    display: flex;
  }

  .title-bar-controls button {
    width: 16px;
    height: 14px;
    background: #c0c0c0;
    border: 1px solid #000;
    margin-left: 4px;
    padding: 0;
    box-shadow: inset -1px -1px #fff, inset 1px 1px #404040;
    cursor: pointer;
  }

  .title-bar-controls button:active {
    box-shadow: inset 1px 1px #fff, inset -1px -1px #404040;
  }

  .window-body {
    background: #c0c0c0;
    padding: 12px;
    border-top: 2px solid #fff;
  }

  .field-row {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  button {
    font-size: 12px;
    padding: 4px 8px;
    background: #e0e0e0;
    border: 1px solid #000;
    box-shadow: inset -1px -1px #fff, inset 1px 1px #808080;
    cursor: pointer;
  }

  button:hover {
    background: #d0d0d0;
  }

  button:active {
    box-shadow: inset 1px 1px #fff, inset -1px -1px #808080;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    font-size: 14px;
    list-style: none;
  }
`;

const styleTag = <style dangerouslySetInnerHTML={{ __html: win98Style }} />;

type Task = {
  id: string;
  text: string;
  completed: boolean;
  deadline: string;
};

type Filter = 'all' | 'completed' | 'ongoing';

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: string }>({});
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      const tasksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(tasksData);
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining: { [key: string]: string } = {};
      tasks.forEach((task) => {
        newTimeRemaining[task.id] = calculateTimeRemaining(task.deadline);
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  const calculateTimeRemaining = (deadline: string): string => {
    const deadlineTime = new Date(deadline).getTime();
    const now = new Date().getTime();
    const difference = deadlineTime - now;

    if (difference <= 0) return 'Waktu habis!';

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${hours}j ${minutes}m ${seconds}d`;
  };

  const addTask = async (): Promise<void> => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambahkan tugas baru',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Nama tugas">' +
        '<input id="swal-input2" type="datetime-local" class="swal2-input">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Tambah',
      cancelButtonText: 'Batal',
      preConfirm: () => {
        return [
          (document.getElementById('swal-input1') as HTMLInputElement)?.value,
          (document.getElementById('swal-input2') as HTMLInputElement)?.value,
        ];
      },
    });

    if (formValues && formValues[0] && formValues[1]) {
      const newTask: Omit<Task, 'id'> = {
        text: formValues[0],
        completed: false,
        deadline: formValues[1],
      };
      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      setTasks([...tasks, { id: docRef.id, ...newTask }]);
    }
  };

  const editTask = async (id: string, currentText: string, currentDeadline: string): Promise<void> => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Tugas',
      html:
        `<input id="swal-input1" class="swal2-input" value="${currentText}" placeholder="Nama tugas">` +
        `<input id="swal-input2" type="datetime-local" class="swal2-input" value="${currentDeadline}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      cancelButtonText: 'Batal',
      preConfirm: () => {
        return [
          (document.getElementById('swal-input1') as HTMLInputElement)?.value,
          (document.getElementById('swal-input2') as HTMLInputElement)?.value,
        ];
      },
    });

    if (formValues && formValues[0] && formValues[1]) {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, text: formValues[0], deadline: formValues[1] } : task
      );
      setTasks(updatedTasks);
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        text: formValues[0],
        deadline: formValues[1],
      });
    }
  };

  const toggleTask = async (id: string): Promise<void> => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    const taskRef = doc(db, 'tasks', id);
    await updateDoc(taskRef, {
      completed: updatedTasks.find((task) => task.id === id)?.completed,
    });
  };

  const deleteTask = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'tasks', id));
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'ongoing') return !task.completed;
    return true;
  });

  return (
    <div>
      {styleTag}
      <div className="window mx-auto mt-10 p-4 w-[400px]">
        <div className="title-bar">
          <div className="title-bar-text">To-Do List</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div className="window-body">
          <div className="field-row justify-between mb-2">
            <button onClick={addTask}>Tambah Tugas</button>
            <div className="field-row" style={{ gap: '0.25rem' }}>
              <button onClick={() => setFilter('all')}>Semua</button>
              <button onClick={() => setFilter('completed')}>Selesai</button>
              <button onClick={() => setFilter('ongoing')}>Sedang</button>
            </div>
          </div>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <AnimatePresence>
              {filteredTasks.map((task) => {
                const timeLeft = calculateTimeRemaining(task.deadline);
                const isExpired = timeLeft === 'Waktu habis!';
                const taskColor = task.completed
                  ? '#C0FFC0'
                  : isExpired
                  ? '#FFCCCC'
                  : '#FFFFCC';

                return (
                  <motion.li
                    key={task.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{ backgroundColor: taskColor, padding: '0.5rem', marginBottom: '0.25rem', border: '1px solid #000', borderRadius: '2px' }}
                  >
                    <div className="field-row justify-between">
                      <span
                        onClick={() => toggleTask(task.id)}
                        style={{ cursor: 'pointer', textDecoration: task.completed ? 'line-through' : 'none', fontWeight: task.completed ? 'normal' : 'bold' }}
                      >
                        {task.text}
                      </span>
                      <div className="field-row" style={{ gap: '0.25rem' }}>
                        <button onClick={() => editTask(task.id, task.text, task.deadline)}>Edit</button>
                        <button onClick={() => deleteTask(task.id)}>Hapus</button>
                      </div>
                    </div>
                    <p>Deadline: {new Date(task.deadline).toLocaleString()}</p>
                    <p>⏳ {timeRemaining[task.id] || 'Menghitung...'}</p>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </div>
  );
}
