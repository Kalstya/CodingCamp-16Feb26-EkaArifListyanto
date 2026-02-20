// ==========================================
// 1. MENANGKAP ELEMEN HTML (DOM Selection)
// ==========================================
// Kita ambil elemen-elemen dari HTML berdasarkan ID mereka
const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const addBtn = document.getElementById('addBtn');
const filterStatus = document.getElementById('filterStatus');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const todoListBody = document.getElementById('todoListBody');

// Array untuk menyimpan data tugas kita (Database sementara)
let todos = [];

// ==========================================
// 2. FUNGSI UTAMA: MENAMPILKAN DATA (Render)
// ==========================================
function renderTodos() {
    // Bersihkan isi tabel sebelum diisi ulang
    todoListBody.innerHTML = '';

    // Ambil nilai filter saat ini ('all', 'completed', atau 'pending')
    const filterValue = filterStatus.value;

    // Saring data berdasarkan pilihan dropdown filter
    const filteredTodos = todos.filter(todo => {
        if (filterValue === 'all') return true;
        return todo.status === filterValue;
    });

    // Cek apakah data kosong
    if (filteredTodos.length === 0) {
        todoListBody.innerHTML = `
            <tr id="emptyMessage">
                <td colspan="4" class="empty-text">No task found</td>
            </tr>
        `;
        return; // Hentikan fungsi sampai di sini kalau kosong
    }

    // Jika ada data, buat baris tabel (<tr>) untuk setiap tugas
    filteredTodos.forEach(todo => {
        const tr = document.createElement('tr');
        
        // Cek status untuk CSS (Coret teks kalau selesai)
        const isCompleted = todo.status === 'completed';
        const textClass = isCompleted ? 'task-done' : '';
        const badgeClass = isCompleted ? 'status-completed' : 'status-pending';
        const statusText = isCompleted ? 'Completed' : 'Pending';

        tr.innerHTML = `
            <td class="${textClass}">${todo.taskName}</td>
            <td class="${textClass}">${todo.dueDate}</td>
            <td><span class="status-badge ${badgeClass}">${statusText}</span></td>
            <td>
                <button class="action-btn btn-complete" onclick="toggleStatus(${todo.id})">
                    ${isCompleted ? 'Undo' : 'Done'}
                </button>
                <button class="action-btn btn-delete" onclick="deleteTodo(${todo.id})">
                    Delete
                </button>
            </td>
        `;
        
        todoListBody.appendChild(tr);
    });
}

// ==========================================
// 3. FUNGSI TAMBAH TUGAS (Add)
// ==========================================
function addTodo() {
    const taskValue = taskInput.value.trim();
    const dateValue = dateInput.value;

    // Validasi: Form tidak boleh kosong
    if (taskValue === '' || dateValue === '') {
        alert('Please fill in both the task and the due date!');
        return;
    }

    // Buat objek tugas baru
    const newTodo = {
        id: Date.now(), // Bikin ID unik pakai waktu saat ini
        taskName: taskValue,
        dueDate: dateValue,
        status: 'pending' // Default status selalu 'pending' (belum selesai)
    };

    // Masukkan ke dalam array 'todos'
    todos.push(newTodo);

    // Kosongkan form input setelah berhasil ditambah
    taskInput.value = '';
    dateInput.value = '';

    // Tampilkan ulang data
    renderTodos();
}

// ==========================================
// 4. FUNGSI UBAH STATUS (Done / Undo)
// ==========================================
function toggleStatus(id) {
    // Cari tugas mana yang diklik berdasarkan ID-nya
    const todo = todos.find(t => t.id === id);
    if (todo) {
        // Balikkan statusnya
        todo.status = todo.status === 'pending' ? 'completed' : 'pending';
        renderTodos();
    }
}

// ==========================================
// 5. FUNGSI HAPUS SATU TUGAS (Delete)
// ==========================================
function deleteTodo(id) {
    // Tanya konfirmasi ke user
    if (confirm('Are you sure you want to delete this task?')) {
        // Buang tugas yang ID-nya cocok dari array
        todos = todos.filter(t => t.id !== id);
        renderTodos();
    }
}

// ==========================================
// 6. FUNGSI HAPUS SEMUA (Delete All)
// ==========================================
function deleteAll() {
    if (todos.length === 0) {
        alert('List is already empty!');
        return;
    }

    if (confirm('Are you SURE you want to delete ALL tasks? This cannot be undone.')) {
        todos = []; // Kosongkan array
        renderTodos();
    }
}

// ==========================================
// 7. MENGHUBUNGKAN EVENT LISTENER (Trigger)
// ==========================================
// Kapan fungsi-fungsi di atas dipanggil? 
// Saat user melakukan sesuatu (klik / ganti dropdown)

addBtn.addEventListener('click', addTodo);
deleteAllBtn.addEventListener('click', deleteAll);
filterStatus.addEventListener('change', renderTodos); // Render ulang saat filter diganti

// Tampilkan tabel kosong saat website pertama kali dibuka
renderTodos();