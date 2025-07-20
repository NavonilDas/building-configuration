import { useState } from "react";
import { toast } from "sonner";
import { BuildingScene } from "./BuildingsScene";
import { ControlPanel } from "./ControlPanel";
import SavedBuildings from "./SavedBuildings";
import BuildingConfig from "@/types/BuildingConfig";



const defaultConfig: BuildingConfig = {
    floors: 4,
    columns: 4,
    width: 20,
    height: 15,
    floorHeight: 3,
    floorSpacing: 0.1,
    columnSpacing: 5,
    wallsOpacity: 0.5,
    stairCaseConfig: {
        stepWidth: 1.5,
        numberOfSteps: 7,
        stepDepth: 0.7,
        stepXPosition: 0,
        stepYPosition: 0
    }
};

export function BuildingConfigurator() {
    const [config, setConfig] = useState<BuildingConfig>(defaultConfig);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [buildingName, setBuildingName] = useState("");
    const [showSavedBuildings, setShowSavedBuildings] = useState(false);

    const handleSave = async () => {
        if (!buildingName.trim()) {
            toast.error("Please enter a building name");
            return;
        }

        try {
            //   await saveBuilding({
            //     name: buildingName,
            //     config,
            //   });
            toast.success("Building saved successfully!");
            setBuildingName("");
            setShowSaveDialog(false);
        } catch (error) {
            toast.error("Failed to save building");
            console.error(error)
        }
    };

    return (
        <div className="h-screen flex">
            {/* 3D Scene */}
            <div className="flex-1 relative">
                <BuildingScene config={config} />
            </div>

            {/* Control Panel */}
            <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Building Configuration</h3>

                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setShowSaveDialog(true)}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                            Save Model
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <ControlPanel config={config} onChange={setConfig} />
                </div>
            </div>

            {/* Save Dialog */}
            {showSaveDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold text-white mb-4">Save Building</h3>
                        <input
                            type="text"
                            value={buildingName}
                            onChange={(e) => setBuildingName(e.target.value)}
                            placeholder="Enter building name"
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none mb-4"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setShowSaveDialog(false);
                                    setBuildingName("");
                                }}
                                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Saved Buildings Dialog */}
            {showSavedBuildings && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg w-96 max-h-96">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Saved Buildings</h3>
                            <button
                                onClick={() => setShowSavedBuildings(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        <SavedBuildings />
                    </div>
                </div>
            )}
        </div>
    );
}
