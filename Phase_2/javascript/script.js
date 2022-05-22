//Variable declares
var inputs
var inputValue
var jsonData
var fileName
var correction = []
var previous
//DOM Tag Get
let importBtn = document.querySelector('.import-btn')
let jsonUpload = document.getElementById('import-file')
let showContent = document.querySelector('.main-body')
var inputs = document.querySelectorAll("input-field");
var buttons = document.querySelectorAll(".butn")
var exportBtn = document.querySelector('.export-btn')
// inputs = Array.from(inputs);
// buttons = Array.from(buttons)
// console.log(inputs);
//eventListener
importBtn.addEventListener('click', fileImport)
jsonUpload.addEventListener('change', jsonFileUpload)
exportBtn.addEventListener('click',download)


//Functions

//Import Button Functions
function fileImport() {
    document.getElementById("import-file").click();
}

//Uploading Json file and showing the contents
function jsonFileUpload(e) {
    var target = e.target || e.srcElement;
    var file = target.files[0];

    if (!file) {
        return;
    }

    fileName = target.files[0].name;
    var reader = new FileReader();

    if (fileName.length >= 20) {
        document.querySelector('.file-name').innerHTML = "<strong>File : </strong>" + fileName.slice(0,
            10) + "....." + fileName.slice(-10);
    } else {
        document.querySelector('.file-name').innerHTML = "<strong>File : </strong>" + fileName;
    }
    reader.onload = function (e) {
        contents = e.target.result 
        contents = contents.replace("None", "null");
        jsonData = JSON.parse(contents);
        jsonData.map((data,ind)=>{
            var individualDiv = document.createElement('div')
            individualDiv.className = 'input'+ind
            showContent.appendChild(individualDiv)
            
            var countData = document.createElement('h3')
            countData.innerHTML =`Image No. ${ind+1}` 
            individualDiv.appendChild(countData)

            var imageShow = document.createElement('img')
            imageShow.src = `Phase_2_imgs/${data.image_name}`
            imageShow.alt = "image"
            individualDiv.appendChild(imageShow)

            var text = document.createElement('h3')
            text.innerHTML = data.text 
            individualDiv.appendChild(text)

            
            var inputField = document.createElement('input')
            inputField.type = 'text'
            inputField.className = 'input-field'
            inputField.id = 'input'+ind
            individualDiv.appendChild(inputField)

            var correctBtn = document.createElement('button')
            correctBtn.className = 'butn'
            correctBtn.id = 'butn'+ind
            correctBtn.type = 'button'
            correctBtn.innerHTML = 'Correct'
            individualDiv.appendChild(correctBtn)

            if(data.correction){
                data.correction.map((corectText)=>{
                    var orderedList = document.createElement("ul")
                    var lists = document.createElement('li')
                    lists.innerHTML = corectText
                    orderedList.appendChild(lists)
                    individualDiv.appendChild(orderedList)
                })
            }


            var breakLine = document.createElement('br')
            individualDiv.appendChild(breakLine)
        }) 
         inputs = document.querySelectorAll(".input-field");
         buttons = document.querySelectorAll(".butn")
          
         inputs = Array.from(inputs);
         buttons = Array.from(buttons)
        
    };
    reader.readAsText(file);

}

function addEvent(eventName, htmlElement, callback) {
    if (htmlElement != null) {
        if (htmlElement.addEventListener) {
            htmlElement.addEventListener(eventName, callback, false);
        } else if (htmlElement.attachEvent) {
            htmlElement.attachEvent("on" + eventName, callback);
        }
    }
}

addEvent("input",document,function(e){
    
    if(e.target.getAttribute('class')=== 'input-field'){
            previous = document.getElementById(e.target.getAttribute('id'))
            inputValue = document.getElementById(e.target.getAttribute('id')).value
    }
})

addEvent("click",document,function(e){
    
    if(e.target.getAttribute('class')==="butn"){
        if(inputValue===undefined || inputValue ==="" || inputValue === null){

        }
        else{
            var correctButton = document.getElementById(e.target.getAttribute('id')).parentElement
       
            var classAttribute = correctButton.getAttribute('class')
            classAttribute = classAttribute.slice(-1)
            //To clear the input Field
            var orderedList = document.createElement("ul")
            var lists = document.createElement('li')
            lists.innerHTML = inputValue
            orderedList.appendChild(lists)
            correctButton.append(orderedList)
            
            if(jsonData[classAttribute].correction){
                jsonData[classAttribute].correction.push(inputValue)
                inputValue = ""
                correction = []
            }
            else{
                correction.push(inputValue)
                inputValue = ""
                jsonData[classAttribute].correction = correction
            }
            
            jsonData.map((val,ind)=>{
                document.getElementById(`input${ind}`).value = ""
            })
            

        }

    }
})

// for downloading updated json
function download(){
    if(fileName===undefined){

    }else{
        saveFile(fileName + '_' + Date.now() + '.json', JSON.stringify(jsonData));
        location.reload();
    }
    
}

function saveFile(filename, text) {
    var blob = new Blob([text], {
        type: 'text/json'
    });
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    } else {
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}
