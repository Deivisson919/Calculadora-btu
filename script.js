let indexEditando = null;
const capacidades = [9000, 12000, 18000, 24000, 30000, 36000, 48000, 60000];
const LIMITE_DISTRIBUICAO = 180000;

//  CALCULAR
function calcularBTU() {

  let nomeInput = document.getElementById("nomeAmbiente");
  let nomeAmbiente = nomeInput ? nomeInput.value.trim() : "";
  if (!nomeAmbiente) nomeAmbiente = "Ambiente";

  let largura = parseNumero(document.getElementById("largura").value);
  let comprimento = parseNumero(document.getElementById("comprimento").value);
  let area = largura * comprimento;

  let pessoas = parseInt(document.getElementById("pessoas").value) || 0;
  let eletronicos = parseInt(document.getElementById("eletronicos").value) || 0;
  let portas = parseInt(document.getElementById("portas").value) || 0;
  let janelas = parseInt(document.getElementById("janelas").value) || 0;
  let paredes = parseInt(document.getElementById("paredes").value) || 0;

  let tipoJanela = document.getElementById("janela").value;
  let sol = document.getElementById("sol").value;
  let forro = document.getElementById("forro").value;

  // 🔴 VALIDAÇÕES
  let inputLargura = document.getElementById("largura");
  let inputComprimento = document.getElementById("comprimento");
  let inputSol = document.getElementById("sol");
  let inputJanela = document.getElementById("janela");

  if (!largura || largura <= 0) {
    inputLargura.classList.add("erro");
    return;
  } else inputLargura.classList.remove("erro");

  if (!comprimento || comprimento <= 0) {
    inputComprimento.classList.add("erro");
    return;
  } else inputComprimento.classList.remove("erro");

  if (paredes > 0 && sol === "") {
    inputSol.classList.add("erro");
    return;
  } else inputSol.classList.remove("erro");

  if (janelas > 0 && tipoJanela === "") {
    inputJanela.classList.add("erro");
    return;
  } else inputJanela.classList.remove("erro");

  let pessoasExtra = pessoas > 1 ? pessoas - 1 : 0;

  // 🔥 CÁLCULO
  let btuTotal =
    (area * 600) +
    (pessoasExtra * 600) +
    (eletronicos * 600) +
    (portas * 400);

  if (tipoJanela && janelas > 0) {
    if (tipoJanela === "1") btuTotal += janelas * 400;
    if (tipoJanela === "2") btuTotal += janelas * 800;
    if (tipoJanela === "3") btuTotal += janelas * 1200;
  }

  if (paredes > 0 && sol) {
    if (sol === "1") btuTotal += btuTotal * 0.10;
    if (sol === "2") btuTotal += btuTotal * 0.05;
  }

  if (forro === "1") btuTotal += 800;

  btuTotal += paredes * 800;

  btuTotal = Math.ceil(btuTotal);

  // 📊 RESULTADO 
  document.getElementById("resultado").innerHTML =
    `📍 <strong>${nomeAmbiente}</strong><br>
     🔥 <strong>${btuTotal.toLocaleString("pt-BR")} BTUs</strong>`;

  // 🧠 RENDER CENTRALIZADO
  renderResultado(btuTotal, pessoas);

  // 💾 SALVAR
  let rec = recomendacaoFinal(btuTotal);

  salvarCalculo({
    data: new Date().toLocaleString(),
    nome: nomeAmbiente,
    largura,
    comprimento,
    pessoas,
    eletronicos,
    portas,
    janelas,
    paredes,
    tipoJanela,
    sol,
    forro,
    btu: btuTotal,
    distribuicao: rec.tipo === "distribuicao" ? {
      aberto: rec.aberto,
      divisoes: rec.divisoes,
      fluxo: rec.fluxo
    } : null
  });

  // 🔄 RESET ESTADO
  indexEditando = null;
  modoVisualizacao = false;

  carregarHistorico();

  setTimeout(() => {
    limparFormulario();
  }, 100);
 
  // 🔘 RESET BOTÃO
  let btn = document.getElementById("btnCalcular");
  btn.innerText = "Calcular";
}

// 🔧 PARSE
function parseNumero(valor) {
  if (!valor) return NaN;
  valor = valor.toString().trim();
  if (valor.includes(',')) {
    valor = valor.replace(/\./g, '').replace(',', '.');
  }
  return parseFloat(valor);
}

