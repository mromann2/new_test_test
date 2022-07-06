//Проверка документа на полное заполнение
function notValid(currentDocument) { 
    let resultValidate = currentDocument.validate();
 
    if (!currentDocument.getRows().size()){
        resultValidate.addValueError('Не заполнена табличная часть документа.');
    }
    
    if (resultValidate.hasErrors() || resultValidate.hasValueErrors() ) 
        return  resultValidate;
}

function processDocument(document, ...handlers) {
    for (let handler of handlers) {
        if ('beforeProcess' in handler) {
            handler.beforeProcess(document);
        }

        if ('processTableRec' in handler) {
            for (let tableRec of document.getRows()){
                handler.processTableRec(tableRec);
            }
        }

        if ('afterProcess' in handler) {
            handler.afterProcess(document);
        }
    }
}
