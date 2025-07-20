import { StairCaseConfig } from "@/types/BuildingConfig";
import Colors from "@/types/Colors";
import * as THREE from "three";

interface SimpleStairCaseProps extends StairCaseConfig {
    floorHeight: number;
    direction: -1 | 1;
    floorOffset: number;
}

export function createSimpleStaircase({
    floorHeight, direction, floorOffset, numberOfSteps, stepDepth, stepWidth, stepXPosition, stepYPosition
}: SimpleStairCaseProps) {
  const stairCase = new THREE.Group();
  const stepHeight = (floorHeight + 0.3) / numberOfSteps;
  const stepStartXPosition = stepXPosition + ((direction === -1) ? 0 : stepWidth);
  const treadGeometry = new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth);
  const woodMaterial = new THREE.MeshStandardMaterial({ color: Colors.stairCase, roughness: 0.5 });
  const step = new THREE.Mesh(treadGeometry, woodMaterial);
  const halfStepWidth = stepWidth / 2;
  const stepStartingZPos = stepYPosition + ((direction == 1) ? (-numberOfSteps * stepDepth + halfStepWidth) : 0);
  for (let i = 0; i < numberOfSteps; i++) {
    // Clone the original step
    const newStep = step.clone();

    // Position the new step
    newStep.position.x = stepStartXPosition;
    newStep.position.y = floorOffset + i * stepHeight;
    newStep.position.z = stepStartingZPos + direction * i * stepDepth;

    // Add the new step to the staircase group
    stairCase.add(newStep);
  }
  const cutter = new THREE.Path();
  if (direction === 1) {
    cutter.moveTo(stepStartXPosition - halfStepWidth, stepStartingZPos - stepDepth);
    cutter.lineTo(stepStartXPosition + halfStepWidth, stepStartingZPos - stepDepth);
    cutter.lineTo(stepStartXPosition + halfStepWidth, stepStartingZPos - stepDepth + numberOfSteps * stepDepth);
    cutter.lineTo(stepStartXPosition - halfStepWidth, stepStartingZPos - stepDepth + numberOfSteps * stepDepth);
    cutter.lineTo(stepStartXPosition - halfStepWidth, stepStartingZPos - stepDepth);
  } else {
    cutter.moveTo(stepStartXPosition + halfStepWidth, stepStartingZPos + stepDepth);
    cutter.lineTo(stepStartXPosition - halfStepWidth, stepStartingZPos + stepDepth);
    cutter.lineTo(stepStartXPosition - halfStepWidth, stepStartingZPos + stepDepth - numberOfSteps * stepDepth);
    cutter.lineTo(stepStartXPosition + halfStepWidth, stepStartingZPos + stepDepth - numberOfSteps * stepDepth);
    cutter.lineTo(stepStartXPosition + halfStepWidth, stepStartingZPos + stepDepth);
  }
  return {
    stairCase,
    removeGap: cutter
  };
}