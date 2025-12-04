/**
 * Routine Forge - Structure Tree Component
 * Left panel navigation tree showing routine hierarchy
 */

import { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Calendar, Dumbbell, Copy, Trash2 } from 'lucide-react';
import { Button, Badge } from '../ui';

const TreeItem = ({
    label,
    icon: Icon,
    level = 0,
    isExpanded,
    onToggle,
    onSelect,
    isSelected,
    actions,
    badge,
    children
}) => {
    const hasChildren = children && children.length > 0;
    const paddingLeft = level * 16 + 12;

    return (
        <div className="select-none">
            <div
                className={`group flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${isSelected
                        ? 'bg-accent/10 text-accent border-l-2 border-accent'
                        : 'hover:bg-primary-surface text-text-secondary hover:text-text-primary'
                    }`}
                style={{ paddingLeft: `${paddingLeft}px` }}
                onClick={onSelect}
            >
                {/* Expand/Collapse button */}
                {hasChildren && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle?.();
                        }}
                        className="p-0.5 hover:bg-primary-bg rounded transition-colors"
                    >
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </button>
                )}
                {!hasChildren && <div className="w-5" />}

                {/* Icon */}
                {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}

                {/* Label */}
                <span className="flex-1 truncate text-sm font-medium">{label}</span>

                {/* Badge */}
                {badge && (
                    <Badge variant="default" size="sm">{badge}</Badge>
                )}

                {/* Actions (show on hover) */}
                {actions && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {actions.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick();
                                }}
                                className="p-1 hover:bg-primary-bg rounded transition-colors"
                                title={action.label}
                            >
                                <action.icon className="h-3.5 w-3.5" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Children */}
            {hasChildren && isExpanded && (
                <div>
                    {children}
                </div>
            )}
        </div>
    );
};

export default function StructureTree({
    plan,
    selectedItem,
    onSelectItem,
    onAddWeek,
    onDuplicateWeek,
    onRemoveWeek,
    onAddDay,
    onDuplicateDay,
    onRemoveDay,
    onAddExercise,
}) {
    const [expandedWeeks, setExpandedWeeks] = useState(
        plan.weeks.reduce((acc, week) => ({ ...acc, [week.id || '']: true }), {})
    );
    const [expandedDays, setExpandedDays] = useState({});

    const toggleWeek = (weekId) => {
        setExpandedWeeks(prev => ({ ...prev, [weekId]: !prev[weekId] }));
    };

    const toggleDay = (dayId) => {
        setExpandedDays(prev => ({ ...prev, [dayId]: !prev[dayId] }));
    };

    const isItemSelected = (type, id) => {
        return selectedItem?.type === type && selectedItem?.id === id;
    };

    return (
        <div className="h-full flex flex-col bg-primary-surface border-r border-border overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 px-4 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-text-primary font-display">
                    Estructura
                </h2>
                <p className="text-xs text-text-muted mt-1">
                    {plan.weeks.length} {plan.weeks.length === 1 ? 'semana' : 'semanas'}
                </p>
            </div>

            {/* Tree Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Metadata Root */}
                <TreeItem
                    label={plan.metadata.name || 'Rutina sin nombre'}
                    icon={Dumbbell}
                    isSelected={isItemSelected('metadata', 'root')}
                    onSelect={() => onSelectItem({ type: 'metadata', id: 'root' })}
                    badge={plan.metadata.level}
                />

                {/* Weeks */}
                {plan.weeks.map((week, weekIdx) => {
                    const weekId = week.id || `week-${weekIdx}`;

                    return (
                        <TreeItem
                            key={weekId}
                            label={week.title || `Semana ${weekIdx + 1}`}
                            icon={Calendar}
                            level={1}
                            isExpanded={expandedWeeks[weekId]}
                            onToggle={() => toggleWeek(weekId)}
                            isSelected={isItemSelected('week', weekId)}
                            onSelect={() => onSelectItem({ type: 'week', id: weekId, weekIdx })}
                            badge={`${week.days?.length || 0} días`}
                            actions={[
                                {
                                    icon: Plus,
                                    label: 'Agregar día',
                                    onClick: () => onAddDay(weekIdx)
                                },
                                {
                                    icon: Copy,
                                    label: 'Duplicar semana',
                                    onClick: () => onDuplicateWeek(weekIdx)
                                },
                                {
                                    icon: Trash2,
                                    label: 'Eliminar semana',
                                    onClick: () => onRemoveWeek(weekIdx)
                                },
                            ]}
                        >
                            {/* Days */}
                            {week.days && week.days.map((day, dayIdx) => {
                                const dayId = day.id || `day-${weekIdx}-${dayIdx}`;
                                const exerciseCount = day.exercises?.length || 0;

                                return (
                                    <TreeItem
                                        key={dayId}
                                        label={day.name || `Día ${dayIdx + 1}`}
                                        icon={day.type === 'DESCANSO' ? Calendar : Dumbbell}
                                        level={2}
                                        isExpanded={expandedDays[dayId]}
                                        onToggle={() => toggleDay(dayId)}
                                        isSelected={isItemSelected('day', dayId)}
                                        onSelect={() => onSelectItem({ type: 'day', id: dayId, weekIdx, dayIdx })}
                                        badge={day.type === 'DESCANSO' ? 'Descanso' : `${exerciseCount} ej.`}
                                        actions={[
                                            ...(day.type !== 'DESCANSO' ? [{
                                                icon: Plus,
                                                label: 'Agregar ejercicio',
                                                onClick: () => onAddExercise(weekIdx, dayIdx)
                                            }] : []),
                                            {
                                                icon: Copy,
                                                label: 'Duplicar día',
                                                onClick: () => onDuplicateDay(weekIdx, dayIdx)
                                            },
                                            {
                                                icon: Trash2,
                                                label: 'Eliminar día',
                                                onClick: () => onRemoveDay(weekIdx, dayIdx)
                                            },
                                        ]}
                                    >
                                        {/* Exercises */}
                                        {day.type !== 'DESCANSO' && day.exercises && day.exercises.map((exercise, exIdx) => {
                                            const exerciseId = exercise.id || `ex-${weekIdx}-${dayIdx}-${exIdx}`;

                                            return (
                                                <TreeItem
                                                    key={exerciseId}
                                                    label={exercise.name || `Ejercicio ${exIdx + 1}`}
                                                    icon={Dumbbell}
                                                    level={3}
                                                    isSelected={isItemSelected('exercise', exerciseId)}
                                                    onSelect={() => onSelectItem({
                                                        type: 'exercise',
                                                        id: exerciseId,
                                                        weekIdx,
                                                        dayIdx,
                                                        exerciseIdx: exIdx
                                                    })}
                                                    badge={exercise.sets ? `${exercise.sets}x${exercise.reps || '?'}` : null}
                                                />
                                            );
                                        })}
                                    </TreeItem>
                                );
                            })}
                        </TreeItem>
                    );
                })}
            </div>

            {/* Footer Actions */}
            <div className="flex-shrink-0 p-4 border-t border-border">
                <Button
                    onClick={onAddWeek}
                    variant="outline"
                    size="sm"
                    fullWidth
                >
                    <Plus className="h-4 w-4" />
                    Agregar Semana
                </Button>
            </div>
        </div>
    );
}
