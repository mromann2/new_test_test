//Константы для свойств проводки
const KFO = 'kfo'; // КВФО
const KPS = 'kps'; // КПС
const KOSGU = 'kosgu'; // КОСГУ
const KOSGUEKR = 'kosguEkr'; // КОСГУ(ЭКР)
const RASOPER = 'rasOper'; // Расшифровка операции
const KOLVO = 'kolvo'; // Количесвто
const CENA = 'cena'; // Цена
const VNEPERIOD = 'vnePeriod'; // Межрасчетный период
const JOURNAL = 'journal'; // Основной журнал
const DOPJOURNAL = 'dopJournal'; // Дополнительный журнал операций
const ACCOUNTINGDATE = 'accountingDate'; // Дата учета

const MAXANALYTICSCOUNT = '4'; // Максимальное кол-во аналитик, встречаемое у счетов
const MODULEMNEMO = 'TestKBB'; // Мнемоника модуля


const ValueTypes = {requisite: "requisite", code: "code", enumValue: "enumValue", kosgu: "kosgu", journal: "journal", test: "test"}

const PostingMethods = {setProperty: "setProperty", 
                        setDebit: "setDebit", setDebitProperty: "setDebitProperty",
                        setCredit: "setCredit", setCreditProperty: "setCreditProperty",
                        sevValue: "sevValue", setComment: "setComment"}
                    
const OSCenaLimits = [
    {date: new Date(2000,1,1), minLimit: 1000, maxLimit: 10000},
    {date: new Date(2009,1,1), minLimit: 3000, maxLimit: 20000},
    {date: new Date(2011,1,1), minLimit: 3000, maxLimit: 40000},
    {date: new Date(2018,1,1), minLimit: 10000, maxLimit: 100000},
]
