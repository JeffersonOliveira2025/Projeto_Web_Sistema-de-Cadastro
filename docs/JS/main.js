// Importações usando caminhos relativos corretos
import { Pessoa } from './classes/Pessoa.js';
import { StorageManager } from './storage.js';

console.log("=== SISTEMA DE CADASTRO INICIADO ===");

// Variável global para controlar a edição
let pessoaEditando = null;

// FUNÇÕES PRINCIPAIS
function validateForm() {
    const nome = $("#nome").val().trim();
    const idade = parseInt($("#idade").val());
    const altura = parseFloat($("#altura").val());
    const profissao = $("#profissao").val().trim();

    if (!nome || nome.length < 2) {
        alert("Nome deve ter pelo menos 2 caracteres");
        return false;
    }

    if (isNaN(idade) || idade < 0 || idade > 150) {
        alert("Idade deve ser entre 0 e 150 anos");
        return false;
    }

    if (isNaN(altura) || altura < 0.5 || altura > 2.5) {
        alert("Altura deve ser entre 0.5m e 2.5m");
        return false;
    }

    if (!profissao || profissao.length < 2) {
        alert("Profissão deve ter pelo menos 2 caracteres");
        return false;
    }

    return true;
}

function cadastrarPessoa() {
    console.log("Cadastrando/Atualizando pessoa...");
    
    if (!validateForm()) {
        return;
    }

    try {
        const pessoa = new Pessoa(
            $("#nome").val().trim(),
            parseInt($("#idade").val()),
            parseFloat($("#altura").val()),
            $("#profissao").val().trim()
        );

        if (pessoaEditando !== null) {
            // MODO EDIÇÃO - Atualiza pessoa existente
            const sucesso = StorageManager.updatePessoa(pessoaEditando, pessoa);
            if (sucesso) {
                showMessage("✅ Pessoa atualizada com sucesso!", "success");
                
                // Sai do modo edição
                pessoaEditando = null;
                $("#btnGravar").html("💾 Cadastrar");
                $("#btnGravar").removeClass("editing");
            }
        } else {
            // MODO CADASTRO - Adiciona nova pessoa
            StorageManager.savePessoa(pessoa);
            showMessage("✅ Pessoa cadastrada com sucesso!", "success");
        }

        loadPessoas();
        $("#formPessoa")[0].reset();

    } catch (error) {
        showMessage(`❌ Erro: ${error.message}`, "error");
    }
}

function loadPessoas() {
    console.log("Carregando pessoas...");
    const pessoas = StorageManager.getPessoas();
    const lista = $("#listaPessoas");
    
    lista.empty();

    if (pessoas.length === 0) {
        lista.html('<p class="no-data">Nenhuma pessoa cadastrada ainda.</p>');
        return;
    }

    pessoas.forEach((pessoaData, index) => {
        const pessoaElement = $(`
            <div class="pessoa-item" data-index="${index}">
                <div class="pessoa-info">
                    <h3>${pessoaData.nome}</h3>
                    <p>Idade: ${pessoaData.idade} anos</p>
                    <p>Altura: ${pessoaData.altura}m</p>
                    <p>Profissão: ${pessoaData.profissao}</p>
                </div>
                <div class="pessoa-actions">
                    <button class="btn-carregar" data-index="${index}">✏️ Carregar</button>
                    <button class="btn-remover" data-index="${index}">🗑️ Remover</button>
                </div>
            </div>
        `);

        pessoaElement.hide().appendTo(lista).fadeIn(500);

        // Evento para CARREGAR nos dados do formulário
        pessoaElement.find('.btn-carregar').on('click', function() {
            const index = $(this).data('index');
            carregarPessoaNoFormulario(index);
        });

        // Evento para REMOVER
        pessoaElement.find('.btn-remover').on('click', function() {
            const index = $(this).data('index');
            removerPessoa(index);
        });
    });
    
    showMessage(`📊 ${pessoas.length} pessoas carregadas!`, "info");
}

