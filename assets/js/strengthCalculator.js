class StrengthCalculator {
    calculate(password) {
        let score = 0;
        
        // Length criteria
        if (password.length >= 12) score += 2;
        else if (password.length >= 8) score += 1;
        
        // Character type criteria
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        
        // Pattern criteria
        if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{12,}$/.test(password)) {
            score += 2;
        }
        
        return score;
    }
}

// Export the class
window.StrengthCalculator = StrengthCalculator;