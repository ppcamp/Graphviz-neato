"use strict";
/* This code is a shortcut to generate an output file to a node application
 * @see https://graphviz.org/pdf/dotguide.pdf
 * @see also https://www.graphviz.org/pdf/neatoguide.pdf
 * It only archieve the directed graph type
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        return __awaiter(this, void 0, void 0, function () {
            var additionalConfig;
            return __generator(this, function (_a) {
                if (!node || !label || !pos)
                    throw new Error("You didn't defin'ed the essential variables to this library. Check out the example in git.");
                additionalConfig = '';
                if (fontColor)
                    additionalConfig += ", color = \"" + bgColor + "\"";
                if (bgColor)
                    additionalConfig += ", fontcolor = \"" + fontColor + "\"";
                additionalConfig += " ]";
                this._nodes[this._nodes.length] = "\"" + node + "\" [ label = \"" + label + "\", pos = \"" + pos + "!\"" + additionalConfig + ";";
                return [2 /*return*/];
            });
        });
    };
    /**
     * Create the connections (edges)
     * @param nodeOrigin <string> The name for the node (origin)
     * @param nodeDest <string> The name for the node (destination)
     * @param color OPTIONAL <string> Color in hex(#ff44ff)
     */
    Neato.prototype.addEdge = function (nodeOrigin, nodeDest, color, label) {
        return __awaiter(this, void 0, void 0, function () {
            var additionalConfig;
            return __generator(this, function (_a) {
                additionalConfig = '';
                if (color)
                    additionalConfig += 'color = "${color}"';
                if (label)
                    additionalConfig = additionalConfig ? additionalConfig + ", label = \"" + label : "label = \"" + label;
                additionalConfig = additionalConfig ? " [ " + additionalConfig + " ];" : ';';
                this._edges[this._edges.length] = "\"" + nodeOrigin + "\" -> \"" + nodeDest + "\"" + additionalConfig;
                return [2 /*return*/];
            });
        });
    };
    /**
     * Save the current output to a dot file in the temp path.
     */
    Neato.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stream, wrln;
            return __generator(this, function (_a) {
                // Name of the output dot file
                this._dotfilename = this.output + ".dot";
                // Check if exist some file with this filename, if so, remove it
                if (fs_1.existsSync(this._dotfilename))
                    fs_1.unlinkSync(this._dotfilename);
                stream = fs_1.createWriteStream(this._dotfilename, { flags: 'a', encoding: 'utf8' });
                wrln = function (str) { return stream.write(str + '\n'); };
                // Write header
                wrln('/* Simple script to generate a graph plot');
                wrln(' *');
                wrln(' * to compile:');
                wrln(" * >> dot -K" + this.renderer + " -T" + this.type + " example.dot -o example.svg");
                wrln(' */\n');
                wrln("/* " + this.comment + " */\n");
                // Write graph attr
                wrln('digraph G {');
                wrln("\t/* Graph attributes */");
                wrln("\trankdir=" + this.graphAttributes.rankdir + ";");
                wrln("\toverlap=" + this.graphAttributes.overlap + ";");
                wrln("\tsplines=" + this.graphAttributes.splines + ";");
                wrln("\tsep=" + this.graphAttributes.sep + ";");
                wrln("\tpad=" + this.graphAttributes.pad + ";");
                wrln("\tnodesep=" + this.graphAttributes.nodesep + ";");
                wrln("\tranksep=" + this.graphAttributes.ranksep + ";");
                // Write node general attr attr
                wrln('');
                wrln("\t/* NODE general attr */");
                wrln("\tnode [shape=" + this.nodeAttributes.shape + ", style=" + this.nodeAttributes.style + ", height=" + this.nodeAttributes.height + ", width=" + this.nodeAttributes.width + ", fontsize=" + this.nodeAttributes.fontsize + ", fontname=" + this.nodeAttributes.fontname + ", fontcolor=" + this.nodeAttributes.fontcolor + ", color=" + this.nodeAttributes.color + " ];\n");
                // Write node particular attr (colors and positions)
                wrln("\t/* NODE particular attr */");
                this._nodes.forEach(function (val) {
                    wrln("\t" + val);
                });
                // Write edge configs
                wrln("\n\t/* Edges (Connections) */");
                wrln("\tedge [ color=\"" + this.graphAttributes.edgecolor + "\", arrowhead=" + this.graphAttributes.arrowhead + ", arrowtail=" + this.graphAttributes.arrowtail + "];");
                this._edges.forEach(function (val) { return wrln("\t" + val); });
                // Finish
                wrln('}');
                // stream.end();
                stream.end();
                return [2 /*return*/];
            });
        });
    };
    /**
     * Execute dot program.
     */
    Neato.prototype.compile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var command, execOut;
            return __generator(this, function (_a) {
                // Save the program before
                this.save();
                // Check if exist some file with this filename, if so, remove it
                if (fs_1.existsSync(this.output + "." + this.type))
                    fs_1.unlinkSync(this.output + "." + this.type);
                command = "dot -K" + this.renderer + " -T" + this.type + " " + this._dotfilename + " -o " + this.output + "." + this.type;
                execOut = child_process_1.exec(command);
                // tslint:disable-next-line: no-console
                // console.debug('Neato -> command', command);
                return [2 /*return*/, this._dotfilename];
            });
        });
    };
    return Neato;
}());
exports.Neato = Neato;
