//Константы для свойств проводки
const KFO = 'tap.accounttransaction.rq.KFO'; // КВФО
const KPS = 'tap.accounttransaction.arq.KPS'; // КПС
const KOSGU = 'tap.accounttransaction.arq.KOSGU'; // КОСГУ
const KOSGUEKR = 'tap.accounttransaction.arq.KOSGUEKR'; // КОСГУ (ЭКР)
const RASOPER = 'tap.accounttransaction.rq.RasshifrovkaOperacii'; // Расшифровка операции
const KOLVO = 'tap.accounttransaction.rq.Kolichestvo'; // Количесвто
const CENA = 'tap.accounttransaction.rq.Cena'; // Цена
const VNEPERIOD = 'tap.accounttransaction.rq.MezhraschetnyiiPeriod'; // Межрасчетный период
const JOURNAL = 'tap.accounttransaction.rq.ZhurnalaOperaciii'; // Номер журнала


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