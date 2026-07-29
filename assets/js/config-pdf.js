function obterConfiguracoesPDF() {
    return JSON.parse(localStorage.getItem("configuracoesPDF")) || {
          telefone:"",
          email:"",
          responsavel:"",
          crea:"",
          logo:""
    };
}

function salvarConfiguracoesPDF(){
    const config = {
        telefone: document.getElementById("telefonePDF").value,
        email: document.getElementById("emailPDF").value,
        responsavel: document.getElementById("responsavelPDF").value,
        crea: document.getElementById("creaPDF").value,
        logo: previewLogo.src
      };

      localStorage.setItem(
        "configuracoesPDF",
        JSON.stringify(config)
      );

      abrirTela("telaCalculadora");
}



document.getElementById("btnSalvarConfiguracaoPDF").addEventListener("click", salvarConfiguracoesPDF);

function carregarConfiguracoesPDF() {

  const config = JSON.parse(localStorage.getItem("configuracoesPDF"));

  if (!config) return;

  if (config.logo){
    previewLogo.src = config.logo;
  }

  document.getElementById("telefonePDF").value = config.telefone || "";
  document.getElementById("emailPDF").value = config.email || "";
  document.getElementById("responsavelPDF").value = config.responsavel || "";
  document.getElementById("creaPDF").value = config.crea || "";

}

function formatarTelefone() {

  let valor = inputTelefone.value.replace(/\D/g, "");

  if (valor.length > 11) {
      valor = valor.substring(0, 11);
  }

  if (valor.length > 2) {
      valor = "(" + valor.substring(0, 2) + ") " + valor.substring(2);
  }

  if (valor.length > 10) {
      valor = valor.substring(0, 10) + "-" + valor.substring(10);
  }

  inputTelefone.value = valor;

}

const inputLogo = document.getElementById("logoPDF");
const previewLogo = document.getElementById("previewLogoPDF");

inputLogo.addEventListener("change", carregarLogo);

function carregarLogo(){
    const arquivo = inputLogo.files[0];
    
    if(!arquivo) return;

    const reader  = new FileReader();
    reader.onload = function (e) {
      previewLogo.src = e.target.result;
    };
    reader.readAsDataURL(arquivo);
  }


const inputTelefone = document.getElementById("telefonePDF");

inputTelefone.addEventListener("input", formatarTelefone);

carregarConfiguracoesPDF();