
const form = document.getElementById("formReserva");
const entrada = document.getElementById("checkin");
const saida = document.getElementById("checkout");
const resultado = document.getElementById("resultado");

function dataLocal(date) {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const dia = String(date.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

const hoje = dataLocal(new Date());

entrada.min = hoje;
saida.min = hoje;

entrada.addEventListener("change", function() {
    saida.min = entrada.value || hoje;

    if (saida.value && saida.value <= entrada.value) {
        saida.value = "";
    }
});

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const dataEntrada = entrada.value;
    const dataSaida = saida.value;
    const hospedes = Number(
        document.getElementById("hospedes").value
    );

    const quarto = document.getElementById("tipoQuarto");
    const precoNoite = Number(quarto.value);

    if (!dataEntrada || !dataSaida) {
        mostrarErro("Selecione as datas de check-in e check-out.");
        return;
    }

    if (dataEntrada < hoje) {
        mostrarErro("O check-in não pode ser em uma data passada.");
        return;
    }

    if (dataSaida <= dataEntrada) {
        mostrarErro("O check-out precisa ser posterior ao check-in.");
        return;
    }

    const inicio = new Date(dataEntrada + "T12:00:00");
    const fim = new Date(dataSaida + "T12:00:00");

    const noites = Math.round((fim - inicio) / 86400000);
    const total = noites * precoNoite;

    const formatarData = data => {
        return new Date(data + "T12:00:00")
            .toLocaleDateString("pt-BR");
    };

    resultado.style.display = "block";

    resultado.innerHTML = `
        <h3>❄ Resumo da sua estadia</h3>
        <p><strong>Check-in:</strong> ${formatarData(dataEntrada)}</p>
        <p><strong>Check-out:</strong> ${formatarData(dataSaida)}</p>
        <p><strong>Duração:</strong> ${noites} ${noites === 1 ? "noite" : "noites"}</p>
        <p><strong>Hóspedes:</strong> ${hospedes}</p>
        <p><strong>Acomodação:</strong> ${quarto.options[quarto.selectedIndex].text}</p>
        <p><strong>Valor estimado:</strong> R$ ${total.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}</p>
        <p class="aviso">
            Esta é apenas uma simulação. Não verificamos disponibilidade
            nem registramos uma reserva.
        </p>
    `;

    resultado.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
});

function mostrarErro(mensagem) {
    resultado.style.display = "block";
    resultado.innerHTML = `<p>${mensagem}</p>`;

    resultado.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}
