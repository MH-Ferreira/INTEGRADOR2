const API_URL = 'https://mhmovie-ebb6czbdbxbzcvfr.canadacentral-01.azurewebsites.net/api';
let selectedFilm = null;
let editingId = null;
lo
// Evento para o formulário
document.getElementById('formReserva').addEventListener('submit', handleFormSubmit);

// Função para abrir o modal de seleção de filmes
function openFilmSelector() {
    document.getElementById('filmSelectorModal').classList.remove('hidden');
}

// Função para fechar o modal
function closeFilmSelector() {
    document.getElementById('filmSelectorModal').classList.add('hidden');
}

// Função para selecionar o filme
function selectFilm(film) {
    selectedFilm = film;

    const selectedFilmElement = document.getElementById('selected-film');
    if (!selectedFilmElement) {
        console.error("Elemento para mostrar o filme não encontrado.");
        return;
    }

    alert(`Você escolheu: ${film}`);
    selectedFilmElement.textContent = `Filme Selecionado: ${film}`;
    closeFilmSelector();
}

// Função para submeter o formulário de reserva
async function handleFormSubmit(event) {
    event.preventDefault();

    // Validação de seleção de filme
    if (!selectedFilm) {
        alert('Por favor, escolha um filme!');
        return;
    }

    const nome = document.getElementById('nome').value.trim();
    const chave = document.getElementById('chave').value.trim();
    const horario = document.getElementById('horario').value.trim();

    // Validação de campos obrigatórios
    if (!nome || !chave || !horario) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    const reserva = {
        nome,
        chaveReserva: chave,
        horarioReserva: horario,
        filmeEscolhido: selectedFilm,
        imagemPerfil: await carregarImagemPerfil(),
    };

    try {
        const url = editingId ? `${API_URL}/atualizar/${editingId}` : `${API_URL}/CriarReserva`;
        const method = editingId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reserva),
        });

        if (!response.ok) throw new Error('Erro ao salvar reserva');

        alert('Reserva salva com sucesso!');
        listReservas(); // Atualiza a lista de reservas
        clearForm(); // Limpa o formulário
    } catch (err) {
        console.error(err);
        alert(`Erro ao salvar a reserva: ${err.message}`);
    }
}

// Função para carregar a imagem de perfil
async function carregarImagemPerfil() {
    const input = document.getElementById('novaFoto');
    if (input.files.length === 0) return null;

    const file = input.files[0];
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Função para listar as reservas
async function listReservas() {
    try {
        const response = await fetch(`${API_URL}/mostrarReserva`);
        if (!response.ok) throw new Error('Erro ao carregar reservas');

        const reservas = await response.json();
        const reservasDiv = document.getElementById('reservas');
        reservasDiv.innerHTML = '';

        reservas.forEach(reserva => {
            const div = document.createElement('div');
            div.innerHTML = `
                <h3>${reserva.nome}</h3>
                <p>Filme: ${reserva.filmeEscolhido}</p>
                ${reserva.imagemPerfil ? `<img src="${reserva.imagemPerfil}" alt="Foto de Perfil" width="50" />` : ''}
                <button onclick="editReserva(${reserva.id})">Editar</button>
                <button onclick="deleteReserva(${reserva.id})">Excluir</button>
            `;
            reservasDiv.appendChild(div);
        });
    } catch (err) {
        console.error(err);
        alert('Erro ao carregar reservas.');
    }
}

// Função para excluir uma reserva
async function deleteReserva(id) {
    try {
        await fetch(`${API_URL}/deletar/${id}`, { method: 'DELETE' });
        alert('Reserva excluída');
        listReservas(); // Atualiza a lista de reservas
    } catch (err) {
        console.error(err);
        alert('Erro ao excluir a reserva.');
    }
}

// Função para editar uma reserva
function editReserva(id) {
    fetch(`${API_URL}/mostrarReserva/${id}`)
        .then(response => response.json())
        .then(reserva => {
            document.getElementById('nome').value = reserva.nome;
            document.getElementById('chave').value = reserva.chaveReserva;
            document.getElementById('horario').value = reserva.horarioReserva;
            selectedFilm = reserva.filmeEscolhido;
            document.getElementById('selected-film').textContent = `Filme Selecionado: ${reserva.filmeEscolhido}`;
            editingId = id;
        })
        .catch(error => {
            console.error('Erro ao carregar reserva para edição:', error);
            alert('Erro ao carregar dados para edição.');
        });
}

// Função para limpar o formulário
function clearForm() {
    document.getElementById('formReserva').reset();
    selectedFilm = null;
    editingId = null;
    document.getElementById('selected-film').textContent = 'Filme Selecionado: Nenhum';
}

// Chama a função para listar as reservas ao carregar a página
listReservas();
