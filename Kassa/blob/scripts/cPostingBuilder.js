class PostingBuilderWithCreatePostingWithProps {
    constructor(document){
        this.document = document; 
        this.hrMnemo = document.getMnemo() + '.hr.';
        this.trMnemo = document.getMnemo() + '.tr.';
    }
    
    checkCondition(tableRec) {
        return true;
    }
    
    getObj(tableRec) {
        return {};
    }
    
    build(tableRec){
        if (!this.checkCondition(tableRec)){
            return;
        }
        
        let currentDocument = this.document;
        this.posting = createPostingWithProps(Object.assign(this.getObj(tableRec), {currentDocument, tableRec}));
        return this.posting;
    }   
}

class DefaultActivator {
    constructor(document, ...postingBuilders) {
        this.document = document;
        this.hrMnemo = document.getMnemo() + '.hr.';
        this.trMnemo = document.getMnemo() + '.tr.';
        
        this.postingBuilders = [new PostingBuilderWithCreatePostingWithProps(document)];
        if (postingBuilders.length) {
            this.postingBuilders.push(...postingBuilders);
        }
    }
    
    beforeActivate() {
        this.validationResult = notValid(this.document);
    }
    
    run() {
        this.beforeActivate();
        if (this.validationResult){
            return this.validationResult;
        }
  
        for (let tableRec of this.document.getRows()){
            for (let builder of this.postingBuilders) {
                if (builder.build(tableRec)){
                    this.document.addPosting(builder.posting);
                }
            }
        }


        this.afterActivate();

        if (this.validationResult){
            return this.validationResult;
        } 
        
        this.document.save();
    }
    
    afterActivate() {
        addMonetaryАssetsPostings(this.document);

        this.document.setExecuted();
        this.document.setOperationSum(getCalculatedSum(this.document, this.trMnemo + 'Summa'));

        this.validationResult = hasNotValidPostings(this.document)
    }
}

function getObjFromPosting(posting) {
    let obj = {};
    
    obj.kfo = posting.getProperty(KFO);
    
    obj.debit = posting.getDebit();
    obj.debitKps = posting.getDebitProperty(KPS);
    obj.debitKosgu = posting.getDebitProperty(KOSGUEKR);
            
    obj.credit = posting.getCredit();
    obj.creditKps = posting.getCreditProperty(KPS);
    obj.creditKosgu = posting.getCreditProperty(KOSGUEKR);

    obj.summa = posting.getValue();
    obj.comment = posting.getComment();

    obj.kolvo = posting.getProperty(KOLVO);
    obj.rasOper = posting.getProperty(RASOPER);
    obj.cena = posting.getProperty(CENA);
    obj.vnePeriod = posting.getProperty(VNEPERIOD);
    obj.dataUcheta = posting.getProperty(ACCOUNTINGDATE);

    return obj;
}
































class PostingBuilder {
    constructor(document, properties = DefaultPostingProperties){
        this.document = document;       
        this.properties = properties;
    }
    
    checkCondition(tableRec) {
        return true;
    }
    
    build(tableRec){
        if (!checkCondition(tableRec)){
            return;
        }
        
        let posting = EntityFactory.createPosting();
       
        for (let property in this.properties){
            this.setProperty(this.properties[property], posting, tableRec);
        }
        
        this.posting = posting;
        return this.posting;
    }
    
    setProperty(property, posting, tableRec){
        let value = property.getValue(tableRec, this.document, this.properties);    
        if (value == null) return;
        
        switch(property.method){
            case PostingMethods.setProperty:
                posting.setProperty(property.name, value);
                break;
            case PostingMethods.setDebit:
                posting.setDebit(value);
                break;
            case PostingMethods.setDebitProperty:
                posting.setDebitProperty(property.name, value);
                break;
            case PostingMethods.setCredit:
                posting.setCredit(value);
                break;
            case PostingMethods.setCreditProperty:
                posting.setCreditProperty(property.name, value);
                break;
            case PostingMethods.setValue:
                posting.setValue(value);
                break;
            case PostingMethods.setComment:
                posting.setComment(value);
                break;
            case PostingMethods.setJournals: //возможно, стоит разбить на 2 разных свойства
                value[0] != '' && posting.setProperty("journal", value[0]);
                value[1] != '' && posting.setProperty("dopJournal", value[1]);
                break;
        }
    }
}