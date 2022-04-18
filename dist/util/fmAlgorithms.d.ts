import { Limiter, Osc } from '../nodes';
declare type AlgorithmFunction = (a: Osc, b: Osc, c: Osc, d: Osc, out: Limiter) => string;
export declare const fmAlgorithms: AlgorithmFunction[];
export {};
