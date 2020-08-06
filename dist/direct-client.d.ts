import { PipelineStage } from 'sparql-engine';
import Spy from './spy';
/**
 * A DirectSageClient is used to evaluate SPARQL queries againt a SaGe server
 * without using the smart client
 *
 * WEARNING: Only mapping-at-a-time operators are allowed (AND, FILTER, BIND, UNION, SELECT)
 *
 * @author Julien AIMONIER-DAVAT
 * @example
 * 'use strict'
 * const DirectSageClient = require('sage-client')
 *
 * // Create a client to query the DBpedia dataset hosted at http://localhost:8000
 * const url = 'http://localhost:8000/sparql/dbpedia2016'
 * const client = new DirectSageClient(url)
 *
 * const query = `
 *  PREFIX dbp: <http://dbpedia.org/property/> .
 *  PREFIX dbo: <http://dbpedia.org/ontology/> .
 *  SELECT * WHERE {
 *    ?s dbp:birthPlace ?place .
 *    ?s a dbo:Architect .
 *  }`
 * const iterator = client.execute(query)
 *
 * iterator.subscribe(console.log, console.error, () => {
 *  console.log('Query execution finished')
 * })
 */
export default class DirectSageClient {
    private readonly _url;
    private readonly _defaultGraph;
    private readonly _graph;
    private readonly _spy;
    /**
     * Constructor
     * @param {string} url - The url of the dataset to query
     */
    constructor(url: string, defaultGraph: string, spy?: Spy);
    /**
     * Build an iterator used to evaluate a SPARQL query against a SaGe server
     * Only BGP, Filter and Bind nodes are supported.
     * @param  query - SPARQL query to evaluate
     * @return An iterator used to evaluates the query
     */
    execute(query: string): PipelineStage<unknown>;
}
