class PasswordGenerator {
    constructor() {
        this.upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.lowerChars = 'abcdefghijklmnopqrstuvwxyz';
        this.numberChars = '0123456789';
        this.symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }

    generate(options) {
        const {
            length,
            useUpper,
            useLower,
            useNumbers,
            useSymbols
        } = options;

        let chars = '';
        if (useUpper) chars += this.upperChars;
        if (useLower) chars += this.lowerChars;
        if (useNumbers) chars += this.numberChars;
        if (useSymbols) chars += this.symbolChars;

        if (chars === '') {
            throw new Error('Please select at least one character type');
        }

        let password = this.generateInitialPassword(length, chars);
        password = this.ensureRequirements(password, options);

        return password;
    }

    generateInitialPassword(length, chars) {
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    ensureRequirements(password, options) {
        const { length, useUpper, useLower, useNumbers, useSymbols } = options;

        if (useUpper && !/[A-Z]/.test(password)) {
            const pos = Math.floor(Math.random() * length);
            password = this.replaceAt(password, pos, this.getRandomChar(this.upperChars));
        }
        if (useLower && !/[a-z]/.test(password)) {
            const pos = Math.floor(Math.random() * length);
            password = this.replaceAt(password, pos, this.getRandomChar(this.lowerChars));
        }
        if (useNumbers && !/[0-9]/.test(password)) {
            const pos = Math.floor(Math.random() * length);
            password = this.replaceAt(password, pos, this.getRandomChar(this.numberChars));
        }
        if (useSymbols && !/[!@#$%^&*()_+-=[\]{}|;:,.<>?]/.test(password)) {
            const pos = Math.floor(Math.random() * length);
            password = this.replaceAt(password, pos, this.getRandomChar(this.symbolChars));
        }

        return password;
    }

    replaceAt(str, index, replacement) {
        return str.substring(0, index) + replacement + str.substring(index + 1);
    }

    getRandomChar(chars) {
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }
}

// Export the class
window.PasswordGenerator = PasswordGenerator;