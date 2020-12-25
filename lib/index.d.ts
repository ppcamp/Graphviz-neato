export declare class Neato {
    private output;
    private type;
    private renderer;
    private graphAttributes;
    private nodeAttributes;
    private comment;
    private _nodes;
    private _edges;
    private _dotfilename;
    /**
     *
     * @param output Path to save file (e.g., Path/filename, without type)
     * @param type "svg" as default
     * @param renderer Name of the renderer (e.g., neato)
     * @param graphAttributes Internal configs (Same as the api in python pkg)
     * @param nodeAttributes Internal configs
     */
    constructor(output: string, type?: string, renderer?: string, graphAttributes?: {
        rankdir: string;
        overlap: string;
        splines: string;
        sep: string;
        pad: number;
        nodesep: number;
        ranksep: number;
        arrowhead: string;
        arrowtail: string;
        edgecolor: string;
    }, nodeAttributes?: {
        shape: string;
        style: string;
        height: string;
        width: string;
        fontsize: string;
        fontname: string;
        fontcolor: string;
        color: string;
    });
    /**
     * Create the nodes with his own configurations
     * @param node <string> Node name (It will not be showed)
     * @param label <string> The name to print in code
     * @param pos <string> Position x,y (e.g.,`${irow},${Math.round(icol * 40) / 100}`)
     * @param fontColor OPTIONAL <string> Color in hex(#33FF33)
     * @param bgColor OPTIONAL <string> Color in hex(#ff44ff)
     */
    addNode(node: string, label: string, pos: string, bgColor?: string, fontColor?: string): void;
    /**
     * Create the connections (edges)
     * @param nodeOrigin <string> The name for the node (origin)
     * @param nodeDest <string> The name for the node (destination)
     * @param color OPTIONAL <string> Color in hex(#ff44ff)
     */
    addEdge(nodeOrigin: string, nodeDest: string, color?: string, label?: string): void;
    /**
     * Save the current output to a dot file in the temp path.
     */
    save(): Promise<void>;
    /**
     * Execute dot program.
     */
    compile(): Promise<string>;
}
