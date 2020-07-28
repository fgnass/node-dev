try {
  require('some_module_that_does_not_exist');
} catch (err) {
  console.log('Caught', err);
}
