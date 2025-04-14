'use client';
import { useState, useEffect, useCallback } from 'react';
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
body {
  background: #008080;
  font-family: 'Microsoft Sans Serif', 'Tahoma', sans-serif;
  color: #000;
  display: flex;
  justify-content: center;S
  background-image: linear-gradient(45deg, #009999 25%, transparent 25%), 
                    linear-gradient(-45deg, #009999 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #009999 75%),
                    linear-gradient(-45deg, transparent 75%, #009999 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}
  
.window {
    border: 2px solid #000;
    background: #c0c0c0;
    font-family: 'Microsoft Sans Serif', 'Tahoma', sans-serif;
    box-shadow: inset -2px -2px #fff, inset 2px 2px #808080;
    padding: 0;
    color: black;
  }

  .title-bar {
    background: linear-gradient(to right, #000080, #0000cd);
    color: white;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bold;
    text-shadow: 1px 1px #000;
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
    color: black;
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
    color: black;
  }

  button:hover {
    background: #d0d0d0;
  }

  button:active {
    box-shadow: inset 1px 1px #fff, inset -1px -1px #808080;
  }

  button:focus {
    outline: none;
    box-shadow: 0 0 0 2px #000;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    font-size: 14px;
    list-style: none;
    color: black;
  }

  input,
  .swal2-input {
    background: #fff;
    border: 2px solid #000;
    padding: 4px;
    font-size: 14px;
    font-family: 'Microsoft Sans Serif', 'Tahoma', sans-serif;
    box-shadow: inset -1px -1px #fff, inset 1px 1px #808080;
    color: black;
  }

  p {
    margin: 4px 0;
    color: black;
  }
  
  /* Custom SweetAlert Windows 98 style */
  .swal2-popup {
    border: 2px solid #000 !important;
    background: #c0c0c0 !important;
    font-family: 'Microsoft Sans Serif', 'Tahoma', sans-serif !important;
    box-shadow: inset -2px -2px #fff, inset 2px 2px #808080 !important;
    padding: 0 !important;
    color: black !important;
    border-radius: 0 !important;
  }
  
  .swal2-title {
    background: linear-gradient(to right, #000080, #0000cd) !important;
    color: white !important;
    padding: 4px 8px !important;
    font-size: 14px !important;
    font-weight: bold !important;
    text-shadow: 1px 1px #000 !important;
    width: 100% !important;
    margin: 0 !important;
    border-bottom: 2px solid #fff !important;
  }
  
  .swal2-html-container {
    background: #c0c0c0 !important;
    padding: 12px !important;
    color: black !important;
    margin-top: 0 !important;
  }
  
  .swal2-actions {
    background: #c0c0c0 !important;
    padding: 8px !important;
    gap: 8px !important;
    margin-top: 0 !important;
  }
  
  .swal2-confirm, .swal2-cancel {
    font-size: 12px !important;
    padding: 4px 8px !important;
    background: #e0e0e0 !important;
    border: 1px solid #000 !important;
    box-shadow: inset -1px -1px #fff, inset 1px 1px #808080 !important;
    cursor: pointer !important;
    color: black !important;
    border-radius: 0 !important;
  }
  
  .swal2-confirm:hover, .swal2-cancel:hover {
    background: #d0d0d0 !important;
  }
  
  .swal2-confirm:active, .swal2-cancel:active {
    box-shadow: inset 1px 1px #fff, inset -1px -1px #808080 !important;
  }
  
  .swal2-confirm:focus, .swal2-cancel:focus {
    outline: none !important;
    box-shadow: 0 0 0 2px #000 !important;
  }
  
  /* Slide Notification Styles */
  .notifications-container {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 250px;
    max-width: 90%;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .notification {
    border: 2px solid #000;
    background: #c0c0c0;
    box-shadow: inset -1px -1px #404040, inset 1px 1px #fff, 4px 4px 8px rgba(0, 0, 0, 0.5);
    overflow: hidden;
  }
  
  .notification-title {
    background: linear-gradient(to right, #000080, #0000cd);
    color: white;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: bold;
    text-shadow: 1px 1px #000;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .notification-close {
    width: 14px;
    height: 14px;
    background: #c0c0c0;
    border: 1px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: bold;
    cursor: pointer;
    line-height: 1;
    box-shadow: inset -1px -1px #404040, inset 1px 1px #fff;
  }
  
  .notification-body {
    padding: 8px;
    font-size: 12px;
  }
  
  .notification-success .notification-title {
    background: linear-gradient(to right, #008000, #00a000);
  }
  
  .notification-error .notification-title {
    background: linear-gradient(to right, #800000, #a00000);
  }
  
  .notification-info .notification-title {
    background: linear-gradient(to right, #000080, #0000cd);
  }
  
  .notification-warning .notification-title {
    background: linear-gradient(to right, #806600, #a08200);
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

type NotificationType = 'success' | 'error' | 'info' | 'warning';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
};

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: string }>({});
  const [filter, setFilter] = useState<Filter>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Notification system
  const addNotification = useCallback((title: string, message: string, type: NotificationType) => {
    const id = Date.now().toString();
    const newNotification = { id, title, message, type };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 3000);
    
    return id;
  }, []);
  
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        addNotification('Sistem', 'Memuat tugas...', 'info');
        
        const querySnapshot = await getDocs(collection(db, 'tasks'));
        const tasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];
        
        setTasks(tasksData);
        addNotification('Sukses', 'Tugas berhasil dimuat!', 'success');
      } catch (error) {
        console.error('Error fetching tasks:', error);
        addNotification('Error', 'Gagal memuat tugas!', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [addNotification]);

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

  const showWin98Alert = async (title: string, currentText: string = '', currentDeadline: string = ''): Promise<string[] | null> => {
    // Configure SweetAlert with Windows 98 style
    const { value: formValues } = await Swal.fire({
      title: title,
      html:
        `<input id="swal-input1" class="swal2-input" value="${currentText}" placeholder="Nama tugas">` +
        `<input id="swal-input2" type="datetime-local" class="swal2-input" value="${currentDeadline}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: currentText ? 'Simpan' : 'Tambah',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'swal2-popup',
        title: 'swal2-title',
        htmlContainer: 'swal2-html-container',
        actions: 'swal2-actions',
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel'
      },
      preConfirm: () => {
        const text = (document.getElementById('swal-input1') as HTMLInputElement)?.value;
        const deadline = (document.getElementById('swal-input2') as HTMLInputElement)?.value;
        
        if (!text.trim()) {
          Swal.showValidationMessage('Nama tugas tidak boleh kosong!');
          return false;
        }
        
        if (!deadline) {
          Swal.showValidationMessage('Deadline harus diisi!');
          return false;
        }
        
        return [text, deadline];
      },
    });

    return formValues ? formValues : null;
  };

  const addTask = async (): Promise<void> => {
    const formValues = await showWin98Alert('Tambahkan tugas baru');

    if (formValues) {
      try {
        addNotification('Sistem', 'Menambahkan tugas...', 'info');
        
        const newTask: Omit<Task, 'id'> = {
          text: formValues[0],
          completed: false,
          deadline: formValues[1],
        };
        
        const docRef = await addDoc(collection(db, 'tasks'), newTask);
        setTasks([...tasks, { id: docRef.id, ...newTask }]);
        
        addNotification('Sukses', 'Tugas berhasil ditambahkan!', 'success');
      } catch (error) {
        console.error('Error adding task:', error);
        addNotification('Error', 'Gagal menambahkan tugas!', 'error');
      }
    }
  };

  const editTask = async (id: string, currentText: string, currentDeadline: string): Promise<void> => {
    const formValues = await showWin98Alert('Edit Tugas', currentText, currentDeadline);

    if (formValues) {
      try {
        addNotification('Sistem', 'Menyimpan perubahan...', 'info');
        
        const updatedTasks = tasks.map((task) =>
          task.id === id ? { ...task, text: formValues[0], deadline: formValues[1] } : task
        );
        
        const taskRef = doc(db, 'tasks', id);
        await updateDoc(taskRef, {
          text: formValues[0],
          deadline: formValues[1],
        });
        
        setTasks(updatedTasks);
        addNotification('Sukses', 'Tugas berhasil diperbarui!', 'success');
      } catch (error) {
        console.error('Error updating task:', error);
        addNotification('Error', 'Gagal memperbarui tugas!', 'error');
      }
    }
  };

  const toggleTask = async (id: string): Promise<void> => {
    try {
      const task = tasks.find(t => t.id === id);
      const newStatus = !task?.completed;
      const statusText = newStatus ? 'selesai' : 'belum selesai';
      
      addNotification('Sistem', `Mengubah status tugas menjadi ${statusText}...`, 'info');
      
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, completed: newStatus } : task
      );
      
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        completed: newStatus,
      });
      
      setTasks(updatedTasks);
      addNotification('Sukses', `Status tugas berhasil diubah menjadi ${statusText}!`, 'success');
    } catch (error) {
      console.error('Error toggling task status:', error);
      addNotification('Error', 'Gagal mengubah status tugas!', 'error');
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    const { isConfirmed } = await Swal.fire({
      title: 'Konfirmasi',
      text: 'Apakah Anda yakin ingin menghapus tugas ini?',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'swal2-popup',
        title: 'swal2-title',
        htmlContainer: 'swal2-html-container',
        actions: 'swal2-actions',
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel'
      },
    });

    if (isConfirmed) {
      try {
        addNotification('Sistem', 'Menghapus tugas...', 'info');
        
        await deleteDoc(doc(db, 'tasks', id));
        setTasks(tasks.filter((task) => task.id !== id));
        
        addNotification('Sukses', 'Tugas berhasil dihapus!', 'success');
      } catch (error) {
        console.error('Error deleting task:', error);
        addNotification('Error', 'Gagal menghapus tugas!', 'error');
      }
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'ongoing') return !task.completed;
    return true;
  });

  return (
    <div>
      {styleTag}
      {/* Notifications Container */}
      <div className="notifications-container">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              className={`notification notification-${notification.type}`}
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="notification-title">
                <span>{notification.title}</span>
                <div 
                  className="notification-close" 
                  onClick={() => removeNotification(notification.id)}
                >
                  ✕
                </div>
              </div>
              <div className="notification-body">
                {notification.message}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="window mx-auto mt-10 p-4 w-[400px]">
        <div className="title-bar">
          <div className="title-bar-text">Task98</div>
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
          
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <p>Memuat data tugas...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #000', background: '#FFFFCC' }}>
              <p>Tidak ada tugas {filter === 'all' ? '' : filter === 'completed' ? 'yang selesai' : 'yang sedang berjalan'}.</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}