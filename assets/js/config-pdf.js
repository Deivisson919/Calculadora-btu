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
        logo: ""
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

const inputTelefone = document.getElementById("telefonePDF");

inputTelefone.addEventListener("input", formatarTelefone);

carregarConfiguracoesPDF();