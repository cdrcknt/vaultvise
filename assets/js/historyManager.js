class PasswordHistoryManager {
    constructor() {
        this.history = this.loadHistory();
        this.setupEventListeners();
        this.renderHistory();
    }

    loadHistory() {
        const savedHistory = localStorage.getItem('passwordHistory');
        return savedHistory ? JSON.parse(savedHistory) : [];
    }

    saveHistory() {
        localStorage.setItem('passwordHistory', JSON.stringify(this.history));
    }

    addToHistory(password) {
        const timestamp = new Date().toLocaleString();
        this.history.unshift({
            id: Date.now(),
            password,
            timestamp,
            name: ''
        });
        this.saveHistory();
        this.renderHistory();
    }

    updatePasswordName(id, name) {
        this.history = this.history.map(item => 
            item.id === id ? { ...item, name } : item
        );
        this.saveHistory();
        this.renderHistory();
    }

    deleteFromHistory(id) {
        this.history = this.history.filter(item => item.id !== id);
        this.saveHistory();
        this.renderHistory();
    }

    downloadHistory() {
        const content = this.history
            .map(item => {
                const name = item.name || 'Unnamed';
                return `Password: ${item.password}\nName: ${name}\nGenerated: ${item.timestamp}\n-----------------`;
            })
            .join('\n\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'password-history.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-password')) {
                const id = parseInt(e.target.dataset.id);
                this.deleteFromHistory(id);
            } else if (e.target.classList.contains('save-name')) {
                const id = parseInt(e.target.dataset.id);
                const input = document.querySelector(`input[data-id="${id}"]`);
                this.updatePasswordName(id, input.value);
            }
        });
    }

    renderHistory() {
        const container = document.getElementById('passwordHistory');
        if (!container) return;

        const historyHTML = this.history.map(item => `
            <div class="bg-gray-50 p-4 rounded-lg mb-4 fade-in">
                <div class="flex justify-between items-start mb-2">
                    <div class="font-mono text-sm">${item.password}</div>
                    <button class="delete-password text-red-500 hover:text-red-700" data-id="${item.id}">×</button>
                </div>
                <div class="flex items-center gap-2 mt-2">
                    <input 
                        type="text" 
                        placeholder="Add name"
                        value="${item.name}"
                        data-id="${item.id}"
                        class="text-sm px-2 py-1 border rounded flex-grow focus:outline-none focus:border-blue-500"
                    >
                    <button 
                        class="save-name bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        data-id="${item.id}"
                    >
                        Save
                    </button>
                </div>
                <div class="text-xs text-gray-500 mt-2">${item.timestamp}</div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="bg-white rounded-lg p-6 custom-shadow mt-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-semibold">Password History</h2>
                    <button id="downloadHistory" class="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600">
                        Download History
                    </button>
                </div>
                <div class="space-y-4">
                    ${historyHTML}
                </div>
            </div>
        `;

        document.getElementById('downloadHistory')?.addEventListener('click', () => this.downloadHistory());
    }
}

// Export the class
window.PasswordHistoryManager = PasswordHistoryManager;