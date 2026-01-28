import { processBuilder } from './builder.mjs';
import { createProcess } from '../../process/index.mjs';

processBuilder.set("exports", ({ accumulator, }) => createProcess(accumulator));
