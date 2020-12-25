/* This code is a shortcut to generate an output file to a node application
 * @see https://graphviz.org/pdf/dotguide.pdf
 * @see also https://www.graphviz.org/pdf/neatoguide.pdf
 * It only archieve the directed graph type
 */

import { ChildProcess, exec as RUN } from 'child_process';
import { existsSync, createWriteStream, unlinkSync, unlink } from 'fs';

export class Neato {
  private comment: string;
  private _nodes;
  private _edges;
  private _dotfilename: string;

  /**
   *
   * @param output Path to save file (e.g., Path/filename, without type)
   * @param type "svg" as default
   * @param renderer Name of the renderer (e.g., neato)
   * @param graphAttributes Internal configs (Same as the api in python pkg)
   * @param nodeAttributes Internal configs
   */
  constructor(
    private output: string,
    private type: string = 'svg',
    private renderer: string = 'neato',
    private graphAttributes = {
      // LR/RL (left to right) or BT/TB (bottom up).
      rankdir: 'BT',
      overlap: 'scale', // Force position
      // splines → polyline, ortho, true/spline, curved
      splines: 'ortho', // edge uppon vertix
      // 'margin': '0.5,0.5',
      sep: '0.5',
      pad: 1,
      nodesep: 1,
      ranksep: 1,
      arrowhead: 'normal',
      arrowtail: 'dot',
      edgecolor: 'black',
    },
    private nodeAttributes = {
      shape: 'rectangle',
      // @see https://graphviz.org/doc/info/shapes.html
      style: '"rounded,filled"',
      height: '1',
      width: '2',
      fontsize: '14',
      fontname: '"Arial"',
      fontcolor: 'black',
      color: '"#a196fa"',
    },
  ) {
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
  addNode(node: string, label: string, pos: string, bgColor?: string, fontColor?: string): void {
    if (!node || !label || !pos)
      throw new Error(`You didn't defin'ed the essential variables to this library. Check out the example in git.`);

    let additionalConfig = '';
    if (fontColor) additionalConfig += `, color = "${bgColor}"`;
    if (bgColor) additionalConfig += `, fontcolor = "${fontColor}"`;
    additionalConfig += ` ]`;

    this._nodes[this._nodes.length] = `"${node}" [ label = "${label}", pos = "${pos}!"${additionalConfig};`;
  }

  /**
   * Create the connections (edges)
   * @param nodeOrigin <string> The name for the node (origin)
   * @param nodeDest <string> The name for the node (destination)
   * @param color OPTIONAL <string> Color in hex(#ff44ff)
   */
  addEdge(nodeOrigin: string, nodeDest: string, color?: string, label?: string): void {
    let additionalConfig = '';
    if (color) additionalConfig += 'color = "${color}"';
    if (label) additionalConfig = additionalConfig ? `${additionalConfig}, label = "${label}` : `label = "${label}`;
    additionalConfig = additionalConfig ? ` [ ${additionalConfig} ];` : ';';

    this._edges[this._edges.length] = `"${nodeOrigin}" -> "${nodeDest}"${additionalConfig}`;
  }

  /**
   * Save the current output to a dot file in the temp path.
   */
  async save(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Name of the output dot file
      this._dotfilename = `${this.output}.dot`;

      // Check if exist some file with this filename, if so, remove it
      if (existsSync(this._dotfilename)) unlinkSync(this._dotfilename);

      // Store these infos in the file
      // try {
      const stream = createWriteStream(this._dotfilename, {
        flags: 'a',
        encoding: 'utf8',
      });

      // An auxiliar function
      const wrln = (str: string) => stream.write(str + '\n');

      // Write header
      wrln('/* Simple script to generate a graph plot');
      wrln(' *');
      wrln(' * to compile:');
      wrln(` * >> dot -K${this.renderer} -T${this.type} example.dot -o example.svg`);
      wrln(' */\n');
      wrln(`/* ${this.comment} */\n`);

      // Write graph attr
      wrln('digraph G {');
      wrln(`\t/* Graph attributes */`);
      wrln(`\trankdir=${this.graphAttributes.rankdir};`);
      wrln(`\toverlap=${this.graphAttributes.overlap};`);
      wrln(`\tsplines=${this.graphAttributes.splines};`);
      wrln(`\tsep=${this.graphAttributes.sep};`);
      wrln(`\tpad=${this.graphAttributes.pad};`);
      wrln(`\tnodesep=${this.graphAttributes.nodesep};`);
      wrln(`\tranksep=${this.graphAttributes.ranksep};`);

      // Write node general attr attr
      wrln('');
      wrln(`\t/* NODE general attr */`);
      wrln(
        `\tnode [shape=${this.nodeAttributes.shape}, style=${this.nodeAttributes.style}, height=${this.nodeAttributes.height}, width=${this.nodeAttributes.width}, fontsize=${this.nodeAttributes.fontsize}, fontname=${this.nodeAttributes.fontname}, fontcolor=${this.nodeAttributes.fontcolor}, color=${this.nodeAttributes.color} ];\n`,
      );

      // Write node particular attr (colors and positions)
      wrln(`\t/* NODE particular attr */`);
      this._nodes.forEach((val) => {
        wrln(`\t${val}`);
      });

      // Write edge configs
      wrln(`\n\t/* Edges (Connections) */`);
      wrln(
        `\tedge [ color="${this.graphAttributes.edgecolor}", arrowhead=${this.graphAttributes.arrowhead}, arrowtail=${this.graphAttributes.arrowtail}];`,
      );
      this._edges.forEach((val) => wrln(`\t${val}`));

      // Finish
      wrln('}');

      // stream.end();
      stream.end();

      stream.on('close', resolve);
    });
  }

  /**
   * Execute dot program.
   */
  async compile(): Promise<string> {
    // Save the program before
    await this.save();

    // Check if exist some file with this filename, if so, remove it
    const filename = `${this.output}.${this.type}`;
    if (existsSync(filename)) {
      unlinkSync(filename);
    }

    const command: string = `dot -K${this.renderer} -T${this.type} ${this._dotfilename} -o ${this.output}.${this.type}`;
    const execOut: ChildProcess = RUN(command);
    // Remove dot file
    // unlinkSync(this._dotfilename);

    return this._dotfilename;
  }
}
