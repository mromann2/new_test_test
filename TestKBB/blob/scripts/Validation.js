//Проверка документа на полное заполнение
function notValid(currentDocument) { 
    let resultValidate = currentDocument.validate();
 
    if (!currentDocument.getRows().size()){
        resultValidate.addValueError('Не заполнена табличная часть документа.');
    }
    
    if (resultValidate.hasErrors() || resultValidate.hasValueErrors() ) 
        return  resultValidate;
}