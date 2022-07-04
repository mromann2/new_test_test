const DefaultPostingProperties = {
    p_KFO: new Property("kfo", "KVFO", PostingMethods.setProperty, fGetTableEnumValue),
    p_JOURNAL: new Property(null, null, PostingMethods.setJournals, fGetPriorityJournal), 
    p_RASOPER: new Property("rasOper", "RasshifrovkaOperacii", PostingMethods.setProperty, fGetTableRequisite),
    p_KOLVO: new Property("kolvo", "Kolichestvo", PostingMethods.setProperty, fGetTableRequisite),
    p_CENA: new Property("cena", "Cena", PostingMethods.setProperty, fGetTableRequisite),
    p_VNEPERIOD: new Property("vnePeriod", null, PostingMethods.setProperty, fGetTableRequisite),

    p_DEBET: new Property(null, "Debet", PostingMethods.setDebit, fGetTableRequisite),
    p_KPSDb: new Property("kps", "KPSDb", PostingMethods.setDebitProperty, fGetTableRequisiteCode),
    p_KOSGUDb: new Property("kosgu", null, PostingMethods.setDebitProperty, fGetKosguByDbEkrProperty),
    p_KOSGUEKRDb: new Property("kosguEkr", "KOSGUDb", PostingMethods.setDebitProperty, fGetTableRequisiteCode),

    p_KREDIT: new Property(null, "Kredit", PostingMethods.setCredit, fGetTableRequisite),
    p_KPSKr: new Property("kps", "KPSKr", PostingMethods.setCreditProperty, fGetTableRequisiteCode),
    p_KOSGUKr: new Property("kosgu", null, PostingMethods.setCreditProperty, fGetKosguByKrEkrProperty),
    p_KOSGUEKRKr: new Property("kosguEkr", "KOSGUKr", PostingMethods.setCreditProperty, fGetTableRequisiteCode),

    p_VALUE:  new Property(null, "Summa", PostingMethods.setValue, fGetTableRequisite),
    p_COMMENT: new Property(null, "Operaciya", PostingMethods.setComment, fGetOperationName)
};

const NdsPostingProperties = {
    __proto__: DefaultPostingProperties,
    
    p_DEBET: new Property(null, "21011", PostingMethods.setDebit, fGetAccountByCode, true),
    p_KPSDb: new Property("kps", "KPSKr", PostingMethods.setDebitProperty, fGetTableRequisiteCode),
    p_KOSGUEKRDb: new Property("kosguEkr", null, PostingMethods.setDebitProperty, fGetDbKosguByDbAccountProperty),
    
    p_KREDIT: new Property(null, "30304", PostingMethods.setCredit, fGetAccountByCode, true),
    p_KPSKr: new Property("kps", "KPSDlyaScheta334", PostingMethods.setCreditProperty, fGetHeadRequisiteCode, true),
    p_KOSGUEKRKr: new Property("kosguEkr", null, PostingMethods.setCreditProperty, fGetKrKosguByKrAccountProperty),
    
    p_VALUE: new Property(null, "SummaNDS", PostingMethods.setValue, fGetTableRequisite)    
};

//const TestPostingProperties = {
//    p_DEBET: new Property(null, "21011", PostingMethods.setDebit, fGetAccountByCode, true)
//};