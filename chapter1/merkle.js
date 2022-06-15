const merkle = require('merkle')

const data = ['wdqdq','dqwdqw','dqwdqw','wdqdq','dqwdqw','dqwdqw']

const merkleTree = merkle('sha256').sync(data)

console.log(merkleTree)

const merkleRoot = merkleTree.root()

console.log(merkleRoot) //merkleRoot가 data의 트리구조 최종 결과물이다.
