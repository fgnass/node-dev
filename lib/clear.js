const control = '\u001bc';
const clearFactory = clear => (clear ? () => process.stdout.write(control) : () => {});

module.exports = { clearFactory, control };
