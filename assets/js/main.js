document.addEventListener('DOMContentLoaded', () => {
    // Initialize classes
    const passwordGenerator = new PasswordGenerator();
    const strengthCalculator = new StrengthCalculator();
    const platformManager = new PlatformManager();
    const historyManager = new PasswordHistoryManager();

    // DOM Elements
    const lengthSlider = document.getElementById('lengthSlider');
    const lengthValue = document.getElementById('lengthValue');
    const generateButton = document.getElementById('generateButton');
    const copyButton = document.getElementById('copyButton');
    const passwordDisplay = document.getElementById('generatedPassword');

    // Update length value display
    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
    });

    // Generate password
    generateButton.addEventListener('click', () => {
        try {
            const options = {
                length: parseInt(lengthSlider.value),
                useUpper: document.getElementById('uppercase').checked,
                useLower: document.getElementById('lowercase').checked,
                useNumbers: document.getElementById('numbers').checked,
                useSymbols: document.getElementById('symbols').checked
            };

            const password = passwordGenerator.generate(options);
            passwordDisplay.textContent = password;

            // Calculate and update strength
            const strength = strengthCalculator.calculate(password);
            updateStrengthIndicator(strength);
        } catch (error) {
            alert(error.message);
        }
    });

    // Copy password to clipboard
    copyButton.addEventListener('click', async () => {
        const password = passwordDisplay.textContent;
        if (password) {
            try {
                await navigator.clipboard.writeText(password);
                const originalText = copyButton.textContent;
                copyButton.textContent = 'Copied!';
                copyButton.classList.add('bg-green-500');
                // Add to history when copied
                historyManager.addToHistory(password);
                setTimeout(() => {
                    copyButton.textContent = originalText;
                    copyButton.classList.remove('bg-green-500');
                }, 1500);
            } catch (err) {
                alert('Failed to copy password');
            }
        }
    });

    // Update strength indicator
    function updateStrengthIndicator(strength) {
        const bar = document.getElementById('strengthBar');
        const text = document.getElementById('strengthText');
        
        let width, color, description;
        
        if (strength >= 7) {
            width = '100%';
            color = 'bg-green-500';
            description = 'Very Strong';
        } else if (strength >= 5) {
            width = '75%';
            color = 'bg-blue-500';
            description = 'Strong';
        } else if (strength >= 3) {
            width = '50%';
            color = 'bg-yellow-500';
            description = 'Medium';
        } else {
            width = '25%';
            color = 'bg-red-500';
            description = 'Weak';
        }
        
        bar.className = `strength-bar ${color}`;
        bar.style.width = width;
        text.textContent = `Password Strength: ${description}`;
    }

    // Generate initial password
    generateButton.click();
});