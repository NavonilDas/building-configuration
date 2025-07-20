export interface StairCaseConfig {
  // Configs for StairCase.
  stepWidth: number;
  numberOfSteps: number;
  stepDepth: number;
  stepXPosition: number;
  stepYPosition: number;
}

export default interface BuildingConfig {

  width: number;
  height: number;
  // Configs for Floor.
  floors: number;
  floorHeight: number;
  floorSpacing: number;
  // Configs for Columns.
  columns: number;
  columnSpacing: number;
  // Configs for Walls.
  wallsOpacity: number;

  stairCaseConfig: StairCaseConfig;
}