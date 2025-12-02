// storage.js - Gerenciamento de Armazenamento Local
export class StorageManager {
    // ===== GERENCIAMENTO DE PESSOAS =====
    
    static getPessoas() {
        const pessoas = localStorage.getItem('pessoas');
        return pessoas ? JSON.parse(pessoas) : [];
    }

    static savePessoa(pessoa) {
        const pessoas = this.getPessoas();
        pessoas.push({
            nome: pessoa.nome,
            idade: pessoa.idade,
            altura: pessoa.altura,
            profissao: pessoa.profissao
        });
        localStorage.setItem('pessoas', JSON.stringify(pessoas));
    }

    static updatePessoa(index, pessoa) {
        const pessoas = this.getPessoas();
        if (index >= 0 && index < pessoas.length) {
            pessoas[index] = {
                nome: pessoa.nome,
                idade: pessoa.idade,
                altura: pessoa.altura,
                profissao: pessoa.profissao
            };
            localStorage.setItem('pessoas', JSON.stringify(pessoas));
            return true;
        }
        return false;
    }

    static removePessoa(index) {
        const pessoas = this.getPessoas();
        if (index >= 0 && index < pessoas.length) {
            pessoas.splice(index, 1);
            localStorage.setItem('pessoas', JSON.stringify(pessoas));
            return true;
        }
        return false;
    }

    static clearPessoas() {
        localStorage.removeItem('pessoas');
    }

    // ===== GERENCIAMENTO DE TEMA =====
    
    static getTheme() {
        return localStorage.getItem('theme') || 'light';
    }

    static saveTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    // ===== GERENCIAMENTO DE COOKIES (FUNCIONALIDADE EXTRA) =====
    
    static setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    static getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // ===== MÉTODOS UTILITÁRIOS =====
    
    static getStorageInfo() {
        return {
            pessoasCount: this.getPessoas().length,
            currentTheme: this.getTheme(),
            storageSize: this.calculateStorageSize(),
            lastUpdate: new Date().toLocaleString()
        };
    }

    static calculateStorageSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length;
            }
        }
        return (total / 1024).toFixed(2) + ' KB';
    }

    // ===== BACKUP E RESTAURAÇÃO (FUNCIONALIDADE EXTRA) =====
    
    static exportData() {
        const data = {
            pessoas: this.getPessoas(),
            theme: this.getTheme(),
            exportDate: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    }

    static importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.pessoas) {
                localStorage.setItem('pessoas', JSON.stringify(data.pessoas));
            }
            if (data.theme) {
                localStorage.setItem('theme', data.theme);
            }
            return true;
        } catch (error) {
            console.error('Erro ao importar dados:', error);
            return false;
        }
    }
}