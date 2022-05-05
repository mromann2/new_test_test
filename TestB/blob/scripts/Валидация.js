//Проверка документа на полное заполнение
function notValid(currentDocument) { 
    let resultValidate = currentDocument.validate();
 
    if (!currentDocument.getRows().size()){
        resultValidate.addValueError('Не заполнена табличная часть документа.');
    }
    
    if (resultValidate.hasErrors() || resultValidate.hasValueErrors() ) 
        return  resultValidate;
}


//Контроль проводок при проведении
//Вызывается в алгоритме проведения перед установкой даты проводки
function hasNotValidPostings(currentDocument) {
    
    let resultPostingValidate = currentDocument.validate();
    
    //Проверка наличия проводок
    if(!currentDocument.getPostings().size()){
        resultPostingValidate.addValueError('Проведение невозможно: не сформировано ни одной проводки.');
    }
    for (let postingRec of currentDocument.getPostings()){

        let debitAccountCode = postingRec.getDebit().getCode();
        let creditAccountCode = postingRec.getCredit().getCode();
    
        // 1. Пустой Дебет и/или Кредит
        if (debitAccountCode == null || creditAccountCode == null){
            resultPostingValidate.addValueError('Проведение невозможно: не указан счет дебета или счет кредита.');
        }
        // 2. Пустой КПС дебет или КПС кредит или КВФО
        if (!postingRec.getProperty(KFO))
            resultPostingValidate.addValueError('Проведение невозможно: не указан КВФО.');
        if (!postingRec.getDebitProperty(KPS))
            resultPostingValidate.addValueError('Проведение невозможно: не указан КПС счета дебета.');
        if (!postingRec.getCreditProperty(KPS))
            resultPostingValidate.addValueError('Проведение невозможно: не указан КПС счета кредита.');
        // 3. Комбинация Баланса и забаланса
        let debitBalance = debitAccountCode.length >= 5 && !debitAccountCode.includes('.');
        let creditBalance = creditAccountCode.length >= 5 && !creditAccountCode.includes('.');
        if (debitAccountCode != '00000' && creditAccountCode != '00000' && debitBalance != creditBalance)
            resultPostingValidate.addValueError('Проведение невозможно: не допускается комбинация балансового (' + (debitBalance ? debitAccountCode : creditAccountCode) + ') и забалансового (' + (!creditBalance ? creditAccountCode : debitAccountCode) + ') счетов.');
        // 4. Сумма=0 и кол-во =0
        if ((!postingRec.getValue() || postingRec.getValue() == 0) && (!postingRec.getProperty(KOLVO) || postingRec.getProperty(KOLVO) == 0))
            resultPostingValidate.addValueError('Проведение невозможно: сумма и/или количество отсутствуют либо равны нулю.');
        // 5. Не заполнен № журнала операций (основной)
        if (!postingRec.getProperty(JOURNAL))
            resultPostingValidate.addValueError('Проведение невозможно: у счетов ' + debitAccountCode + ' и ' + creditAccountCode + ' отсутствуют номера журналов.');
        // 6. Какая то аналитика по дебету или кредиту не заполнена
        if (!resultPostingValidate.hasErrors() && !resultPostingValidate.hasValueErrors() ){
            if(postingRec.getDebit())
                haveAllAnalitics(postingRec.getDebit(), resultPostingValidate);
            if(postingRec.getCredit())
                haveAllAnalitics(postingRec.getCredit(), resultPostingValidate);
        }
    }
    
    if (resultPostingValidate.hasErrors() || resultPostingValidate.hasValueErrors() )
        return  resultPostingValidate;
}

//Контроль заполнения аналитик у счетов
function haveAllAnalitics(postingAccount, resultPostingValidate) {
    
    let analytics = postingAccount.getAnalytics();
    let postingAccountCode = postingAccount.getCode();
    
    if(!analytics.size){
        resultPostingValidate.addValueError('Проведение невозможно: не заданы аналитики для счета ' + postingAccountCode);
    } else {
        let sourceMap = new Map();
        for (let numberAnalitic of analytics.keySet()) {
            let mnemoAnalitic = EntityFactory.getPlan().getAccounts().getAnalyticMnemo(postingAccountCode, numberAnalitic);
            let valueAnalitic = analytics.get(numberAnalitic);
            sourceMap.set(mnemoAnalitic, valueAnalitic);
        }
        for (let count = 0; count < MAXANALYTICSCOUNT; count++) {
            let mnemoAnaliticFromPlan = EntityFactory.getPlan().getAccounts().getAnalyticMnemo(postingAccountCode, count);
            if ((mnemoAnaliticFromPlan && mnemoAnaliticFromPlan != '') && !sourceMap.has(mnemoAnaliticFromPlan)) {
                resultPostingValidate.addValueError('Проведение невозможно: для счета ' + postingAccountCode + ' не задана аналитика ' + (count + 1));
            }
        }
    }
    return resultPostingValidate;
}