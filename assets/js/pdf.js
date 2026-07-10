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
         onclick="abrirModalPDF()"
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

function esperarRenderizacao() {
  return new Promise(resolve => {
      requestAnimationFrame(() => {
          requestAnimationFrame(() =>{
            resolve();
          });
      });
  });  
}

async function esperarImagens(container) {

  const imagens = container.querySelectorAll("img");

  for (const img of imagens) {

    if (!img.complete || img.naturalWidth === 0) {
      await new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }

    if (img.decode) {
      try {
        await img.decode();
      } catch (e) {
      }
    }
  }

}

async function gerarPDF() {

  montarPDF();

  let elemento = document.getElementById("pdfArea");

await esperarImagens(elemento);
await esperarRenderizacao();

  let opt = {
    margin: 0.5,
    filename: "Relatório Técnico HVAC.pdf",

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
    },

    pagebreak: {
      mode:["css","legacy"]
    }
  };

console.log(elemento);
console.log(elemento.innerHTML);
console.log(elemento.offsetHeight);

html2pdf()
.set(opt)
.from(elemento)
.save();
}

function montarPDF() {
  
  let pdfArea = document.getElementById("pdfArea");
  let portas = parseInt(document.getElementById("portas").value) || 0;
  let pessoas = parseInt(document.getElementById("pessoas").value) || 0;
  let eletronicos = parseInt(document.getElementById("eletronicos").value) || 0;


  pdfArea.innerHTML = `

  <div class="pdf-page">
  <div class="pdf-content">

    <!-- HEADER -->
    <div class="pdf-header">

      <!-- ESQUERDA -->
      <div class="pdf-header-left">

        <div class="pdf-img-header">
          <img src="assets/Images/img-header.png" alt="Calendário">
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

    <!-- FOOTER -->
    <div class="pdf-footer">

      <div class="footer-item">
        <img src="assets/Images/telephone.png" alt="Area">
        <span>(99) 99999-9999</span>
      </div>

      <div class="footer-item">
        <img src="assets/Images/email.png" alt="Area">
        <span>contato@empresaficticia.com.br</span>
      </div>

    </div>

  </div>
</div>

<div class="pdf-page">

  <div class="pdf-content">

    <h2>MEMORIAL DE CÁLCULO</h2>

    <div class="linha-memorial"></div>

    <table class="tabela-memorial">

      <thead>
        <tr>
          <th>ITEM</th>
          <th>DESCRIÇÃO</th>
          <th>CÁLCULO</th>
          <th>CARGA (BTUs)</th>
        </tr>
      </thead>

      <tbody>

        <tr>
          <td><img src="assets/Images/area.png" alt="Area"></td>
          <td>ÁREA</td>
          <td>${area.toLocaleString("pt-BR")} m² x 600 BTU/m²</td>
          <td>${detalheArea.toLocaleString("pt-BR")}</td>
        </tr>

        <tr>
          <td><img src="assets/Images/people.png" alt="Pessoas"></td>
          <td>PESSOAS</td>
          <td>${qtdPessoas} x 600 BTU/pessoa</td>
          <td>${detalhePessoas.toLocaleString("pt-BR")}</td>
        </tr>

        <tr>
          <td><img src="assets/Images/tv.png" alt="Eletrônicos"></td>
          <td>ELETRÔNICOS</td>
          <td>${qtdEletronicos} x 600 BTU/aparelho</td>
          <td>${detalheEletronicos.toLocaleString("pt-BR")}</td>
        </tr>

        <tr>
          <td><img src="assets/Images/door.png" alt="Portas"></td>
          <td>PORTAS</td>
          <td>${qtdPortas} x 400 BTU/unidade</td>
          <td>${detalhePortas.toLocaleString("pt-BR")}</td>
        </tr>

        <tr>
          <td><img src="assets/Images/window.png" alt="Janelas"></td>
          <td>JANELAS</td>
          <td>${qtdJanelas} x BTU/unidade</td>
          <td>${detalheJanelas.toLocaleString("pt-BR")}</td>
        </tr>

        <tr>
          <td><img src="assets/Images/sun.png" alt="Insolação"></td>
          <td>INSOLAÇÃO</td>
          <td>${calculoSol}</td>
          <td>${detalheSol.toLocaleString("pt-BR")}</td>
        </tr>

        <tr>
          <td><img src="assets/Images/house.png" alt="Forro"></td>
          <td>FORRO</td>
          <td>${calculoForro}</td>
          <td>${detalheForro.toLocaleString("pt-BR")}</td>
        </tr>

        <tr>
          <td><img src="assets/Images/wall.png" alt="Paredes"></td>
          <td>Paredes</td>
          <td>${paredes} x 800 BTU/unidade</td>
          <td>${detalheParedes.toLocaleString("pt-BR")}</td>
        </tr>

      </tbody>

    </table>

    <div class="total-memorial">
      <h1>Total:</h1>
      <h1>${resultadoFinal.toLocaleString("pt-BR")} BTUs</h1>
    </div>

    <div class="box-observacao">

      <div class="observacao-topo">
        <img src="assets/Images/observacao.png" alt = "OBS">
        <h3>OBSERVAÇÕES</h3>
      </div>

      <p>
        Cálculo baseado em fatores médios de carga térmica conforme referências
        ASHRAE, ABNT e práticas de engenharia aplicada em climatização.
      </p>

    </div>

  </div>

</div>

<div class = "pdf-page">
      <div class = "pdf-content">
            <h2>RECOMENDAÇÃO</h2>
                <div class = "linha-recomendacao"></div>
                      <div class = "box-recomendacao">
                        <img src = "assets/Images/air-conditioning.png" alt = "ar-condicionado"> 
                               <div class ="recomendacao-text" >
                                      <h2>Equipamento sugerido</h2>

                                     <span> ${rec.tipo === "simples"
                                        ? rec.texto
                                        : resultadoDistribuicao.texto}</span>

                                       <h3> ${sistemaProjeto.sistema}</h3>

                                      <p>Equipamento com capacidade adequada para atender a carga térmica calculada,
                                        oferecendo conforto térmico e eficiência energética.
                                      </p>
                                </div><!--recomendação-text-->
                      </div><!--box-recomendacao-->

        <div class = "box-important">
          <h2>INFORMAÇÕES IMPORTANTES</h2>
              <div class = "inside-important">
                    <div class = "important-item">
                    <img src = "assets/Images/vento.png" alt = "Vento"> 
                    <p>Manter filtros limpos para melhor eficiência do equipamento.</p>
                    </div>

                    <div class = "important-item">
                    <img src = "assets/Images/termometro.png" alt = "Termômetro">
                    <p>Temperatura ideal recomendada entre 23°C e 24°C.</p>
                    </div>

                    <div class = "important-item">
                    <img src = "assets/Images/engrenagem.png" alt = "Engrenagem"> 
                    <p>Realizar manutenções periódicas conforme manual do fabricante.</p>
                    </div>

                    <div class = "important-item">                    
                    <img src = "assets/Images/folha.png" alt = "Folha"> 
                    <p>Equipamentos Inverter proporcionam maior economia de energia.</p>
                    </div>
                </div><!--inside-important-->
        </div><!--box-important-->
     </div> <!--pdf-content-->
</div> <!--pdf-page-->



  `;
}