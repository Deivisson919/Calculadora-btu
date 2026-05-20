function renderBotaoPDF(tipo){

  let pdfResultado = document.getElementById("pdfResultado");
  let pdfDistribuicao = document.getElementById("pdfDistribuicao");
  let resultado = document.getElementById("resultado");

  pdfResultado.innerHTML = "";
  pdfDistribuicao.innerHTML = "";

  if (!resultado || resultado.innerHTML.trim() === "") {
    return;
  }

  let html = `
    <div style="margin-top:15px;">

      <a href="#"
         onclick="gerarPDF()"
         style="
         display: flex;
           color:#2563eb;
           font-weight:bold;
           text-decoration:none;
           justify-content: center;
         ">

         📄 Gerar PDF

      </a>

    </div>
  `;

  // 🔹 simples
  if (tipo === "simples"){
    pdfResultado.innerHTML = html;
  }

  // 🔹 distribuição
  if (tipo === "distribuicao"){
    pdfDistribuicao.innerHTML = html;
  }

}

function gerarPDF() {

  montarPDF();

  let elemento = document.getElementById("pdfArea");

  let opt = {
    margin: 0.5,
    filename: "Relatório BTUs.pdf",

    image: {
      type: "jpeg",
      quality: 1
    },

    html2canvas: {
      useCORS: true,
      allowTaint: true,
      scale: 2
    },

    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "portrait"
    }
  };

  setTimeout(() => {

    console.log(elemento);
    console.log(elemento.innerHTML);
    console.log(elemento.offsetHeight);

    html2pdf()
      .set(opt)
      .from(elemento)
      .save();

  }, 500);

}

function montarPDF() {

  let pdfArea = document.getElementById("pdfArea");
 
  let pessoas = parseInt(document.getElementById("pessoas").value) || 0;

  let projeto = classificarProjeto(resultadoFinal, pessoas);

  pdfArea.innerHTML = `

  <div class="pdf-page">
  <div class="pdf-content">
      <!-- HEADER -->
      <div class="pdf-header">

        <!-- ESQUERDA -->
        <div class="pdf-header-left">

          <div class="pdf-logo">
          <img src="assets/Images/logo df ar.png" alt="Calendário">
          </div>

          <div class="pdf-title">
            <h2>
              RELATÓRIO<br>
              TÉCNICO HVAC
            </h2>

            <span>CÁLCULO DE CARGA TÉRMICA</span>
          </div>

        </div>

        <!-- DIREITA -->
        <div class="pdf-side-card">

          <div class="side-item">
              <img src="assets/Images/calendar.png" alt="Calendário">
                <p>
                  Data do relatório:<br>
                  ${dataProjeto}
                </p>
          </div>

          <div class="side-item">
              <img src="assets/Images/user.png" alt="Usuário">
                <p>
                  Responsável Técnico:<br>
                  DF Intelligence
                </p>
          </div>

        </div>

      </div>

      <!-- INFO -->
      <div class="pdf-info">

        <div class="info-item">
        <img src = "assets/Images/calendar.png" alt="Cliente">
             <div class = "info-texto">
                  <strong>CLIENTE:</strong>
                  <span>Empresa Exemplo</span>
              </div>
        </div>

        <div class="info-item">
        <img src = "assets/Images/calendar.png" alt="Projeto">
              <div class = "info-texto">
                  <strong>PROJETO:</strong>
                  <span>${projeto.tipo}</span>
              </div>
        </div>

      </div>

      <!-- CARD BTU -->
      <div class="pdf-btu-card">

        <div class="btu-topo">

          <div class="icone-frio">
            <img src="assets/Images/flocos-de-neve.png" alt="Frio">
          </div>

          <div class="btu-textos">

            <h3>CARGA TÉRMICA TOTAL:</h3>

            <div class="numero">
              ${resultadoFinal.toLocaleString("pt-BR")} BTUs
            </div>

          </div>

        </div>

      </div>

      <!-- RESUMO -->
      <div class="pdf-resumo">

        <h3>RESUMO DO PROJETO</h3>

        <hr>

        <p>
          Este relatório apresenta o cálculo de carga térmica
          para o ambiente mencionado acima, utilizando metodologias
          baseadas em fatores de carga térmica por área, ocupação,
          equipamentos, aberturas, insolação e outros critérios técnicos.
        </p>

      </div>
  </div>
</div>

  `;
}