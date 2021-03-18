process.on('uncaughtException', e => {
  setTimeout(() => console.log('async', e), 100);
});

// eslint-disable-next-line no-undef
foo(); // undefined / throws exception
