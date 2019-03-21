export class Util {

    static search(list: Array<any>, value: String): Array<any> {
        return list.filter(o => o.toString().toLowerCase().includes(value.toLowerCase()));
    }
}