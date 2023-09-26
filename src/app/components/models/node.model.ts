export interface CellNode {
    row: number;
    col: number;
    isStart: boolean;
    isEnd: boolean;
    isWall: boolean;
    isVisited: boolean;
    isClosed: boolean;
    isPath: boolean;
    connectedTo?: CellNode;
}
