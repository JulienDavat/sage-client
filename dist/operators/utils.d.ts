import { Algebra, Generator } from 'sparqljs';
/**
 * Create a SPARQL query (in string format) from a Basic Graph Pattern
 * @param  triples - Set of triple patterns
 * @return A conjunctive SPARQL query
 */
export declare function formatBGPQuery(generator: Generator, triples: Algebra.TripleObject[]): string;
/**
 * Create a SPARQL query (in string format) from a set of Basic Graph Patterns
 * @param  bgps - Set of Basic Graph Patterns, i.e., a set of set of triple patterns
 * @return A SPARQL query
 */
export declare function formatManyBGPQuery(generator: Generator, bgps: Array<Algebra.TripleObject[]>): string;
/**
 * Create a SPARQL query (in string format) from the root of a SPARQL query plan
 * @param  root - Root of a SPARQL query plan
 * @return A SPARQL query
 */
export declare function formatQuery(generator: Generator, root: Algebra.RootNode): string;
