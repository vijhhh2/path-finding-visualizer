export interface CellNode {
    row: number;
    col: number;
    isStart: boolean;
    isEnd: boolean;
    isWall: boolean;
    isExplored: boolean;
    connectedTo?: CellNode;
}