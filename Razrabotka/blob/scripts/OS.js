
//аналог Lcen<3000 / Lcen>3000 из КББ
//znak = 1 менее 3000
//znak = 2 более 3000
function LcenMeneeBolee3000(currentDocument, tableRec, znak) {
    let DataPrih;
    let DataVvoda = null;
    let MinDt;
    let DOCMNEMO = currentDocument.getMnemo();
    let Sost = currentDocument.get(DOCMNEMO + '.hr.Sostoyanie');

    if (DOCMNEMO.search('NakladnyeNaVnutreneePeremeshenieOS') !== -1) {
        
        let CodeOS = tableRec.get(DOCMNEMO + '.tr.OS').getCode();
        
        //если ОС найдено в картотеке
        if (EntityFactory.getCatalogs().get(MODULEMNEMO + ".KartotekaOS").findByCode(CodeOS).size() > 0) {        
            //Получаем карточку из ОС картотеки
            let KartOS = EntityFactory.getCatalogs().get(MODULEMNEMO + ".KartotekaOS").findByCode(CodeOS).get(0);              
            DataPrih = KartOS.get(MODULEMNEMO + ".KartotekaOS.DataPrihoda");
        }
        
        //Если дата ввода в фактуре не заполнена, то берем из шапки, если состояние = Ввод в эксплуатацию
        if (!(tableRec.get(DOCMNEMO + '.tr.DataVvodaVEkspluataciiu')) ) {            
            DataVvoda = currentDocument.getDate();
        } else {
            DataVvoda = tableRec.get(DOCMNEMO + '.tr.DataVvodaVEkspluataciiu');
        };        
    } else { //Приходный акт
        DataPrih = currentDocument.getDate();
    };
    

    //Берем наименьшее из даты ввода и даты прихода
    if ((DataPrih != null) && (DataVvoda != null)) {
        MinDt = Math.min(DataPrih, DataVvoda);  
    } else if (DataPrih != null) {
        MinDt = DataPrih;
    } else  if (DataVvoda != null) {
        MinDt = DataVvoda;
    };     
    
    
    let Summs = tableRec.get(DOCMNEMO + '.tr.Stoimost');
    let Dt = tableRec.get(DOCMNEMO + '.tr.Debet')?.getCode();
    Summs = Summs * 1; //почему-то по умолчанию тип object а не number
    
    if ((Summs == 0) || ((Sost != 'Ввод в эксплуатацию') && (znak == 1))) {
        return false;
    };
    
    let Lcena = getOSCenaLimits(MinDt).minLimit;
    
    //почему-то по умолчанию тип object а не number
    if (!Lcena) {
        Lcena = 0;
    } else {
        Lcena = Lcena * 1; 
    }; 
    
       
    if (Summs > Lcena) {
        if (znak == 1) {
            return false;
        } else {
            return true;
        }  
    };
    
    
    let Dt3 = Dt?.slice(0,3);
    let Dt4 = Dt?.slice(0,4);
    let Dt5 = Dt?.slice(0,5);
    
    let data = new Date(currentDocument.getDate());
    let ye = data.getFullYear();   
      
    if (znak == 1) {
        if ((Dt3 == '102') || (Dt4 == '1011') || (Dt3 == '111') || (Dt3 == '103') 
          || ((ye <= 2017) & ((Dt5 == '10137') || (Dt5 == '10127') || (Dt5 == '10147')))
          || ((ye >= 2018) & ((Dt == '10128БФ') || (Dt == '10138БФ')))) {
             return false;
        } else {
             return true;
        }
    } else {
        if ((Dt3 == '102') || (Dt3 == '111')
          || ((ye <= 2017) & ((Dt5 == '10137') || (Dt5 == '10127') || (Dt5 == '10147')))
          || ((ye >= 2018) & ((Dt == '10128БФ') || (Dt == '10138БФ')))) {
             return true;
        } else {
             return false;
        }        
    };  
}

//Получение лимитов стоимости в зависимости от даты
function getOSCenaLimits(date) {
    let result = {
        date: undefined,
        minLimit: 1000,
        maxLimit: 10000
    };
    
    if (!date) date = new Date();
    
    OSCenaLimits.forEach((item) => {
        if (item.date <= date && (!result.date || result.date < item.date)) result = item;
    });
    
    return result;
}
