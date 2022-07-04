function add1718(currentDocument){
    
    let catAssociatedAccounts = EntityFactory.getCatalogs().get(MODULEMNEMO + ".SootvetstviyaSchetov");
    
    for (let posting of currentDocument.getPostings()){
        
        for (let accountSide of ["Debit", "Credit"]){ //так надо(не через getDebit(), getCredit). Смотри ниже
            let sourceAccount = accountSide == "Debit" ? posting.getDebit() : posting.getCredit(); 
            
            let recAssociatedAccount = catAssociatedAccounts.findByCode(sourceAccount.getCode())?.[0];
            let schet17 = recAssociatedAccount?.get("Kassa.SootvetstviyaSchetov.Schet17");
            let schet18 = recAssociatedAccount?.get("Kassa.SootvetstviyaSchetov.Schet18");
            
            let serviceAccount = EntityFactory.getPlan().getAccounts().findByCode('00000').get(0);
            let ekrAnalyticNumber = getAnalyticNumber(sourceAccount, MODULEMNEMO + '.' + 'KOSGU');

            if (schet17 && schet18 && serviceAccount && ekrAnalyticNumber != null){
                let ekr = sourceAccount.getAnalytics().get(ekrAnalyticNumber)?.getCode();

                if (ekr){
                    let newPosting = EntityFactory.createPosting();
                    let valueFactor = 1;
                    
                    if (ekr.match(/^5(?!10).*|^[238].*/)) { //RegExp: ЭКР начинается с 5, но не продолжается 10(то есть, не 510), либо начинается с 2, 3, 8
                        newPosting.setDebit(serviceAccount);
                        newPosting.setCredit(fillAccountByAnalytics(schet18, sourceAccount));
                        
                        valueFactor = accountSide == "Debit" ? -1 : 1;
                    } else {
                        newPosting.setDebit(fillAccountByAnalytics(schet17, sourceAccount));
                        newPosting.setCredit(serviceAccount);
                        
                        valueFactor = accountSide == "Credit" ? -1 : 1;                       
                    }
                    
                    newPosting.setValue(posting.getValue() * valueFactor);
                    posting.getProperty(KFO) && newPosting.setProperty(KFO, posting.getProperty(KFO));
                                       
                    getAccountProperty(accountSide, posting, KPS) &&
                    newPosting.setDebitProperty(KPS, getAccountProperty(accountSide, posting, KPS));
                    
                    getAccountProperty(accountSide, posting, KOSGU) &&
                    newPosting.setDebitProperty(KOSGU, getAccountProperty(accountSide, posting, KOSGU));
            
                    getAccountProperty(accountSide, posting, KOSGUEKR) &&
                    newPosting.setDebitProperty(KOSGUEKR, getAccountProperty(accountSide, posting, KOSGUEKR));
                    
                    getAccountProperty(invertSide(accountSide), posting, KPS) &&
                    newPosting.setCreditProperty(KPS, getAccountProperty(invertSide(accountSide), posting, KPS));
                    
                    getAccountProperty(invertSide(accountSide), posting, KOSGU) &&
                    newPosting.setCreditProperty(KOSGU, getAccountProperty(invertSide(accountSide), posting, KOSGU));
                    
                    getAccountProperty(invertSide(accountSide), posting, KOSGUEKR) &&
                    newPosting.setCreditProperty(KOSGUEKR, getAccountProperty(invertSide(accountSide), posting, KOSGUEKR));  

                    let arrJournals = ['',''];
                    arrJournals = getPriorityJournal(newPosting.getDebit(), newPosting.getCredit());

                    if (arrJournals[0] != '') {
                        newPosting.setProperty(JOURNAL, arrJournals[0]);
                    }
                    if (arrJournals[1] != '') {
                        newPosting.setProperty(DOPJOURNAL, arrJournals[1]);
                    }          
                    
                    posting.getProperty(KOLVO) &&
                    newPosting.setProperty(KOLVO, posting.getProperty(KOLVO));
                    
                    posting.getComment() &&
                    newPosting.setComment(posting.getComment());
            
                    posting.getProperty(RASOPER) &&
                    newPosting.setProperty(RASOPER, posting.getProperty(RASOPER));
            
                    posting.getProperty(CENA) &&
                    newPosting.setProperty(CENA, posting.getProperty(CENA));
            
                    posting.getProperty(VNEPERIOD) &&
                    newPosting.setProperty(VNEPERIOD, posting.getProperty(VNEPERIOD));
            
                    posting.getProperty(ACCOUNTINGDATE) &&
                    newPosting.setProperty(ACCOUNTINGDATE, posting.getProperty(ACCOUNTINGDATE));
                    currentDocument.addPosting(newPosting);
                }
            }       
        }
    }
}

function getAccountProperty(side, posting, property) {
    return side == "Debit" ? posting.getDebitProperty(property) : posting.getCreditProperty(property);
}

function invertSide(side) {
    return side == "Debit" ? "Credit" : "Debit";
}

function getAnalyticNumber(account, analyticMnemo) {
    let accountCode = account.getCode();

    for (let analyticNumber of account.getAnalytics().keySet()) {
        if (analyticMnemo == EntityFactory.getPlan().getAccounts().getAnalyticMnemo(accountCode, analyticNumber)) {
            return analyticNumber;
        }
    }
}
//        addMonetaryАssetsPosting
//        addFinancialGuaranteesPosting
