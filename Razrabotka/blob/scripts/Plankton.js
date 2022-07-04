// копирование значений полей и документа sourceDocument в документ targetDocument
// поля берутся из серции part, имена полей из массива fields
function copyFieldValuesHr(source, target, fields){
    let sourceMnemo = source.getMnemo();
    let targetMnemo = target.getMnemo();
    for (let field of fields) {
        if (!(Array.isArray(field))) {
            field = [field, field];
        }
        target.set(targetMnemo + '.hr.' + field[0], source.get(sourceMnemo + '.hr.' + field[1]));
    }
}

function copyFieldValuesTr(source, target, sourceMnemo, targetMnemo, fields){
    if (fields === undefined) {
        fields = source.keySet();
    }    
    for (let field of fields) {
        if (!(Array.isArray(field))) {
            field = [field, field];
        }
        target.put(targetMnemo + '.tr.' + field[0], source.get(sourceMnemo + '.tr.' + field[1]));
    }
}

// копирование всех записей всех полей из фактурной части одного документа в фактурную часть другого
function copyTableRecAll(sourceDocument, targetDocument){
    targetMnemo = targetDocument.getMnemo();
    for (let tableRec of sourceDocument.getRows()){
        let row = targetDocument.addTableRow();
        for (let fieldMnemo of tableRec.keySet()) {
            row.put(targetMnemo + '.tr.' + fieldMnemo.slice(fieldMnemo.lastIndexOf('.') + 1), tableRec.get(fieldMnemo));
        }
    }
}

// задать значения полей из массива
function setFieldValuesHr(currentDocument, fields, values){
    let docMnemo = currentDocument.getMnemo();
    for (let i = 0; i < fields.length; i++) {
        currentDocument.set(docMnemo + '.hr.' + fields[i], values[i]);
    }    
}
// задать значения полей из массива
function setFieldValuesTr(tableRec, docMnemo, fields, values){
    for (let i = 0; i < fields.length; i++) {
        tableRec.put(docMnemo + '.tr.' + fields[i], values[i]);
    }    
}

function getFieldValuesHr(currentDocument, fields){
    let docMnemo = currentDocument.getMnemo();
    let result = [];
    for (let i = 0; i < fields.length; i++) {
        result.push(currentDocument.get(docMnemo + '.hr.' + fields[i]));
    }
    return result;
}

function getAccountByCode(code){
    return EntityFactory.getPlan().getAccounts().findByCode(code).get(0);
}

function swapObjProperties(object, ...propertyPairs) {
    for (let propertyPair of propertyPairs) {
        let value = object[propertyPair[0]];
        object[propertyPair[0]] = object[propertyPair[1]];
        object[propertyPair[1]] = value;
    }
}

function getAnalyticNumber(account, analyticMnemo) {
    let accountCode = account.getCode();

    for (let analyticNumber of account.getAnalytics().keySet()) {
        if (analyticMnemo == EntityFactory.getPlan().getAccounts().getAnalyticMnemo(accountCode, analyticNumber)) {
            return analyticNumber;
        }
    }
}

//Заполнение регистра
function FillRegistr(regName, currentDocument, dimensionsMnemo, dimensions, requisitesMnemo, requisites, resourcesMnemo, resources) {
   
    let myReg = Register.get(regName);
    let record = myReg.create();

    record.setDate(currentDocument.getDate());
    record.setDocument(currentDocument);

    for (let i = 0; i < dimensions.length; i++) {
         record.setDimension(regName + '.dm.' + dimensionsMnemo[i], dimensions[i]);
    }
    
    for (let i = 0; i < requisites.length; i++) {
         record.setRequisite(regName + '.rg.' + requisitesMnemo[i], requisites[i]);
    }

    for (let i = 0; i < resources.length; i++) {
         record.set(regName + '.rs.' + resourcesMnemo[i], resources[i]);
    }
    record.create();
}