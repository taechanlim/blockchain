// function log<T>(n: T) {
//     console.log('result :', n);
// }

//제네릭 ->  데이터타입을 변수로 빼는 느낌
// <>로 사용

// log<Number>(122);

// class 를 쓰는 이유 :  객체 편하게 생성하려고사용.
//객체를 사용할때 데이터타입을 정해줘야함.
//public : interface를 지정하지않고 사용가능하게해줌.

export class Output {
    [address: string]: number;

    constructor(_address: string, _amount: number) {
        this[_address] = _amount;
    }
}

export class Input {
    public signature: string; // 772210

    constructor(_output: Output) {
        this.signature = Input.sum(_output);
    }
    // const a:string
    // function ab():string { }
    static sum(_output: Output): string {
        const value: string = Object.values(_output).join('');
        return value;
    }
}
