document
  .getElementById("pdf-input")
  .addEventListener("change", function (event) {
    var file = event.target.files[0];

    if (file) {
      // Carrega o PDF
      var reader = new FileReader();
      reader.onload = function (e) {
        var pdfUrl = e.target.result;

        // Salva a URL do PDF no localStorage
        localStorage.setItem("pdfUrl", pdfUrl);

        pdfjsLib.getDocument(pdfUrl).promise.then(function (pdf) {
          // Função para processar uma página
          function processPage(pageNum) {
            // Obtém o texto da página
            pdf.getPage(pageNum).then(function (page) {
              page.getTextContent().then(function (textContent) {
                // Extrai e exibe o texto
                var text = "";
                textContent.items.forEach(function (item) {
                  // Verifica se o item contém texto
                  if (item.str) {
                    text += item.str + " ";
                  }
                });

                // Adiciona o texto à div
                var pdfTextDiv = document.getElementById("pdf-text");
                pdfTextDiv.innerHTML +=
                  "<p><strong>pag " + pageNum + "</strong> " + text + "</p>";

                // Processa a próxima página se existir
                if (pageNum < pdf.numPages) {
                  processPage(pageNum + 1);
                }
              });
            });
          }

          // Limpa o conteúdo anterior
          var pdfTextDiv = document.getElementById("pdf-text");
          pdfTextDiv.innerHTML = "";

          // Inicia o processamento pela primeira página
          processPage(1);
        });
      };

      // Lê o conteúdo do arquivo como uma URL de dados
      reader.readAsDataURL(file);
    }
  });

// Verifica se há um URL de PDF no localStorage ao carregar a página
window.onload = function () {
  var storedPdfUrl = localStorage.getItem("pdfUrl");

  if (storedPdfUrl) {
    // Atualiza o valor do input de arquivo
    document.getElementById("pdf-input").value = "";

    // Carrega o PDF a partir do localStorage
    pdfjsLib.getDocument(storedPdfUrl).promise.then(function (pdf) {
      // Limpa o conteúdo anterior
      var pdfTextDiv = document.getElementById("pdf-text");
      pdfTextDiv.innerHTML = "";

      // Função para processar uma página
      function processPage(pageNum) {
        // Obtém o texto da página
        pdf.getPage(pageNum).then(function (page) {
          page.getTextContent().then(function (textContent) {
            // Extrai e exibe o texto
            var text = "";
            textContent.items.forEach(function (item) {
              // Verifica se o item contém texto
              if (item.str) {
                text += item.str + " ";
              }
            });

            // Adiciona o texto à div
            pdfTextDiv.innerHTML +=
              "<p><strong>pag " + pageNum + "</strong> " + text + "</p>";

            // Processa a próxima página se existir
            if (pageNum < pdf.numPages) {
              processPage(pageNum + 1);
            }
          });
        });
      }

      // Inicia o processamento pela primeira página
      processPage(1);
    });
  }
};
