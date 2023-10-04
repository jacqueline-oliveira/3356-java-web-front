import getDados from "./getDados.js";

// Mapeia os elementos DOM que você deseja atualizar
const elementos = {
    top5: document.querySelector('[data-name="top5"]'),
    lancamentos: document.querySelector('[data-name="lancamentos"]'),
    series: document.querySelector('[data-name="series"]')
};

// Função para criar a lista de filmes
function criarListaFilmes(elemento, dados) {
    // Verifique se há um elemento <ul> dentro da seção
    const ulExistente = elemento.querySelector('ul');

    // Se um elemento <ul> já existe dentro da seção, remova-o
    if (ulExistente) {
        elemento.removeChild(ulExistente);
    }

    const ul = document.createElement('ul');
    ul.className = 'lista';
    const listaHTML = dados.slice(0, 5).map((filme) => `
        <li>
            <a href="/detalhes.html?id=${filme.id}">
                <img src="${filme.poster}" alt="${filme.titulo}">
            </a>
        </li>
    `).join('');

    ul.innerHTML = listaHTML;
    elemento.appendChild(ul);
}

// Função genérica para tratamento de erros
function lidarComErro(mensagemErro) {
    console.error(mensagemErro);
}

function limparElementos() {
    for (const section of sectionsParaOcultar) {
        section.classList.toggle('hidden')
    }
}

const categoriaSelect = document.querySelector('[data-categorias]');
const sectionsParaOcultar = document.querySelectorAll('.section'); // Adicione a classe CSS 'hide-when-filtered' às seções e títulos que deseja ocultar.

categoriaSelect.addEventListener('change', async function handleMudancaCategoria() {
    const categoriaSelecionada = categoriaSelect.value;

    // Limpe o conteúdo atual na tela
    if (categoriaSelecionada === 'todos') {
        // Recarregue os dados originais
        limparElementos();
    } else {
        limparElementos();
        // Faça uma solicitação para o endpoint com a categoria selecionada
        try {
            const data = await getDados(`/series/categoria/${categoriaSelecionada}`);
            criarListaFilmes(categoria, data);
        } catch (error) {
            lidarComErro("Ocorreu um erro ao carregar os dados da categoria.");
        }
    }
});

// Array de URLs para as solicitações
gerarSeries();
async function gerarSeries() {
    const urls = ['/series/top5', '/series/lancamentos', '/series'];

    try {
        // Faz todas as solicitações em paralelo
        const data = await Promise.all(urls.map(url => getDados(url)));
        criarListaFilmes(elementos.top5, data[0]);
        criarListaFilmes(elementos.lancamentos, data[1]);
        criarListaFilmes(elementos.series, data[2]);
    } catch (error) {
        lidarComErro("Ocorreu um erro ao carregar os dados.");
    }
}
