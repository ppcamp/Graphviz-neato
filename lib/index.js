"use strict";
/* This code is a shortcut to generate an output file to a node application
 * @see https://graphviz.org/pdf/dotguide.pdf
 * @see also https://www.graphviz.org/pdf/neatoguide.pdf
 * It only archieve the directed graph type
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neato = void 0;
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var Neato = /** @class */ (function () {
    /**
     *
     * @param output Path to save file (e.g., Path/filename, without type)
     * @param type "svg" as default
     * @param renderer Name of the renderer (e.g., neato)
     * @param graphAttributes Internal configs (Same as the api in python pkg)
     * @param nodeAttributes Internal configs
     */
    function Neato(output, type, renderer, graphAttributes, nodeAttributes) {
        if (type === void 0) { type = 'svg'; }
        if (renderer === void 0) { renderer = 'neato'; }
        if (graphAttributes === void 0) { graphAttributes = {
            // LR/RL (left to right) or BT/TB (bottom up).
            rankdir: 'BT',
            overlap: 'scale',
            // splines → polyline, ortho, true/spline, curved
            splines: 'ortho',
            // 'margin': '0.5,0.5',
            sep: '0.5',
            pad: 1,
            nodesep: 1,
            ranksep: 1,
            arrowhead: 'normal',
            arrowtail: 'dot',
            edgecolor: 'black',
        }; }
        if (nodeAttributes === void 0) { nodeAttributes = {
            shape: 'rectangle',
            // @see https://graphviz.org/doc/info/shapes.html
            style: '"rounded,filled"',
            height: '1',
            width: '2',
            fontsize: '14',
            fontname: '"Arial"',
            fontcolor: 'black',
            color: '"#a196fa"',
        }; }
        this.output = output;
        this.type = type;
        this.renderer = renderer;
        this.graphAttributes = graphAttributes;
        this.nodeAttributes = nodeAttributes;
        this._nodes = new Array();
        this._edges = new Array();
        this._dotfilename = '';
        this.comment =
            'This code is not guaranteed. The developer is not responsible for any damages. Use at your own risk';
    }
    /**
     * Create the nodes with his own configurations
     * @param node <string> Node name (It will not be showed)
     * @param label <string> The name to print in code
     * @param pos <string> Position x,y (e.g.,`${irow},${Math.round(icol * 40) / 100}`)
     * @param fontColor OPTIONAL <string> Color in hex(#33FF33)
     * @param bgColor OPTIONAL <string> Color in hex(#ff44ff)
     */
    Neato.prototype.addNode = function (node, label, pos, bgColor, fontColor) {
        if (!node || !label || !pos)
            throw new Error("You didn't defin'ed the essential variables to this library. Check out the example in git.");
        var additionalConfig = '';
        if (fontColor)
            additionalConfig += ", color = \"" + bgColor + "\"";
        if (bgColor)
            additionalConfig += ", fontcolor = \"" + fontColor + "\"";
        additionalConfig += " ]";
        this._nodes[this._nodes.length] = "\"" + node + "\" [ label = \"" + label + "\", pos = \"" + pos + "!\"" + additionalConfig + ";";
    };
    /**
     * Create the connections (edges)
     * @param nodeOrigin <string> The name for the node (origin)
     * @param nodeDest <string> The name for the node (destination)
     * @param color OPTIONAL <string> Color in hex(#ff44ff)
     */
    Neato.prototype.addEdge = function (nodeOrigin, nodeDest, color, label) {
        var additionalConfig = '';
        if (color)
            additionalConfig += 'color = "${color}"';
        if (label)
            additionalConfig = additionalConfig ? additionalConfig + ", label = \"" + label : "label = \"" + label;
        additionalConfig = additionalConfig ? " [ " + additionalConfig + " ];" : ';';
        this._edges[this._edges.length] = "\"" + nodeOrigin + "\" -> \"" + nodeDest + "\"" + additionalConfig;
    };
    /**
     * Save the current output to a dot file in the temp path.
     */
    Neato.prototype.save = function () {
        // Name of the output dot file
        this._dotfilename = this.output + ".dot";
        // Check if exist some file with this filename, if so, remove it
        if (fs_1.existsSync(this._dotfilename))
            fs_1.unlinkSync(this._dotfilename);
        // Store these infos in the file
        try {
            var stream_1 = fs_1.createWriteStream(this._dotfilename, { flags: 'a', encoding: 'utf8' });
            // An auxiliar function
            var wrln_1 = function (str) { return stream_1.write(str + '\n'); };
            // Write header
            wrln_1('/* Simple script to generate a graph plot');
            wrln_1(' *');
            wrln_1(' * to compile:');
            wrln_1(" * >> dot -K" + this.renderer + " -T" + this.type + " example.dot -o example.svg");
            wrln_1(' */\n');
            wrln_1("/* " + this.comment + " */\n");
            // Write graph attr
            wrln_1('digraph G {');
            wrln_1("\t/* Graph attributes */");
            wrln_1("\trankdir=" + this.graphAttributes.rankdir + ";");
            wrln_1("\toverlap=" + this.graphAttributes.overlap + ";");
            wrln_1("\tsplines=" + this.graphAttributes.splines + ";");
            wrln_1("\tsep=" + this.graphAttributes.sep + ";");
            wrln_1("\tpad=" + this.graphAttributes.pad + ";");
            wrln_1("\tnodesep=" + this.graphAttributes.nodesep + ";");
            wrln_1("\tranksep=" + this.graphAttributes.ranksep + ";");
            // Write node general attr attr
            wrln_1('');
            wrln_1("\t/* NODE general attr */");
            wrln_1("\tnode [shape=" + this.nodeAttributes.shape + ", style=" + this.nodeAttributes.style + ", height=" + this.nodeAttributes.height + ", width=" + this.nodeAttributes.width + ", fontsize=" + this.nodeAttributes.fontsize + ", fontname=" + this.nodeAttributes.fontname + ", fontcolor=" + this.nodeAttributes.fontcolor + ", color=" + this.nodeAttributes.color + " ];\n");
            // Write node particular attr (colors and positions)
            wrln_1("\t/* NODE particular attr */");
            this._nodes.forEach(function (val) {
                wrln_1("\t" + val);
            });
            // Write edge configs
            wrln_1("\n\t/* Edges (Connections) */");
            wrln_1("\tedge [ color=\"" + this.graphAttributes.edgecolor + "\", arrowhead=" + this.graphAttributes.arrowhead + ", arrowtail=" + this.graphAttributes.arrowtail + "];");
            this._edges.forEach(function (val) { return wrln_1("\t" + val); });
            // Finish
            wrln_1('}');
            // stream.end();
            stream_1.end();
        }
        catch (err) {
            // tslint:disable-next-line: no-console
            console.log("Some error occurred. Check: " + err);
        }
    };
    /**
     * Execute dot program.
     */
    Neato.prototype.compile = function () {
        // Save the program before
        this.save();
        // Check if exist some file with this filename, if so, remove it
        if (fs_1.existsSync(this.output + "." + this.type))
            fs_1.unlinkSync(this.output + "." + this.type);
        var command = "dot -K" + this.renderer + " -T" + this.type + " " + this._dotfilename + " -o " + this.output + "." + this.type;
        var execOut = child_process_1.exec(command);
        // tslint:disable-next-line: no-console
        console.debug('Neato -> command', command);
        return this._dotfilename;
    };
    return Neato;
}());
exports.Neato = Neato;
// IMPORTANT:
// FIXME:
// TODO:
// QUESTION:
// NOTE: Test
// Workflow example (must be ordered)
var wk = [
    {
        id: '81e41be3-521a-43ec-969f-a543151c95b9',
        descr: 'Início',
        prev: '',
        isCurrent: false,
    },
    {
        id: '4223ded5-fea9-4b10-b605-8d447c91244b',
        descr: 'Estágio 1',
        prev: '81e41be3-521a-43ec-969f-a543151c95b9',
        isCurrent: false,
    },
    {
        id: '2759d04f-1fa6-4a9c-8ce3-1858c87e9edd',
        descr: 'Estágio 2',
        prev: '4223ded5-fea9-4b10-b605-8d447c91244b',
        isCurrent: false,
    },
    {
        id: '1bba8aa9-8a74-40ec-a477-8553a0af338e',
        descr: 'Estágio 3',
        prev: '2759d04f-1fa6-4a9c-8ce3-1858c87e9edd',
        isCurrent: false,
    },
    {
        id: '3e8086cc-93dc-417c-93f8-968acafcb52a',
        descr: 'Estágio 1',
        prev: '1bba8aa9-8a74-40ec-a477-8553a0af338e',
        isCurrent: true,
    },
    {
        id: 'cc752e85-8880-41e8-9399-a78ec1f2f6d2',
        descr: 'Estágio 2',
        prev: '3e8086cc-93dc-417c-93f8-968acafcb52a',
        isCurrent: false,
    },
    {
        id: '85aeaf16-5140-4a44-ab71-5ea180ebea3b',
        descr: 'Estágio 3',
        prev: 'cc752e85-8880-41e8-9399-a78ec1f2f6d2',
        isCurrent: false,
    },
    {
        id: '26248dd8-1724-4383-a9b2-266f9293cf02',
        descr: 'Estágio 4',
        prev: '85aeaf16-5140-4a44-ab71-5ea180ebea3b',
        isCurrent: false,
    },
    {
        id: '7c9f3478-2708-462e-93f3-017453fcec58',
        descr: 'Estágio final',
        prev: '26248dd8-1724-4383-a9b2-266f9293cf02',
        isCurrent: false,
    },
];
function genWorkflow(filename, workflow) {
    // Graph example
    var graph = new Neato(filename);
    // Number of itens in cols
    var cols = 3;
    // Number of rows
    var rows = Math.ceil(workflow.length / cols);
    // Iterate over the number of cols/rows
    var icol = 0;
    var irow = 0;
    // FIXME: Fix the bugs of positioning
    // TODO: Test different colors
    // Add nodes
    for (var _i = 0, workflow_1 = workflow; _i < workflow_1.length; _i++) {
        var obj = workflow_1[_i];
        // y,x
        var pos = icol + "," + Math.round((-irow + 0.7) * 100) / 100;
        // Assign a color to current position in workflow/
        if (obj.isCurrent)
            graph.addNode(obj.id, obj.descr, pos, '#506596', '#ffffff');
        else
            graph.addNode(obj.id, obj.descr, pos, '#96a1b0', '#ffffff');
        // Changing node position: even-> LR, odd->RL
        if (icol < cols && irow % 2 === 0)
            icol++;
        else if (icol > 0 && irow % 2 !== 0)
            icol--;
        else
            irow++;
    }
    /** Add edges
     * We're assuming that the data are in order
     * Set the nodes connections
     * The first node doesn't not have anny previous values
     */
    for (var i = 1; i < workflow.length; i++)
        graph.addEdge(workflow[i].prev, workflow[i].id);
    // Save the image file
    graph.compile();
}
genWorkflow('C:/Users/paugu/Desktop/test', wk);
