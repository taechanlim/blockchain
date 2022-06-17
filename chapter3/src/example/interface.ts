//Typescript
//OOP

//interface

// const board = [
//     {
//         idx: 1, //number
//         subject: '제목1', //string
//         content: '내용1', //string
//         writer: '작성자1', //string
//         hit: 0, //number
//     },
//     {
//         idx: 2,
//         subject: '제목2',
//         content: '내용2',
//         writer: '작성자2',
//         hit: 0,
//     },
// ];

//js-> 배열,객체의 장점 :  하나의 변수에 여러가지데이터를 넣을수있다.

//interface 는 객체안의 각각의 타입에 지정할내용을 정해준다.
interface IBoard {
    idx: number;
    subject: string;
    content: string;
    writer: string;
    hit: number;
}

const data: IBoard = {
    idx: 1,
    subject: '제목1',
    content: '내용1',
    writer: '작성자1',
    hit: 0,
};

let example: number[] = [1, 2, 3, 4];

const board: IBoard[] = [
    {
        idx: 1,
        subject: '제목1',
        content: '내용1',
        writer: '작성자1',
        hit: 0,
    },
    {
        idx: 2,
        subject: '제목2',
        content: '내용2',
        writer: '작성자2',
        hit: 0,
    },
    {
        idx: 3,
        subject: '제목3',
        content: '내용3',
        writer: '작성자3',
        hit: 0,
    },
];

// declare type Result<R> = { isError: false; value: R };
// declare type Failure<E> = { isError: true; error: E };
// declare type Failable<R, E> = Result<R> | Failure<E>;

function isSome(num: number): Failable<string, string> {
    if (num !== 5) return { isError: true, error: `${num} 은 틀렸습니다.` };
    return { isError: false, value: `${num} 이 맞습니다.` };
}
const result = isSome(1);
if (result.isError) console.log(result.error);
