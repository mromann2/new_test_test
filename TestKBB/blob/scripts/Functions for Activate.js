// Функция создания проводки с заданными свойствами. Если свойства в объекте не указаны - используются стандартные поля из табличной части.
// Принимает объект со следующими свойствами:
//let obj = {
//    tableRec,
//    docMnemo: ,
//    kfo: ,
//    debitKps: , 
//    debit: ,
//    debitKosgu: ,
//    creditKps: ,
//    credit: ,
//    creditKosgu: ,
//    summa: ,
//    comment: ,
//    rasOper: ,
//    kolvo: ,
//    cena: ,
//    vnePeriod: ,
//}

function createPostingWithProps(obj) {
    let posting = EntityFactory.createPosting();
    let reqMnemo = obj.docMnemo + '.tr.';
    let moduleMnemo = obj.docMnemo.split('.')[0];
    
    //КВФО
    posting.setProperty(KFO, obj.kfo ?? obj.tableRec.get(reqMnemo + 'KVFO')[0]);
    //Дебет
    posting.setDebit(obj.debit ?? obj.tableRec.get(reqMnemo + 'Debet'));
    posting.setDebitProperty(KPS, obj.debitKps ?? obj.tableRec.get(reqMnemo + 'KPSDb').getCode());
    if (obj.debitKosgu !== undefined){
        posting.setDebitProperty(KOSGU, obj.debitKosgu.slice(0,3));
        posting.setDebitProperty(KOSGUEKR, obj.debitKosgu);
    }else if (obj.debit && getKOSGUDebit(obj.debit)){
        posting.setDebitProperty(KOSGU, getKOSGUDebit(obj.debit).slice(0,3));
        posting.setDebitProperty(KOSGUEKR, getKOSGUDebit(obj.debit));
    } else {
        posting.setDebitProperty(KOSGU, obj.tableRec.get(reqMnemo + 'KOSGUDb').getCode().slice(0,3));
        posting.setDebitProperty(KOSGUEKR, obj.tableRec.get(reqMnemo + 'KOSGUDb').getCode());
    }
    //Кредит
    posting.setCredit(obj.credit ?? obj.tableRec.get(reqMnemo + 'Kredit'));
    posting.setCreditProperty(KPS, obj.creditKps ?? obj.tableRec.get(reqMnemo + 'KPSKr').getCode());
    if (obj.creditKosgu !== undefined){
        posting.setCreditProperty(KOSGU, obj.creditKosgu.slice(0,3));
        posting.setCreditProperty(KOSGUEKR, obj.creditKosgu);
    }else if (obj.credit && getKOSGUCredit(obj.credit)){
        posting.setCreditProperty(KOSGU, getKOSGUCredit(obj.credit).slice(0,3));
        posting.setCreditProperty(KOSGUEKR, getKOSGUCredit(obj.credit));
    } else {
        posting.setCreditProperty(KOSGU, obj.tableRec.get(reqMnemo + 'KOSGUKr').getCode().slice(0,3));
        posting.setCreditProperty(KOSGUEKR, obj.tableRec.get(reqMnemo + 'KOSGUKr').getCode());
    }
    //Номер журнала
    if ((obj.debit !== undefined) && (obj.credit !== undefined)){
        posting.setProperty(JOURNAL, getPriorityJournal(obj.debit, obj.credit));
    } else if (obj.debit !== undefined) {
        posting.setProperty(JOURNAL, getPriorityJournal(obj.debit, obj.tableRec.get(reqMnemo + 'Kredit')));
    } else if (obj.credit !== undefined) {
        posting.setProperty(JOURNAL, getPriorityJournal(obj.tableRec.get(reqMnemo + 'Debet'), obj.credit));
    } else
        posting.setProperty(JOURNAL, getPriorityJournal(obj.tableRec.get(reqMnemo + 'Debet'), obj.tableRec.get(reqMnemo + 'Kredit')));
    
    //Сумма 
    if (obj.summa !== undefined) {
        posting.setValue(obj.summa);
    } else if (obj.tableRec.get(reqMnemo + 'VsegoSNDS')){
        posting.setValue(obj.tableRec.get(reqMnemo + 'VsegoSNDS'));
    } else if (obj.tableRec.get(reqMnemo + 'Summa')){ 
            posting.setValue(obj.tableRec.get(reqMnemo + 'Summa'));
    }
    //Комментарий
    if (obj.comment !== undefined){
        posting.setComment(obj.comment)
    } else if (obj.tableRec.get(reqMnemo + 'Operaciya')){
        posting.setComment(obj.tableRec.get(reqMnemo + 'Operaciya').get(moduleMnemo + '.Operacii.PolnoeNaimenovanie'))
    }
    //Расшифровка операции
    if (obj.rasOper !== undefined){
        posting.setProperty(RASOPER, obj.rasOper)
    } else if (obj.tableRec.get(reqMnemo + 'RasshifrovkaOperacii')){
        posting.setProperty(RASOPER, obj.tableRec.get(reqMnemo + 'RasshifrovkaOperacii'));
    }
    //Количество
    if (obj.kolvo !== undefined){
        posting.setProperty(KOLVO, obj.kolvo)
    } else if (obj.tableRec.get(reqMnemo + 'Kolichestvo')){
        posting.setProperty(KOLVO, obj.tableRec.get(reqMnemo + 'Kolichestvo'))
    }
    //Цена
    if (obj.cena !== undefined){
        posting.setProperty(CENA, obj.cena)
    } else if (obj.tableRec.get(reqMnemo + 'Cena')){
        posting.setProperty(CENA,obj.tableRec.get(reqMnemo + 'Cena'))
    }
    
    //Межрасчетный период
    if (obj.vnePeriod !== undefined){
        posting.setProperty(VNEPERIOD, obj.vnePeriod)
    }
    return posting;
}


// Определение в какой журнал попадет проводка (происходит сравнение приоритов журналов операций счета Дт и Кт. Диапазон 1-9 (1 - самый высокий приоритет))
function getPriorityJournal(debet, credit) {
    let debetJournal = getJournal(debet);
    let creditJournal = getJournal(credit);
    if (debetJournal || creditJournal) {
        let debetJornalPrioritet = debetJournal ? debetJournal.get('Razrabotka.Zhurnaly.Prioritet') : 9;
        let creditJornalPrioritet = creditJournal ? creditJournal.get('Razrabotka.Zhurnaly.Prioritet') : 9;
        if (debetJornalPrioritet < creditJornalPrioritet)
            return debetJournal.getCode();
        else 
            return creditJournal.getCode();
    } else
        return '';
}

// Определение счета вложений из справочника "Соответствия счетов" по объекту счета
function getInvestAccount(moduleMnemo, initialAccount) {
    let catalogRec = EntityFactory.getCatalogs().get(moduleMnemo + '.SootvetstviyaSchetov').findByRequisite(moduleMnemo + '.SootvetstviyaSchetov.Schet', initialAccount.getCode())[0];
    if (catalogRec){
        return catalogRec.get(moduleMnemo + '.SootvetstviyaSchetov.SchetVlozheniii');
    }
}

// Расчет суммы операции по табличной части
function getCalculatedSum(currentDocument, mnemoSumm) {
    let summ = 0;
    for (let tableRec of currentDocument.getRows()){
        summ += +tableRec.get(mnemoSumm);            
    }
    return summ;
}