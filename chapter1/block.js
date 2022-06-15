const block = {
    version:'1.0.0',
    height:0, //블럭갯수,블럭이 생성될때마다 1올라감(auto increment)
    timestamp:222312321, //'2022-06-08 10:28', 보통 new Date().getTime()사용해서 숫자만 넣음.
    previousHash:'', // 이전블록의 해시
    hash:'',    //해시값은 merkleroot,difficulty,nonce값을 스트링으로 넣은값을 해시변환해서 넣는다.
    merkleRoot:'',  //data트리내용의 최종hash값을 담음 
    // difficulty:0,
    // nonce:0,
    //difficulty,nonce는 채굴할때 사용.
    data:['wdqdq','dqwdqw','dqwdqw'],
}

//merkleRoot : data값중 두개의 짝을 해쉬변환하고 그 해쉬와 그 다음 data값과 hash처리하고 .... 최종 하나의 hash값을 도출한 hash값 (npm install merkle사용)