// 🔧 CLASSIFICAÇÃO
function classificarProjeto(btuTotal, pessoas) {
  if (btuTotal <= 18000 && pessoas <= 5) {
    return { tipo: "Residencial", nivel: "Baixa complexidade", alerta: "" };
  }
  if (btuTotal <= 36000 && pessoas <= 15) {
    return { tipo: "Residencial / Comercial leve", nivel: "Média complexidade", alerta: "" };
  }
  if (btuTotal <= 60000 && pessoas <= 50) {
    return { tipo: "Comercial leve", nivel: "Atenção técnica", alerta: "Verifique instalação elétrica." };
  }
  if (btuTotal <= 120000 && pessoas <= 100) {
    return { tipo: "Comercial", nivel: "Alta complexidade", alerta: "Recomendado suporte técnico." };
  }
  return {
    tipo: "Comercial pesado",
    nivel: "Projeto profissional",
    alerta: "Recomendado engenheiro e sistema central."
  };
}

function renderResultado(btuTotal, pessoas, area = 0) {

  let projeto = classificarProjeto(btuTotal, pessoas);
  let diagnostico = diagnosticoSistema(btuTotal);
  let sistema = definirSistema(btuTotal, pessoas, area);
  let rec = recomendacaoFinal(btuTotal);

  let recomendacaoDiv = document.getElementById("recomendacao");
  let distribuicaoDiv = document.getElementById("distribuicao");
  let boxDistribuicao = document.getElementById("boxDistribuicao");

  let recomendacaoHTML = "";

  // 🧹 limpa antes de renderizar
  recomendacaoDiv.innerHTML = "";
  distribuicaoDiv.innerHTML = "";

  // 🔹 CASO SIMPLES
  if (rec.tipo === "simples") {

    recomendacaoHTML = `
      🔧 <strong>Recomendado:</strong><br>
      ${rec.texto}<br><br>
    `;

    // 🔴 esconde box distribuição
    if (boxDistribuicao) {
      boxDistribuicao.style.display = "none";
    }
  }

  // 🔹 CASO LIMITE HVAC
  if (rec.tipo === "limite") {

    // 🔴 esconde distribuição
    if (boxDistribuicao) {
      boxDistribuicao.style.display = "none";
    }

    recomendacaoHTML = `
      ⚠️ <strong>Projeto HVAC de grande porte</strong><br><br>

      ${rec.alerta}<br><br>

      🔧 <strong>Sistema recomendado:</strong><br>
      ${rec.sistema}<br><br>
    `;
  }

  // 🔹 CASO DISTRIBUIÇÃO
  if (rec.tipo === "distribuicao") {

    // 🟢 mostra distribuição
    if (boxDistribuicao) {
      boxDistribuicao.style.display = "block";
    }

    distribuicaoDiv.innerHTML = `
      📌 <strong>Cálculo total:</strong>
      ${btuTotal.toLocaleString("pt-BR")} BTUs<br><br>

      🌬️ <strong>Espaço aberto:</strong><br>
      ${rec.aberto.texto}<br><br>

      <strong>Capacidade do sistema:</strong>
      ${rec.aberto.total.toLocaleString("pt-BR")} BTUs<br><br>

      🏢 <strong>Média dificuldade de circulação:</strong><br>
      ${rec.divisoes.texto}<br><br>

      <strong>Capacidade do sistema:</strong>
      ${rec.divisoes.total.toLocaleString("pt-BR")} BTUs<br><br>

      🧱 <strong>Grande dificuldade de circulação:</strong><br>
      ${rec.fluxo.texto}<br><br>

      <strong>Capacidade do sistema:</strong>
      ${rec.fluxo.total.toLocaleString("pt-BR")} BTUs<br><br>
    `;
  }

  // 🧠 BLOCO PRINCIPAL
  recomendacaoDiv.innerHTML = `

    📊 <strong>Classificação:</strong><br>
    ${projeto.tipo}<br><br>

    🧠 <strong>Nível técnico:</strong><br>
    ${projeto.nivel}<br><br>

    ${recomendacaoHTML}

    📈 <strong>Nível do projeto:</strong><br>
    <span style="color:${diagnostico.cor}; font-weight:bold;">
      ${diagnostico.nivel}
    </span><br><br>

    🏗️ <strong>Sistema recomendado:</strong><br>
    ${sistema.sistema}<br><br>

    🏢 <strong>Categoria do projeto:</strong><br>
    ${sistema.categoria}<br><br>

    📝 <strong>Análise técnica:</strong><br>
    ${sistema.observacao}<br><br>

    ${diagnostico.alerta ? `
      ⚠️ ${diagnostico.alerta}<br><br>
    ` : ""}

    ${projeto.alerta ? `
      ⚠️ ${projeto.alerta}<br><br>
    ` : ""}
  `;
}

