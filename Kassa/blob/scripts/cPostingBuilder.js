class PostingBuilder {
    constructor(document, properties = DefaultPostingProperties){
        this.document = document;       
        this.properties = properties;
    }
    
    build(tableRec){
        let posting = EntityFactory.createPosting();
       
        for (let property in this.properties){
            this.setProperty(this.properties[property], posting, tableRec);
        }
        
        return posting;
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