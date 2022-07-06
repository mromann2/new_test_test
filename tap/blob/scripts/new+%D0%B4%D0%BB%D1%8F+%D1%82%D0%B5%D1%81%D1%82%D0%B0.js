//// Функция создания проводки с заданными свойствами. Если свойства в объекте не указаны - используются стандартные поля из табличной части.
//// Принимает объект со следующими свойствами:
////let obj = {
////    tableRec,
////    docMnemo: ,
////    kfo: ,
////    debitKps: , 
////    debit: ,
////    debitKosgu: ,
////    creditKps: ,
////    credit: ,
////    creditKosgu: ,
////    summa: ,
////    comment: ,
////    rasOper: ,
////    kolvo: ,
////    cena: ,
////    vnePeriod: ,
////}
//
//function createPostingWithProps(obj) {
//    let posting = EntityFactory.createPosting();
//    let reqMnemo = obj.docMnemo + '.tr.';
//    let moduleMnemo = obj.docMnemo.split('.')[0];
//    
//    //КВФО
//    posting.setProperty(KFO, obj.kfo ?? obj.tableRec.get(reqMnemo + 'KVFO')[0]);
//    //Дебет
//    posting.setDebit(obj.debit ?? obj.tableRec.get(reqMnemo + 'Debet'));
//    posting.setDebitProperty(KPS, obj.debitKps ?? obj.tableRec.get(reqMnemo + 'KPSDb').getCode());
//    if (obj.debitKosgu !== undefined){
//        posting.setDebitProperty(KOSGU, obj.debitKosgu.slice(0,3));
//        posting.setDebitProperty(KOSGUEKR, obj.debitKosgu);
//    }else if (obj.debit && getKOSGUDebit(obj.debit)){
//        posting.setDebitProperty(KOSGU, getKOSGUDebit(obj.debit).slice(0,3));
//        posting.setDebitProperty(KOSGUEKR, getKOSGUDebit(obj.debit));
//    } else {
//        posting.setDebitProperty(KOSGU, obj.tableRec.get(reqMnemo + 'KOSGUDb').getCode().slice(0,3));
//        posting.setDebitProperty(KOSGUEKR, obj.tableRec.get(reqMnemo + 'KOSGUDb').getCode());
//    }
//    //Кредит
//    posting.setCredit(obj.credit ?? obj.tableRec.get(reqMnemo + 'Kredit'));
//    posting.setCreditProperty(KPS, obj.creditKps ?? obj.tableRec.get(reqMnemo + 'KPSKr').getCode());
//    if (obj.creditKosgu !== undefined){
//        posting.setCreditProperty(KOSGU, obj.creditKosgu.slice(0,3));
//        posting.setCreditProperty(KOSGUEKR, obj.creditKosgu);
//    }else if (obj.credit && getKOSGUCredit(obj.credit)){
//        posting.setCreditProperty(KOSGU, getKOSGUCredit(obj.credit).slice(0,3));
//        posting.setCreditProperty(KOSGUEKR, getKOSGUCredit(obj.credit));
//    } else {
//        posting.setCreditProperty(KOSGU, obj.tableRec.get(reqMnemo + 'KOSGUKr').getCode().slice(0,3));
//        posting.setCreditProperty(KOSGUEKR, obj.tableRec.get(reqMnemo + 'KOSGUKr').getCode());
//    }
//    //Номер журнала
//    let arrJournals = ['', ''];
//    if ((obj.debit !== undefined) && (obj.credit !== undefined)){
//        arrJournals = getPriorityJournal(obj.debit, obj.credit);
//    } else if (obj.debit !== undefined) {
//        arrJournals = getPriorityJournal(obj.debit, obj.tableRec.get(reqMnemo + 'Kredit'));
//    } else if (obj.credit !== undefined) {
//        arrJournals = getPriorityJournal(obj.tableRec.get(reqMnemo + 'Debet'), obj.credit);
//    } else {
//        arrJournals = getPriorityJournal(obj.tableRec.get(reqMnemo + 'Debet'), obj.tableRec.get(reqMnemo + 'Kredit'));
//    }
//    posting.setProperty(JOURNAL, arrJournals[0]);
//    //Сумма 
//    if (obj.summa !== undefined) {
//        posting.setValue(obj.summa);
//    } else if (obj.tableRec.get(reqMnemo + 'VsegoSNDS')){
//        posting.setValue(obj.tableRec.get(reqMnemo + 'VsegoSNDS'));
//    } else if (obj.tableRec.get(reqMnemo + 'Summa')){ 
//            posting.setValue(obj.tableRec.get(reqMnemo + 'Summa'));
//    }
//    //Комментарий
//    if (obj.comment !== undefined){
//        posting.setComment(obj.comment)
//    } else if (obj.tableRec.get(reqMnemo + 'Operaciya')){
//        posting.setComment(obj.tableRec.get(reqMnemo + 'Operaciya').get(moduleMnemo + '.Operacii.PolnoeNaimenovanie'))
//    }
//    //Расшифровка операции
//    if (obj.rasOper !== undefined){
//        posting.setProperty(RASOPER, obj.rasOper)
//    } else if (obj.tableRec.get(reqMnemo + 'RasshifrovkaOperacii')){
//        posting.setProperty(RASOPER, obj.tableRec.get(reqMnemo + 'RasshifrovkaOperacii'));
//    }
//    //Количество
//    if (obj.kolvo !== undefined){
//        posting.setProperty(KOLVO, obj.kolvo)
//    } else if (obj.tableRec.get(reqMnemo + 'Kolichestvo')){
//        posting.setProperty(KOLVO, obj.tableRec.get(reqMnemo + 'Kolichestvo'))
//    }
//    //Цена
//    if (obj.cena !== undefined){
//        posting.setProperty(CENA, obj.cena)
//    } else if (obj.tableRec.get(reqMnemo + 'Cena')){
//        posting.setProperty(CENA,obj.tableRec.get(reqMnemo + 'Cena'))
//    }
//    //Межрасчетный период
//    if (obj.vnePeriod !== undefined){
//        posting.setProperty(VNEPERIOD, obj.vnePeriod)
//    }
//    return posting;
//}
//
//
//// Определение в какой журнал попадет проводка (происходит сравнение приоритов журналов операций счета Дт и Кт. Диапазон 1-9 (1 - самый высокий приоритет))
//function getPriorityJournal(debit, credit) {
//    let debitJournal = getJournal(debit);
//    let creditJournal = getJournal(credit);
//    if (debitJournal || creditJournal) {
//        let debitJornalPrioritet = debitJournal ? debitJournal.get('Razrabotka.Zhurnaly.Prioritet') : 10;
//        let creditJornalPrioritet = creditJournal ? creditJournal.get('Razrabotka.Zhurnaly.Prioritet') : 10;
//        if (debitJornalPrioritet == creditJornalPrioritet) {
//            return [debitJournal.getCode(), ''];
//        }
//        if (debitJornalPrioritet < creditJornalPrioritet) {
//            return [debitJournal.getCode(), creditJournal?.getCode()];
//        } else {
//            return [creditJournal.getCode(), debitJournal?.getCode()];
//        }
//    } else {
//        return ['', ''];
//    }
//}
//
//
//// Определение связанного счета из справочника "Соответствия счетов" по объекту счета и мнемо интересующего поля из справочника
////SchetAmortizacii, SchetAvansa, SchetVlozheniii, SchetObesceneniya, Schet17, Schet18, SchetZatrat, SchetZabalansovyii
//function getLinkedAccount(moduleMnemo, initialAccount, linkedMnemo) {
//    let catalogRec = EntityFactory.getCatalogs().get(moduleMnemo + '.SootvetstviyaSchetov').findByCode(initialAccount.getCode())[0];
//    if (catalogRec){
//        return catalogRec.get(moduleMnemo + '.SootvetstviyaSchetov.' + linkedMnemo);
//    }
//}
//
//
//// Определение счета вложений из справочника "Соответствия счетов" по объекту счета
//function getInvestAccount(moduleMnemo, initialAccount) {
//    let catalogRec = EntityFactory.getCatalogs().get(moduleMnemo + '.SootvetstviyaSchetov').findByCode(initialAccount.getCode())[0];
//    if (catalogRec){
//        return catalogRec.get(moduleMnemo + '.SootvetstviyaSchetov.SchetVlozheniii');
//    }
//}
//
//createPostingWithProps({})
//
//
//// Расчет суммы операции по табличной части
//function getCalculatedSum(currentDocument, mnemoSumm) {
//    let summ = 0;
//    for (let tableRec of currentDocument.getRows()){
//        summ += +tableRec.get(mnemoSumm);            
//    }
//    return summ;
//}
//
//
////функция заполнения аналитик у счета. В качестве параметров выступают счет и счет-источник
//function fillAccountByAnalytics(account, sourceAccount) {
//    let maxAnalyticsCount = 3; // Максимальное кол-во аналитик, встречаемое у счетов
//    let sourceAccountCode = sourceAccount.getCode();
//    let accountCode = account.getCode();
//    let sourceMap = new Map();
//    let analytics = sourceAccount.getAnalytics();
//    for (let analyticNumber of analytics.keySet()) {
//        let analyticMnemo = EntityFactory.getPlan().getAccounts().getAnalyticMnemo(sourceAccountCode, analyticNumber);
//        let valueAnalytic = analytics.get(analyticNumber);
//        sourceMap.set(analyticMnemo, valueAnalytic);
//    }
//    for (let count = 0; count < maxAnalyticsCount; count++) {
//        let accountAnalyticMnemo = EntityFactory.getPlan().getAccounts().getAnalyticMnemo(accountCode, count);
//        if (accountAnalyticMnemo && accountAnalyticMnemo != '' && sourceMap.has(accountAnalyticMnemo)) {
//            let analyticObject = sourceMap.get(accountAnalyticMnemo);
//            account.put(count, analyticObject);
//        }
//    }
//    return account;
//}
//
//
////Проверка документа на полное заполнение
//function notValid(currentDocument) { 
//    let resultValidate = currentDocument.validate();
// 
//    if (!currentDocument.getRows().size()){
//        resultValidate.addValueError('Не заполнена табличная часть документа.');
//    }
//    
//    if (resultValidate.hasErrors() || resultValidate.hasValueErrors() ) 
//        return  resultValidate;
//}
//
//
////Контроль проводок при проведении
////Вызывается в алгоритме проведения перед установкой даты проводки
//function hasNotValidPostings(currentDocument) {
//    
//    let resultPostingValidate = currentDocument.validate();
//    
//    //Проверка наличия проводок
//    if(!currentDocument.getPostingList().size()){
//        resultPostingValidate.addValueError('Проведение невозможно: не сформировано ни одной проводки.');
//    }
//    for (let postingRec of currentDocument.getPostingList()){
//
//        let debitAccountCode = postingRec.getDebit().getCode();
//        let creditAccountCode = postingRec.getCredit().getCode();
//    
//        // 1. Пустой Дебет и/или Кредит
//        if (debitAccountCode == null || creditAccountCode == null){
//            resultPostingValidate.addValueError('Проведение невозможно: не указан счет дебета или счет кредита.');
//            return  resultPostingValidate;
//        }
//        // 2. Пустой КПС дебет или КПС кредит или КВФО
//        if (!postingRec.getProperty(KFO))
//            resultPostingValidate.addValueError('Проведение невозможно: не указан КВФО.');
//        if (!postingRec.getDebitProperty(KPS))
//            resultPostingValidate.addValueError('Проведение невозможно: не указан КПС счета дебета.');
//        if (!postingRec.getCreditProperty(KPS))
//            resultPostingValidate.addValueError('Проведение невозможно: не указан КПС счета кредита.');
//        // 3. Комбинация Баланса и забаланса
//        let debitBalance = debitAccountCode.length >= 5 && !debitAccountCode.includes('.');
//        let creditBalance = creditAccountCode.length >= 5 && !creditAccountCode.includes('.');
//        if (debitBalance != creditBalance)
//            resultPostingValidate.addValueError('Проведение невозможно: не допускается комбинация балансового (' + (debitBalance ? debitAccountCode : creditAccountCode) + ') и забалансового (' + (!creditBalance ? creditAccountCode : debitAccountCode) + ') счетов.');
//        // 4. Сумма=0 и кол-во =0
//        if ((!postingRec.getValue() || postingRec.getValue() == 0) && (!postingRec.getProperty(KOLVO) || postingRec.getProperty(KOLVO) == 0))
//            resultPostingValidate.addValueError('Проведение невозможно: сумма и/или количество отсутствуют либо равны нулю.');
//        // 5. Не заполнен № журнала операций (основной)
//        if (!postingRec.getProperty(JOURNAL))
//            resultPostingValidate.addValueError('Проведение невозможно: у счетов ' + debitAccountCode + ' и ' + creditAccountCode + ' отсутствуют номера журналов.');
//         //6. Какая то аналитика по дебету или кредиту не заполнена
//        if(postingRec.getDebit())
//            haveAllAnalitics(postingRec.getDebit(), resultPostingValidate);
//        if(postingRec.getCredit())
//            haveAllAnalitics(postingRec.getCredit(), resultPostingValidate);
//    }
//    
//    if (resultPostingValidate.hasErrors() || resultPostingValidate.hasValueErrors() )
//        return  resultPostingValidate;
//}
//
////Контроль заполнения аналитик у счетов
//function haveAllAnalitics(postingAccount, resultPostingValidate) {
//    
//    let analytics = postingAccount.getAnalytics();
//    let postingAccountCode = postingAccount.getCode();
//    
//    if(!analytics.size){
//        resultPostingValidate.addValueError('Проведение невозможно: не заданы аналитики для счета ' + postingAccountCode);
//    } else {
//        let sourceMap = new Map();
//        for (let numberAnalitic of analytics.keySet()) {
//            let mnemoAnalitic = EntityFactory.getPlan().getAccounts().getAnalyticMnemo(postingAccountCode, numberAnalitic);
//            let valueAnalitic = analytics.get(numberAnalitic);
//            sourceMap.set(mnemoAnalitic, valueAnalitic);
//        }
//        for (let count = 0; count < 3; count++) {
//            let mnemoAnaliticFromPlan = EntityFactory.getPlan().getAccounts().getAnalyticMnemo(postingAccountCode, count);
//            if ((mnemoAnaliticFromPlan && mnemoAnaliticFromPlan != '') && !sourceMap.has(mnemoAnaliticFromPlan)) {
//                resultPostingValidate.addValueError('Проведение невозможно: для счета ' + postingAccountCode + ' не задана аналитика ' + (count + 1));
//            }
//        }
//    }
//    return resultPostingValidate;
//}
//Константы для свойств проводки
const KFO = 'kfo'; // КВФО
const KPS = 'kps'; // КПС
const KOSGU = 'kosgu'; // КОСГУ
const KOSGUEKR = 'kosguEkr'; // КОСГУ(ЭКР)
const RASOPER = 'rasOper'; // Расшифровка операции
const KOLVO = 'kolvo'; // Количесвто
const CENA = 'cena'; // Цена
const VNEPERIOD = 'vnePeriod'; // Межрасчетный период
const JOURNAL = 'journal'; // Цена

const MODULEMNEMO = 'Razrabotka';
const MAXANALYTICSCOUNT = 3