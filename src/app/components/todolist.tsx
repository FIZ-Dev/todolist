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
    margin: 0;
    padding: 0;
    /* Windows 98 teal/blue background */
    background-color: #008080;
    /* Add the Windows 98 grid pattern */
    background-image: url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c0-8.837 7.163-16 16-16s16 7.163 16 16-7.163 16-16 16S8 24.837 8 16zm0 0v1.5c0 1.325.14 2.618.408 3.858l.206.146a16.105 16.105 0 0 0 4.3 3.9c1.613.896 3.418 1.522 5.332 1.818.638.1 1.29.16 1.954.16 1.065 0 2.097-.16 3.067-.46 2.03-.634 3.842-1.835 5.282-3.434l.116.116c2.334 2.328 5.548 3.764 9.108 3.764 7.174 0 12.99-5.82 12.99-13s-5.816-13-12.99-13c-7.174 0-12.99 5.82-12.99 13l.002.2c.03.473.233.89.568 1.173.47.4 1.165.6 1.763.413.45-.13.835-.44 1.046-.854.16-.32.28-.64.28-.982 0-2.342 1.15-4.42 2.92-5.676.4-.285.836-.528 1.295-.724.88-.376 1.85-.588 2.87-.588 3.976 0 7.194 3.21 7.22 7.175 0 .07 0 .14-.002.214-.03 4.03-3.35 7.32-7.4 7.32a7.4 7.4 0 0 1-3.47-.865 7.348 7.348 0 0 1-3.65-4.765.972.972 0 0 0-.913-.76c-.09-.004-.18 0-.268.01-.37.06-.68.25-.865.55a1.017 1.017 0 0 0-.13.953 10.76 10.76 0 0 1 .778 4.05c0 5.97-4.84 10.816-10.802 10.816S9.02 28.845 9.02 22.87a10.82 10.82 0 0 1 1.784-5.945c.068-.11.132-.22.188-.336a1 1 0 0 0-.44-1.34 1 1 0 0 0-1.3.253z' fill='%230a0a0a' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
    font-family: 'Microsoft Sans Serif', 'Tahoma', sans-serif;
  }

  .window {
    border: 2px solid #000;
    background: #c0c0c0;
    font-family: 'Microsoft Sans Serif', 'Tahoma', sans-serif;
    box-shadow: inset -2px -2px #404040, inset 2px 2px #fff, 4px 4px 8px rgba(0, 0, 0, 0.5);
    padding: 0;
    color: black;
  }

  .title-bar {
    background: linear-gradient(to right, #000080, #1084d0);
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
    box-shadow: inset -1px -1px #404040, inset 1px 1px #fff;
    cursor: pointer;
    position: relative;
  }

  .title-bar-controls button:active {
    box-shadow: inset 1px 1px #404040, inset -1px -1px #fff;
  }

  .title-bar-controls button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .title-bar-controls button[aria-label="Close"]::before {
    content: 'x';
    font-size: 9px;
    font-weight: bold;
  }

  .title-bar-controls button[aria-label="Minimize"]::before {
    content: '';
    width: 8px;
    height: 2px;
    background: #000;
    bottom: 3px;
  }

  .title-bar-controls button[aria-label="Maximize"]::before {
    content: '';
    width: 8px;
    height: 6px;
    border: 1px solid #000;
    background: transparent;
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
    background: #c0c0c0;
    border: 1px solid #000;
    box-shadow: inset -1px -1px #404040, inset 1px 1px #fff;
    cursor: pointer;
    color: black;
  }

  button:hover {
    background: #d0d0d0;
  }

  button:active {
    box-shadow: inset 1px 1px #404040, inset -1px -1px #fff;
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
    box-shadow: inset -2px -2px #404040, inset 2px 2px #fff, 4px 4px 8px rgba(0, 0, 0, 0.5) !important;
    padding: 0 !important;
    color: black !important;
    border-radius: 0 !important;
  }
  
  .swal2-title {
    background: linear-gradient(to right, #000080, #1084d0) !important;
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
    background: #c0c0c0 !important;
    border: 1px solid #000 !important;
    box-shadow: inset -1px -1px #404040, inset 1px 1px #fff !important;
    cursor: pointer !important;
    color: black !important;
    border-radius: 0 !important;
  }
  
  .swal2-confirm:hover, .swal2-cancel:hover {
    background: #d0d0d0 !important;
  }
  
  .swal2-confirm:active, .swal2-cancel:active {
    box-shadow: inset 1px 1px #404040, inset -1px -1px #fff !important;
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
    background: linear-gradient(to right, #000080, #1084d0);
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
    background: linear-gradient(to right, #000080, #1084d0);
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
      
      {/* Windows 98 Taskbar */}
      <div className="taskbar">
        <div style={{ marginRight: '4px' }}>🪟</div>
        Start
        <div className="taskbar-time">{new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
}