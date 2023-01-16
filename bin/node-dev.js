#!/usr/bin/env node

import dev from '../lib/index.js';
import cli from '../lib/cli.js';

const { script, scriptArgs, nodeArgs, opts } = cli(process.argv);

dev(script, scriptArgs, nodeArgs, opts);
