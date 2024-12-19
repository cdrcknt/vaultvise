class PlatformManager {
    constructor() {
        this.platforms = this.loadPlatforms();
        this.setupEventListeners();
        this.renderPlatforms();
    }

    loadPlatforms() {
        const savedPlatforms = localStorage.getItem('passwordPlatforms');
        if (savedPlatforms) {
            return JSON.parse(savedPlatforms);
        }
        return [
            {
                name: 'Google',
                minLength: 8,
                maxLength: 100,
                requiresUpper: true,
                requiresLower: true,
                requiresNumbers: true,
                requiresSymbols: false
            },
            {
                name: 'Microsoft',
                minLength: 8,
                maxLength: 256,
                requiresUpper: true,
                requiresLower: true,
                requiresNumbers: true,
                requiresSymbols: true
            }
        ];
    }

    savePlatforms() {
        localStorage.setItem('passwordPlatforms', JSON.stringify(this.platforms));
    }

    setupEventListeners() {
        const form = document.getElementById('newPlatformForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addPlatform();
        });
    }

    addPlatform() {
        const name = document.getElementById('platformName').value;
        const minLength = parseInt(document.getElementById('minLength').value);
        const maxLength = parseInt(document.getElementById('maxLength').value);
        const requiresUpper = document.getElementById('reqUppercase').checked;
        const requiresLower = document.getElementById('reqLowercase').checked;
        const requiresNumbers = document.getElementById('reqNumbers').checked;
        const requiresSymbols = document.getElementById('reqSymbols').checked;

        if (!name || !minLength || !maxLength) {
            alert('Please fill in all required fields');
            return;
        }

        if (minLength > maxLength) {
            alert('Minimum length cannot be greater than maximum length');
            return;
        }

        if (this.platforms.some(p => p.name.toLowerCase() === name.toLowerCase())) {
            alert('A platform with this name already exists');
            return;
        }

        this.platforms.push({
            name,
            minLength,
            maxLength,
            requiresUpper,
            requiresLower,
            requiresNumbers,
            requiresSymbols
        });

        this.savePlatforms();
        this.renderPlatforms();
        document.getElementById('newPlatformForm').reset();
    }

    deletePlatform(platformName) {
        this.platforms = this.platforms.filter(p => p.name !== platformName);
        this.savePlatforms();
        this.renderPlatforms();
    }

    renderPlatformCard(platform) {
        return `
            <div class="policy-card bg-gray-50 p-4 rounded-lg fade-in">
                <div class="flex justify-between items-start">
                    <h3 class="text-lg font-medium">${platform.name}</h3>
                    <button onclick="platformManager.deletePlatform('${platform.name}')" class="text-red-500 hover:text-red-700">
                        ×
                    </button>
                </div>
                <div class="mt-2 space-y-1 text-sm text-gray-600">
                    <p>Length: ${platform.minLength} - ${platform.maxLength} characters</p>
                    <p>Requirements:</p>
                    <ul class="list-disc list-inside pl-2">
                        ${platform.requiresUpper ? '<li>Uppercase letter</li>' : ''}
                        ${platform.requiresLower ? '<li>Lowercase letter</li>' : ''}
                        ${platform.requiresNumbers ? '<li>Number</li>' : ''}
                        ${platform.requiresSymbols ? '<li>Special character</li>' : ''}
                    </ul>
                </div>
            </div>
        `;
    }

    renderPlatforms() {
        const container = document.getElementById('requirementsList');
        container.innerHTML = this.platforms.map(p => this.renderPlatformCard(p)).join('');
    }
}

// Export the class
window.PlatformManager = PlatformManager;