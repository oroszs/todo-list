class DateConvert {
    day(index) {
        const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return DAYS[index - 1];
    }
    month(index) {
        const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return MONTHS[index];
    }
    hour(militaryHour) {
        if(militaryHour === 0) {
            return 12;
        } else if(militaryHour < 13) {
            return militaryHour;
        }
        return militaryHour - 12;
    }
    minute (int) {
        let intString = JSON.stringify(int);
        if(intString.length === 1) {
            let zero = '0';
            return zero += int;
        }
        return int;
    }
}

export default DateConvert;