function combinarBTU(btu, modo = "normal") {

  let capacidadesModo;

  if (modo === "media") {
    capacidadesModo = [36000, 30000, 24000, 18000, 12000, 9000];
  } 
  else if (modo === "dificil") {
    capacidadesModo = [60000, 48000, 36000, 30000, 24000, 18000, 12000, 9000];
  } 
  else {
    capacidadesModo = [48000, 36000, 30000, 24000, 18000, 12000, 9000];
  }

  let melhor = null;

  // 🔥 testa combinações inteligentes
  for (let a of capacidadesModo) {
    for (let b of [0, ...capacidadesModo]) {
      for (let c of [0, ...capacidadesModo]) {
        for (let d of [0, ...capacidadesModo]) {

          let lista = [a, b, c, d].filter(x => x > 0);

          let total = lista.reduce((soma, v) => soma + v, 0);

          // precisa atingir o BTU mínimo
          if (total < btu) continue;

          let sobra = total - btu;

          // quantidade de aparelhos
          let qtd = lista.length;

          // 🔥 score principal
          let score = sobra + (qtd * 2000);

          // penaliza excesso de aparelhos
          if (qtd >= 4) {
            score += 4000;
          }

          // penaliza distribuição desbalanceada
          let maior = Math.max(...lista);
          let menor = Math.min(...lista);

          if ((maior - menor) >= 40000) {
            score += 5000;
          }

          // evita muitos aparelhos pequenos
          let pequenos = lista.filter(x => x <= 12000).length;

          if (pequenos >= 2) {
            score += 3000;
          }

          // prioriza combinações comerciais limpas
          let unicos = [...new Set(lista)];

          if (unicos.length === 1 && qtd >= 2) {
            score -= 1500;
          }

          if (!melhor || score < melhor.score) {

            melhor = {
              lista,
              total,
              sobra,
              score
            };

          }
        }
      }
    }
  }

  // 🔒 fallback
  if (!melhor) {
    return {
      texto: "⚠️ Não foi possível gerar distribuição.",
      total: 0
    };
  }

  // 📊 agrupar aparelhos iguais
  let agrupado = {};

  melhor.lista.forEach(cap => {
    agrupado[cap] = (agrupado[cap] || 0) + 1;
  });

  let resultado = [];

  Object.keys(agrupado)
    .sort((a, b) => b - a)
    .forEach(cap => {

      resultado.push(
        `${agrupado[cap]} aparelho(s) de ${Number(cap).toLocaleString("pt-BR")} BTUS`
      );

    });

  return {
    texto: "🔹 " + resultado.join("<br>🔹 "),
    total: melhor.total
  };
}

function recomendacaoFinal(btuTotal) {

  if (btuTotal > LIMITE_DISTRIBUICAO) {
    return {
      tipo: "limite",
      alerta: "Projeto acima do limite da distribuição automática.",
      sistema: "VRF / Sistema Central"
    };
  }

  // 🔹 recomendações simples
  if (btuTotal <= 12000) {
    return {
      tipo: "simples",
      texto: "1 aparelho de 12.000 BTUS"
    };
  }

  if (btuTotal <= 18000) {
    return {
      tipo: "simples",
      texto: "1 aparelho de 18.000 BTUS"
    };
  }

  if (btuTotal <= 24000) {
    return {
      tipo: "simples",
      texto: "1 aparelho de 24.000 BTUS"
    };
  }

  // 🔥 cálculo inteligente dos cenários
  function calcularExtra(base, fator, limiteExtra) {

    let extra = base * (fator - 1);

    // limita exagero
    if (extra > limiteExtra) {
      extra = limiteExtra;
    }

    let resultado = base + extra;

    return Math.ceil(resultado);
  }

  // 🌬️ espaço aberto
  let abertoBTU = btuTotal;

  // 🏢 média circulação
  let medioBTU = calcularExtra(btuTotal, 1.10, 10000);

  // 🧱 circulação difícil
  let dificilBTU = calcularExtra(btuTotal, 1.18, 16000);

  // 🔥 distribuição inteligente
  let aberto = combinarBTU(abertoBTU, "normal");

  let divisoes = combinarBTU(medioBTU, "media");

  let fluxo = combinarBTU(dificilBTU, "dificil");

  // 🔒 garante progressão lógica
  if (divisoes.total <= aberto.total) {

    divisoes = combinarBTU(aberto.total + 9000, "media");

  }

  if (fluxo.total <= divisoes.total) {

    fluxo = combinarBTU(divisoes.total + 9000, "dificil");

  }

  return {
    tipo: "distribuicao",
    aberto,
    divisoes,
    fluxo
  };
}

