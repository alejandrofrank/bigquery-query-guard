import {measurements} from '../data/market-recording.js';
import {checkLimit as recordedLimit} from './query-lab.js';
export const experiments=measurements.experiments;
export const groups=measurements.groups;
export const checkLimit=(id,variant,limit)=>recordedLimit(id,variant,limit,{experiments,measurements});
export {measurements};
