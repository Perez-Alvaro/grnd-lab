/**
 * Routine Forge - Dynamic Form Panel
 * Renders the appropriate form based on selected item in structure tree
 */

import PlanMetadataForm from "../Trainer/editor/PlanMetadataForm.jsx";
import WeekEditor from "../Trainer/editor/WeekEditor.jsx";

export default function DynamicFormPanel({ selectedItem, plan }) {
    // For now, always show WeekEditor which contains all editing capabilities
    // In the future, we can add more targeted forms based on selection

    return (
        <div className="space-y-6">
            {/* Metadata Form - always at top */}
            <PlanMetadataForm />

            {/* Week/Day/Exercise Editor */}
            <WeekEditor />
        </div>
    );
}
