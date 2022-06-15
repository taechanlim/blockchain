const SHA256 = require('crypto-js/sha256')

const a = 'hello hash'

console.log(SHA256(a).toString()) //e08e1d7bd3fec53b7360de39482ac30d8d1b7bedead27e013810e29095fee6fb 출력.(64자)

// hash 는 64글자로 암호화해주는 알고리즘
// 결과물을 가지고 원래 글자를 알고싶어도 알수없다.(단방향 암호화)

