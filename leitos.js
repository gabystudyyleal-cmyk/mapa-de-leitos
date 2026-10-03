/*==============================
        HOMEPAGE - MAPA DE LEITOS
==============================*/

let setorAtual = "Todos";

const elSetores = document.getElementById("setores");
const elFiltros = document.getElementById("filtros");
const elBusca = document.getElementById("busca");

function atualizarResumo(leitos) {
    const conta = s => leitos.filter(l => l.status === s).length;
    document.getElementById("totalLeitos").textContent = leitos.length;
    document.getElementById("totalOcupados").textContent = conta("busy");
    document.getElementById("totalLivres").textContent = conta("free");
    document.getElementById("totalIsolamento").textContent = conta("isolation");
    document.getElementById("totalObservacao").textContent = conta("observation");
}

function renderizarFiltros(setores) {
    if (setorAtual !== "Todos" && !setores.includes(setorAtual)) setorAtual = "Todos";

    elFiltros.innerHTML = "";
    ["Todos", ...setores].forEach(nome => {
        const b = document.createElement("button");
        b.textContent = nome;
        if (nome === setorAtual) b.className = "active";
        b.addEventListener("click", () => {
            setorAtual = nome;
            renderizarFiltros(setores);
            renderizarLeitos();
        });
        elFiltros.appendChild(b);
    });
}

function renderizarLeitos() {
    const leitos = ordenar(lerLeitos());
    const termo = elBusca.value.trim().toLowerCase();

    if (leitos.length === 0) {
        elSetores.innerHTML = `<div class="section empty">
            Nenhum leito cadastrado ainda.<br>
            <a href="leitos.html">Adicione os leitos em Gerenciar Leitos</a>.</div>`;
        return;
    }

    const setores = [...new Set(leitos.map(l => l.setor))];
    let html = "";

    setores.forEach(setor => {
        if (setorAtual !== "Todos" && setorAtual !== setor) return;

        const lista = leitos.filter(l => l.setor === setor &&
            (l.codigo.toLowerCase().includes(termo) || l.paciente.toLowerCase().includes(termo)));
        if (lista.length === 0) return;

        const livres = lista.filter(l => l.status === "free").length;

        html += `<div class="section">
            <div class="section-title">
                <span>${esc(setor)}</span>
                <small>${livres} de ${lista.length} livres</small>
            </div>
            <div class="beds">` +
            lista.map(l => `
                <div class="bed ${l.status}">
                    <h3>${esc(l.codigo)}</h3>
                    <p>${l.paciente ? esc(l.paciente) : "Sem paciente"}</p>
                    <p class="bed-status">${STATUS[l.status].nome}</p>
                </div>`).join("") +
            `</div></div>`;
    });

    elSetores.innerHTML = html ||
        `<div class="section empty">Nenhum leito encontrado. Ajuste a busca ou o filtro.</div>`;
}

function renderizarAtualizacoes() {
    const lista = lerAtualizacoes();
    const el = document.getElementById("atualizacoes");

    el.innerHTML = lista.length === 0 ?
        `<p class="vazio">Nenhuma alteração ainda.</p>` :
        lista.map(a => `
            <div class="update">
                <div class="dot ${a.cor}"></div>
                <div><p>${esc(a.texto)}</p><small>${a.hora}</small></div>
            </div>`).join("");
}

function iniciar() {
    const leitos = lerLeitos();
    atualizarResumo(leitos);
    renderizarFiltros([...new Set(ordenar(leitos).map(l => l.setor))]);
    renderizarLeitos();
    renderizarAtualizacoes();
}

elBusca.addEventListener("input", renderizarLeitos);

document.getElementById("dataAtual").textContent =
    new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

iniciar();