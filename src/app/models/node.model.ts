export interface CellNode {
    row: number;
    col: number;
    isStart: boolean;
    isEnd: boolean;
    isWall: boolean;
    isVisited: boolean;
    isClosed: boolean;
    isPath: boolean;
    gCost: number;
    hCost: number;
    fCost: number;
    connectedTo?: CellNode;
}

export type Grid = CellNode[][];
