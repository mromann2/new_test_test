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
    return createPostingFromObj(setObj(obj));
}

function setObj(obj) {
    function putToObj(propName, getValueFunc) { //тут именно функция, так как это позволяет не делать лишних движений, при propName in obj
        if (!(propName in obj)) {
            let value = getValueFunc();
            if (value != null) {
                resultObj[propName] = value;
            }
        }
    }
    let tableRec = obj.tableRec;
    let trMnemo = obj.currentDocument.getMnemo() + '.tr.';
    let resultObj = Object.assign({}, obj);
    
    putToObj('kfo', () => tableRec.get(trMnemo + 'KVFO')?.[0]);

    putToObj('debit', () => tableRec.get(trMnemo + 'Debet'));
    putToObj('debitKps', () => tableRec.get(trMnemo + 'KPSDb').getCode());
    putToObj('debitKosgu', () => {
        if (obj.debit && getKOSGUDebit(obj.debit)){
            return getKOSGUDebit(obj.debit);
        }
        return tableRec.get(trMnemo + 'KOSGUDb')?.getCode();
    });

    putToObj('creditKosgu', () => {
        if (obj.credit && getKOSGUCredit(obj.credit)){
            return getKOSGUCredit(obj.credit);
        }
        return tableRec.get(trMnemo + 'KOSGUKr')?.getCode();
    });
    putToObj('credit', () => tableRec.get(trMnemo + 'Kredit'));
    putToObj('creditKps', () => tableRec.get(trMnemo + 'KPSKr').getCode());
    
    putToObj('summa', () => tableRec.get(trMnemo + 'VsegoSNDS') ?? tableRec.get(trMnemo + 'Summa') ?? '0');
    putToObj('kolvo', () => tableRec.get(trMnemo + 'Kolichestvo') ?? '0');
    putToObj('comment', () => tableRec.get(trMnemo + 'Operaciya')?.get(MODULEMNEMO + '.Operacii.PolnoeNaimenovanie'));
    putToObj('rasOper', () => tableRec.get(trMnemo + 'RasshifrovkaOperacii'));
    putToObj('cena', () => tableRec.get(trMnemo + 'Cena'));
    putToObj('dataUcheta', () => formatDate(obj.currentDocument.get(obj.currentDocument.getMnemo() + '.hr.DataUcheta') ?? obj.currentDocument.getDate()));
    
    return resultObj;
}

function createPostingFromObj(obj) {
    let posting = EntityFactory.createPosting();
    
    obj.kfo && posting.setProperty(KFO, obj.kfo);
    
    obj.debit && posting.setDebit(obj.debit);
    obj.debitKps && posting.setDebitProperty(KPS, obj.debitKps);
    obj.debitKosgu && posting.setDebitProperty(KOSGU, obj.debitKosgu.slice(0,3));
    obj.debitKosgu && posting.setDebitProperty(KOSGUEKR, obj.debitKosgu);
            
    obj.credit && posting.setCredit(obj.credit);
    obj.creditKps && posting.setCreditProperty(KPS, obj.creditKps);
    obj.creditKosgu && posting.setCreditProperty(KOSGU, obj.creditKosgu.slice(0,3));
    obj.creditKosgu && posting.setCreditProperty(KOSGUEKR, obj.creditKosgu);

    posting.setValue(obj.summa ?? '0');
    obj.comment && posting.setComment(obj.comment);

    posting.setProperty(KOLVO, obj.kolvo ?? '0');
    obj.rasOper && posting.setProperty(RASOPER, obj.rasOper);
    obj.cena && posting.setProperty(CENA, obj.cena);
    obj.vnePeriod && posting.setProperty(VNEPERIOD, obj.vnePeriod);
    obj.dataUcheta && posting.setProperty(ACCOUNTINGDATE, obj.dataUcheta);

    let arrJournals = getPriorityJournal(obj.debit, obj.credit, obj.vnePeriod);
    posting.setProperty(JOURNAL, arrJournals[0]);
    if (arrJournals[1] != '') {
        posting.setProperty(DOPJOURNAL, arrJournals[1]);
    }
    
    return posting;
}

