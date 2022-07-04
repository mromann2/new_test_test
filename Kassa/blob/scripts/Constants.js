//Константы для свойств проводки
const KFO = MODULEMNEMO + '.accounttransaction.rq.KFO'; // КВФО
const KPS = MODULEMNEMO + '.accounttransaction.arq.KPS'; // КПС
const KOSGU = MODULEMNEMO + '.accounttransaction.arq.KOSGU'; // КОСГУ
const KOSGUEKR = MODULEMNEMO + '.accounttransaction.arq.KOSGUEKR'; // КОСГУ(ЭКР)
const RASOPER = MODULEMNEMO + '.accounttransaction.rq.RasshifrovkaOperacii'; // Расшифровка операции
const KOLVO = MODULEMNEMO + '.accounttransaction.rq.Kolichestvo'; // Количество
const CENA = MODULEMNEMO + '.accounttransaction.rq.Cena'; // Цена
const VNEPERIOD = MODULEMNEMO + '.accounttransaction.rq.MezhraschetnyiiPeriod'; // Межрасчетный период
const JOURNAL = MODULEMNEMO + '.accounttransaction.rq.ZhO'; // Основной журнал
const DOPJOURNAL = MODULEMNEMO + '.accounttransaction.rq.DopZhO'; // Дополнительный журнал операций
const ACCOUNTINGDATE = MODULEMNEMO + '.accounttransaction.rq.DataUcheta'; // Дата учета

const MAXANALYTICSCOUNT = '4'; // Максимальное кол-во аналитик, встречаемое у счетов
const MODULEMNEMO = 'Kassa';

const PostingMethods = {setProperty: "setProperty", 
                        setDebit: "setDebit", setDebitProperty: "setDebitProperty",
                        setCredit: "setCredit", setCreditProperty: "setCreditProperty",
                        setValue: "setValue", setComment: "setComment", setJournals: "setJournals"}


const pNDS = {
    "18%": 18/118,
    "18/118": 18/118,
    "10%": 10/110,
    "10/110": 10/110,
    "0%": 0,
    "без НДС": 0,
    "20%": 20/120,
    "20/120": 20/120
}