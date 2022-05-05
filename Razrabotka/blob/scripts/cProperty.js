class Property {
    constructor(name, source, method, valueType){
        this.name = name;
        this.source = source;
        this.method = method;
        this.valueType = valueType;
    }
    
    getValue(tableRec, documentMnemo){
        return this.value ?? this.getValueByType(tableRec, documentMnemo);
    }
    
    getValueByType(tableRec, documentMnemo){
        if (this.source == null) return;
        
        switch (this.valueType){
            case ValueTypes.requisite:
                return this.getRequisite(tableRec, documentMnemo);
            case ValueTypes.enumValue:
                return this.getEnumValue(tableRec, documentMnemo);
            case ValueTypes.code:
                return this.getCode(tableRec, documentMnemo);
            case ValueTypes.kosgu:
                return this.getCode(tableRec, documentMnemo).slice(0, 3);
            case ValueTypes.operationName:
                return this.getRequisite(tableRec, documentMnemo)?.get(MODULEMNEMO + '.Operacii.PolnoeNaimenovanie');
            case ValueTypes.journal:
                let debet = this.source.properties.p_DEBET.getValue(tableRec, documentMnemo);
                let kredit = this.source.properties.p_KREDIT.getValue(tableRec, documentMnemo);
                return this.getPriorityJournal(debet, kredit)[0];
            case ValueTypes.test:
                return this.name + "|" + this.source + "|" + this.method + "|" + this.valueType + "|" + documentMnemo;
        }
    }
    
    getRequisite(tableRec, documentMnemo){
        return tableRec.get(documentMnemo + ".tr." + this.source);
    }
    
    getEnumValue(tableRec, documentMnemo){
        return tableRec.get(documentMnemo + ".tr." + this.source)[0];
    }
    
    getCode(tableRec, documentMnemo){
        return this.getRequisite(tableRec, documentMnemo).getCode();
    }

    getPriorityJournal(debet, credit) {
        let debetJournal = debet.getJournal();
        let creditJournal = credit.getJournal();
        if (debetJournal || creditJournal) {
            let debetJornalPrioritet = debetJournal ? debetJournal.get(MODULEMNEMO + '.Zhurnaly.Prioritet') : 10;
            let creditJornalPrioritet = creditJournal ? creditJournal.get(MODULEMNEMO + '.Zhurnaly.Prioritet') : 10;
            if (debetJornalPrioritet == creditJornalPrioritet) {
                return [debetJournal.getCode(), ''];
            }
            if (debetJornalPrioritet < creditJornalPrioritet) {
                return [debetJournal.getCode(), creditJournal?.getCode()];
            } else {
                return [creditJournal.getCode(), debetJournal?.getCode()];
            }
        } else {
            return ['', ''];
        }
    }

}
