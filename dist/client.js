/* file : client.ts
MIT License

Copyright (c) 2018-2020 Thomas Minier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var sparql_engine_1 = require("sparql-engine");
var sage_graph_1 = require("./sage-graph");
/**
 * A SageClient is used to evaluate SPARQL queries againt a SaGe server
 * @author Thomas Minier
 * @example
 * 'use strict'
 * const SageClient = require('sage-client')
 *
 * // Create a client to query the DBpedia dataset hosted at http://localhost:8000
 * const url = 'http://localhost:8000/sparql/dbpedia2016'
 * const client = new SageClient(url)
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
var SageClient = /** @class */ (function () {
    /**
     * Constructor
     * @param {string} url - The url of the dataset to query
     */
    function SageClient(url, defaultGraph, spy) {
        var _this = this;
        this._url = url;
        this._defaultGraph = defaultGraph;
        this._spy = spy;
        this._graph = new sage_graph_1.default(this._url, this._defaultGraph, this._spy);
        this._dataset = new sparql_engine_1.HashMapDataset(this._defaultGraph, this._graph);
        // set graph factory to create SageGraph on demand
        this._dataset.setGraphFactory(function (iri) {
            if (!iri.startsWith('http')) {
                throw new Error("Invalid URL in SERVICE clause: " + iri);
            }
            if (!iri.includes('/sparql')) {
                throw new Error('The requested server does not look like a valid SaGe server');
            }
            var index = iri.indexOf('/sparql');
            var url = iri.substring(0, index + 7);
            return new sage_graph_1.default(url, iri, _this._spy);
        });
        this._builder = new sparql_engine_1.PlanBuilder(this._dataset);
    }
    /**
     * Build an iterator used to evaluate a SPARQL query against a SaGe server
     * @param  query - SPARQL query to evaluate
     * @return An iterator used to evaluates the query
     */
    SageClient.prototype.execute = function (query) {
        var _this = this;
        this._graph.open();
        var pipeline = this._builder.build(query);
        return sparql_engine_1.Pipeline.getInstance().finalize(pipeline, function () { return _this._graph.close(); });
    };
    return SageClient;
}());
exports.default = SageClient;