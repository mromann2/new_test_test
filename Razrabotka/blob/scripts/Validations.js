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
        return showErrors(resultPostingValidate);
    }
    for (let postingRec of currentDocument.getPostings()){

        let debitAccountCode = postingRec.getDebit().getCode();
        let creditAccountCode = postingRec.getCredit().getCode();
        let postingInfo = 'Проводка Дт ' + debitAccountCode + ' Кт ' + creditAccountCode + '. Проведение невозможно: ';

        // 1. Пустой Дебет и/или Кредит
        if (debitAccountCode == null || creditAccountCode == null){
            let debitText = debitAccountCode ? debitAccountCode : '--';
            let creditText = creditAccountCode ? creditAccountCode : '--';
            resultPostingValidate.addValueError('Проводка Дт ' + debitText + ' Кт ' + creditText + ' . Проведение невозможно: не указан счет дебета или счет кредита.');
            continue;
        }
        // 3. Комбинация Баланса и забаланса
        let debitBalance = debitAccountCode.length >= 5 && !debitAccountCode.includes('.');
        let creditBalance = creditAccountCode.length >= 5 && !creditAccountCode.includes('.');
        if (debitAccountCode != '00000' && creditAccountCode != '00000' && debitBalance != creditBalance){
            resultPostingValidate.addValueError(postingInfo + 'не допускается комбинация балансового (' + (debitBalance ? debitAccountCode : creditAccountCode) + ') и забалансового (' + (!creditBalance ? creditAccountCode : debitAccountCode) + ') счетов.');
            continue;
        }
        // 4. Сумма=0 и кол-во =0
        if ((!postingRec.getValue() || postingRec.getValue() == 0) && (!postingRec.getProperty(KOLVO) || postingRec.getProperty(KOLVO) == 0)){
            resultPostingValidate.addValueError(postingInfo + 'сумма и/или количество отсутствуют либо равны нулю.');
            continue;
        }
        // 5. Не заполнен № журнала операций (основной)
        if (!postingRec.getProperty(JOURNAL)){
            resultPostingValidate.addValueError(postingInfo + 'у счетов ' + debitAccountCode + ' и ' + creditAccountCode + ' отсутствуют номера журналов.');
            continue;
        }
        // 2. Пустой КПС дебет или КПС кредит или КВФО
        if (!postingRec.getProperty(KFO)){
            resultPostingValidate.addValueError(postingInfo + 'не указан КВФО.');
            continue;
        }
        if (!postingRec.getDebitProperty(KPS)){
            resultPostingValidate.addValueError(postingInfo + 'не указан КПС счета дебета.');
            continue;
        }
        if (!postingRec.getCreditProperty(KPS)){
            resultPostingValidate.addValueError(postingInfo + 'не указан КПС счета кредита.');
            continue;
        }
        if (!postingRec.getDebitProperty(KOSGU)){
            resultPostingValidate.addValueError(postingInfo + 'не указан КОСГУ счета дебета.');
            continue;
        }
        if (!postingRec.getCreditProperty(KOSGU)){
            resultPostingValidate.addValueError(postingInfo + 'не указан КОСГУ счета кредита.');
            continue;
        }
        // 6. Какая то аналитика по дебету или кредиту не заполнена
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
    
    function showErrors(resultPostingValidate) {
        if (resultPostingValidate.hasErrors() || resultPostingValidate.hasValueErrors() )
            return  resultPostingValidate;
    }
    return showErrors(resultPostingValidate);
}
