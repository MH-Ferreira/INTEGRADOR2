// Variáveis globais
let selectedFilm = ''; // Variável para armazenar o filme selecionado
const reservas = []; // Lista de reservas

// Função para abrir o seletor de filmes
function openFilmSelector() {
    const modal = document.getElementById('filmSelectorModal');
    modal.classList.remove('hidden');
}

// Função para fechar o seletor de filmes
function closeFilmSelector() {
    const modal = document.getElementById('filmSelectorModal');
    modal.classList.add('hidden');
}

// Função para selecionar um filme
function selectFilm(filmName) {
    selectedFilm = filmName;
    alert(`Você selecionou: ${filmName}`);
    closeFilmSelector();
}

// Função para enviar o formulário e registrar a reserva
document.getElementById('formReserva').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o envio tradicional do formulário

    const nome = document.getElementById('nome').value;
    const chave = document.getElementById('chave').value;
    const horario = document.getElementById('horario').value;
    const fotoInput = document.getElementById('novaFoto');
    const foto = fotoInput.files.length > 0 ? fotoInput.files[0] : null;

    // Verifica se o filme foi selecionado
    if (!selectedFilm) {
        alert('Por favor, escolha um filme!');
        return;
    }

    // Cria um objeto para a nova reserva
    const reserva = {
        nome,
        chave,
        horario,
        foto,
        filme: selectedFilm
    };

    // Adiciona a reserva à lista
    reservas.push(reserva);

    // Exibe as reservas na página
    updateReservas();

    // Limpa os campos do formulário
    document.getElementById('formReserva').reset();
    selectedFilm = ''; // Reseta o filme selecionado
});

// Função para atualizar a lista de reservas
function updateReservas() {
    const reservasContainer = document.getElementById('reservas');
    reservasContainer.innerHTML = ''; // Limpa a lista atual de reservas

    reservas.forEach((reserva, index) => {
        const reservaDiv = document.createElement('div');
        reservaDiv.classList.add('reserva');

        let fotoHtml = '';
        if (reserva.foto) {
            const fotoURL = URL.createObjectURL(reserva.foto);
            fotoHtml = `<img src="${fotoURL}" alt="Foto de perfil" class="foto-perfil">`;
        } else {
            fotoHtml = `<span class="no-foto">Sem foto</span>`;
        }

        reservaDiv.innerHTML = `
            <p><strong>Nome:</strong> ${reserva.nome}</p>
            <p><strong>Chave:</strong> ${reserva.chave}</p>
            <p><strong>Filme:</strong> ${reserva.filme}</p>
            <p><strong>Horário:</strong> ${reserva.horario}</p>
            ${fotoHtml}
        `;

        reservasContainer.appendChild(reservaDiv);
    });
}
