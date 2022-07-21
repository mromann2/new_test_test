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
    return createPostingFromObj(tempSetObjFromObj(obj));
}

function tempSetObjFromObj(obj) {
    let tableRec = obj.tableRec;
    let trMnemo = obj.currentDocument.getMnemo() + '.tr.';

    if (!('kfo' in obj) && tableRec.get(trMnemo + 'KVFO')?.[0]) {
        obj['kfo'] = tableRec.get(trMnemo + 'KVFO')[0];
    }

    if (!('debit' in obj) && tableRec.get(trMnemo + 'Debet')) {
        obj['debit'] = tableRec.get(trMnemo + 'Debet');
    }
    
    if (!('debitKps' in obj) && tableRec.get(trMnemo + 'KPSDb')?.getCode()){
        obj['debitKps'] = tableRec.get(trMnemo + 'KPSDb').getCode();
    }
    
    if (!('debitKosgu' in obj)) {
        if (obj.debit && getKOSGUDebit(obj.debit)){
            obj['debitKosgu'] = getKOSGUDebit(obj.debit);
        } else if(tableRec.get(trMnemo + 'KOSGUDb')?.getCode()) {
            obj['debitKosgu'] = tableRec.get(trMnemo + 'KOSGUDb').getCode();
        }
    }
    
    if (!('credit' in obj) && tableRec.get(trMnemo + 'Kredit')) {
        obj['credit'] = tableRec.get(trMnemo + 'Kredit');
    }
    
    if (!('creditKps' in obj) && tableRec.get(trMnemo + 'KPSKr')?.getCode()){
        obj['creditKps'] = tableRec.get(trMnemo + 'KPSKr').getCode();
    }
    
    if (!('creditKosgu' in obj)){
        if (obj.credit && getKOSGUCredit(obj.credit)){
            obj['creditKosgu'] = getKOSGUCredit(obj.credit);
        } else if (tableRec.get(trMnemo + 'KOSGUKr')?.getCode()) {
            obj['creditKosgu'] = tableRec.get(trMnemo + 'KOSGUKr').getCode();
        }
    }

    if (!('summa' in obj)){
        obj['summa'] = tableRec.get(trMnemo + 'VsegoSNDS') ?? tableRec.get(trMnemo + 'Summa') ?? '0';
    }

    if (!('kolvo' in obj)){
        obj['kolvo'] = tableRec.get(trMnemo + 'Kolichestvo') ?? '0';
    }

    if (!('comment' in obj) && tableRec.get(trMnemo + 'Operaciya')){
        obj['comment'] = obj.tableRec.get(trMnemo + 'Operaciya').get(MODULEMNEMO + '.Operacii.PolnoeNaimenovanie');
    }

    if(!('rasOper' in obj) && tableRec.get(trMnemo + 'RasshifrovkaOperacii')){
        obj['rasOper'] = tableRec.get(trMnemo + 'RasshifrovkaOperacii');
    }

    if(!('cena' in obj) && tableRec.get(trMnemo + 'Cena')){
        obj['cena'] = tableRec.get(trMnemo + 'Cena');
    }
    if (!('dataUcheta' in obj)) {
        obj['dataUcheta'] = '' + obj.currentDocument.get(obj.currentDocument.getMnemo() + '.hr.DataUcheta') ?? obj.currentDocument.getDate();
    }
    
    return obj;
}

