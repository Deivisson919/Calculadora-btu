let indexEditando = null;

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

  // Alerta
  let inputLargura = document.getElementById("largura");
  let inputComprimento = document.getElementById("comprimento");
  let inputParedes = document.getElementById("sol");
  
  // largura
  if (!largura || largura <= 0) {
    inputLargura.classList.add("erro");
    return;
  } else {
    inputLargura.classList.remove("erro");
  }
  
  // comprimento
  if (!comprimento || comprimento <= 0) {
    inputComprimento.classList.add("erro");
    return;
  } else {
    inputComprimento.classList.remove("erro");
  }
  
  // paredes
  if (paredes > 0 && sol ==="") {
    inputParedes.classList.add("erro");
    return;
  } else {
    inputParedes.classList.remove("erro");
  }
  let inputJanela = document.getElementById("janela");

  if (janelas > 0 && tipoJanela === "") {
    inputJanela.classList.add("erro");
    return;
  } else {
    inputJanela.classList.remove("erro");
  }

  let pessoasExtra = pessoas > 1 ? pessoas - 1 : 0;

  // 🔥 CÁLCULO
  let btuTotal =
    (area * 600) +
    (pessoasExtra * 600) +
    (eletronicos * 600) +
    (portas * 400);

  // 🪟 JANELAS
  if (tipoJanela && janelas > 0) {
    if (tipoJanela === "1") btuTotal += janelas * 400;
    if (tipoJanela === "2") btuTotal += janelas * 800;
    if (tipoJanela === "3") btuTotal += janelas * 1200;
  }

  // ☀️ SOL
  if (paredes > 0 && sol) {
    if (sol === "1") btuTotal += btuTotal * 0.10;
    if (sol === "2") btuTotal += btuTotal * 0.05;
  }

  // 🏠 FORRO
  if (forro === "1") btuTotal += 800;

  // 🧱 PAREDES
  btuTotal += paredes * 800;

  btuTotal = Math.ceil(btuTotal);

  // 🔧 PROCESSAMENTO
  let projeto = classificarProjeto(btuTotal, pessoas);
  let diagnostico = diagnosticoSistema(btuTotal);
  let rec = recomendacaoFinal(btuTotal);

  // 📊 RESULTADO
  document.getElementById("resultado").innerHTML =
    `📍 <strong>${nomeAmbiente}</strong><br>
     🔥 <strong>${btuTotal.toLocaleString("pt-BR")} BTU</strong>`;

     document.getElementById("recomendacao").innerHTML =
     `
     <strong>Classificação:</strong> ${projeto.tipo}<br>
     <strong>Nível técnico:</strong> ${projeto.nivel}<br><br>
     
     📊 <strong>Nível do projeto:</strong><br>
     <span style="color:${diagnostico.cor}; font-weight:bold;">
       ${diagnostico.nivel}
     </span><br>
     
     🏗️ <strong>Sistema recomendado:</strong><br>
     ${diagnostico.sistema}<br><br>
     
     ${diagnostico.alerta ? `⚠️ ${diagnostico.alerta}<br><br>` : "" }  
     
     ${projeto.alerta ? `⚠️ ${projeto.alerta}<br>` : ""}
     
     ${btuTotal > 250000 ? `
     🚫 <strong>Atenção crítica:</strong><br>
     Este projeto excede o uso recomendado de ar split.<br>
     Utilize sistema central (VRF / Chiller).
     ` : ""}
     `;

     document.getElementById("distribuicao").innerHTML = `
📌 <strong>Cálculo total:</strong> ${btuTotal.toLocaleString("pt-BR")} BTU<br><br>

🌬️ Espaço aberto:<br>
${rec.aberto}<br><br>

🏢 Espaço com divisões:<br>
${rec.divisoes}<br><br>

🧱 Fluxo de ar difícil:<br>
${rec.fluxo}<br><br>
`;

  // 💾 SALVAR
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
    distribuicao: {
      aberto: rec.aberto,
      divisoes: rec.divisoes,
      fluxo: rec.fluxo
    }
  });

indexEditando = null; 
modoVisualizacao = false;

carregarHistorico();

//limpa o formulario
document.querySelectorAll("select").forEach(s => s.value = "");
let btn = document.getElementById("btnCalcular");
btn.innerHTML = "Calcular";
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

