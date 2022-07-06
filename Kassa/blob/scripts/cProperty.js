class Property {
    constructor(name, source, method, getValueFunction, bCacheValue = false){
        this.name = name;
        this.source = source;
        this.method = method;
        this.getValueFunction = getValueFunction;
        this.bCacheValue = bCacheValue;
    }
    
    getValue(tableRec, document, properties){
        let result = this.value ?? this.getValueFunction?.(this.source ?? properties, tableRec, document);
        if (this.bCacheValue){
            this.value = result;
        }
        return result;
    }
}