// Преобразование даты в формат вида 01.01.2022
function formatDate(date) {
    let orderDateJS = date;
    let dd = orderDateJS.getDate();
    dd < 10 ? dd = '0' + dd : dd;
    let mm = orderDateJS.getMonth() + 1;
    mm < 10 ? mm = '0' + mm : mm;
    
    return dd + '.' + mm + '.' + orderDateJS.getFullYear();
}

// Определение в какой журнал попадет проводка (происходит сравнение приоритов журналов операций счета Дт и Кт. Диапазон 1-9 (1 - самый высокий приоритет))
function getPriorityJournal(debit, credit, vnePeriod = false) {
    if ( !debit || !credit){
        return ['','']
    }
    if (vnePeriod) {
        return ['11', ''];
    }

    let debitJournal = getJournal(debit);
    let debitJornalPrioritet = debitJournal ? debitJournal.get(MODULEMNEMO + '.Zhurnaly.Prioritet') : 10;

    let creditJournal = getJournal(credit);
    let creditJornalPrioritet = creditJournal ? creditJournal.get(MODULEMNEMO + '.Zhurnaly.Prioritet') : 10;
    
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

function getObjFromPosting(posting) {
    return {
        kfo: posting.getProperty(KFO),

        debit: posting.getDebit(),
        debitKps: posting.getDebitProperty(KPS),
        debitKosgu: posting.getDebitProperty(KOSGUEKR),

        credit: posting.getCredit(),
        creditKps: posting.getCreditProperty(KPS),
        creditKosgu: posting.getCreditProperty(KOSGUEKR),

        summa: posting.getValue(),
        comment: posting.getComment(),

        kolvo: posting.getProperty(KOLVO),
        rasOper: posting.getProperty(RASOPER),
        cena: posting.getProperty(CENA),
        vnePeriod: posting.getProperty(VNEPERIOD),
        dataUcheta: posting.getProperty(ACCOUNTINGDATE)
    };
}

function addMonetaryАssetsPostings(currentDocument){
    let catAssociatedAccounts = EntityFactory.getCatalogs().get(MODULEMNEMO + ".SootvetstviyaSchetov");
    let serviceAccount = EntityFactory.getPlan().getAccounts().findByCode('00000').get(0);
    let cacheAssociatedAccounts = {};

    for (let posting of currentDocument.getPostings()){         
        addMonetaryАssetsPosting(posting, true);
        addMonetaryАssetsPosting(posting, false);
    }

    function addMonetaryАssetsPosting(posting, isDb){
        let sourceAccount = isDb ? posting.getDebit() : posting.getCredit();
        let sourceAccountCode = sourceAccount.getCode();
        
        if (!(sourceAccountCode in cacheAssociatedAccounts)) { //временная жесть, чтоб хоть как-то работало:                                      //должно быть так:
            let recAssociatedAccount = EntityFactory.getCatalogs().get(MODULEMNEMO + ".SootvetstviyaSchetov").findByCode(sourceAccountCode)?.[0]; //catAssociatedAccounts.findByCode(sourceAccountCode)?.[0];
            let schet17 = recAssociatedAccount?.get(MODULEMNEMO + ".SootvetstviyaSchetov.Schet17");
            let schet18 = recAssociatedAccount?.get(MODULEMNEMO + ".SootvetstviyaSchetov.Schet18");
            cacheAssociatedAccounts[sourceAccountCode] = {schet17, schet18};
        }
        let schet17 = cacheAssociatedAccounts[sourceAccountCode]?.schet17;
        let schet18 = cacheAssociatedAccounts[sourceAccountCode]?.schet18;
        
        let ekrAnalyticNumber = getAnalyticNumber(sourceAccount, MODULEMNEMO + '.' + 'KOSGUEKR');
         
        if (!schet17 || !schet18 || ekrAnalyticNumber == null) {
            return;
        }
        let ekr = sourceAccount.getAnalytics().get(ekrAnalyticNumber)?.getCode();        

        isOutlayEkr = ekr.match(/^5(?!10).*|^[238].*/);

        let obj = getObjFromPosting(posting);
        if (isOutlayEkr == isDb) { //расходы по дебету или доходы по кредиту с минусом. Прямые операции с плюсом
            obj.value = obj.value * -1;           
            swapObjProperties(obj, ['debitKps', 'creditKps'], ['debitKosgu', 'creditKosgu']);
        }

        if (isOutlayEkr) {
            obj.credit = fillAccountByAnalytics(schet18, sourceAccount);
            obj.debit = serviceAccount;
            obj.debitKps = "0".repeat(17);
            obj.debitKosgu = "000";
        } else {
            obj.debet = fillAccountByAnalytics(schet17, sourceAccount);
            obj.credit = serviceAccount;
            obj.creditKps = "0".repeat(17);
            obj.creditKosgu = "000";
        }
        
        currentDocument.addPosting(createPostingFromObj(obj));
    }    
}

// Определение связанного счета из справочника "Соответствия счетов" по объекту счета и мнемо интересующего поля из справочника
//SchetAmortizacii, SchetAvansa, SchetVlozheniii, SchetObesceneniya, Schet17, Schet18, SchetZatrat, SchetZabalansovyii
// fillAnalyticsFromInitialAccount - можно перенести аналитики с исходного счёта на связанный счёт
// resultValidate - если передать сюда currentDocument.validate(), то он обработает ошибку, если не найден связанный счёт
function getLinkedAccount(initialAccount, linkedMnemo, fillAnalyticsFromInitialAccount = false, resultValidate) {

    const linkedNames = {SchetAmortizacii   : 'амортизации', 
                         SchetAvansa        : 'аванса', 
                         SchetVlozheniii    : 'вложений', 
                         SchetObesceneniya  : 'обесценения', 
                         Schet17            : '17', 
                         Schet18            : '18', 
                         SchetZatrat        : 'затрат', 
                         SchetZabalansovyii : 'забалансовый'}

    function addError(msg) {
        if (resultValidate){
            resultValidate.addValueError(msg);
        }
    }
     
    function clearResultValidate() {
        if (resultValidate){
            if (!resultValidate.hasErrors() && !resultValidate.hasValueErrors()) {
                resultValidate = false;
            }
        }
    }
    
    if (initialAccount) {
        let catalogRec = EntityFactory.getCatalogs().get(MODULEMNEMO + '.SootvetstviyaSchetov').findByCode(initialAccount.getCode())[0];
        if (catalogRec){
            let result = catalogRec.get(MODULEMNEMO + '.SootvetstviyaSchetov.' + linkedMnemo);
            if (result) {
                if (fillAnalyticsFromInitialAccount){
                    if (typeof fillAnalyticsFromInitialAccount !== 'object') {
                        fillAnalyticsFromInitialAccount = initialAccount
                    }
                    fillAccountByAnalytics(result, fillAnalyticsFromInitialAccount);
                }
                clearResultValidate();
                return result;
            }
        }
        addError('Не задан счет ' + linkedNames[linkedMnemo] + ' для счета: ' + initialAccount.getCode());
    }
    clearResultValidate();
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
    if (account && sourceAccount) {
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
}

//функция заполнения аналитик у счета. В качестве параметров выступают счет, мнемо аналитики и объект-значение 
function SetAnaliticInAccount(account, mnemoAnalitic, ObjVal) {
    let mnmAn = MODULEMNEMO + '.' + mnemoAnalitic;
    let accountCode = account.getCode();
    
    for (let count = 0; count < MAXANALYTICSCOUNT; count++) {
        let accountAnalyticMnemo = EntityFactory.getPlan().getAccounts().getAnalyticMnemo(accountCode, count);
        if (accountAnalyticMnemo == mnmAn) {
            account.put(count, ObjVal);
        }
    }
    
    return account;
}

//функция получения аналитики из счета. В качестве параметров выступают счет и мнемо аналитики 
function getAnaliticFromAccount(account, mnemoAnalitic) {
    let mnmAn = MODULEMNEMO + '.' + mnemoAnalitic;
    let accountCode = account.getCode();
    
    for (let count = 0; count < MAXANALYTICSCOUNT; count++) {
        let accountAnalyticMnemo = EntityFactory.getPlan().getAccounts().getAnalyticMnemo(accountCode, count);
        if (accountAnalyticMnemo == mnmAn) {
            return account.get(count);
        }
    }        
}

//для postActivate докментов движения ТМЦ
//если значения нет в аналитике счета - заменяем нулевым значением (по умолчанию)
function getValOrZeroVal(sh, dictName, zeroVal) {
    let val = getAnaliticFromAccount(sh, dictName);
    if (!val) {
        val = zeroVal;
    }     
    return val;
}