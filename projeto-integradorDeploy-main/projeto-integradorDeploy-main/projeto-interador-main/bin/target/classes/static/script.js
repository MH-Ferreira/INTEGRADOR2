const API_URL = 'https://mhmovie-ebb6czbdbxbzcvfr.canadacentral-01.azurewebsites.net/api';
let selectedFilm = null;
let editingId = null;

document.getElementById('formReserva').addEventListener('submit', handleFormSubmit);

// Função para abrir o modal de seleção de filmes
function openFilmSelector() {
    document.getElementById('filmSelectorModal').classList.remove('hidden');
}

// Função para fechar o modal
function closeFilmSelector() {
    document.getElementById('filmSelectorModal').classList.add('hidden');
}

// Seleciona um filme
function selectFilm(film) {
    selectedFilm = film;
    alert(`Você escolheu: ${film}`);
    closeFilmSelector();
}

// Submete o formulário
async function handleFormSubmit(event) {
    event.preventDefault();

    const reserva = {
        nome: document.getElementById('nome').value,
        chaveReserva: document.getElementById('chave').value,
        horarioReserva: document.getElementById('horario').value,
        filmeEscolhido: selectedFilm,
        imagemPerfil: null, // Carregue a foto, se necessário
    };

    try {
        const response = await fetch(`${API_URL}/CriarReserva`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reserva),
        });

        if (!response.ok) throw new Error('Erro ao salvar reserva');
        alert('Reserva salva com sucesso!');
        listReservas();
    } catch (err) {
        console.error(err);
    }
}

// Lista as reservas
async function listReservas() {
    try {
        const response = await fetch(`${API_URL}/mostrarReserva`);
        if (!response.ok) throw new Error('Erro ao carregar reservas');

        const reservas = await response.json();
        const reservasDiv = document.getElementById('reservas');
        reservasDiv.innerHTML = '';

        reservas.forEach((reserva) => {
            const div = document.createElement('div');
            div.innerHTML = `
                <h3>${reserva.nome}</h3>
                <p>Filme: ${reserva.filmeEscolhido}</p>
                <button onclick="deleteReserva(${reserva.id})">Excluir</button>
            `;
            reservasDiv.appendChild(div);
        });
    } catch (err) {
        console.error(err);
    }
}

// Exclui uma reserva
async function deleteReserva(id) {
    try {
        await fetch(`${API_URL}/deletar/${id}`, { method: 'DELETE' });
        alert('Reserva excluída');
        listReservas();
    } catch (err) {
        console.error(err);
    }
}

// Inicializa a lista de reservas
listReservas();
