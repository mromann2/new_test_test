//Константы для свойств проводки
const KFO = 'kfo'; // КВФО
const KPS = 'kps'; // КПС
const KOSGU = 'kosgu'; // КОСГУ
const KOSGUEKR = 'kosguEKR'; // КОСГУ (ЭКР)
const RASOPER = 'rasOper'; // Расшифровка операции
const KOLVO = 'kolvo'; // Количесвто
const CENA = 'cena'; // Цена
const VNEPERIOD = 'vnePeriod'; // Межрасчетный период
const JOURNAL = 'journal'; // Номер журнала


/*function createPostingmnemoDoc(mnemoDoc) {
    return null;
}*/

// Операция проведения для табличной части со стандартными реквизитами
/*function createPostingWithProps(mnemoDoc) {
    
    return null;
}*/

// Определение в какой журнал попадет проводка (происходит сравнение приоритов журналов операций счета Дт и Кт. Диапазон 1-9 (1 - самый высокий приоритет))
function getPriorityJournal(debetJornal, creditJornal) {
    let debetJornalPrioritet = debetJornal.get('TestovoePrilozhenie.Zhurnaly.Prioritet');
    let creditJornalPrioritet = creditJornal.get('TestovoePrilozhenie.Zhurnaly.Prioritet');
    
    if (debetJornalPrioritet < creditJornalPrioritet)
        return debetJornal.getCode();
    else 
        return creditJornal.getCode();
}