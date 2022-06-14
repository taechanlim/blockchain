declare enum MessageType {
    //enum : interface에 특정 값만 넣고싶을때 ex)gender -> '남자' / '여자'
    latest_block = 0,
}

declare interface Message {
    type: MessageType;
    payload: any;
}
