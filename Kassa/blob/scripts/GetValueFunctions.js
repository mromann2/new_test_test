//ВНИМАНИЕ! Данные функции используются для получения значений в алгоритмах проведения. Менять с особой осторожностью
function fGetTableRequisite(source, tableRec, document){
    return tableRec.get(document.getMnemo() + ".tr." + source);    
}

function fGetHeadRequisite(source, tableRec, document){
    return document.get(document.getMnemo() + ".hr." + source);  
}

function fGetTableEnumValue(source, tableRec, document){
    return tableRec.get(document.getMnemo() + ".tr." + source)[0];    
}

function fGetTableRequisiteCode(source, tableRec, document){
    return fGetTableRequisite(source, tableRec, document)?.getCode();
}

function fGetHeadRequisiteCode(source, tableRec, document){
    return fGetHeadRequisite(source, tableRec, document)?.getCode();
}

function fGetAccountByCode(source, tableRec, document){
    return EntityFactory.getPlan().getAccounts().findByCode(source).get(0);
}

function fGetOperationName(source, tableRec, document){
    return fGetTableRequisite(source, tableRec, document)?.get(MODULEMNEMO + '.Operacii.PolnoeNaimenovanie');
}

function fGetKosguByDbEkrProperty(source, tableRec, document){
    return source.p_KOSGUEKRDb.getValue(tableRec, document, source)?.slice(0, 3);
}

function fGetKosguByKrEkrProperty(source, tableRec, document){
    return source.p_KOSGUEKRKr.getValue(tableRec, document, source)?.slice(0, 3);
}

function fGetDbKosguByDbAccountProperty(source, tableRec, document){
    return source.p_DEBET.getValue(tableRec, document, source).getKOSGUDebit();
}

function fGetKrKosguByKrAccountProperty(source, tableRec, document){
    return source.p_KREDIT.getValue(tableRec, document, source).getKOSGUCredit();
}
    
function fGetPriorityJournal(source, tableRec, document){
    let debet = source.p_DEBET.getValue(tableRec, document, source);
    let credit = source.p_KREDIT.getValue(tableRec, document, source);
    let debitJournal = debet?.getJournal();
    let creditJournal = credit?.getJournal();
    let debitJornalPrioritet = debitJournal ? debitJournal.get(MODULEMNEMO + '.Zhurnaly.Prioritet') : 10;
    let creditJornalPrioritet = creditJournal ? creditJournal.get(MODULEMNEMO + '.Zhurnaly.Prioritet') : 10;
    let result = ['', ''];
    
    if (debitJournal && creditJournal) {
        if (debitJournal.getCode() == creditJournal.getCode()) {
            result[0] = debitJournal.getCode() ?? '';
        } else if (debitJornalPrioritet < creditJornalPrioritet) {
            result = [debitJournal.getCode() ?? '', creditJournal.getCode() ?? ''];
        } else {
            result = [creditJournal.getCode() ?? '', debitJournal.getCode() ?? ''];
        }
    } else if (!debitJournal != !creditJournal){
        result[0] = (debitJournal ? debitJournal.getCode() : creditJournal?.getCode()) ?? '';
    }  
    
    return result;
}