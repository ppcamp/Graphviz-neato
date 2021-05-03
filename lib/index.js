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
        if (renderer === void 0) { renderer = 'dot'; }
        if (graphAttributes === void 0) { graphAttributes = {
            // LR/RL (left to right) or BT/TB (bottom up).
            rankdir: 'TB',
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
        this._nodes[this._nodes.length] = "\"" + node + "\" [ label = \"" + label + "\", " + additionalConfig + ";"; // pos = "${pos}!"${additionalConfig};`;
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        // Name of the output dot file
                        _this._dotfilename = _this.output + ".dot";
                        // Check if exist some file with this filename, if so, remove it
                        if (fs_1.existsSync(_this._dotfilename))
                            fs_1.unlinkSync(_this._dotfilename);
                        // Store these infos in the file
                        // try {
                        var stream = fs_1.createWriteStream(_this._dotfilename, {
                            flags: 'a',
                            encoding: 'utf8',
                        });
                        // An auxiliar function
                        var wrln = function (str) { return stream.write(str + '\n'); };
                        // Write header
                        wrln('/* Simple script to generate a graph plot');
                        wrln(' *');
                        wrln(' * to compile:');
                        wrln(" * >> dot -K" + _this.renderer + " -T" + _this.type + " example.dot -o example.svg");
                        wrln(' */\n');
                        wrln("/* " + _this.comment + " */\n");
                        // Write graph attr
                        wrln('digraph G {');
                        wrln("\t/* Graph attributes */");
                        wrln("\trankdir=" + _this.graphAttributes.rankdir + ";");
                        wrln("\toverlap=" + _this.graphAttributes.overlap + ";");
                        wrln("\tsplines=" + _this.graphAttributes.splines + ";");
                        wrln("\tsep=" + _this.graphAttributes.sep + ";");
                        wrln("\tpad=" + _this.graphAttributes.pad + ";");
                        wrln("\tnodesep=" + _this.graphAttributes.nodesep + ";");
                        wrln("\tranksep=" + _this.graphAttributes.ranksep + ";");
                        // Write node general attr attr
                        wrln('');
                        wrln("\t/* NODE general attr */");
                        wrln("\tnode [shape=" + _this.nodeAttributes.shape + ", style=" + _this.nodeAttributes.style + ", height=" + _this.nodeAttributes.height + ", width=" + _this.nodeAttributes.width + ", fontsize=" + _this.nodeAttributes.fontsize + ", fontname=" + _this.nodeAttributes.fontname + ", fontcolor=" + _this.nodeAttributes.fontcolor + ", color=" + _this.nodeAttributes.color + " ];\n");
                        // Write node particular attr (colors and positions)
                        wrln("\t/* NODE particular attr */");
                        _this._nodes.forEach(function (val) {
                            wrln("\t" + val);
                        });
                        // Write edge configs
                        wrln("\n\t/* Edges (Connections) */");
                        wrln("\tedge [ color=\"" + _this.graphAttributes.edgecolor + "\", arrowhead=" + _this.graphAttributes.arrowhead + ", arrowtail=" + _this.graphAttributes.arrowtail + "];");
                        _this._edges.forEach(function (val) { return wrln("\t" + val); });
                        // Finish
                        wrln('}');
                        // stream.end();
                        stream.end();
                        stream.on('close', resolve);
                    })];
            });
        });
    };
    /**
     * Execute dot program.
     */
    Neato.prototype.compile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var filename, command, execOut;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Save the program before
                    return [4 /*yield*/, this.save()];
                    case 1:
                        // Save the program before
                        _a.sent();
                        filename = this.output + "." + this.type;
                        if (fs_1.existsSync(filename)) {
                            fs_1.unlinkSync(filename);
                        }
                        command = "dot -K" + this.renderer + " -T" + this.type + " " + this._dotfilename + " -o " + this.output + "." + this.type;
                        execOut = child_process_1.execSync(command);
                        // Remove dot file
                        // unlinkSync(this._dotfilename);
                        return [2 /*return*/, this._dotfilename];
                }
            });
        });
    };
    return Neato;
}());
exports.Neato = Neato;
