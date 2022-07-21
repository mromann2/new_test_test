//Преобразование даты в формат вида 01.01.2022
function formatDate(date) {
    if (date != null) {
        let dd = date.getDate();
        dd < 10 ? dd = '0' + dd : dd;
        let mm = date.getMonth() + 1;
        mm < 10 ? mm = '0' + mm : mm;

        return dd + '.' + mm + '.' + date.getFullYear();
    } else
        return undefined;
}