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
    filename: "relatorio-btu.pdf",

    image: {
      type: "jpeg",
      quality: 1
    },

    html2canvas: {
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

  pdfArea.innerHTML = `

    <div style="
      padding:40px;
      background:white;
      color:black;
      font-family:Arial;
      width:800px;
    ">

      <h1 style="color:#2563eb;">
        RELATÓRIO TÉCNICO BTU
      </h1>

      <hr>

      <p>
        Área:
        ${area}
        →
        +${detalheArea}
      </p>

      <p>
        Pessoas:
        ${qtdPessoas}
        →
        +${detalhePessoas}
      </p>

      <p>
        Eletrônicos:
        ${qtdEletronicos}
        →
        +${detalheEletronicos}
      </p>

      <p>
        Portas:
        ${qtdPortas}
        →
        +${detalhePortas}
      </p>

      <p>
        Janelas:
        ${qtdJanelas}
        →
        +${detalheJanelas}
      </p>

      <p>
        Sol:
        +${detalheSol}
      </p>

      <p>
        Forro:
        +${detalheForro}
      </p>

      <p>
        Paredes:
        ${paredes}
        →
        +${detalheParedes}
      </p>

      <hr>

      <h2>
        TOTAL:
        ${resultadoFinal}
        BTUs
      </h2>

    </div>

  `;

  console.log(pdfArea.offsetHeight);
console.log(pdfArea.offsetWidth);
}
/*function montarPDF() {

  let pdfArea = document.getElementById("pdfArea");

  pdfArea.innerHTML = `

    <div style="
      padding:40px;
      background:white;
      color:black;
      font-family:Arial;
      width:800px;
    ">

      <h1 style="
        color:#2563eb;
        margin-bottom:5px;
      ">
        RELATÓRIO TÉCNICO BTU
      </h1>

      <p style="
        color:gray;
        margin-top:0;
      ">
        Sistema de cálculo térmico
      </p>

      <hr style="margin:25px 0;">

      <h2>MEMORIAL DE CÁLCULO</h2>

      <p>
        Área térmica:
        ${area}m²
        →
        +${detalheArea.toLocaleString("pt-BR")} BTUs
      </p>

      <p>
        Pessoas:
        ${qtdPessoas}
        →
        +${detalhePessoas.toLocaleString("pt-BR")} BTUs
      </p>

      <p>
        Eletrônicos:
        ${qtdEletronicos}
        →
        +${detalheEletronicos.toLocaleString("pt-BR")} BTUs
      </p>

      <p>
        Portas externas:
        ${qtdPortas}
        →
        +${detalhePortas.toLocaleString("pt-BR")} BTUs
      </p>

      <p>
        Janelas:
        ${qtdJanelas}
        →
        +${detalheJanelas.toLocaleString("pt-BR")} BTUs
      </p>

      <p>
        Incidência solar:
        →
        +${detalheSol.toLocaleString("pt-BR")} BTUs
      </p>

      <p>
        Forro:
        →
        +${detalheForro.toLocaleString("pt-BR")} BTUs
      </p>

      <p>
        Paredes solares:
        ${paredes}
        →
        +${detalheParedes.toLocaleString("pt-BR")} BTUs
      </p>

      <hr style="margin:25px 0;">

      <h2>
        CARGA TÉRMICA TOTAL
      </h2>

      <div style="
        font-size:32px;
        font-weight:bold;
        color:#2563eb;
        margin-top:10px;
      ">
        ${resultadoFinal.toLocaleString("pt-BR")} BTUs
      </div>

      <hr style="margin:30px 0;">

      <p style="
        color:gray;
        font-size:12px;
      ">
        Relatório gerado automaticamente pelo sistema.
      </p>

    </div>

  `;
}*/