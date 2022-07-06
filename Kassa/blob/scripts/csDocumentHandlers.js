//основная процедура во всех классах - processTableRec
class DocSummaHandler {
    constructor(sumRequisiteName = "Summa") {
        this.sumRequisiteName = sumRequisiteName;
    }
    
    beforeProcess(document) {
        this.value = 0;
        this.hrMnemo = document.getMnemo() + '.hr.';
        this.trMnemo = document.getMnemo() + '.tr.';
        this.originalValue = document.get(this.hrMnemo + this.sumRequisiteName); //не используется, но в будущем можно сравнить сумму по фактуре и изначальную сумму документа(и задать вопрос пользователю на изменение, например)
    }
    
    processTableRec(tableRec) {
        this.value += +tableRec.get(this.trMnemo + 'VsegoSNDS') ?? +tableRec.get(this.trMnemo + 'Summa') ?? 0;
    }
    
    afterProcess(document) {
        document.set(this.hrMnemo + this.sumRequisiteName, this.value)
    }
}




class DocReferenceHandler {
    constructor(refFieldName, sourceFields, depFields, options) {
        this.refFieldName = refFieldName;
        this.sourceFields = sourceFields;
        this.depFields = depFields;
        this.options = options;
        this.opSetNuls = options.setNulls ?? true;
    }

    beforeProcess(document) { //если бы можно было получать значения из таблицы нормально(без знания мнемоники документа) то beforeProcess - лишнее
        this.trMnemo = document.getMnemo() + '.tr.';
    }
    
    processTableRec(tableRec) {
        let catalogRecord = tableRec.get(this.trMnemo + this.refFieldName);
        if (!catalogRecord) {
            return;
        }

        let sourceValue;
        for (let i = 0; i < this.depFields.length; i++) {
            sourceValue = catalogRecord.get(catalogRecord.getMnemo() + '.' + this.sourceFields[i]);
            if (sourceValue || this.opSetNuls && !sourceValue) {
                tableRec.put(this.trMnemo + this.depFields[i], sourceValue);
            }
        }
    }
}





class DocFillTableByHatHandler {
    constructor(hatFieldName, tableFieldName) { //технически, ничего не мешает переделать на массивы. 
        this.hatFieldName = hatFieldName;       //Мне просто не очень нравятся ничем(кроме знания программиста) не связанные 2 массива(словарь тут явно излишний)
        this.tableFieldName = tableFieldName;   //По субъективным ощущениям, строже и правильнее просто создать несколько экземпляров класса с однозначным соответствием 1 поле шапки - 1 поле таблицы
    }
    
    beforeProcess(document) {
        this.hatValue = document.get(document.getMnemo() + '.hr.' + this.hatFieldName);
        this.trMnemo = document.getMnemo() + '.tr.';
    }

    processTableRec(tableRec) {
        if (this.hatValue && !tableRec.get(this.trMnemo + this.tableFieldName)) {
            tableRec.put(this.trMnemo + this.tableFieldName, this.hatValue);
        }
    }
}




class DocNdsHandler {
    constructor() {
    }
    
    beforeProcess(document) {
        this.trMnemo = document.getMnemo() + '.tr.';
    }
    
    processTableRec(tableRec) {
        let VsegoSNDS = +tableRec.get(this.trMnemo + 'VsegoSNDS');
        let NDS = tableRec.get(this.trMnemo + 'NDS');
        let SummaBezNDS = +tableRec.get(this.trMnemo + 'SummaBezNDS');
        let SummaNDS = +tableRec.get(this.trMnemo + 'SummaNDS');
        let koef = pNDS[NDS];
        
        if (VsegoSNDS && koef) {
            SummaNDS = (VsegoSNDS * koef).toFixed(2);
            SummaBezNDS = VsegoSNDS - +SummaNDS;
        } else if (SummaBezNDS && koef) {
            VsegoSNDS = (SummaBezNDS / (1 - koef)).toFixed(2);
            SummaNDS = +VsegoSNDS - SummaBezNDS;
        }              
        
        tableRec.put(this.trMnemo + 'VsegoSNDS', VsegoSNDS);
        tableRec.put(this.trMnemo + 'SummaBezNDS', SummaBezNDS);
        tableRec.put(this.trMnemo + 'SummaNDS', SummaNDS);
    }
    
    afterProcess(document) {
    }
}