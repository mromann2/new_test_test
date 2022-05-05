class PostingBuilder {
    constructor(documentMnemo){
        this.posting = EntityFactory.createPosting();
        this.documentMnemo = documentMnemo;
        
        this.properties = {
            p_KFO: new Property("kfo", "KVFO", PostingMethods.setProperty, ValueTypes.enumValue),
            p_JOURNAL: new Property("journal", this, PostingMethods.setProperty, ValueTypes.journal),
            p_RASOPER: new Property("rasOper", "RasshifrovkaOperacii", PostingMethods.setProperty, ValueTypes.requisite),
            p_KOLVO: new Property("kolvo", "Kolichestvo", PostingMethods.setProperty, ValueTypes.requisite),
            p_CENA: new Property("cena", "Cena", PostingMethods.setProperty, ValueTypes.requisite),
            p_VNEPERIOD: new Property("vnePeriod", null, PostingMethods.setProperty, ValueTypes.requisite),

            p_DEBET: new Property(null, "Debet", PostingMethods.setDebit, ValueTypes.requisite),
            p_KPSDb: new Property("kps", "KPSDb", PostingMethods.setDebitProperty, ValueTypes.code),
            p_KOSGUDb: new Property("kosgu", "KOSGUDb", PostingMethods.setDebitProperty, ValueTypes.kosgu),
            p_KOSGUEKRDb: new Property("kosguEkr", "KOSGUDb", PostingMethods.setDebitProperty, ValueTypes.code),

            p_KREDIT: new Property(null, "Kredit", PostingMethods.setCredit, ValueTypes.requisite),
            p_KPSKr: new Property("kps", "KPSKr", PostingMethods.setCreditProperty, ValueTypes.code),
            p_KOSGUKr: new Property("kosgu", "KOSGUKr", PostingMethods.setCreditProperty, ValueTypes.kosgu),
            p_KOSGUEKRKr: new Property("kosguEkr", "KOSGUKr", PostingMethods.setCreditProperty, ValueTypes.code),

            p_VALUE:  new Property(null, "Summa", PostingMethods.setValue, ValueTypes.requisite),
            p_COMMENT: new Property(null, "Operaciya", PostingMethods.setComment, ValueTypes.operationName)
        };
    }
    
    build(tableRec){
        for (let property in this.properties){
            this.setProperty(this.properties[property], tableRec);
        }
        
        return this.posting;
    }
    
    setProperty(property, tableRec){
        let value = property.getValue(tableRec, this.documentMnemo);
        if (value == null) return;
        
        switch(property.method){
            case PostingMethods.setProperty:
                this.posting.setProperty(property.name, value);
                break;
            case PostingMethods.setDebit:
                this.posting.setDebit(value);
                break;
            case PostingMethods.setDebitProperty:
                this.posting.setDebitProperty(property.name, value);
                break;
            case PostingMethods.setCredit:
                this.posting.setCredit(value);
                break;
            case PostingMethods.setCreditProperty:
                this.posting.setCreditProperty(property.name, value);
                break;
            case PostingMethods.setValue:
                this.posting.setValue(value);
                break;
            case PostingMethods.setComment:
                this.posting.setComment(value);
                break;
        }
    }
}

