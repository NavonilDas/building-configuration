import BuildingConfig, { StairCaseConfig } from "@/types/BuildingConfig";

interface ControlPanelProps {
    config: BuildingConfig;
    onChange: (config: BuildingConfig) => void;
}

type BuildingConfigWithoutStairCase = Omit<BuildingConfig, 'stairCaseConfig'>;

const controls = [
    {
        label: "Building Width",
        key: "width" as keyof BuildingConfigWithoutStairCase,
        min: 10,
        max: 50,
        step: 1,
    },
    {
        label: "Building Height",
        key: "height" as keyof BuildingConfigWithoutStairCase,
        min: 10,
        max: 50,
        step: 1,
    },
    {
        label: "Number of Floors",
        key: "floors" as keyof BuildingConfigWithoutStairCase,
        min: 1,
        max: 20,
        step: 1,
    },
    {
        label: "Floor Height",
        key: "floorHeight" as keyof BuildingConfigWithoutStairCase,
        min: 2,
        max: 6,
        step: 0.1,
    },
    {
        label: "Floor Spacing",
        key: "floorSpacing" as keyof BuildingConfigWithoutStairCase,
        min: 0,
        max: 3,
        step: 0.1,
    },
    {
        label: "Columns per Side",
        key: "columns" as keyof BuildingConfigWithoutStairCase,
        min: 2,
        max: 10,
        step: 1,
    },
    {
        label: "Column Spacing",
        key: "columnSpacing" as keyof BuildingConfigWithoutStairCase,
        min: 3,
        max: 10,
        step: 0.5,
    },
    {
        label: "Walls Opacity",
        key: "wallsOpacity" as keyof BuildingConfigWithoutStairCase,
        min: 0,
        max: 1,
        step: 0.1,
    },


];

const StairCaseControls = [
    {
        label: "Number of Steps per Floor",
        key: "numberOfSteps" as keyof StairCaseConfig,
        min: 0,
        max: 20,
        step: 1,
    },
    {
        label: "Steps Width",
        key: "stepWidth" as keyof StairCaseConfig,
        min: 0,
        max: 20,
        step: 0.1,
    },
    {
        label: "Steps Depth",
        key: "stepDepth" as keyof StairCaseConfig,
        min: 0,
        max: 20,
        step: 0.1,
    },
    {
        label: "Steps X Position",
        key: "stepXPosition" as keyof StairCaseConfig,
        min: -20,
        max: 20,
        step: 0.1,
    },
    {
        label: "Steps Y Position",
        key: "stepYPosition" as keyof StairCaseConfig,
        min: -20,
        max: 20,
        step: 0.1,
    },
];

export function ControlPanel({ config, onChange }: ControlPanelProps) {
    const updateConfig = (key: keyof BuildingConfig, value: number) => {
        onChange({
            ...config,
            [key]: value,
        });
    };



    function updateStairCaseConfig(key: keyof StairCaseConfig, value: number): void {
        onChange({
            ...config,
            stairCaseConfig: {
                ...config.stairCaseConfig,
                [key]: value,
            }
        });
    }

    return (
        <div className="p-4 space-y-6">
            {controls.map((control) => (
                <div key={control.key} className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-300">
                            {control.label}
                        </label>
                        <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
                            {config[control.key].toFixed(1)}
                        </span>
                    </div>
                    <input
                        type="range"
                        min={control.min}
                        max={control.max}
                        step={control.step}
                        value={config[control.key]}
                        onChange={(e) => updateConfig(control.key, parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>{control.min}</span>
                        <span>{control.max}</span>
                    </div>
                </div>
            ))}
            {/* TODO: Convert the Control into a new Component */}
            <h3>Staircase Config</h3>
            {StairCaseControls.map((control) => (
                <div key={control.key} className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-300">
                            {control.label}
                        </label>
                        <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
                            {config.stairCaseConfig[control.key].toFixed(1)}
                        </span>
                    </div>
                    <input
                        type="range"
                        min={control.min}
                        max={control.max}
                        step={control.step}
                        value={config.stairCaseConfig[control.key]}
                        onChange={(e) => updateStairCaseConfig(control.key, parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>{control.min}</span>
                        <span>{control.max}</span>
                    </div>
                </div>
            ))}

            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Building Stats</h4>
                <div className="space-y-1 text-xs text-gray-400">
                    <div>Total Height: {(config.floors * (config.floorHeight + config.floorSpacing) - config.floorSpacing).toFixed(1)}m</div>
                    <div>Floor Area: {(config.width * config.height).toFixed(0)}m²</div>
                    <div>Total Area: {(config.width * config.height * config.floors).toFixed(0)}m²</div>
                    <div>Columns: {Math.pow(config.columns, 2) * (config.floors - 1)}</div>
                </div>
            </div>
        </div>
    );
}
