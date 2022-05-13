// Функция создания проводки с заданными свойствами. Если свойства в объекте не указаны - используются стандартные поля из табличной части.
// Принимает объект со следующими свойствами:
//let obj = {
//    tableRec,
//    currentDocument,
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
    let docMnemo = obj.currentDocument.getMnemo();
    let reqMnemo = docMnemo + '.tr.';
    
    //КВФО
    if ("kfo" in obj){
        obj.kfo && posting.setProperty(KFO, obj.kfo);
    } else {
       obj.tableRec.get(reqMnemo + 'KVFO')?.[0] && posting.setProperty(KFO, obj.tableRec.get(reqMnemo + 'KVFO')[0]);
    }
    //Дебет
    if('debit' in obj){
        obj.debit && posting.setDebit(obj.debit)
    } else {
        obj.tableRec.get(reqMnemo + 'Debet') && posting.setDebit(obj.tableRec.get(reqMnemo + 'Debet'));
    }
    if('debitKps' in obj){
        obj.debitKps && posting.setDebitProperty(KPS, obj.debitKps)
    } else {
       obj.tableRec.get(reqMnemo + 'KPSDb')?.getCode() && posting.setDebitProperty(KPS, obj.tableRec.get(reqMnemo + 'KPSDb').getCode());
    }
    if('debitKosgu' in obj){
        obj.debitKosgu && (posting.setDebitProperty(KOSGU, obj.debitKosgu.slice(0,3)) && posting.setDebitProperty(KOSGUEKR, obj.debitKosgu));
    } else if (obj.debit && getKOSGUDebit(obj.debit)){
        posting.setDebitProperty(KOSGU, getKOSGUDebit(obj.debit).slice(0,3));
        posting.setDebitProperty(KOSGUEKR, getKOSGUDebit(obj.debit));
    } else {
        obj.tableRec.get(reqMnemo + 'KOSGUDb')?.getCode() && (posting.setDebitProperty(KOSGU, obj.tableRec.get(reqMnemo + 'KOSGUDb').getCode().slice(0,3))
                                                              && posting.setDebitProperty(KOSGUEKR, obj.tableRec.get(reqMnemo + 'KOSGUDb').getCode()));
    }
    //Кредит
     if('credit' in obj){
        obj.credit && posting.setCredit(obj.credit)
    } else {
        obj.tableRec.get(reqMnemo + 'Kredit') && posting.setCredit(obj.tableRec.get(reqMnemo + 'Kredit'));
    }
    if('creditKps' in obj){
        obj.creditKps && posting.setCreditProperty(KPS, obj.creditKps)
    } else {
       obj.tableRec.get(reqMnemo + 'KPSKr')?.getCode() && posting.setCreditProperty(KPS, obj.tableRec.get(reqMnemo + 'KPSKr').getCode());
    }
    if('creditKosgu' in obj){
        obj.creditKosgu && (posting.setCreditProperty(KOSGU, obj.creditKosgu.slice(0,3)) && posting.setCreditProperty(KOSGUEKR, obj.creditKosgu));
    } else if (obj.credit && getKOSGUCredit(obj.credit)){
        posting.setCreditProperty(KOSGU, getKOSGUCredit(obj.credit).slice(0,3));
        posting.setCreditProperty(KOSGUEKR, getKOSGUCredit(obj.credit));
    } else {
        obj.tableRec.get(reqMnemo + 'KOSGUKr')?.getCode() && (posting.setCreditProperty(KOSGU, obj.tableRec.get(reqMnemo + 'KOSGUKr').getCode().slice(0,3))
                                                              && posting.setCreditProperty(KOSGUEKR, obj.tableRec.get(reqMnemo + 'KOSGUKr').getCode()));
    }

   //Номер журнала
    let arrJournals = ['', ''];
    if ( obj.debit && obj.credit ){
        arrJournals = getPriorityJournal(obj.debit, obj.credit);
    } else if (obj.debit  && obj.tableRec.get(reqMnemo + 'Kredit')) {
        arrJournals = getPriorityJournal(obj.debit, obj.tableRec.get(reqMnemo + 'Kredit'));
    } else if (obj.credit && obj.tableRec.get(reqMnemo + 'Debet')) {
        arrJournals = getPriorityJournal(obj.tableRec.get(reqMnemo + 'Debet'), obj.credit);
    } else if (obj.tableRec.get(reqMnemo + 'Debet') && obj.tableRec.get(reqMnemo + 'Kredit')){
        arrJournals = getPriorityJournal(obj.tableRec.get(reqMnemo + 'Debet'), obj.tableRec.get(reqMnemo + 'Kredit'));
    }
    //posting.setProperty(JOURNAL, arrJournals[0]);
    if (arrJournals[0] != '') {
        posting.setProperty(JOURNAL, arrJournals[0]);
    }
    if (arrJournals[1] != '') {
        posting.setProperty(DOPJOURNAL, arrJournals[1]);
    }
    
    
    //Сумма
    if('summa' in obj){
        posting.setValue(obj.summa ?? '0')
    } else {
        posting.setValue(obj.tableRec.get(reqMnemo + 'VsegoSNDS') ?? obj.tableRec.get(reqMnemo + 'Summa') ?? '0')
    }
    
    //Количество
     if('kolvo' in obj){
        posting.setProperty(KOLVO, obj.kolvo ?? 0)
    } else {
        posting.setProperty(KOLVO, obj.tableRec.get(reqMnemo + 'Kolichestvo') ?? '0')
    }
  
    //Комментарий
     if('comment' in obj){
         obj.comment && posting.setComment(obj.comment)
     } else {
         obj.tableRec.get(reqMnemo + 'Operaciya') && posting.setComment(obj.tableRec.get(reqMnemo + 'Operaciya').get(MODULEMNEMO + '.Operacii.PolnoeNaimenovanie'))
     }
    
    //Расшифровка операции
    if('rasOper' in obj){
         obj.rasOper && posting.setProperty(RASOPER, obj.rasOper);
     } else {
         obj.tableRec.get(reqMnemo + 'RasshifrovkaOperacii') && posting.setProperty(RASOPER, obj.tableRec.get(reqMnemo + 'RasshifrovkaOperacii'))
     }
    
    //Цена
    if('cena' in obj){
         obj.cena && posting.setProperty(CENA, obj.cena);
     } else {
         obj.tableRec.get(reqMnemo + 'Cena') && posting.setProperty(CENA,obj.tableRec.get(reqMnemo + 'Cena'))
     }
     
    //Межрасчетный период
    if (obj.vnePeriod !== undefined){
        posting.setProperty(VNEPERIOD, obj.vnePeriod);
    }
    //Дата учета
    posting.setProperty(ACCOUNTINGDATE, obj.currentDocument.get(docMnemo + '.hr.DataUcheta') ?? obj.currentDocument.getDate().toString());
    return posting;


    // Определение в какой журнал попадет проводка (происходит сравнение приоритов журналов операций счета Дт и Кт. Диапазон 1-9 (1 - самый высокий приоритет))
    function getPriorityJournal(debit, credit) {
        let debitJournal = getJournal(debit);
        let creditJournal = getJournal(credit);
        let debitJornalPrioritet = debitJournal ? debitJournal.get(MODULEMNEMO + '.Zhurnaly.Prioritet') : 10;
        let creditJornalPrioritet = creditJournal ? creditJournal.get(MODULEMNEMO + '.Zhurnaly.Prioritet') : 10;
        if (obj.vnePeriod) {
            return ['11', ''];
        }
        if (debitJournal && creditJournal) {
            if (debitJournal.getCode() == creditJournal.getCode()) {
                return [debitJournal.getCode(), ''];
            } else if (debitJornalPrioritet < creditJornalPrioritet) {
                return [debitJournal.getCode(), creditJournal.getCode()];
            } else {
                return [creditJournal.getCode(), debitJournal.getCode()];
            }
        } else if (!debitJournal != !creditJournal){
            return [debitJournal ? debitJournal.getCode() : creditJournal.getCode(), ''];
        } else {
            return ['', ''];
        }
    }
}
// Определение связанного счета из справочника "Соответствия счетов" по объекту счета и мнемо интересующего поля из справочника
//SchetAmortizacii, SchetAvansa, SchetVlozheniii, SchetObesceneniya, Schet17, Schet18, SchetZatrat, SchetZabalansovyii
function getLinkedAccount(initialAccount, linkedMnemo) {
    let catalogRec = EntityFactory.getCatalogs().get(MODULEMNEMO + '.SootvetstviyaSchetov').findByCode(initialAccount.getCode())[0];
    if (catalogRec){
        return catalogRec.get(MODULEMNEMO + '.SootvetstviyaSchetov.' + linkedMnemo);
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

//функция заполнения аналитик у счета. В качестве параметров выступают счет и счет-источник
function fillAccountByAnalytics(account, sourceAccount) {
    let sourceAccountCode = sourceAccount.getCode();
    let accountCode = account.getCode();
    let sourceMap = new Map();
    let analytics = sourceAccount.getAnalytics();
    for (let analyticNumber of analytics.keySet()) {
        let analyticMnemo = EntityFactory.getPlan().getAccounts().getAnalyticMnemo(sourceAccountCode, analyticNumber);
        let valueAnalytic = analytics.get(analyticNumber);
        sourceMap.set(analyticMnemo, valueAnalytic);
    }
    for (let count = 0; count < MAXANALYTICSCOUNT; count++) {
        let accountAnalyticMnemo = EntityFactory.getPlan().getAccounts().getAnalyticMnemo(accountCode, count);
        if (accountAnalyticMnemo && accountAnalyticMnemo != '' && sourceMap.has(accountAnalyticMnemo)) {
            let analyticObject = sourceMap.get(accountAnalyticMnemo);
            account.put(count, analyticObject);
        }
    }
    return account;
}