function combinarBTU(btu) {
  let capacidades = [60000, 48000, 36000, 24000, 18000, 12000, 9000];
  let resultado = [];

  for (let cap of capacidades) {
    while (btu >= cap * 0.9) {
      resultado.push(cap);
      btu -= cap;
    }
  }

  if (btu > 0) resultado.push(9000);

  return resultado.map(v => v.toLocaleString("pt-BR")).join(" + ");
}

function recomendacaoFinal(btuTotal) {
  return {
    aberto: combinarBTU(btuTotal),
    divisoes: combinarBTU(btuTotal * 1.2),
    fluxo: combinarBTU(btuTotal * 1.4)
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

  // 🔵 Ativar modo visualização
  travarFormulario(true);

  // Resultado
  document.getElementById("resultado").innerHTML =
    `📍 <strong>${item.nome}</strong><br>
     🔥 <strong>${item.btu.toLocaleString("pt-BR")} BTU</strong>`;
     let btuTotal = item.btu;

     let projeto = classificarProjeto(btuTotal, item.pessoas);
     let diagnostico = diagnosticoSistema(btuTotal);
     let rec = recomendacaoFinal(btuTotal);
     
     document.getElementById("recomendacao").innerHTML =
     `
     <strong>Classificação:</strong> ${projeto.tipo}<br>
     <strong>Nível técnico:</strong> ${projeto.nivel}<br><br>
     
     📊 <strong>Nível do projeto:</strong><br>
     <span style="color:${diagnostico.cor}; font-weight:bold;">
       ${diagnostico.nivel}
     </span><br>
     
     🏗️ <strong>Sistema recomendado:</strong><br>
     ${diagnostico.sistema}<br><br>
     
     ${diagnostico.alerta ? `⚠️ ${diagnostico.alerta}<br><br>` : ""}
     
     📌 Cálculo total: ${btuTotal.toLocaleString("pt-BR")} BTU<br><br>
     
     🌬️ Espaço aberto (melhor circulação de ar):<br>
     ${rec.aberto}<br><br>
     
     🏢 Espaço com divisões:<br>
     ${rec.divisoes}<br><br>
     
     🧱 Espaço com muita dificuldade no fluxo de ar:<br>
     ${rec.fluxo}<br><br>
     
     ${projeto.alerta ? `⚠️ ${projeto.alerta}<br>` : ""}
     
     ${btuTotal > 250000 ? `
     🚫 <strong>Atenção crítica:</strong><br>
     Este projeto excede o uso recomendado de ar split.<br>
     Utilize sistema central (VRF / Chiller).
     ` : ""}
     `;

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
     document.querySelectorAll("input").forEach(i => i.value = "");
  }
  else {
    calcularBTU();
  }
}

function voltarParaCalculo(){
    indexEditando = null;
    modoVisualizacao = false;
    document.querySelectorAll("input").forEach(i => i.value = "");
    document.querySelectorAll("select").forEach(s => s.value = "");

    document.getElementById("resultado").innerHTML = "";
    document.getElementById("recomendacao").innerHTML = "";
    travarFormulario(false);
    let btn =  document.getElementById("btnCalcular");
    btn.innerText = "Calcular"
}

function editarItem(index) {
  let historico = JSON.parse(localStorage.getItem("historicoBTU")) || [];
  let item = historico[index];
  let btn = document.getElementById("btnCalcular");
  btn.innerHTML = "Atualizar";

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

  historico.forEach((item, index) => {
    if (!item || !item.nome) return;
    html += `
      <div style="background:#fff; padding:12px; margin-top:10px; border-radius:10px; display:flex; justify-content:space-between; gap:10px; align-items:center;">
        
        <div style="flex:1;">
          <strong>${item.nome}</strong><br>
          <strong>${item.btu.toLocaleString("pt-BR")} BTU</strong><br>
          <small>${item.data}</small><br>
          <div style="color:#22c55e; margin-top:6px;">
            🌬️ Aberto: ${item.distribuicao?.aberto}<br>
            🏢 Divisões: ${item.distribuicao?.divisoes}<br>
            🧱 Fluxo: ${item.distribuicao?.fluxo}
          </div>
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