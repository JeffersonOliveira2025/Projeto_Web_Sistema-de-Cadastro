export class Pessoa {
    constructor(nome, idade, altura, profissao) {
        this.nome = nome;
        this.idade = idade;
        this.altura = altura;
        this.profissao = profissao;
    }

    toString() {
        return `${this.nome}, ${this.idade} anos, ${this.altura}m, ${this.profissao}`;
    }
}