function tempSetObjFromObj2(obj) {
    let tableRec = obj.tableRec;
    let trMnemo = obj.currentDocument.getMnemo() + '.tr.';

    switch (propName) {
        case "kfo":
            tableRec.get(trMnemo + 'KVFO')?.[0];
            break;
        case "debit":
            tableRec.get(trMnemo + 'Debet');
            break;
        case "debitKps":
            tableRec.get(trMnemo + 'KPSDb')?.getCode();
            break;
        case "debitKosgu":
            if (obj.debit && getKOSGUDebit(obj.debit)){
                getKOSGUDebit(obj.debit);
            } else if(tableRec.get(trMnemo + 'KOSGUDb')?.getCode()) {
                tableRec.get(trMnemo + 'KOSGUDb').getCode();
            }
            break;
        case "credit":
            tableRec.get(trMnemo + 'Kredit');
            break;
        case "creditKps":
            tableRec.get(trMnemo + 'KPSKr')?.getCode();
            break;
        case "creditKosgu":
            if (obj.credit && getKOSGUCredit(obj.credit)){
                obj['creditKosgu'] = getKOSGUCredit(obj.credit);
            } else if (tableRec.get(trMnemo + 'KOSGUKr')?.getCode()) {
                obj['creditKosgu'] = tableRec.get(trMnemo + 'KOSGUKr').getCode();
            }
            break;
        case "summa":
            tableRec.get(trMnemo + 'VsegoSNDS') ?? tableRec.get(trMnemo + 'Summa');
            break;
        case "kolvo":
            tableRec.get(trMnemo + 'Kolichestvo');
            break;
        case "creditKps":
            tableRec.get(trMnemo + 'KPSKr')?.getCode();
            break;
        case "comment":
            tableRec.get(trMnemo + 'Operaciya')?.get(MODULEMNEMO + '.Operacii.PolnoeNaimenovanie');
            break;
        case "rasOper":
            tableRec.get(trMnemo + 'RasshifrovkaOperacii');
            break;
        case "cena":
            tableRec.get(trMnemo + 'Cena');
            break;
        case "dataUcheta":
            obj.currentDocument.get(obj.currentDocument.getMnemo() + '.hr.DataUcheta') ?? obj.currentDocument.getDate();
            break;
        default:
            "х*ня";
            break;
    }
    return obj;
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


//Контроль проводок при проведении
//Вызывается в алгоритме проведения перед установкой даты проводки
function hasNotValidPostings(currentDocument) {
    
    let resultPostingValidate = currentDocument.validate();
    
    //1. Проверка наличия проводок
    if(!currentDocument.getPostings().size()){
        resultPostingValidate.addValueError('Проведение невозможно: не сформировано ни одной проводки.');
        return showErrors(resultPostingValidate);
    }
    
    for (let postingRec of currentDocument.getPostings()){

        let debitAccountCode = postingRec.getDebit().getCode();
        let creditAccountCode = postingRec.getCredit().getCode();
        let postingInfo = 'Проводка Дт ' + debitAccountCode + ' Кт ' + creditAccountCode + '. Проведение невозможно: ';

        // 2. Пустой Дебет и/или Кредит
        if (debitAccountCode == null || creditAccountCode == null){
            resultPostingValidate.addValueError('Проводка Дт ' + (debitAccountCode ? debitAccountCode : '--') + 
                ' Кт ' + (creditAccountCode ? creditAccountCode : '--') + '. Проведение невозможно: ' +  
                (!debitAccountCode ? 'Не указан счет дебета. ' : '') + 
                (!creditAccountCode ? 'Не указан счет кредита.' : ''));
            continue;
        }
        // 3. Комбинация Баланса и забаланса
        let debitBalance = debitAccountCode.length >= 5 && !debitAccountCode.includes('.');
        let creditBalance = creditAccountCode.length >= 5 && !creditAccountCode.includes('.');
        if (debitAccountCode != '00000' && creditAccountCode != '00000' && debitBalance != creditBalance){
            resultPostingValidate.addValueError(postingInfo + 'Не допускается комбинация балансового и забалансового счетов.');
            continue;
        }
        // 4. Сумма=0 и кол-во =0
        if ((!postingRec.getValue() || postingRec.getValue() == 0) && (!postingRec.getProperty(KOLVO) || postingRec.getProperty(KOLVO) == 0)){
            resultPostingValidate.addValueError(postingInfo + 'Сумма и/или количество отсутствуют либо равны нулю.');
            continue;
        }
        // 5. Не заполнен № журнала операций (основной)
        if (!postingRec.getProperty(JOURNAL)){
            resultPostingValidate.addValueError(postingInfo + 'У счетов ' + debitAccountCode + ' и ' + creditAccountCode + ' отсутствуют номера журналов.');
            continue;
        }
        // 6. Пустые КВФО, КПС, КОСГУ или описание операции
        if (!postingRec.getProperty(KFO)){
            resultPostingValidate.addValueError(postingInfo + 'Не указан КВФО.');
            continue;
        }
        if (!postingRec.getDebitProperty(KPS) || !postingRec.getCreditProperty(KPS)){
            resultPostingValidate.addValueError(postingInfo +
                (!postingRec.getDebitProperty(KPS) ? 'Не указан КПС счета дебета. ' : '') + 
                (!postingRec.getCreditProperty(KPS) ? 'Не указан КПС счета кредита.' : ''));
            continue;
        }
        if (!postingRec.getDebitProperty(KOSGU) || !postingRec.getCreditProperty(KOSGU)){
            resultPostingValidate.addValueError(postingInfo +
                (!postingRec.getDebitProperty(KOSGU) ? 'Не указан КОСГУ счета дебета. ' : '') + 
                (!postingRec.getCreditProperty(KOSGU) ? 'Не указан КОСГУ счета кредита.' : ''));
            continue;
        }
        let operation = postingRec.getComment();
        if (!operation || operation == ''){
            resultPostingValidate.addValueError(postingInfo + 'Не указано описание операции.');
            continue;
        }
        // 7. Какая то аналитика по дебету или кредиту не заполнена
        if(postingRec.getDebit())
            haveAllAnalitics(postingRec.getDebit(), resultPostingValidate);
        if(postingRec.getCredit())
            haveAllAnalitics(postingRec.getCredit(), resultPostingValidate);
    
        //Контроль заполнения аналитик у счетов
        function haveAllAnalitics(postingAccount, resultPostingValidate) {

            let analytics = postingAccount.getAnalytics();
            let postingAccountCode = postingAccount.getCode();
            let sourceMap = new Map();
            for (let numberAnalitic of analytics.keySet()) {
                let mnemoAnalitic = EntityFactory.getPlan().getAccounts().getAnalyticMnemo(postingAccountCode, numberAnalitic);
                let valueAnalitic = analytics.get(numberAnalitic);
                sourceMap.set(mnemoAnalitic, valueAnalitic);
            }
            for (let count = 0; count < MAXANALYTICSCOUNT; count++) {
                let mnemoAnaliticFromPlan = EntityFactory.getPlan().getAccounts().getAnalyticMnemo(postingAccountCode, count);
                if ((mnemoAnaliticFromPlan && mnemoAnaliticFromPlan != '') && !sourceMap.has(mnemoAnaliticFromPlan)) {
                    resultPostingValidate.addValueError(postingInfo + 'для счета ' + postingAccountCode + ' не задана аналитика ' + (count + 1));
                }
            }
            return resultPostingValidate;
        }
    }
}