function definirSistema(btuTotal, pessoas, area) {

  // 🟢 Residencial
  if (btuTotal <= 36000) {
    return {
      sistema: "Split Hi-Wall",
      categoria: "Residencial",
      observacao: "Ideal para ambientes pequenos e médios."
    };
  }

  // 🟡 Comercial leve
  if (btuTotal <= 90000) {
    return {
      sistema: "Split Piso Teto ou Cassete",
      categoria: "Comercial leve",
      observacao: "Melhor distribuição de ar para ambientes amplos."
    };
  }

  // 🟠 Comercial médio
  if (btuTotal <= 180000) {
    return {
      sistema: "Múltiplos Piso Teto / Cassete",
      categoria: "Comercial médio",
      observacao: "Recomendado balanceamento por setores."
    };
  }

  // 🔴 Comercial pesado
  if (btuTotal <= 300000) {
    return {
      sistema: "VRF ou Dutado",
      categoria: "Projeto profissional",
      observacao: "Necessário pré-projeto técnico."
    };
  }

  // ⚫ Grande porte
  return {
    sistema: "Chiller / Sistema Central",
    categoria: "Engenharia HVAC",
    observacao: "Obrigatório projeto especializado."
  };
}


// 🧠 DIAGNÓSTICO
function diagnosticoSistema(btuTotal) {
  if (btuTotal <= 120000) {
    return { nivel: "Confiável", cor: "#22c55e", sistema: "Ar-condicionado Split", alerta: "" };
  }
  if (btuTotal <= 200000) {
    return { nivel: "Atenção", cor: "#f59e0b", sistema: "Múltiplos Splits", alerta: "Projeto exige análise mais detalhada." };
  }
  if (btuTotal <= 250000) {
    return { nivel: "Limite técnico", cor: "#f97316", sistema: "VRF ou múltiplos Splits", alerta: "Alto nível de carga térmica." };
  }
  return {
    nivel: "Projeto profissional",
    cor: "#ef4444",
    sistema: "Sistema central (VRF / Chiller)",
    alerta: "Obrigatório projeto técnico completo."
  };
}

// 💾 SALVAR / HISTÓRICO 
function salvarCalculo(dados) {
  let historico = JSON.parse(localStorage.getItem("historicoBTU")) || [];

  if (indexEditando !== null) {
    historico[indexEditando] = dados;
    indexEditando = null;
  } else {
    historico.push(dados);
  }

  localStorage.setItem("historicoBTU", JSON.stringify(historico));
}