// NOVA FUNÇÃO: Carrega os dados da pessoa no formulário
function carregarPessoaNoFormulario(index) {
    const pessoas = StorageManager.getPessoas();
    
    if (index >= 0 && index < pessoas.length) {
        const pessoa = pessoas[index];
        
        // Preenche o formulário com os dados da pessoa
        $("#nome").val(pessoa.nome);
        $("#idade").val(pessoa.idade);
        $("#altura").val(pessoa.altura);
        $("#profissao").val(pessoa.profissao);
        
        // Armazena o índice da pessoa sendo editada
        pessoaEditando = index;
        
        // Altera o botão para indicar modo edição
        $("#btnGravar").html("💾 Atualizar");
        $("#btnGravar").addClass("editing");
        
        showMessage(`📝 Carregando dados de ${pessoa.nome} para edição`, "info");
        
        // Rola a página até o formulário
        $('html, body').animate({
            scrollTop: $(".form-section").offset().top
        }, 500);
    }
}

function removerPessoa(index) {
    const pessoas = StorageManager.getPessoas();
    if (index >= 0 && index < pessoas.length) {
        if (confirm(`Tem certeza que deseja remover ${pessoas[index].nome}?`)) {
            const sucesso = StorageManager.removePessoa(index);
            if (sucesso) {
                // Se estava editando a pessoa removida, limpa o formulário
                if (pessoaEditando === index) {
                    pessoaEditando = null;
                    $("#btnGravar").html("💾 Cadastrar");
                    $("#btnGravar").removeClass("editing");
                    $("#formPessoa")[0].reset();
                }
                
                showMessage("✅ Pessoa removida com sucesso!", "success");
                loadPessoas();
            }
        }
    }
}

function limparDados() {
    if (confirm("Tem certeza que deseja apagar TODOS os dados?")) {
        StorageManager.clearPessoas();
        // Limpa também o modo edição
        pessoaEditando = null;
        $("#btnGravar").html("💾 Cadastrar");
        $("#btnGravar").removeClass("editing");
        showMessage("🗑️ Todos os dados foram removidos!", "info");
        loadPessoas();
    }
}

function toggleTheme() {
    const currentTheme = StorageManager.getTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    StorageManager.saveTheme(newTheme);
    applyTheme(newTheme);
    
    $("#btnToggleTheme").text(newTheme === 'light' ? '🌙 Modo Escuro' : '☀️ Modo Claro');
}

function applySavedTheme() {
    const savedTheme = StorageManager.getTheme();
    applyTheme(savedTheme);
    $("#btnToggleTheme").text(savedTheme === 'light' ? '🌙 Modo Escuro' : '☀️ Modo Claro');
}

function applyTheme(theme) {
    $('body').removeClass('light-theme dark-theme').addClass(theme + '-theme');
}

function showMessage(message, type) {
    $('.message').remove();
    
    const messageElement = $(`<div class="message ${type}">${message}</div>`);
    $('body').append(messageElement);
    
    setTimeout(() => {
        messageElement.fadeOut(300, function() {
            messageElement.remove();
        });
    }, 3000);
}

// INICIALIZAÇÃO QUANDO DOCUMENTO ESTIVER PRONTO
$(document).ready(function() {
    console.log("✅ jQuery carregado com sucesso!");
    console.log("✅ Botões encontrados:", {
        btnGravar: $("#btnGravar").length,
        btnCarregar: $("#btnCarregar").length, 
        btnLimpar: $("#btnLimpar").length
    });
    
    // Aplica tema salvo
    applySavedTheme();
    
    // Configura eventos dos botões
    $("#btnGravar").on('click', cadastrarPessoa);
    $("#btnCarregar").on('click', loadPessoas);
    $("#btnLimpar").on('click', limparDados);
    $("#btnToggleTheme").on('click', toggleTheme);
    
    // Evento para limpar formulário (sai do modo edição)
    $("#btnLimparForm").on('click', function() {
        pessoaEditando = null;
        $("#btnGravar").html("💾 Cadastrar");
        $("#btnGravar").removeClass("editing");
        $("#formPessoa")[0].reset();
    });
    
    // Carrega pessoas ao iniciar
    loadPessoas();
    
    console.log("🎉 SISTEMA PRONTO PARA USO!");
});