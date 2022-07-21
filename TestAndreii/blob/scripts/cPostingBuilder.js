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
        
        let sum = 0;
        for (let tableRec of this.document.getRows()){
            sum += +(tableRec.get(this.trMnemo + 'VsegoSNDS') ?? tableRec.get(this.trMnemo + 'Summa'));
        }
        this.document.setOperationSum(sum);
        this.document.setExecuted();

        this.validationResult = hasNotValidPostings(this.document)
    }
}