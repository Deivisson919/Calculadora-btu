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

      mostrarAviso (
        "Configurações salvas com sucesso."
      );

      abrirTela("telaCalculadora");
}

function mostrarAviso(mensagem) {

  const modal = document.getElementById("modalAvisoGlobal");

  console.log(modal);

  modal.classList.add("active");
  
  document.getElementById("mensagemAvisoGlobal").textContent = mensagem;
  document.getElementById("modalAvisoGlobal").classList.add("active");
}

document.getElementById("btnFecharAvisoGlobal").addEventListener("click", () => {
  document.getElementById("modalAvisoGlobal").classList.remove("active");
});

document.getElementById("btnSalvarConfiguracaoPDF").addEventListener("click", salvarConfiguracoesPDF);

function carregarConfiguracoesPDF() {
  const config = obterConfiguracoesPDF();
  document.getElementById("telefonePDF").value = config.telefone;
  document.getElementById("emailPDF").value = config.email;
  document.getElementById("responsavelPDF").value = config.responsavel;
  document.getElementById("creaPDF").value = config.crea;
}

carregarConfiguracoesPDF();