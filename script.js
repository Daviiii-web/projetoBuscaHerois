document.addEventListener('DOMContentLoaded', () => {

    const cardContainer = document.querySelector('.card-container');
    const searchInput = document.querySelector('input[type="text"]');
    const searchButton = document.querySelector('#botao-busca');
    const modalOverlay = document.querySelector('#hero-modal');
    const modalBody = document.querySelector('#modal-body');
    const modalCloseButton = document.querySelector('.modal-close-button');


    const initialCardHTML = cardContainer.innerHTML;
    let todosOsHerois = [];

    async function carregarHerois(){
        try {
            const response = await fetch('data.json');
            todosOsHerois = await response.json();
        } catch (error) {
            console.error("Erro ao carregar o arquivo data.json:", error);
            cardContainer.innerHTML = "<p>Não foi possível carregar os dados dos heróis.</p>";
        }
    }

    function renderizarCards(listaDeHerois){
        cardContainer.innerHTML = '';

        if (listaDeHerois.length === 0) {
            cardContainer.innerHTML = '<p style="text-align: center; font-size: 1.2rem;">Nenhum herói encontrado com esse nome.</p>';
        } else {
            for (const heroi of listaDeHerois){
                const article = document.createElement('article');
                article.classList.add("card");
                article.dataset.heroiNome = heroi.nome;
                article.innerHTML = `
                    <img src="${heroi.imagem}" alt="Imagem do ${heroi.nome}">
                    <div class="card-content">
                        <h2>${heroi.nome}</h2>
                        <h3>História</h3>
                        <p>${heroi.historia}</p>
                        <h3>Curiosidades</h3>
                        <p>${heroi.curiosidades}</p>
                        <h3>Poderes</h3>
                        <ul>${heroi.poderes.map(poder => `<li>${poder}</li>`).join('')}</ul>
                        <h3>Inimigos</h3>
                        <ul>${heroi.inimigos.map(inimigo => `<li>${inimigo}</li>`).join('')}</ul>
                    </div>
                `;
                cardContainer.appendChild(article);
            }
        }
    }

    function abrirModal(heroi) {
        modalBody.innerHTML = `
            <div class="modal-body-grid">
                <img src="${heroi.imagem}" alt="Imagem de ${heroi.nome}">
                <div>
                    <h2>${heroi.nome}</h2>
                    <h3>História</h3>
                    <p>${heroi.historia}</p>
                </div>
                <div>
                    <h3>Curiosidades</h3>
                    <p>${heroi.curiosidades}</p>
                    <h3>Poderes</h3>
                    <ul>${heroi.poderes.map(poder => `<li>${poder}</li>`).join('')}</ul>
                </div>
                <div>
                    <h3>Inimigos Principais</h3>
                    <ul>${heroi.inimigos.map(inimigo => `<li>${inimigo}</li>`).join('')}</ul>
                    <h3>Quadrinhos Essenciais</h3>
                    <ul>${heroi.quadrinhos.map(hq => `<li>${hq}</li>`).join('')}</ul>
                    <h3>Jogos Notáveis</h3>
                    <ul>${heroi.jogos.map(jogo => `<li>${jogo}</li>`).join('')}</ul>
                </div>
            </div>
        `;
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function fecharModal() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function buscarHeroi() {
        const termoBusca = searchInput.value.toLowerCase();

        if (termoBusca === '') {
            cardContainer.innerHTML = initialCardHTML;
        } else {
            const normalizarTexto = (texto) => {
                return texto
                    .normalize("NFD") // Separa acentos das letras
                    .replace(/[\u0300-\u036f]/g, "") // Remove os acentos (caracteres diacríticos)
                    .replace(/[-]/g, " ") // Substitui hífen por espaço para facilitar a comparação
                    .toLowerCase();
            };

            const termoNormalizado = normalizarTexto(termoBusca);

            if (termoNormalizado === 'all' || termoNormalizado === 'todos') {
                renderizarCards(todosOsHerois);
            } else {
                const heroisFiltrados = todosOsHerois.filter(heroi => normalizarTexto(heroi.nome).includes(termoNormalizado));
                renderizarCards(heroisFiltrados);
            }

        }
    }

    searchButton.addEventListener('click', buscarHeroi);
    searchInput.addEventListener('input', buscarHeroi);

    cardContainer.addEventListener('click', (event) => {
        const cardClicado = event.target.closest('.card');
        if (cardClicado && !cardClicado.classList.contains('initial-card')) {
            const nomeHeroi = cardClicado.dataset.heroiNome;
            const heroiSelecionado = todosOsHerois.find(h => h.nome === nomeHeroi);
            if (heroiSelecionado) {
                abrirModal(heroiSelecionado);
            }
        }
    });

    modalCloseButton.addEventListener('click', fecharModal);
    modalOverlay.addEventListener('click', (event) => { if (event.target === modalOverlay) fecharModal(); });

    carregarHerois();
});
