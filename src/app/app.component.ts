import { Component, ViewEncapsulation,ViewChild,Inject } from '@angular/core';
import {Connector, ConnectorModel, Diagram, DiagramComponent, DiagramModel, IDragEnterEventArgs, IDragLeaveEventArgs, IDropEventArgs, MarginModel, NodeConstraints, NodeModel, PaletteModel, PointPortModel, randomId, SymbolInfo, UndoRedo, UndoRedoService,Node} from '@syncfusion/ej2-angular-diagrams';
import { ExpandMode } from '@syncfusion/ej2-navigations';

import {DiagramSkeleton,nodeModel,connectorModel} from './diagram-skeleton.model';
Diagram.Inject(UndoRedo);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'diagramtest';
  // public isChanged:boolean=false;
  public diagramData:DiagramSkeleton;
  public expandMode: ExpandMode = 'Multiple';
  @ViewChild('diagram')
  public diagram: DiagramComponent;
  
  public nodeDefaults(node:NodeModel):NodeModel{
    let obj:NodeModel={};
    if(obj.width===undefined){
      obj.width=145;
    }
    else{
      let ratio:number=100/obj.width;
      obj.width=100;
      obj.height*=ratio;
    }
    obj.style = { fill: '#357BD2', strokeColor: 'white' };
    obj.annotations = [{ style: { color: 'black', fill: 'transparent' } }];
    // obj.ports = this.getPorts(node);
    // console.log(obj);
    // this.isChanged=true;
    return obj;
  }
  
 getPorts(obj: NodeModel): PointPortModel[] {
  let ports: PointPortModel[] = [
    { id: 'port1', shape: 'Circle', offset: { x: 0, y: 0.5 } },
    { id: 'port2', shape: 'Circle', offset: { x: 0.5, y: 1 } },
    { id: 'port3', shape: 'Circle', offset: { x: 1, y: 0.5 } },
    { id: 'port4', shape: 'Circle', offset: { x: 0.5, y: 0 } }
  ];
  return ports;
}
public symbolMargin: MarginModel = { left: 15, right: 15, top: 15, bottom: 15 };
private flowshapes: NodeModel[] = [
  { id: 'Process', shape: { type: 'Flow', shape: 'Process' } },
];
private connectorSymbols: ConnectorModel[] = [
  {
    id: 'Link1',
    type: 'Orthogonal',
    sourcePoint: { x: 0, y: 0 },
    targetPoint: { x: 60, y: 60 },
    targetDecorator: { shape: 'Arrow', style: {strokeColor: '#757575', fill: '#757575'} },
    style: { strokeWidth: 1, strokeColor: '#757575' }
  }]
  public palettes: PaletteModel[] = [
    {
      id: 'flow',
      expanded: true,
      symbols: this.flowshapes,
      iconCss: 'shapes',
      title: 'Flow Shapes'
    },
    {
      id: 'connectors',
      expanded: true,
      symbols: this.connectorSymbols,
      iconCss: 'shapes',
      title: 'Connectors'
    }
  ];
  public connDefaults(obj: Connector): void {
    if (obj.id.indexOf('connector') !== -1) {
      obj.type = 'Orthogonal';
      obj.targetDecorator = { shape: 'Arrow', width: 10, height: 10 };
      console.log(obj);
      // this.isChanged=true;
    }
  }
  public getSymbolInfo(symbol: NodeModel): SymbolInfo {
    return { fit: true };
  }
  // public dragEnter(args: IDragEnterEventArgs): void {
  //   // console.log(args.diagram);
  //   let obj: NodeModel = args.element as NodeModel;
  //   if (obj && obj.width && obj.height) {
  //     let oWidth: number = obj.width;
  //     let oHeight: number = obj.height;
  //     let ratio: number = 100 / obj.width;
  //     obj.width = 100;
  //     obj.height *= ratio;
  //     obj.offsetX += (obj.width - oWidth) / 2;
  //     obj.offsetY += (obj.height - oHeight) / 2;
  //     obj.style = { fill: '#357BD2', strokeColor: 'white' };
      
  //   }
  //   console.log(obj.offsetX)
    
  // }
 
  public created(): void {
    // this.diagram.addPorts(this.diagram.nodes[0], this.ports);
  }
  public getSymbolDefaults(symbol: NodeModel): void {
    symbol.style.strokeColor = '#757575';
    if (symbol.id === 'Process') {
      symbol.width = 80;
      symbol.height = 40;
    }  else {
      symbol.width = 50;
      symbol.height = 50;
    }
  }
  valuechange($event:any) {
    var nodeList: nodeModel[] = [];
    var connectorList: connectorModel[] = [];
    
    
    this.diagram.nodes.forEach((element) => {
      const nodeData: nodeModel = {
        id: element.id,
        height: element.height,
        width: element.width,
        offsetX: element.offsetX,
        offsetY: element.offsetY,
      };
      nodeList.push(nodeData);
    });

    this.diagram.connectors.forEach((element) => {
      const connectorData: connectorModel = {
        id: element.id,
        sourceId: element.sourceID,
        targetId: element.targetID,
      };
      connectorList.push(connectorData);
    });

    this.diagramData = {
      nodes: nodeList,
      connectors: connectorList,
    };
    console.log(this.diagramData);
}
public drop(args: IDropEventArgs) {
  if (args.element instanceof Node && this.diagram.nodes.length > 0) {
    if (args.element.id !== (args.target as NodeModel).id) {
      args.cancel = true;
      //Argument element is used to get the dropped node.
      let node: NodeModel = args.element;

      let newNode: NodeModel = {
        id: "node" + randomId(),
        offsetX: args.element.offsetX,
        offsetY: args.element.offsetY + 100,
        shape: args.element.shape,
        height: 75,
        width: 75,
        constraints: NodeConstraints.Default | NodeConstraints.AllowDrop
      };
      this.diagram.add(newNode);
      console.log(newNode)

      let connector: ConnectorModel = {
        id: "connector" + randomId(),
        sourceID: (args.target as NodeModel).id,
        targetID: newNode.id,
      };
      this.diagram.add(connector);
      console.log(connector)
    } else {
      alert("Node does not dropped on other node!!!!");
    }
  }
}
 }