function verItem(index) {

  modoVisualizacao = true;

  let btn = document.getElementById("btnCalcular");
  btn.innerText = "Voltar";

  let historico = JSON.parse(localStorage.getItem("historicoBTU")) || [];
  let item = historico[index];

  if (!item) {
    alert("Item não encontrado.");
    return;
  }

  // 🔧 Preencher formulário
  document.getElementById("nomeAmbiente").value = item.nome;
  document.getElementById("largura").value = item.largura;
  document.getElementById("comprimento").value = item.comprimento;
  document.getElementById("pessoas").value = item.pessoas;
  document.getElementById("eletronicos").value = item.eletronicos;
  document.getElementById("portas").value = item.portas;
  document.getElementById("janelas").value = item.janelas;
  document.getElementById("paredes").value = item.paredes;

  document.getElementById("janela").value = item.tipoJanela;
  document.getElementById("sol").value = item.sol;
  document.getElementById("forro").value = item.forro;

  // 🔒 Travar formulário
  travarFormulario(true);

  let btuTotal = item.btu;

  // 📊 RESULTADO (DIV 1 - topo)
  document.getElementById("resultado").innerHTML =
    `📍 <strong>${item.nome}</strong><br>
     🔥 <strong>${btuTotal.toLocaleString("pt-BR")} BTUS</strong>`;

  // 🔥 CHAMA O MOTOR CENTRAL (SEM DUPLICAR LÓGICA)
  renderResultado(btuTotal, item.pessoas);

  // 📌 GARANTIA EXTRA (evita lixo antigo se histórico antigo não tiver distribuição)
  let rec = recomendacaoFinal(btuTotal);
  controlarDistribuicao(rec, btuTotal);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function travarFormulario(travar) {
  let campos = document.querySelectorAll("input, select");

  campos.forEach(campo => {
    campo.disabled = travar;

    if (travar) {
      campo.style.background = "#eff6ff"; // azul claro
      campo.style.borderColor = "#2563eb";
      campo.style.color = "#1e3a8a";
      campo.style.cursor = "not-allowed";
    } else {
      campo.style.background = "";
      campo.style.borderColor = "";
      campo.style.color = "";
      campo.style.cursor = "";
    }
  });
}

let modoVisualizacao = false;

function acaoBotao(){
  if (modoVisualizacao){
     voltarParaCalculo();
 
  }
  else {
    calcularBTU();
  }
}

function limparFormulario(){
  document.querySelectorAll("input").forEach(i => i.value = "");
  document.querySelectorAll("select").forEach(s => s.value = "");
}

function voltarParaCalculo(){
    indexEditando = null;
    modoVisualizacao = false;
    document.querySelectorAll("input").forEach(i => i.value = "");
    document.querySelectorAll("select").forEach(s => s.value = "");

    document.getElementById("resultado").innerHTML = "";
    document.getElementById("recomendacao").innerHTML = "";
    document.getElementById("distribuicao").innerHTML = "";
    travarFormulario(false);
    let btn =  document.getElementById("btnCalcular");
    btn.innerText = "Calcular"
}

function editarItem(index) {
  let historico = JSON.parse(localStorage.getItem("historicoBTU")) || [];
  let item = historico[index];
  let btn = document.getElementById("btnCalcular");
  btn.innerText = "Atualizar";

  document.getElementById("nomeAmbiente").value = item.nome;
  document.getElementById("largura").value = item.largura;
  document.getElementById("comprimento").value = item.comprimento;
  document.getElementById("pessoas").value = item.pessoas;
  document.getElementById("eletronicos").value = item.eletronicos;
  document.getElementById("portas").value = item.portas;
  document.getElementById("janelas").value = item.janelas;
  document.getElementById("paredes").value = item.paredes;

  document.getElementById("janela").value = item.tipoJanela;
  document.getElementById("sol").value = item.sol;
  document.getElementById("forro").value = item.forro;

  indexEditando = index;

  // 🔓 destravar edição
  travarFormulario(false);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function carregarHistorico() {
  let historico = JSON.parse(localStorage.getItem("historicoBTU")) || [];
  let html = "<h3>Histórico</h3>";

  historico
    .map((item, index) => ({ item, index })) // preserva índice original
    .reverse() // mais recente primeiro
    .forEach(({ item, index }) => {

      if (!item || !item.nome) return;

      html += `
        <div style="background:#fff; padding:12px; margin-top:10px; border-radius:10px; display:flex; justify-content:space-between; gap:10px; align-items:center;">
          
          <div style="flex:1;">
            <strong>${item.nome}</strong><br>
            <strong>${item.btu.toLocaleString("pt-BR")} BTUS</strong><br>
            <small>${item.data}</small><br>

            ${
              item.distribuicao ? `
              <div style="color:#2563eb; margin-top:6px;">
                🔧 Projeto com distribuição
              </div>
              ` : `
              <div style="color:#2563eb; margin-top:6px;">
                🔧 Projeto simples (sem necessidade de distribuição)
              </div>
              `
            }

          </div>

          <div style="display:flex; flex-direction:column; gap:6px;">
            <button onclick="verItem(${index})"
              style="background:#2563eb;color:white;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;font-size:12px;">
              Ver
            </button>

            <button onclick="editarItem(${index})"
              style="background:#f59e0b;color:white;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;font-size:12px;">
              Editar
            </button>

            <button onclick="excluirItem(${index})"
              style="background:red;color:white;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;font-size:12px;">
              Excluir
            </button>
          </div>

        </div>
      `;
    });

  document.getElementById("historico").innerHTML = html;
}

function excluirItem(index) {
  let historico = JSON.parse(localStorage.getItem("historicoBTU")) || [];
  historico.splice(index, 1);
  localStorage.setItem("historicoBTU", JSON.stringify(historico));
  carregarHistorico();
}

// função de alerta 
window.addEventListener("load", function () {
  carregarHistorico();

  let inputLargura = document.getElementById("largura");
  let inputComprimento = document.getElementById("comprimento");
  let inputParedes = document.getElementById("sol");
  let inputJanela = document.getElementById("janela");

  inputLargura.addEventListener("input", function () {
    this.classList.remove("erro");
  });

  inputComprimento.addEventListener("input", function () {
    this.classList.remove("erro");
  });

  inputParedes.addEventListener("change", function () {
    this.classList.remove("erro");
  });

  inputJanela.addEventListener("change", function () {
    if (this.value !== "") {
      this.classList.remove("erro");
    }
  });
});

window.verItem = verItem;
window.editarItem = editarItem;
window.excluirItem = excluirItem;