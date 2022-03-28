export const control = '\u001bc';
export const clearFactory = clear => (clear ? () => process.stdout.write(control) : () => {});
