window.onload = function(e) {

  var input = document.getElementById('documento0');
  var preview = document.getElementsByClassName('preview')[0];

  input.addEventListener('change', updateImageDisplay);

  function updateImageDisplay() {
    while (preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }

    var curFiles = input.files;
    if (curFiles.length === 0) {
      var para = document.createElement('p');
      para.textContent = 'no se seleccionó un archivo';
      preview.appendChild(para);
    } else {
      var list = document.createElement('ol');
      preview.appendChild(list);
      for (var i = 0; i < curFiles.length; i++) {
        var listItem = document.createElement('li');
        var para = document.createElement('p');

        if (validFileType(curFiles[i])) {
          if (curFiles[i].type == 'application/pdf' || curFiles[i].type == 'image/tiff') {
            para.textContent = curFiles[i].name + ', Tamaño: ' + returnFileSize(curFiles[i].size);
            var pdfEmbebido = document.createElement('iframe');
            pdfEmbebido.src = window.URL.createObjectURL(curFiles[i]);
            pdfEmbebido.type = "application/pdf";
            pdfEmbebido.width = "50%%";
            pdfEmbebido.height = "50%";
            listItem.appendChild(pdfEmbebido);
            listItem.appendChild(para);

          } else {
            para.textContent = curFiles[i].name + ', Tamaño: ' + returnFileSize(curFiles[i].size);
            var image = document.createElement('img');
            image.className += "archivo";
            image.src = window.URL.createObjectURL(curFiles[i]);
            listItem.appendChild(image);
            listItem.appendChild(para);
          }
        } else {
          para.textContent = 'Archivo: ' + curFiles[i].name + ': Not a valid file type. Update your selection.';
          listItem.appendChild(para);
        }

        list.appendChild(listItem);
      }
    }
  }

  var fileTypes = [
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'image/x-png',
    'application/pdf',
    'image/tiff'
  ];

  function validFileType(file) {
    for (var i = 0; i < fileTypes.length; i++) {
      if (file.type === fileTypes[i]) {
        return true;
      }
    }
    return false;
  }

  function returnFileSize(number) {
    if (number < 1024) {
      return number + 'bytes';
    } else if (number >= 1024 && number < 1048576) {
      return (number / 1024).toFixed(1) + 'KB';
    } else if (number >= 1048576) {
      return (number / 1048576).toFixed(1) + 'MB';
    }
  }

  document.getElementById('form1').addEventListener('submit', function(e) {
    event.preventDefault();
    var preloader = document.getElementsByClassName('preloader')[0];
    preloader.style.display = "inline";

    var form = document.getElementById('form1');
    var data = new FormData(form);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        renderResults(this.response);
        preloader.style.display = "none";
      }
    };
    xmlhttp.open("POST", "/docsAnalyze", true);
    xmlhttp.send(data);
  });
}

function renderResults(response) {
  var jsonResults = JSON.parse(response);
  var divResults = document.getElementById('resultados');
  var list1 = document.createElement('ul');
  var li1 = document.createElement('li');
  li1.innerHTML = 'Documento: ' + jsonResults.data[0].dataAnalized.typeDoc;
  console.log(li1);
  var li2 = document.createElement('li');
  li2.innerHTML = 'Se Presentó: ' + jsonResults.data[0].typeDoc;
  var li3 = document.createElement('li');
  li3.innerHTML = 'Nombre: ' + jsonResults.data[0].dataAnalized.nombre.fullName;
  var li4 = document.createElement('li');
  li4.innerHTML = 'Domicilio: ' + jsonResults.data[0].dataAnalized.domicilio;
  var li5 = document.createElement('li');
  li5.innerHTML = 'C.P.: ' + jsonResults.data[0].dataAnalized.cp;
  var li6 = document.createElement('li');
  li6.innerHTML = 'Rostro Detectado: ' + jsonResults.data[0].dataAnalized.faceDetected;
  list1.appendChild(li1);
  list1.appendChild(li2);
  list1.appendChild(li3);
  list1.appendChild(li4);
  list1.appendChild(li5);
  list1.appendChild(li6);
  divResults.appendChild(list1);
}

function actualizarDatos() {
  var divResults = document.getElementById('resultados');
  divResults.innerHTML = '';
}
