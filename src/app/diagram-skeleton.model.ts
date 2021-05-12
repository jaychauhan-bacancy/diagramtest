export interface DiagramSkeleton {
  nodes: nodeModel[];
  connectors: connectorModel[];
}
export interface nodeModel {
  id: string;
  offsetX: number;
  offsetY: number;
  height: number;
  width: number;
  title?: string;
}
export interface connectorModel {
  id: string;
  sourceId: string;
  targetId: string;
  title?: string;
}
