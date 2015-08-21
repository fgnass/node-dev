function *test(){
  yield 'foo'
}

var result = test().next().value

console.log(result)